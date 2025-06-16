import { getArtworkImageUrl } from "./image-utils";
import type { Artist, Artwork } from "./types";

// Airtable 설정
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

// 캐시 설정
const CACHE_DURATION = 5 * 60 * 1000; // 5분
const cache = new Map<string, { data: any; timestamp: number }>();

// 로컬 스토리지 캐시 (클라이언트 사이드에서만 사용)
class LocalStorageCache {
  private isClient = typeof window !== "undefined";

  set(key: string, data: any, duration: number = CACHE_DURATION): void {
    if (!this.isClient) return;

    const item = {
      data,
      timestamp: Date.now(),
      duration,
    };

    try {
      localStorage.setItem(`airtable_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn("Failed to save to localStorage:", error);
    }
  }

  get(key: string): any | null {
    if (!this.isClient) return null;

    try {
      const item = localStorage.getItem(`airtable_${key}`);
      if (!item) return null;

      const parsed = JSON.parse(item);
      const now = Date.now();

      if (now - parsed.timestamp > parsed.duration) {
        localStorage.removeItem(`airtable_${key}`);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.warn("Failed to read from localStorage:", error);
      return null;
    }
  }
}

const localCache = new LocalStorageCache();

/**
 * 안전한 Airtable 인스턴스 생성 (재시도 로직 포함)
 */
async function createAirtableBase() {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error("❌ Airtable 환경 변수가 설정되지 않았습니다.");
    console.error("다음 환경 변수를 .env.local 파일에 설정해주세요:");
    console.error("AIRTABLE_API_KEY=your_api_key");
    console.error("AIRTABLE_BASE_ID=your_base_id");
    console.warn("🔄 Fallback 데이터를 사용합니다.");
    return null;
  }

  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // 동적 import로 Airtable 로드 (서버/클라이언트 호환성)
      const { default: Airtable } = await import("airtable");

      // Airtable 인스턴스 생성
      const airtable = new Airtable({
        apiKey: AIRTABLE_API_KEY,
        requestTimeout: 5000, // 5초로 증가
        // 연결 안정성을 위한 추가 설정
        endpointUrl: "https://api.airtable.com",
      });

      const base = airtable.base(AIRTABLE_BASE_ID);

      // 연결 테스트 (간단한 요청으로 확인)
      console.log(`🔄 Airtable 연결 시도 ${attempt}/${maxRetries}`);

      return base;
    } catch (error) {
      lastError = error as Error;
      console.warn(
        `❌ Airtable 연결 시도 ${attempt}/${maxRetries} 실패:`,
        error
      );

      if (attempt < maxRetries) {
        // 재시도 전 잠시 대기 (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 3000);
        console.log(`⏳ ${delay}ms 후 재시도...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  console.error("❌ 모든 재시도 후 Airtable 연결 실패:", lastError);
  console.warn("🔄 Fallback 데이터를 사용합니다.");
  return null;
}

/**
 * 헬퍼 함수들
 */

// 필드 값을 우선순위에 따라 가져오는 함수
function getFieldValue(fields: any, fieldNames: string[]): any {
  for (const fieldName of fieldNames) {
    if (
      fields[fieldName] !== undefined &&
      fields[fieldName] !== null &&
      fields[fieldName] !== ""
    ) {
      return fields[fieldName];
    }
  }
  return null;
}

// 슬러그 생성 함수
function createSlug(title: string, year: number | string): string {
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, "")
    .replace(/\s+/g, "-")
    .trim();
  return `heelang-${cleanTitle}-${year}`;
}

// 종횡비 계산 함수
function calculateAspectRatio(dimensions: string): string {
  if (!dimensions) return "1/1";

  const match = dimensions.match(/(\d+)\s*[x×]\s*(\d+)/i);
  if (match) {
    const width = parseInt(match[1]);
    const height = parseInt(match[2]);

    // 간단한 비율로 변환
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    return `${width / divisor}/${height / divisor}`;
  }

  return "1/1";
}

// 태그 파싱 함수
function parseTagsField(tagValue: any): string[] {
  if (!tagValue) return [];

  if (Array.isArray(tagValue)) {
    return tagValue
      .map((tag) => tag.toString().trim())
      .filter((tag) => tag.length > 0);
  }

  if (typeof tagValue === "string") {
    return tagValue
      .split(/[,;|]/)
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }

  return [];
}

function getCachedData(key: string): any | null {
  // 메모리 캐시 확인
  const memoryCache = cache.get(key);
  if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_DURATION) {
    return memoryCache.data;
  }

  // 로컬 스토리지 캐시 확인
  return localCache.get(key);
}

function setCachedData(key: string, data: any): void {
  // 메모리 캐시 저장
  cache.set(key, { data, timestamp: Date.now() });

  // 로컬 스토리지 캐시 저장
  localCache.set(key, data);
}

// 재시도 로직
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // 지수 백오프
    }
  }
  throw new Error("Max retries exceeded");
}

/**
 * Airtable에서 작품 데이터를 가져오는 함수
 */
