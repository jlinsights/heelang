import { getBase as getAirtableBase } from "./airtable-client";
import {
  clearCacheAndRevalidate,
  getCachedData as getCachedDataGlobal,
  setCachedData as setCachedDataGlobal,
} from "./cache";
import { captureError } from "./error-logger";
import { getArtworkImageUrl } from "./image-utils";
import { ArtistSchema, ArtworkSchema } from "./schemas";
import type { Artist, Artwork } from "./types";

// Airtable 설정
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

// 캐시 설정
const CACHE_DURATION = 5 * 60 * 1000; // 5분
// const cache = new Map<string, { data: any; timestamp: number }>(); // replaced by global cache

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
/*
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

/**
 * 📑 필드 매핑 테이블 (Airtable 컬럼명 → Canonical Key)
 */
const ARTWORK_FIELD_MAP: Record<string, string[]> = {
  title: ["title", "Title", "제목"],
  year: ["year", "Year", "년도"],
  medium: ["medium", "Medium", "재료"],
  dimensions: ["dimensions", "Dimensions", "크기"],
  description: ["description", "Description", "설명"],
  tags: ["tags", "Tags", "태그"],
  featured: ["featured", "Featured", "추천"],
  category: ["category", "Category", "카테고리"],
  available: ["available", "Available", "판매여부"],
};

const ARTIST_FIELD_MAP: Record<string, string[]> = {
  name: ["name", "Name", "작가명", "작가 이름"],
  bio: ["bio", "Bio", "biography", "Biography", "소개", "작가 소개"],
  statement: [
    "statement",
    "Statement",
    "artistStatement",
    "ArtistStatement",
    "작가노트",
    "작가 노트",
  ],
};

function pickField<T = any>(
  fields: any,
  map: Record<string, string[]>,
  key: string
): T | undefined {
  return getFieldValue(fields, map[key] ?? [key]) as T | undefined;
}

function getCachedData(key: string): any | null {
  // unified cache helper
  return getCachedDataGlobal(key);
}

// Legacy implementation removed
/*
  // 메모리 캐시 확인
  const memoryCache = cache.get(key);
  if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_DURATION) {
    return memoryCache.data;
  }

  // 로컬 스토리지 캐시 확인
  return localCache.get(key);
}

*/

function setCachedData(key: string, data: any): void {
  return setCachedDataGlobal(key, data);
}

/**
 * 모든 페이지의 레코드를 가져오는 범용 헬퍼 (100개 초과 지원)
 */
