import {
  getBase as getAirtableBase,
  safeAirtableRequest,
} from './airtable-client'
import {
  getCachedData as getCachedDataGlobal,
  setCachedData as setCachedDataGlobal,
} from './cache'
import { captureError } from './error-logger'
import { getArtworkImageUrl } from './image-utils'
import { ArtworkSchema } from './schemas'
import type { Artist, Artwork } from './types'
import type { FieldSet } from 'airtable'
import type { AirtableBase } from 'airtable/lib/airtable_base'
import type { QueryParams } from 'airtable/lib/query_params'

// Airtable 필드 값은 스키마 없이 들어온다(문자열·숫자·배열·첨부 등).
// 매핑 코드가 필드를 동적으로 읽으므로, any 허용을 이 별칭 하나로 모은다.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AirtableFieldValue = any
type AirtableFields = Record<string, AirtableFieldValue>

interface AirtableRecordLike {
  id: string
  fields: AirtableFields
  // airtable Record 인스턴스에는 없음(_rawJson에만 존재) — 기존 동작대로 폴백됨
  createdTime?: string
}

// Airtable 설정
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID

// 캐시 설정
const CACHE_DURATION = 5 * 60 * 1000 // 5분
// const cache = new Map<string, { data: any; timestamp: number }>(); // replaced by global cache

// 로컬 스토리지 캐시 (클라이언트 사이드에서만 사용)
class LocalStorageCache {
  private isClient = typeof window !== 'undefined'

  set(key: string, data: unknown, duration: number = CACHE_DURATION): void {
    if (!this.isClient) return

    const item = {
      data,
      timestamp: Date.now(),
      duration,
    }

    try {
      localStorage.setItem(`airtable_${key}`, JSON.stringify(item))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }

  get(key: string): unknown {
    if (!this.isClient) return null

    try {
      const item = localStorage.getItem(`airtable_${key}`)
      if (!item) return null

      const parsed = JSON.parse(item)
      const now = Date.now()

      if (now - parsed.timestamp > parsed.duration) {
        localStorage.removeItem(`airtable_${key}`)
        return null
      }

      return parsed.data
    } catch (error) {
      console.warn('Failed to read from localStorage:', error)
      return null
    }
  }
}

const localCache = new LocalStorageCache()

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
function getFieldValue(
  fields: AirtableFields,
  fieldNames: string[]
): AirtableFieldValue {
  for (const fieldName of fieldNames) {
    if (
      fields[fieldName] !== undefined &&
      fields[fieldName] !== null &&
      fields[fieldName] !== ''
    ) {
      return fields[fieldName]
    }
  }
  return null
}

// 슬러그 생성 함수
function createSlug(title: string, year: number | string): string {
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, '')
    .replace(/\s+/g, '-')
    .trim()
  return `heelang-${cleanTitle}-${year}`
}

// 종횡비 계산 함수
function calculateAspectRatio(dimensions: string): string {
  if (!dimensions) return '1/1'

  const match = dimensions.match(/(\d+)\s*[x×]\s*(\d+)/i)
  if (match) {
    const width = parseInt(match[1])
    const height = parseInt(match[2])

    // 간단한 비율로 변환
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
    const divisor = gcd(width, height)
    return `${width / divisor}/${height / divisor}`
  }

  return '1/1'
}

// 태그 파싱 함수
function parseTagsField(tagValue: AirtableFieldValue): string[] {
  if (!tagValue) return []

  if (Array.isArray(tagValue)) {
    return tagValue
      .map((tag) => tag.toString().trim())
      .filter((tag) => tag.length > 0)
  }

  if (typeof tagValue === 'string') {
    return tagValue
      .split(/[,;|]/)
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
  }

  return []
}

/**
 * 📑 필드 매핑 테이블 (Airtable 컬럼명 → Canonical Key)
 */
const ARTWORK_FIELD_MAP: Record<string, string[]> = {
  title: ['title', 'Title', '제목'],
  year: ['year', 'Year', '년도'],
  medium: ['medium', 'Medium', '재료'],
  dimensions: ['dimensions', 'Dimensions', '크기'],
  description: ['description', 'Description', '설명'],
  tags: ['tags', 'Tags', '태그'],
  featured: ['featured', 'Featured', '추천'],
  category: ['category', 'Category', '카테고리'],
  available: ['available', 'Available', '판매여부'],
}

const ARTIST_FIELD_MAP: Record<string, string[]> = {
  name: ['name', 'Name', '작가명', '작가 이름'],
  bio: ['bio', 'Bio', 'biography', 'Biography', '소개', '작가 소개'],
  statement: [
    'statement',
    'Statement',
    'artistStatement',
    'ArtistStatement',
    '작가노트',
    '작가 노트',
  ],
}