export async function fetchArtworksFromAirtable(): Promise<Artwork[] | null> {
  const cacheKey = "artworks";

  // 캐시된 데이터 확인
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    console.log(`📦 Using cached artworks data (${cachedData.length} items)`);
    return cachedData;
  }

  try {
    const base = await createAirtableBase();
    if (!base) {
      console.warn("🚫 Airtable base not available, will use fallback data");
      return null;
    }

    console.log("📡 Fetching artworks from Airtable...");
    const records = await retryOperation(async () => {
      return await base("Artworks")
        .select({
          maxRecords: 100,
          sort: [{ field: "year", direction: "desc" }],
        })
        .all();
    });

    console.log(`📊 Retrieved ${records.length} records from Airtable`);
    const artworks: Artwork[] = [];

    records.forEach((record: any, index: number) => {
      const fields = record.fields;

      // 디버깅을 위해 첫 번째 레코드의 필드 구조 출력
      if (index === 0) {
        console.log("🔍 Sample record fields:", Object.keys(fields));
      }

      // 실제 Airtable 필드명 사용
      const title = fields.title;
      const year = fields.year;

      if (!title) {
        console.warn(`⚠️ Skipping record ${index + 1}: missing title`);
        return;
      }

      // 작품 데이터 구성 (실제 Airtable 필드명 사용)
      const artwork: Artwork = {
        id: record.id,
        slug: fields.slug || createSlug(title, year),
        title,
        year: parseInt(year?.toString() || "2024"),
        medium: fields.medium || "화선지에 먹",
        dimensions: fields.dimensions || "70 x 140 cm",
        aspectRatio:
          fields.aspectRatio ||
          calculateAspectRatio(fields.dimensions || "70 x 140 cm"),
        description: fields.description || "",
        imageUrl: getArtworkImageUrl(
          fields.slug || createSlug(title, year),
          parseInt(year?.toString() || "2024"),
          "medium"
        ),
        imageUrlQuery: `${title} calligraphy art`,
        artistNote: fields.artistNote || "",
        featured: fields.featured === true,
        category: fields.category || "calligraphy",
        available: fields.available !== false,
        tags: parseTagsField(fields.tags),
        series: fields.series,
        technique: fields.technique,
        inspiration: fields.inspiration,
        symbolism: fields.symbolism,
        culturalContext: fields.culturalContext,
        price: parseFloat(fields.price?.toString() || "0") || undefined,
        exhibition: fields.exhibition,
        createdAt: fields.createdTime || new Date().toISOString(),
        updatedAt: fields.lastModifiedTime || new Date().toISOString(),
      };

      artworks.push(artwork);

      if (index < 3) {
        console.log(
          `📝 Processed artwork ${index + 1}: "${artwork.title}" (${
            artwork.year
          })`
        );
      }
    });

    console.log(
      `✅ Successfully processed ${artworks.length} artworks from Airtable`
    );

    // 캐시에 저장
    setCachedData(cacheKey, artworks);

    return artworks;
  } catch (error) {
    console.error("❌ Error in fetchArtworksFromAirtable:", error);
    return null;
  }
}

/**
 * Airtable에서 작가 정보를 가져오는 함수
 */
