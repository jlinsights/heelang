import { getArtistImageUrl, getArtworkImageUrl } from "./image-utils";
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
    console.warn(
      "Airtable credentials not found. Using local data as fallback."
    );
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
        requestTimeout: 3000, // 3초로 단축
        // 연결 안정성을 위한 추가 설정
        endpointUrl: "https://api.airtable.com",
      });

      const base = airtable.base(AIRTABLE_BASE_ID);

      // 연결 테스트 (간단한 요청으로 확인)
      if (attempt === 1) {
        console.log(`Airtable connection attempt ${attempt}/${maxRetries}`);
      }

      return base;
    } catch (error) {
      lastError = error as Error;
      console.warn(
        `Airtable connection attempt ${attempt}/${maxRetries} failed:`,
        error
      );

      if (attempt < maxRetries) {
        // 재시도 전 잠시 대기 (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 3000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  console.error("Failed to initialize Airtable after all retries:", lastError);
  return null;
}

/**
 * 슬러그 생성 유틸리티
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
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
    return cachedData;
  }

  try {
    const base = await createAirtableBase();
    if (!base) {
      console.warn("Airtable base not available, will use fallback data");
      return null;
    }

    const records = await retryOperation(async () => {
      return await base("Artworks")
        .select({
          maxRecords: 100,
          sort: [{ field: "year", direction: "desc" }],
        })
        .all();
    });

    const artworks: Artwork[] = [];

    records.forEach((record: any) => {
      const fields = record.fields;
      const slug = fields.slug || `artwork-${record.id}`;
      const year = fields.year || new Date().getFullYear();

      // 문방사우 (보물 시리즈) 특별 처리
      if (slug === "heelang-treasures-2022" || fields.title === "문방사우") {
        // 8개의 개별 보물 작품으로 분리
        for (let i = 1; i <= 8; i++) {
          const treasureSlug = `heelang-treasure-${i}-2022`;
          const treasureArtwork: Artwork = {
            id: `${record.id}-treasure-${i}`,
            slug: treasureSlug,
            title: `보물 ${i} (Treasure ${i})`,
            year: 2022,
            medium:
              fields.medium ||
              fields.Medium ||
              "화선지에 먹 (Ink on Mulberry Paper)",
            dimensions: fields.dimensions || fields.Dimensions || "70 x 70 cm",
            aspectRatio: "1/1",
            description: `보물 시리즈의 ${
              i === 1
                ? "첫"
                : i === 2
                ? "두"
                : i === 3
                ? "세"
                : i === 4
                ? "네"
                : i === 5
                ? "다섯"
                : i === 6
                ? "여섯"
                : i === 7
                ? "일곱"
                : "여덟"
            } 번째 작품입니다.`,
            imageUrl: getArtworkImageUrl(treasureSlug, 2022, "original"),
            imageUrlQuery: `treasure ${i} calligraphy`,
            artistNote:
              fields.description ||
              fields.Description ||
              fields.artistNote ||
              fields.ArtistNote ||
              "문방사우 시리즈의 일부입니다.",
            featured:
              fields.featured === true || fields.Featured === true || i === 3, // Airtable featured 필드 우선, 기본값은 보물 3
            category: "treasure",
            available: true,
          };
          artworks.push(treasureArtwork);
        }
      }
      // 새로 추가된 작품들 특별 처리
      else if (
        slug === "heelang-dongjoo1-2023" ||
        fields.title === "윤동주 시인 - 눈 감고 간다"
      ) {
        const artwork: Artwork = {
          id: record.id,
          slug: "heelang-dongjoo1-2023",
          title: "윤동주 시인 - 눈 감고 간다",
          year: 2023,
          medium:
            fields.medium ||
            fields.Medium ||
            "화선지에 먹 (Ink on Mulberry Paper)",
          dimensions: fields.dimensions || fields.Dimensions || "50 x 70 cm",
          aspectRatio: "5/7",
          description:
            "윤동주 시인의 시 '눈 감고 간다'를 서예로 표현한 작품입니다.",
          imageUrl: getArtworkImageUrl(
            "heelang-dongjoo1-2023",
            2023,
            "original"
          ),
          imageUrlQuery: "윤동주 시인 눈 감고 간다 서예",
          artistNote:
            fields.description ||
            fields.Description ||
            fields.artistNote ||
            fields.ArtistNote ||
            "윤동주 시인의 시를 서예로 표현했습니다.",
          featured: fields.featured === true || fields.Featured === true,
          category: "poetry",
          available: true,
        };
        artworks.push(artwork);
      } else if (
        slug === "heelang-dongjoo2-2023" ||
        fields.title === "윤동주 시인 - 삶과 죽음"
      ) {
        const artwork: Artwork = {
          id: record.id,
          slug: "heelang-dongjoo2-2023",
          title: "윤동주 시인 - 삶과 죽음",
          year: 2023,
          medium:
            fields.medium ||
            fields.Medium ||
            "화선지에 먹 (Ink on Mulberry Paper)",
          dimensions: fields.dimensions || fields.Dimensions || "50 x 70 cm",
          aspectRatio: "5/7",
          description:
            "윤동주 시인의 삶과 죽음에 대한 철학을 서예로 표현한 작품입니다.",
          imageUrl: getArtworkImageUrl(
            "heelang-dongjoo2-2023",
            2023,
            "original"
          ),
          imageUrlQuery: "윤동주 시인 삶과 죽음 서예",
          artistNote:
            fields.description ||
            fields.Description ||
            fields.artistNote ||
            fields.ArtistNote ||
            "윤동주 시인의 삶과 죽음에 대한 철학을 담았습니다.",
          featured:
            fields.featured === true || fields.Featured === true || true, // Airtable featured 필드 우선, 기본값은 true
          category: "poetry",
          available: true,
        };
        artworks.push(artwork);
      } else if (
        slug === "heelang-grandpa-2022" ||
        fields.title === "할아버지 손"
      ) {
        const artwork: Artwork = {
          id: record.id,
          slug: "heelang-grandpa-2022",
          title: "할아버지 손",
          year: 2022,
          medium:
            fields.medium ||
            fields.Medium ||
            "화선지에 먹 (Ink on Mulberry Paper)",
          dimensions: fields.dimensions || fields.Dimensions || "60 x 80 cm",
          aspectRatio: "3/4",
          description:
            "할아버지의 손을 통해 세월의 흔적과 삶의 지혜를 표현한 작품입니다.",
          imageUrl: getArtworkImageUrl(
            "heelang-grandpa-2022",
            2022,
            "original"
          ),
          imageUrlQuery: "할아버지 손 서예",
          artistNote:
            fields.description ||
            fields.Description ||
            fields.artistNote ||
            fields.ArtistNote ||
            "할아버지의 손에 담긴 세월과 사랑을 표현했습니다.",
          featured: fields.featured === true || fields.Featured === true,
          category: "family",
          available: true,
        };
        artworks.push(artwork);
      }
      // 2025년 새로 추가된 작품들 특별 처리
      else if (
        slug === "heelang-writing-2025" ||
        fields.title === "書 (글 서)"
      ) {
        const artwork: Artwork = {
          id: record.id,
          slug: "heelang-writing-2025",
          title: "書 (글 서)",
          year: 2025,
          medium:
            fields.medium ||
            fields.Medium ||
            "화선지에 먹 (Ink on Mulberry Paper)",
          dimensions: fields.dimensions || fields.Dimensions || "70 x 100 cm",
          aspectRatio: "7/10",
          description:
            "글을 쓴다는 것의 의미와 서예의 본질을 탐구한 작품입니다.",
          imageUrl: getArtworkImageUrl(
            "heelang-writing-2025",
            2025,
            "original"
          ),
          imageUrlQuery: "書 글 서 서예 calligraphy",
          artistNote:
            fields.description ||
            fields.Description ||
            fields.artistNote ||
            fields.ArtistNote ||
            "글을 쓰는 행위 자체에 대한 성찰을 담았습니다.",
          featured: fields.featured === true || fields.Featured === true,
          category: "philosophy",
          available: true,
        };
        artworks.push(artwork);
      } else if (
        slug === "heelang-cloud-2025" ||
        fields.title === "雲 (구름 운)"
      ) {
        const artwork: Artwork = {
          id: record.id,
          slug: "heelang-cloud-2025",
          title: "雲 (구름 운)",
          year: 2025,
          medium:
            fields.medium ||
            fields.Medium ||
            "화선지에 먹 (Ink on Mulberry Paper)",
          dimensions: fields.dimensions || fields.Dimensions || "80 x 120 cm",
          aspectRatio: "2/3",
          description:
            "구름처럼 자유롭고 변화무쌍한 삶의 모습을 표현한 작품입니다.",
          imageUrl: getArtworkImageUrl("heelang-cloud-2025", 2025, "original"),
          imageUrlQuery: "雲 구름 운 서예 자연",
          artistNote:
            fields.description ||
            fields.Description ||
            fields.artistNote ||
            fields.ArtistNote ||
            "구름의 자유로움과 변화하는 아름다움을 담았습니다.",
          featured:
            fields.featured === true || fields.Featured === true || true, // Airtable featured 필드 우선, 기본값은 true
          category: "nature",
          available: true,
        };
        artworks.push(artwork);
      } else if (
        slug === "heelang-good-day-2025" ||
        fields.title === "日日是好日 (일일시호일)"
      ) {
        const artwork: Artwork = {
          id: record.id,
          slug: "heelang-good-day-2025",
          title: "日日是好日 (일일시호일)",
          year: 2025,
          medium:
            fields.medium ||
            fields.Medium ||
            "화선지에 먹 (Ink on Mulberry Paper)",
          dimensions: fields.dimensions || fields.Dimensions || "50 x 70 cm",
          aspectRatio: "5/7",
          description:
            "매일매일이 좋은 날이라는 선불교의 가르침을 담은 작품입니다.",
          imageUrl: getArtworkImageUrl(
            "heelang-good-day-2025",
            2025,
            "original"
          ),
          imageUrlQuery: "日日是好日 일일시호일 선불교 매일 좋은날",
          artistNote:
            fields.description ||
            fields.Description ||
            fields.artistNote ||
            fields.ArtistNote ||
            "매일을 감사하며 살아가는 마음을 표현했습니다.",
          featured: fields.featured === true || fields.Featured === true,
          category: "zen",
          available: true,
        };
        artworks.push(artwork);
      } else if (slug === "heelang-fly-2025" || fields.title === "飛 (날 비)") {
        const artwork: Artwork = {
          id: record.id,
          slug: "heelang-fly-2025",
          title: "飛 (날 비)",
          year: 2025,
          medium:
            fields.medium ||
            fields.Medium ||
            "화선지에 먹 (Ink on Mulberry Paper)",
          dimensions: fields.dimensions || fields.Dimensions || "60 x 90 cm",
          aspectRatio: "2/3",
          description:
            "자유롭게 날아오르는 꿈과 희망을 표현한 역동적인 작품입니다.",
          imageUrl: getArtworkImageUrl("heelang-fly-2025", 2025, "original"),
          imageUrlQuery: "飛 날 비 자유 꿈 희망 서예",
          artistNote:
            fields.description ||
            fields.Description ||
            fields.artistNote ||
            fields.ArtistNote ||
            "제약 없이 자유롭게 날아오르는 정신을 담았습니다.",
          featured: fields.featured === true || fields.Featured === true,
          category: "freedom",
          available: true,
        };
        artworks.push(artwork);
      } else if (
        slug === "heelang-firmly-2025" ||
        fields.title === "담담하게 그러나 단단하게"
      ) {
        const artwork: Artwork = {
          id: record.id,
          slug: "heelang-firmly-2025",
          title: "담담하게 그러나 단단하게",
          year: 2025,
          medium:
            fields.medium ||
            fields.Medium ||
            "화선지에 먹 (Ink on Mulberry Paper)",
          dimensions: fields.dimensions || fields.Dimensions || "70 x 100 cm",
          aspectRatio: "7/10",
          description:
            "인생을 대하는 올바른 자세에 대한 철학적 성찰을 담은 작품입니다.",
          imageUrl: getArtworkImageUrl("heelang-firmly-2025", 2025, "original"),
          imageUrlQuery: "담담하게 단단하게 인생 철학 서예",
          artistNote:
            fields.description ||
            fields.Description ||
            fields.artistNote ||
            fields.ArtistNote ||
            "평온하면서도 굳건한 마음가짐을 표현했습니다.",
          featured: fields.featured === true || fields.Featured === true,
          category: "philosophy",
          available: true,
        };
        artworks.push(artwork);
      } else {
        // 일반 작품 처리
        const artwork: Artwork = {
          id: record.id,
          slug: slug,
          title: fields.title || fields.Title || "제목 없음",
          year: year,
          medium: fields.medium || fields.Medium || "화선지에 먹",
          dimensions: fields.dimensions || fields.Dimensions || "",
          aspectRatio: fields.aspectRatio || fields.AspectRatio || "1/1",
          description: fields.description || fields.Description || "",
          // 로컬 이미지 URL 사용
          imageUrl: getArtworkImageUrl(slug, year, "original"),
          imageUrlQuery: fields.imageUrlQuery || "",
          artistNote: fields.artistNote || fields.ArtistNote || "",
          featured: fields.featured === true || fields.Featured === true,
          category: fields.category || fields.Category || "recent",
          available: fields.available !== false && fields.Available !== false,
        };
        artworks.push(artwork);
      }
    });

    setCachedData(cacheKey, artworks);
    return artworks;
  } catch (error) {
    console.warn(
      "Error fetching from Airtable, will use fallback data:",
      error
    );
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
    return cachedData;
  }

  try {
    const base = await createAirtableBase();
    if (!base) {
      console.warn("Airtable base not available, will use fallback data");
      return null;
    }

    console.log("Fetching artist from Airtable...");

    const records = await base("Artists")
      .select({
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) {
      throw new Error("No artist data found");
    }

    const fields = records[0].fields as any;
    const artist: Artist = {
      name: fields.name || fields.Name || "",
      bio: fields.bio || fields.Bio || "",
      statement: fields.statement || fields.Statement || "",
      profileImageUrl: getArtistImageUrl("공경순 작가 프로필.png"),
      birthYear: fields.birthYear || fields.BirthYear || undefined,
      education: (fields.education || fields.Education || "")
        .toString()
        .split("\n")
        .filter((item: string) => item.trim().length > 0),
      exhibitions: (fields.exhibitions || fields.Exhibitions || "")
        .toString()
        .split("\n")
        .filter((item: string) => item.trim().length > 0),
      awards: (fields.awards || fields.Awards || "")
        .toString()
        .split("\n")
        .filter((item: string) => item.trim().length > 0),
      collections: (fields.collections || fields.Collections || "")
        .toString()
        .split("\n")
        .filter((item: string) => item.trim().length > 0),
      website: fields.website || fields.Website || undefined,
      socialLinks: {
        instagram: fields.instagram || fields.Instagram || undefined,
        facebook: fields.facebook || fields.Facebook || undefined,
        twitter: fields.twitter || fields.Twitter || undefined,
        website: fields.website || fields.Website || undefined,
      },
    };

    setCachedData(cacheKey, artist);

    console.log("Successfully fetched artist from Airtable");
    return artist;
  } catch (error) {
    console.warn(
      "Error fetching artist from Airtable, will use fallback data:",
      error
    );
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