function pickField<T = AirtableFieldValue>(
  fields: AirtableFields,
  map: Record<string, string[]>,
  key: string
): T | undefined {
  return getFieldValue(fields, map[key] ?? [key]) as T | undefined
}

function getCachedData<T>(key: string): T | null {
  // unified cache helper
  return getCachedDataGlobal<T>(key)
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

function setCachedData(key: string, data: unknown): void {
  return setCachedDataGlobal(key, data)
}

/**
 * 모든 페이지의 레코드를 가져오는 범용 헬퍼 (100개 초과 지원)
 */
async function fetchAllRecords(
  base: AirtableBase | null,
  tableName: string,
  selectOptions: QueryParams<FieldSet> = {}
): Promise<AirtableRecordLike[]> {
  if (!base) return []

  return retryOperation<AirtableRecordLike[]>(
    () =>
      new Promise((resolve, reject) => {
        const records: AirtableRecordLike[] = []
        base(tableName)
          .select({ pageSize: 100, ...selectOptions })
          .eachPage(
            (pageRecords, fetchNextPage) => {
              records.push(...pageRecords)
              fetchNextPage()
            },
            (err) => {
              if (err) reject(err)
              else resolve(records)
            }
          )
      }),
    3,
    1000
  )
}

// 재시도 로직
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`)
      await new Promise((resolve) => setTimeout(resolve, delay))
      delay *= 2 // 지수 백오프
    }
  }
  throw new Error('Max retries exceeded')
}

/**
 * Airtable에서 작품 데이터를 가져오는 함수
 */
export async function fetchArtworksFromAirtable(): Promise<Artwork[] | null> {
  const cacheKey = 'artworks'

  // 캐시된 데이터 확인
  const cachedData = getCachedData<Artwork[]>(cacheKey)
  if (cachedData) {
    console.log(`📦 Using cached artworks data (${cachedData.length} items)`)
    return cachedData
  }

  try {
    const base = await getAirtableBase()
    if (!base) {
      console.warn('🚫 Airtable base not available, will use fallback data')
      return null
    }

    console.log('📡 Fetching artworks from Airtable...')
    const records = await fetchAllRecords(base, 'Artworks', {
      sort: [{ field: 'year', direction: 'desc' }],
    })

    console.log(`📊 Retrieved ${records.length} records from Airtable`)
    const artworks: Artwork[] = []

    records.forEach((record: AirtableRecordLike, index: number) => {
      const fields = record.fields

      // 디버깅을 위해 첫 번째 레코드의 필드 구조 출력
      if (index === 0) {
        console.log('🔍 Sample record fields:', Object.keys(fields))
      }

      // 실제 Airtable 필드명 사용
      const title = pickField<string>(fields, ARTWORK_FIELD_MAP, 'title')
      const year = pickField<number | string>(fields, ARTWORK_FIELD_MAP, 'year')

      if (!title) {
        console.warn(`⚠️ Skipping record ${index + 1}: missing title`)
        return
      }

      // 작품 데이터 구성 (실제 Airtable 필드명 사용)
      const mediumValue = (pickField<string>(
        fields,
        ARTWORK_FIELD_MAP,
        'medium'
      ) ||
        fields.medium ||
        '화선지에 먹') as string

      const artwork: Artwork = {
        id: record.id,
        slug: fields.slug || createSlug(title, year || 2024),
        title,
        year: year ? parseInt(year.toString()) : 2024,
        medium: mediumValue,
        dimensions: fields.dimensions || '70 x 140 cm',
        aspectRatio:
          fields.aspectRatio ||
          calculateAspectRatio(fields.dimensions || '70 x 140 cm'),
        description: fields.description || '',
        imageUrl: (() => {
          // Use local image path instead of external Airtable URL
          const slug = fields.slug || createSlug(title, year || 2024)
          const yearNum = year ? parseInt(year.toString()) : 2024

          // Use image utility function to generate local path
          return getArtworkImageUrl(slug, yearNum, 'medium')
        })(),
        imageUrlQuery: `${title} calligraphy art`,
        artistNote: fields.artistNote || '',
        featured: fields.featured || false,
        category: fields.category || '회화',
        available: fields.available !== false,
        tags: fields.tags || [],
        price: fields.price || undefined,
        exhibition: fields.exhibition || '',
        createdAt: record.createdTime || new Date().toISOString(),
        updatedAt: record.createdTime || new Date().toISOString(),
        series: fields.series || '',
        technique: fields.technique || '',
        inspiration: fields.inspiration || '',
        symbolism: fields.symbolism || '',
        culturalContext: fields.culturalContext || '',
      }

      // Zod 스키마 검증 후에만 배열에 추가
      const validation = ArtworkSchema.safeParse(artwork)
      if (!validation.success) {
        captureError(validation.error, { scope: 'ArtworkSchema' })
      } else {
        // Type assertion to ensure compatibility with Artwork interface
        artworks.push(validation.data as Artwork)
      }

      if (index < 3) {
        console.log(
          `📝 Processed artwork ${index + 1}: "${artwork.title}" (${
            artwork.year
          })`
        )
      }
    })

    console.log(
      `✅ Successfully processed ${artworks.length} artworks from Airtable`
    )

    // 캐시에 저장
    setCachedData(cacheKey, artworks)

    return artworks
  } catch (error) {
    captureError(error, { scope: 'fetchArtworksFromAirtable' })
    return null
  }
}

/**
 * Airtable에서 작가 정보를 가져오는 함수
 */
export async function fetchArtistFromAirtable(): Promise<Artist | null> {
  try {
    console.log('🔄 Fetching artist data from Airtable...')

    // 캐시 확인
    const cachedData = getCachedData<Artist>('artist')
    if (cachedData) {
      console.log('✅ Using cached artist data')
      return cachedData as Artist
    }

    // Airtable에서 데이터 가져오기 (안전한 요청 래퍼 사용)
    const records = await safeAirtableRequest(async () => {
      const base = await getAirtableBase()
      return await fetchAllRecords(base, 'Artist')
    })

    if (!records || records.length === 0) {
      console.warn('⚠️ No artist records found in Airtable')
      return null
    }

    // 첫 번째 레코드 사용 (단일 작가 가정)
    const record = records[0]
    const fields = record.fields

    // 필드 매핑 헬퍼 함수들
    const getName = () => {
      const name = getFieldValue(fields, ['name', 'Name', '이름', '작가명'])
      return name?.toString() || 'Unknown Artist'
    }

    const getString = (primary: string, ...alts: string[]) =>
      getFieldValue(fields, [primary, ...alts])?.toString() ?? ''

    const parseMultiline = (value: AirtableFieldValue): string[] =>
      !value
        ? []
        : typeof value === 'string'
          ? value
              .split('\n')
              .map((line) => line.trim())
              .filter((line) => line.length > 0)
          : Array.isArray(value)
            ? value.map((item) => item.toString().trim())
            : [value.toString().trim()]

    const getBio = () =>
      getString('bio', 'Bio', 'biography', 'Biography', '소개', '작가 소개')

    const getStatement = () =>
      getString(
        'statement',
        'Statement',
        'artistStatement',
        'Artist Statement',
        '작가 노트',
        '작가의 말'
      )

    const getEmail = () => {
      return getString('email', 'Email', '이메일', '연락처')
    }

    const getPhone = () => {
      return getString('phone', 'Phone', '전화번호', '연락처')
    }

    const getProfileImageUrl = () => {
      // Cloudflare Images URL 등 직접 입력된 profileImageUrl 필드 우선 사용
      const directUrl = getFieldValue(fields, [
        'profileImageUrl',
        'ProfileImageUrl',
        'profileImageURL',
        'ProfileImageURL',
        'profile_image_url',
        'Profile_Image_Url',
      ])
      if (
        directUrl &&
        typeof directUrl === 'string' &&
        directUrl.startsWith('http')
      ) {
        return directUrl
      }
      // 기존 이미지 필드(attachment)도 fallback으로 지원
      const imageField = getFieldValue(fields, [
        'profileImage',
        'Profile Image',
        'profile_image',
        '프로필 이미지',
        '사진',
      ])
      if (imageField && Array.isArray(imageField) && imageField.length > 0) {
        return imageField[0].url || '/images/artist/artist.jpg'
      }
      return '/images/artist/artist.jpg'
    }

    // 작가 데이터 구성
    const artist: Artist = {
      id: record.id,
      name: getName(),
      bio: getBio(),
      profileImageUrl: getProfileImageUrl(),
      birthYear:
        parseInt(getString('birthYear', 'Birth Year', '출생년도')) || 1970,
      education: parseMultiline(
        getFieldValue(fields, ['education', 'Education', '학력'])
      ),
      exhibitions: parseMultiline(
        getFieldValue(fields, ['exhibitions', 'Exhibitions', '전시이력'])
      ),
      awards: parseMultiline(
        getFieldValue(fields, ['awards', 'Awards', '수상이력'])
      ),
      collections: parseMultiline(
        getFieldValue(fields, ['collections', 'Collections', '수집이력'])
      ),
      website: getString('website', 'Website', '웹사이트', '홈페이지'),
      email: getEmail(),
      phone: getPhone(),
      socialLinks: {
        instagram: getString('instagram', 'Instagram', '인스타그램'),
        facebook: getString('facebook', 'Facebook', '페이스북'),
        twitter: getString('twitter', 'Twitter', '트위터'),
        website: getString('website', 'Website', '웹사이트', '홈페이지'),
        youtube: getString('youtube', 'YouTube', '유튜브'),
        linkedin: getString('linkedin', 'LinkedIn', '링크드인'),
      },
      birthPlace: getString('birthPlace', 'Birth Place', '출생지'),
      currentLocation: getString(
        'currentLocation',
        'Current Location',
        '현재위치'
      ),
      specialties: parseTagsField(
        getFieldValue(fields, ['specialties', 'Specialties', '전문분야'])
      ),
      influences: parseTagsField(
        getFieldValue(fields, ['influences', 'Influences', '영향받은 작가'])
      ),
      teachingExperience: parseMultiline(
        getFieldValue(fields, [
          'teachingExperience',
          'Teaching Experience',
          '교육이력',
        ])
      ),
      publications: parseMultiline(
        getFieldValue(fields, ['publications', 'Publications', '출판이력'])
      ),
      memberships: parseMultiline(
        getFieldValue(fields, ['memberships', 'Memberships', '소속이력'])
      ),
      philosophy: getString('philosophy', 'Philosophy', '철학'),
      techniques: parseTagsField(
        getFieldValue(fields, ['techniques', 'Techniques', '기법'])
      ),
      materials: parseMultiline(
        getFieldValue(fields, ['materials', 'Materials', '재료'])
      ),
    }

    // 캐시에 저장
    setCachedData('artist', artist)

    console.log('✅ Artist data fetched successfully')
    return artist
  } catch (error) {
    console.error('❌ Error fetching artist from Airtable:', error)
    return null
  }
}

/**
 * 특정 작품을 ID로 가져오는 함수
 */
export async function fetchArtworkById(id: string): Promise<Artwork | null> {
  const artworks = await fetchArtworksFromAirtable()
  if (!artworks) {
    return null
  }
  return (
    artworks.find((artwork) => artwork.id === id || artwork.slug === id) || null
  )
}

/**
 * 보물 시리즈 작품들을 가져오는 함수
 */
export async function fetchTreasureArtworks(): Promise<Artwork[]> {
  const cacheKey = 'treasure'

  // 캐시된 데이터 확인
  const cachedData = getCachedData<Artwork[]>(cacheKey)
  if (cachedData) {
    return cachedData
  }

  try {
    const allArtworks = await fetchArtworksFromAirtable()
    if (!allArtworks) {
      return []
    }
    const treasureArtworks = allArtworks
      .filter(
        (artwork) =>
          artwork.title.includes('보물') ||
          artwork.title.toLowerCase().includes('treasure') ||
          artwork.category === 'treasure'
      )
      .sort((a, b) => {
        // 보물 1, 2, 3... 순으로 정렬
        const numA = parseInt(a.title.match(/\d+/)?.[0] || '0')
        const numB = parseInt(b.title.match(/\d+/)?.[0] || '0')
        return numA - numB
      })

    setCachedData(cacheKey, treasureArtworks)
    return treasureArtworks
  } catch (error) {
    console.error('Error fetching treasure artworks from Airtable:', error)
    return []
  }
}

/**
 * 추천 작품들을 가져오는 함수
 */
export async function fetchFeaturedArtworks(
  limit: number = 3
): Promise<Artwork[] | null> {
  const cacheKey = `featured-artworks-${limit}`

  // 캐시된 데이터 확인
  const cachedData = getCachedData<Artwork[]>(cacheKey)
  if (cachedData) {
    return cachedData
  }

  try {
    const allArtworks = await fetchArtworksFromAirtable()
    if (!allArtworks) {
      return []
    }

    // 추천 작품들을 선택 (최신순으로 정렬하여 상위 limit개 선택)
    const featuredArtworks = allArtworks
      .sort((a, b) => b.year - a.year)
      .slice(0, limit)

    setCachedData(cacheKey, featuredArtworks)
    return featuredArtworks
  } catch (error) {
    console.error('Error fetching featured artworks from Airtable:', error)
    return []
  }
}