export async function fetchArtistFromAirtable(): Promise<Artist | null> {
  const cacheKey = "artist";

  // 캐시된 데이터 확인
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    console.log("📦 Using cached artist data");
    return cachedData;
  }

  try {
    const base = await createAirtableBase();
    if (!base) {
      console.warn("🚫 Airtable base not available for artist data");
      return null;
    }

    console.log("📡 Fetching artist from Airtable...");

    const records = await base("Artist")
      .select({
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) {
      console.warn("⚠️ No artist data found in Airtable");
      return null;
    }

    const fields = records[0].fields as any;

    // 작가 정보를 우선순위에 따라 가져오는 헬퍼 함수들
    const getName = () => {
      return (
        fields.name ||
        fields.Name ||
        fields.작가명 ||
        fields["작가 이름"] ||
        "희랑 공경순"
      );
    };

    const getBio = () => {
      return (
        fields.bio ||
        fields.Bio ||
        fields.biography ||
        fields.Biography ||
        fields.소개 ||
        fields["작가 소개"] ||
        ""
      );
    };

    const getEmail = () => {
      return fields.email || fields.Email || fields.이메일 || "";
    };

    const getPhone = () => {
      return (
        fields.phone ||
        fields.Phone ||
        fields.전화번호 ||
        fields["연락처"] ||
        ""
      );
    };

    const getProfileImageUrl = () => {
      // 에어테이블의 Attachment 필드에서 이미지 URL 가져오기
      const profileImage =
        fields.profileImage ||
        fields.ProfileImage ||
        fields["프로필 이미지"] ||
        fields.profile_image;

      if (
        profileImage &&
        Array.isArray(profileImage) &&
        profileImage.length > 0
      ) {
        return profileImage[0].url;
      }

      // fallback으로 최적화된 로컬 이미지 사용
      return "/Images/Artist/Artist.png";
    };

    const artist: Artist = {
      id: records[0].id,
      name: getName(),
      bio: getBio(),
      email: getEmail(),
      phone: getPhone(),
      profileImageUrl: getProfileImageUrl(),
      socialLinks: {
        instagram: fields.instagram || fields.Instagram || "",
        facebook: fields.facebook || fields.Facebook || "",
        website: fields.website || fields.Website || "",
        youtube: fields.youtube || fields.YouTube || "",
        linkedin: fields.linkedin || fields.LinkedIn || "",
      },
      birthPlace: fields.birthPlace || fields.BirthPlace || fields.출생지 || "",
      currentLocation:
        fields.currentLocation || fields.CurrentLocation || fields.거주지 || "",
      specialties: parseTagsField(
        fields.specialties || fields.Specialties || fields.전문분야
      ),
      influences: parseTagsField(
        fields.influences || fields.Influences || fields.영향
      ),
      teachingExperience: parseTagsField(
        fields.teachingExperience ||
          fields.TeachingExperience ||
          fields.교육경력
      ),
      publications: parseTagsField(
        fields.publications || fields.Publications || fields.출판물
      ),
      memberships: parseTagsField(
        fields.memberships || fields.Memberships || fields.소속단체
      ),
      philosophy: fields.philosophy || fields.Philosophy || fields.철학 || "",
      techniques: parseTagsField(
        fields.techniques || fields.Techniques || fields.기법
      ),
      materials: parseTagsField(
        fields.materials || fields.Materials || fields.재료
      ),
      awards: parseTagsField(fields.awards || fields.Awards || fields.수상경력),
      exhibitions: parseTagsField(
        fields.exhibitions || fields.Exhibitions || fields.전시경력
      ),
      collections: parseTagsField(
        fields.collections || fields.Collections || fields.소장처
      ),
    };

    console.log("✅ Successfully fetched artist data from Airtable");

    // 캐시에 저장
    setCachedData(cacheKey, artist);

    return artist;
  } catch (error) {
    console.error("❌ Error fetching artist from Airtable:", error);

    // 권한 오류인 경우 특별 처리
    if (error instanceof Error && error.message.includes("not authorized")) {
      console.warn(
        "🔒 No permission to access Artists table, will use fallback data"
      );
    }

    return null;
  }
}

/**
 * 특정 작품을 ID로 가져오는 함수
 */
export async function fetchArtworkById(id: string): Promise<Artwork | null> {
  const artworks = await fetchArtworksFromAirtable();
  if (!artworks) {
    return null;
  }
  return (
    artworks.find((artwork) => artwork.id === id || artwork.slug === id) || null
  );
}

/**
 * 보물 시리즈 작품들을 가져오는 함수
 */
export async function fetchTreasureArtworks(): Promise<Artwork[]> {
  const cacheKey = "treasure";

  // 캐시된 데이터 확인
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const allArtworks = await fetchArtworksFromAirtable();
    if (!allArtworks) {
      return [];
    }
    const treasureArtworks = allArtworks
      .filter(
        (artwork) =>
          artwork.title.includes("보물") ||
          artwork.title.toLowerCase().includes("treasure") ||
          artwork.category === "treasure"
      )
      .sort((a, b) => {
        // 보물 1, 2, 3... 순으로 정렬
        const numA = parseInt(a.title.match(/\d+/)?.[0] || "0");
        const numB = parseInt(b.title.match(/\d+/)?.[0] || "0");
        return numA - numB;
      });

    setCachedData(cacheKey, treasureArtworks);
    return treasureArtworks;
  } catch (error) {
    console.error("Error fetching treasure artworks from Airtable:", error);
    return [];
  }
}

/**
 * 추천 작품들을 가져오는 함수
 */
export async function fetchFeaturedArtworks(
  limit: number = 3
): Promise<Artwork[] | null> {
  const cacheKey = `featured_${limit}`;

  // 캐시된 데이터 확인
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const allArtworks = await fetchArtworksFromAirtable();
    if (!allArtworks) {
      return null;
    }
    const featured = allArtworks.filter((artwork) => artwork.featured);

    if (featured.length >= limit) {
      const featuredArtworks = featured.slice(0, limit);
      setCachedData(cacheKey, featuredArtworks);
      return featuredArtworks;
    }

    // 부족한 경우 최신 작품으로 채움
    const remaining = limit - featured.length;
    const latest = allArtworks
      .filter((artwork) => !artwork.featured)
      .sort((a, b) => b.year - a.year)
      .slice(0, remaining);

    const featuredArtworks = [...featured, ...latest];
    setCachedData(cacheKey, featuredArtworks);
    return featuredArtworks;
  } catch (error) {
    console.error("Error fetching featured artworks from Airtable:", error);
    return null;
  }
}

/**
 * 캐시 초기화 함수
 */
export function clearAirtableCache(): void {
  cache.clear();
}