async function fetchAllRecords(
  base: any,
  tableName: string,
  selectOptions: Record<string, any> = {}
): Promise<any[]> {
  if (!base) return [];

  return retryOperation<any[]>(
    () =>
      new Promise((resolve, reject) => {
        const records: any[] = [];
        base(tableName)
          .select({ pageSize: 100, ...selectOptions })
          .eachPage(
            (pageRecords: any[], fetchNextPage: () => void) => {
              records.push(...pageRecords);
              fetchNextPage();
            },
            (err: any) => {
              if (err) reject(err);
              else resolve(records);
            }
          );
      }),
    3,
    1000
  );
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
    const base = await getAirtableBase();
    if (!base) {
      console.warn("🚫 Airtable base not available, will use fallback data");
      return null;
    }

    console.log("📡 Fetching artworks from Airtable...");
    const records = await fetchAllRecords(base, "Artworks", {
      sort: [{ field: "year", direction: "desc" }],
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
      const title = pickField<string>(fields, ARTWORK_FIELD_MAP, "title");
      const year = pickField<number | string>(
        fields,
        ARTWORK_FIELD_MAP,
        "year"
      );

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
        imageUrl: (() => {
          const attachment =
            fields.image ||
            fields.Image ||
            fields["이미지"] ||
            fields.images ||
            fields.artworkImage ||
            fields.ArtworkImage;
          if (attachment && Array.isArray(attachment) && attachment[0]?.url) {
            return attachment[0].url as string;
          }
          // fallback to optimized local image path
          return getArtworkImageUrl(
            fields.slug || createSlug(title, year),
            parseInt(year?.toString() || "2024"),
            "medium"
          );
        })(),
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

      // Zod 스키마 검증 후에만 배열에 추가
      const validation = ArtworkSchema.safeParse(artwork);
      if (!validation.success) {
        captureError(validation.error, { scope: "ArtworkSchema" });
      } else {
        artworks.push(validation.data);
      }

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
    captureError(error, { scope: "fetchArtworksFromAirtable" });
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
    const base = await getAirtableBase();
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

    // 문자열 필드 헬퍼
    const getString = (primary: string, ...alts: string[]) =>
      getFieldValue(fields, [primary, ...alts])?.toString() ?? "";

    // 멀티라인 텍스트를 배열로 변환 (줄바꿈·세미콜론·쉼표 구분)
    const parseMultiline = (value: any): string[] =>
      !value
        ? []
        : (Array.isArray(value)
            ? value
            : value.toString().split(/\r?\n|[,;]|\|/)
          )
            .map((v: string) => v.trim())
            .filter(Boolean);

    const getBio = () =>
      getString("bio", "Bio", "biography", "Biography", "소개", "작가 소개");

    const getStatement = () =>
      getString(
        "statement",
        "Statement",
        "artistStatement",
        "ArtistStatement",
        "작가노트",
        "작가 노트"
      );

    const getEmail = () => {
      return getString("email", "Email", "이메일");
    };

    const getPhone = () => {
      return getString("phone", "Phone", "전화번호", "연락처");
    };

    const getProfileImageUrl = () => {
      // 로컬 이미지 사용 (요청사항에 따라)
      return "/Images/Artist/Artist.png";
    };

    const artist: Artist = {
      id: records[0].id,
      name: getName(),
      bio: getBio(),
      statement: getStatement(),
      profileImageUrl: getProfileImageUrl(),
      birthYear:
        fields.birthYear || fields.BirthYear || fields.출생년도
          ? parseInt(
              String(fields.birthYear || fields.BirthYear || fields.출생년도)
            )
          : undefined,
      education: parseMultiline(
        fields.education || fields.Education || fields.학력
      ),
      exhibitions: parseMultiline(
        fields.exhibitions || fields.Exhibitions || fields.전시
      ),
      awards: parseMultiline(fields.awards || fields.Awards || fields.수상),
      email: getEmail(),
      phone: getPhone(),
      socialLinks: {
        instagram: getString("instagram", "Instagram", "인스타그램"),
        facebook: getString("facebook", "Facebook", "페이스북"),
        website: getString("website", "Website", "웹사이트"),
        youtube: getString("youtube", "YouTube", "유튜브"),
        linkedin: getString("linkedin", "LinkedIn", "링크드인"),
      },
      birthPlace: getString("birthPlace", "BirthPlace", "출생지"),
      currentLocation: getString(
        "currentLocation",
        "CurrentLocation",
        "거주지"
      ),
      specialties: parseMultiline(
        fields.specialties || fields.Specialties || fields.전문분야
      ),
      influences: parseMultiline(
        fields.influences || fields.Influences || fields.영향
      ),
      techniques: parseMultiline(
        fields.techniques || fields.Techniques || fields.기법
      ),
      createdAt: fields.createdTime || new Date().toISOString(),
      updatedAt: fields.lastModifiedTime || new Date().toISOString(),
    };

    // Zod 스키마 검증
    const validation = ArtistSchema.safeParse(artist);
    if (!validation.success) {
      captureError(validation.error, { scope: "ArtistSchema" });
      console.warn("⚠️ Artist data validation failed:", validation.error);
      return null;
    }

    console.log("✅ Successfully fetched artist from Airtable");

    // 캐시에 저장
    setCachedData(cacheKey, validation.data);

    return validation.data;
  } catch (error) {
    captureError(error, { scope: "fetchArtistFromAirtable" });
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
  clearCacheAndRevalidate("artworks");
}
