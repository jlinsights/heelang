import {
  fetchArtworksFromAirtable,
  fetchFeaturedArtworks,
  fetchTreasureArtworks,
} from '@/lib/airtable'
import type { Artwork } from '@/lib/types'
import { getArtworkImageUrl } from './image-utils'

// 로컬 작품 이미지 경로 생성 함수
export function getLocalArtworkImagePath(
  slug: string,
  year: number,
  size: 'thumb' | 'medium' | 'large' = 'medium'
): string {
  // slug에서 heelang- 접두사 제거하고 연도 추출
  const cleanSlug = slug.replace(/^heelang-/, '')
  const filename = `heelang-${cleanSlug}-${size}.jpg`
  return `/images/Artworks/${year}/${filename}`
}

// 작품 이미지 URL 생성 (fallback 포함)
export function getArtworkImageWithFallback(
  slug: string,
  year: number,
  size: 'thumb' | 'medium' | 'large' = 'medium'
): string {
  try {
    return getLocalArtworkImagePath(slug, year, size)
  } catch (error) {
    console.warn(`Failed to get local image for ${slug}:`, error)
    // fallback to placeholder
    return '/placeholder.jpg'
  }
}

// 로컬 fallback 데이터
export const fallbackArtworksData: Artwork[] = [
  // 2025년 작품
  {
    id: '25',
    slug: 'heelang-journey-2025',
    title: '여행 (Journey)',
    year: 2025,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '70 x 140 cm',
    aspectRatio: '1/2',
    description:
      '인생의 여행길에서 마주하는 다양한 풍경과 감정을 담은 작품입니다.',
    imageUrl: getArtworkImageUrl('heelang-journey-2025', 2025, 'medium'),
    imageUrlQuery: 'journey calligraphy life path',
    artistNote:
      '길 위에서 느끼는 모든 순간들이 하나의 작품으로 완성되었습니다.',
    featured: false,
    category: 'recent',
    available: true,
    tags: ['여행', '인생', '길', '감정'],
  },
  {
    id: '24',
    slug: 'heelang-bloom-as-you-are-2025',
    title: '있는 그대로 피어나다 (Bloom As You Are)',
    year: 2025,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '100 x 70 cm',
    aspectRatio: '10/7',
    description:
      '자신만의 방식으로 피어나는 꽃처럼, 각자의 고유한 아름다움을 표현한 작품입니다.',
    imageUrl: getArtworkImageUrl(
      'heelang-bloom-as-you-are-2025',
      2025,
      'medium'
    ),
    imageUrlQuery: 'bloom authentic self calligraphy',
    artistNote:
      '억지로 만들어진 아름다움이 아닌, 자연스러운 본질의 아름다움을 추구했습니다.',
    featured: true,
    category: 'recent',
    available: true,
    tags: ['꽃', '자연', '아름다움', '본질'],
  },
  {
    id: '23',
    slug: 'heelang-a-boy-2025',
    title: '소년 (A Boy)',
    year: 2025,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '50 x 70 cm',
    aspectRatio: '5/7',
    description: '순수함과 호기심으로 가득한 소년의 마음을 담은 작품입니다.',
    imageUrl: getArtworkImageUrl('heelang-a-boy-2025', 2025, 'medium'),
    imageUrlQuery: 'boy innocence youth calligraphy',
    artistNote: '잃어버린 순수함에 대한 그리움을 서예로 표현했습니다.',
    featured: false,
    category: 'recent',
    available: true,
    tags: ['순수', '소년', '호기심', '그리움'],
  },
  {
    id: '22',
    slug: 'heelang-fortune-2025',
    title: '복 (Fortune)',
    year: 2025,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '90 x 90 cm',
    aspectRatio: '1/1',
    description: '진정한 복이 무엇인지에 대한 성찰을 담은 작품입니다.',
    imageUrl: getArtworkImageUrl('heelang-fortune-2025', 2025, 'medium'),
    imageUrlQuery: 'fortune blessing happiness calligraphy',
    artistNote:
      '물질적 풍요보다는 마음의 평안함에서 오는 복을 표현하고자 했습니다.',
    featured: false,
    category: 'recent',
    available: true,
    tags: ['복', '행복', '평안', '성찰'],
  },
  {
    id: '21',
    slug: 'heelang-way-2025',
    title: '길 (Way)',
    year: 2025,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '140 x 70 cm',
    aspectRatio: '2/1',
    description: '인생의 길, 예술의 길에 대한 깊은 사유를 담은 작품입니다.',
    imageUrl: getArtworkImageUrl('heelang-way-2025', 2025, 'medium'),
    imageUrlQuery: 'way path life journey calligraphy',
    artistNote: '올바른 길에 대한 끊임없는 탐구와 성찰의 과정을 표현했습니다.',
    featured: true,
    category: 'recent',
    available: true,
    tags: ['길', '인생', '예술', '탐구'],
  },

  // 2024년 작품
  {
    id: '20',
    slug: 'heelang-celebration-2024',
    title: '축하 (Celebration)',
    year: 2024,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '70 x 100 cm',
    aspectRatio: '7/10',
    description: '삶의 소중한 순간들을 축하하는 마음을 담은 작품입니다.',
    imageUrl: getArtworkImageUrl('heelang-celebration-2024', 2024, 'medium'),
    imageUrlQuery: 'celebration joy life moments calligraphy',
    artistNote:
      '일상의 작은 기쁨들도 충분히 축하받을 만한 가치가 있다는 생각을 담았습니다.',
    featured: false,
    category: '2024',
    available: true,
    tags: ['축하', '기쁨', '일상', '가치'],
  },
  {
    id: '19',
    slug: 'heelang-one-day-one-good-day-2024',
    title: '하루 한 번 좋은 날 (One Day One Good Day)',
    year: 2024,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '50 x 70 cm',
    aspectRatio: '5/7',
    description:
      '매일을 좋은 날로 만들어가는 긍정적인 마음가짐을 표현한 작품입니다.',
    imageUrl: getArtworkImageUrl(
      'heelang-one-day-one-good-day-2024',
      2024,
      'medium'
    ),
    imageUrlQuery: 'good day positive mindset daily life calligraphy',
    artistNote: '하루하루를 감사한 마음으로 살아가는 삶의 태도를 담았습니다.',
    featured: false,
    category: '2024',
    available: true,
    tags: ['좋은날', '긍정', '감사', '일상'],
  },
  {
    id: '18',
    slug: 'heelang-ups-and-downs-2024',
    title: '기복 (Ups and Downs)',
    year: 2024,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '70 x 140 cm',
    aspectRatio: '1/2',
    description:
      '인생의 기복과 변화를 담담히 받아들이는 마음을 표현한 작품입니다.',
    imageUrl: getArtworkImageUrl('heelang-ups-and-downs-2024', 2024, 'medium'),
    imageUrlQuery: 'ups downs life changes acceptance calligraphy',
    artistNote:
      '인생의 오르막과 내리막을 모두 받아들이는 평정심을 표현했습니다.',
    featured: false,
    category: '2024',
    available: true,
    tags: ['기복', '변화', '평정심', '인생'],
  },
  {
    id: '17',
    slug: 'heelang-truth-within-the-ordinary-2024',
    title: '평범함 속의 진리 (Truth Within the Ordinary)',
    year: 2024,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '100 x 70 cm',
    aspectRatio: '10/7',
    description:
      '일상의 평범한 순간들 속에서 발견되는 깊은 진리를 담은 작품입니다.',
    imageUrl: getArtworkImageUrl(
      'heelang-truth-within-the-ordinary-2024',
      2024,
      'medium'
    ),
    imageUrlQuery: 'truth ordinary daily life wisdom calligraphy',
    artistNote: '특별함을 찾기보다는 평범함 속에 숨어있는 진리에 주목했습니다.',
    featured: false,
    category: '2024',
    available: true,
    tags: ['진리', '평범함', '일상', '지혜'],
  },
  {
    id: '16',
    slug: 'heelang-whisper-of-nature-2024',
    title: '자연의 속삭임 (Whisper of Nature)',
    year: 2024,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '90 x 90 cm',
    aspectRatio: '1/1',
    description:
      '자연이 들려주는 미세한 소리와 움직임을 서예로 표현한 작품입니다.',
    imageUrl: getArtworkImageUrl(
      'heelang-whisper-of-nature-2024',
      2024,
      'medium'
    ),
    imageUrlQuery: 'nature whisper natural sounds calligraphy',
    artistNote: '자연과의 교감 속에서 느끼는 평온함과 경이로움을 담았습니다.',
    featured: false,
    category: '2024',
    available: true,
    tags: ['자연', '속삭임', '평온', '교감'],
  },
  {
    id: '15',
    slug: 'heelang-stem-2024',
    title: '줄기 (Stem)',
    year: 2024,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '140 x 70 cm',
    aspectRatio: '2/1',
    description:
      '식물의 줄기처럼 곧게 뻗어나가는 의지와 성장을 표현한 작품입니다.',
    imageUrl: getArtworkImageUrl('heelang-stem-2024', 2024, 'medium'),
    imageUrlQuery: 'stem plant growth strength calligraphy',
    artistNote:
      '굽히지 않는 의지와 끊임없는 성장의 의미를 줄기의 형상에 담았습니다.',
    featured: false,
    category: '2024',
    available: true,
    tags: ['줄기', '성장', '의지', '식물'],
  },

  // 2023년 작품
  {
    id: '14',
    slug: 'heelang-breath-2023',
    title: '호흡 (Breath)',
    year: 2023,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '70 x 100 cm',
    aspectRatio: '7/10',
    description:
      '생명의 가장 기본이 되는 호흡의 리듬과 흐름을 표현한 작품입니다.',
    imageUrl: getArtworkImageUrl('heelang-breath-2023', 2023, 'medium'),
    imageUrlQuery: 'breath life rhythm flow calligraphy',
    artistNote:
      '호흡의 들숨과 날숨처럼 반복되는 생명의 리듬을 서예로 표현했습니다.',
    featured: false,
    category: '2023',
    available: true,
    tags: ['호흡', '생명', '리듬', '흐름'],
  },
  {
    id: '13',
    slug: 'heelang-inkstone-2023',
    title: '벼루 (Inkstone)',
    year: 2023,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '50 x 70 cm',
    aspectRatio: '5/7',
    description:
      '서예가의 가장 소중한 도구인 벼루에 대한 경외심을 담은 작품입니다.',
    imageUrl: getArtworkImageUrl('heelang-inkstone-2023', 2023, 'medium'),
    imageUrlQuery: 'inkstone calligraphy tool tradition respect calligraphy',
    artistNote: '천년을 함께하는 벼루에 대한 깊은 애정과 존경을 표현했습니다.',
    featured: false,
    category: '2023',
    available: true,
    tags: ['벼루', '도구', '전통', '존경'],
  },
  {
    id: '12',
    slug: 'heelang-memories-2023',
    title: '기억 (Memories)',
    year: 2023,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '90 x 90 cm',
    aspectRatio: '1/1',
    description: '소중했던 기억들이 마음 속에 남긴 흔적들을 담은 작품입니다.',
    imageUrl: getArtworkImageUrl('heelang-memories-2023', 2023, 'medium'),
    imageUrlQuery: 'memories past emotional traces calligraphy',
    artistNote:
      '시간이 지나도 변하지 않는 소중한 기억들의 가치를 표현했습니다.',
    featured: false,
    category: '2023',
    available: true,
    tags: ['기억', '과거', '감정', '가치'],
  },

  // 2022년 작품 (보물 시리즈)
  {
    id: '11',
    slug: 'heelang-treasure-8-2022',
    title: '벼루 (硯, Inkstone)',
    year: 2022,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '70 x 70 cm',
    aspectRatio: '1/1',
    description:
      '보물 시리즈의 여덟 번째 작품으로, 내면의 보물에 대한 탐구를 담았습니다.',
    imageUrl: getArtworkImageUrl('heelang-treasure-8-2022', 2022, 'medium'),
    imageUrlQuery: 'treasure 8 inner wealth calligraphy',
    artistNote: '진정한 보물은 마음 속에 있다는 깨달음을 표현했습니다.',
    featured: false,
    category: 'treasure',
    available: true,
    tags: ['보물', '내면', '깨달음', '문방사우'],
  },
  {
    id: '10',
    slug: 'heelang-treasure-7-2022',
    title: '먹 (墨, Ink Stick)',
    year: 2022,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '70 x 70 cm',
    aspectRatio: '1/1',
    description: '보물 시리즈의 일곱 번째 작품으로, 지혜의 가치를 탐구합니다.',
    imageUrl: getArtworkImageUrl('heelang-treasure-7-2022', 2022, 'medium'),
    imageUrlQuery: 'treasure 7 wisdom value calligraphy',
    artistNote: '물질적 가치를 넘어선 정신적 보물의 의미를 담았습니다.',
    featured: false,
    category: 'treasure',
    available: true,
    tags: ['보물', '지혜', '가치', '문방사우'],
  },
  {
    id: '9',
    slug: 'heelang-treasure-6-2022',
    title: '붓 (筆, Brush)',
    year: 2022,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '70 x 70 cm',
    aspectRatio: '1/1',
    description:
      '보물 시리즈의 여섯 번째 작품으로, 인간관계의 소중함을 표현합니다.',
    imageUrl: getArtworkImageUrl('heelang-treasure-6-2022', 2022, 'medium'),
    imageUrlQuery: 'treasure 6 relationships human connection calligraphy',
    artistNote:
      '사람과 사람 사이의 진실한 연결이 가장 큰 보물임을 깨달았습니다.',
    featured: false,
    category: 'treasure',
    available: true,
    tags: ['보물', '인간관계', '연결', '문방사우'],
  },
  {
    id: '8',
    slug: 'heelang-treasure-5-2022',
    title: '종이 (紙, Paper)',
    year: 2022,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '70 x 70 cm',
    aspectRatio: '1/1',
    description:
      '보물 시리즈의 다섯 번째 작품으로, 종이의 순수함과 가능성을 탐구합니다.',
    imageUrl: getArtworkImageUrl('heelang-treasure-5-2022', 2022, 'medium'),
    imageUrlQuery: 'paper jongi calligraphy traditional tools',
    artistNote:
      '백지의 무한한 가능성과 순수함을 통해 창조의 시작점을 표현했습니다.',
    featured: false,
    category: 'treasure',
    available: true,
    tags: ['보물', '종이', '가능성', '문방사우'],
  },
  {
    id: '7',
    slug: 'heelang-treasure-4-2022',
    title: '붓 (筆, Brush)',
    year: 2022,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '70 x 70 cm',
    aspectRatio: '1/1',
    description:
      '문방사우 시리즈의 네 번째 작품으로, 붓의 유연함과 표현력을 탐구합니다.',
    imageUrl: getArtworkImageUrl('heelang-treasure-4-2022', 2022, 'medium'),
    imageUrlQuery: 'brush but calligraphy traditional tools',
    artistNote:
      '붓털의 부드러움과 강인함을 통해 유연성과 표현의 자유로움을 담았습니다.',
    featured: false,
    category: 'treasure',
    available: true,
  },
  {
    id: '6',
    slug: 'heelang-treasure-3-2022',
    title: '종이 (紙, Paper)',
    year: 2022,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '70 x 70 cm',
    aspectRatio: '1/1',
    description:
      '문방사우 시리즈의 세 번째 작품으로, 종이의 순수함과 가능성을 탐구합니다.',
    imageUrl: getArtworkImageUrl('heelang-treasure-3-2022', 2022, 'medium'),
    imageUrlQuery: 'paper jongi calligraphy traditional tools',
    artistNote:
      '백지의 무한한 가능성과 순수함을 통해 창조의 시작점을 표현했습니다.',
    featured: true,
    category: 'treasure',
    available: true,
  },
  {
    id: '5',
    slug: 'heelang-treasure-2-2022',
    title: '벼루 (硯, Inkstone)',
    year: 2022,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '70 x 70 cm',
    aspectRatio: '1/1',
    description:
      '문방사우 시리즈의 두 번째 작품으로, 벼루의 견고함과 포용력을 표현합니다.',
    imageUrl: getArtworkImageUrl('heelang-treasure-2-2022', 2022, 'medium'),
    imageUrlQuery: 'inkstone byeoru calligraphy traditional tools',
    artistNote:
      '벼루의 단단함과 먹을 받아들이는 포용력을 통해 인내와 수용의 미덕을 담았습니다.',
    featured: false,
    category: 'treasure',
    available: true,
  },
  {
    id: '4',
    slug: 'heelang-treasure-1-2022',
    title: '먹 (墨, Ink Stick)',
    year: 2022,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '70 x 70 cm',
    aspectRatio: '1/1',
    description:
      '문방사우 시리즈의 첫 번째 작품으로, 먹의 깊이와 농담을 탐구합니다.',
    imageUrl: getArtworkImageUrl('heelang-treasure-1-2022', 2022, 'medium'),
    imageUrlQuery: 'ink stick muk calligraphy traditional tools',
    artistNote:
      '먹의 진한 농담과 번짐을 통해 서예의 근본적 아름다움을 표현했습니다.',
    featured: false,
    category: 'treasure',
    available: true,
  },

  // 2021년 작품
  {
    id: '3',
    slug: 'heelang-black-and-white-2021',
    title: '흑백 (Black and White)',
    year: 2021,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '70 x 100 cm',
    aspectRatio: '7/10',
    description:
      '흑과 백의 대비를 통해 삶의 이중성과 조화를 표현한 작품입니다.',
    imageUrl: getArtworkImageUrl(
      'heelang-black-and-white-2021',
      2021,
      'medium'
    ),
    imageUrlQuery: 'black white contrast duality life calligraphy',
    artistNote:
      '상반된 것들이 만나 이루는 완전한 조화의 아름다움을 추구했습니다.',
    featured: false,
    category: '2021',
    available: true,
  },
  {
    id: '2',
    slug: 'heelang-echo-2021',
    title: '메아리 (Echo)',
    year: 2021,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '90 x 90 cm',
    aspectRatio: '1/1',
    description: '마음의 소리가 울려 퍼지는 메아리의 감동을 담은 작품입니다.',
    imageUrl: getArtworkImageUrl('heelang-echo-2021', 2021, 'medium'),
    imageUrlQuery: 'echo sound reverberation heart emotion calligraphy',
    artistNote:
      '내면의 목소리가 세상과 공명하며 만들어내는 아름다운 울림을 표현했습니다.',
    featured: false,
    category: '2021',
    available: true,
  },
  {
    id: '1',
    slug: 'heelang-hologram-2021',
    title: '홀로그램 (Hologram)',
    year: 2021,
    medium: '화선지에 먹 (Ink on Mulberry Paper)',
    dimensions: '70 x 100 cm',
    aspectRatio: '7/10',
    description: '다차원적 현실과 환상의 경계를 탐구한 실험적 작품입니다.',
    imageUrl: getArtworkImageUrl('heelang-hologram-2021', 2021, 'medium'),
    imageUrlQuery: 'hologram dimension reality illusion modern calligraphy',
    artistNote:
      '전통 서예와 현대적 감각의 만남을 통해 새로운 차원의 작품을 시도했습니다.',
    featured: false,
    category: '2021',
    available: true,
  },
]

/**
 * 클라이언트 사이드에서 API를 통해 작품 데이터를 가져오는 함수
 */
async function fetchArtworksFromAPI(): Promise<Artwork[]> {
  try {
    const response = await fetch('/api/artworks', {
      cache: 'no-store', // 항상 최신 데이터 가져오기
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const result = await response.json()

    if (result.success && result.data) {
      return result.data
    } else {
      console.warn('API returned no artwork data:', result.message)
      return []
    }
  } catch (error) {
    console.error('Failed to fetch artworks from API:', error)
    return []
  }
}

/**
 * 환경에 따라 적절한 데이터 소스에서 작품 목록을 가져오는 함수
 */
async function getArtworksFromSource(): Promise<Artwork[]> {
  // 서버 사이드인지 확인
  const isServer = typeof window === 'undefined'

  if (isServer) {
    // 서버 사이드: Airtable에 직접 접근
    try {
      console.log(
        '🔍 Server-side: Attempting to fetch artworks from Airtable...'
      )
      const airtableData = await fetchArtworksFromAirtable()

      if (airtableData && airtableData.length > 0) {
        console.log(
          `✅ Successfully fetched ${airtableData.length} artworks from Airtable`
        )
        return airtableData
      } else {
        console.warn('⚠️ No artworks found in Airtable, using fallback data')
        return fallbackArtworksData
      }
    } catch (error) {
      console.error('❌ Error fetching artworks from Airtable:', error)
      console.log('🔄 Using fallback data')
      return fallbackArtworksData
    }
  } else {
    // 클라이언트 사이드: API 라우트를 통해 접근
    try {
      console.log('🔍 Client-side: Attempting to fetch artworks from API...')
      const apiData = await fetchArtworksFromAPI()

      if (apiData && apiData.length > 0) {
        console.log(
          `✅ Successfully fetched ${apiData.length} artworks from API`
        )
        return apiData
      } else {
        console.warn('⚠️ No artworks found from API, using fallback data')
        return fallbackArtworksData
      }
    } catch (error) {
      console.error('❌ Error fetching artworks from API:', error)
      console.log('🔄 Using fallback data')
      return fallbackArtworksData
    }
  }
}

/**
 * 작품 목록을 가져오는 함수 (환경에 따라 적절한 소스 선택)
 */
export async function getArtworks(): Promise<Artwork[]> {
  return await getArtworksFromSource()
}

/**
 * 추천 작품들을 가져오는 통합 함수 (환경에 따라 적절한 소스 선택)
 */
export async function getFeaturedArtworks(
  limit: number = 3
): Promise<Artwork[]> {
  // 서버 사이드인지 확인
  const isServer = typeof window === 'undefined'

  if (isServer) {
    // 서버 사이드: Airtable에 직접 접근
    try {
      console.log(
        '🔍 Server-side: Attempting to fetch featured artworks from Airtable...'
      )
      const airtableData = await fetchFeaturedArtworks(limit)
      if (airtableData && airtableData.length > 0) {
        console.log(
          `✅ Successfully fetched ${airtableData.length} featured artworks from Airtable`
        )
        return airtableData
      }
    } catch (error) {
      console.warn('Failed to fetch featured artworks from Airtable:', error)
    }
  } else {
    // 클라이언트 사이드: API를 통해 모든 작품을 가져온 후 featured 필터링
    try {
      console.log(
        '🔍 Client-side: Attempting to fetch artworks from API for featured selection...'
      )
      const allArtworks = await fetchArtworksFromAPI()
      if (allArtworks && allArtworks.length > 0) {
        const featuredFromAPI = allArtworks.filter(
          (artwork) => artwork.featured
        )
        if (featuredFromAPI.length > 0) {
          console.log(
            `✅ Successfully found ${featuredFromAPI.length} featured artworks from API`
          )
          return featuredFromAPI.slice(0, limit)
        }
      }
    } catch (error) {
      console.warn('Failed to fetch featured artworks from API:', error)
    }
  }

  // fallback data에서 featured 작품들을 찾아서 반환
  console.log(
    '⚠️ No featured artworks found from external sources, using fallback data'
  )
  const featuredFallback = fallbackArtworksData.filter(
    (artwork) => artwork.featured
  )
  return featuredFallback.slice(0, limit)
}

/**
 * 보물 시리즈 작품들을 가져오는 통합 함수 (환경에 따라 적절한 소스 선택)
 */
export async function getTreasureArtworks(): Promise<Artwork[]> {
  // 서버 사이드인지 확인
  const isServer = typeof window === 'undefined'

  if (isServer) {
    // 서버 사이드: Airtable에 직접 접근
    try {
      console.log(
        '🔍 Server-side: Attempting to fetch treasure artworks from Airtable...'
      )
      const airtableData = await fetchTreasureArtworks()
      if (airtableData.length > 0) {
        console.log(
          `✅ Successfully fetched ${airtableData.length} treasure artworks from Airtable`
        )
        return airtableData
      }
    } catch (error) {
      console.warn('Failed to fetch treasure artworks from Airtable:', error)
    }
  } else {
    // 클라이언트 사이드: API를 통해 모든 작품을 가져온 후 treasure 필터링
    try {
      console.log(
        '🔍 Client-side: Attempting to fetch artworks from API for treasure selection...'
      )
      const allArtworks = await fetchArtworksFromAPI()
      if (allArtworks && allArtworks.length > 0) {
        const treasureFromAPI = allArtworks.filter(
          (artwork) => artwork.category === 'treasure'
        )
        if (treasureFromAPI.length > 0) {
          console.log(
            `✅ Successfully found ${treasureFromAPI.length} treasure artworks from API`
          )
          return treasureFromAPI
        }
      }
    } catch (error) {
      console.warn('Failed to fetch treasure artworks from API:', error)
    }
  }

  // fallback data에서 treasure 작품들을 찾아서 반환
  console.log(
    '⚠️ No treasure artworks found from external sources, using fallback data'
  )
  const treasureFallback = fallbackArtworksData.filter(
    (artwork) => artwork.category === 'treasure'
  )
  return treasureFallback
}

/**
 * ID로 특정 작품을 찾는 함수
 */
export async function getArtworkById(id: string): Promise<Artwork | null> {
  const artworks = await getArtworks()
  return artworks.find((artwork) => artwork.id === id) || null
}

/**
 * Slug로 특정 작품을 찾는 함수
 */
export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  console.log(`🔍 getArtworkBySlug called with slug: ${slug}`)

  const artworks = await getArtworks()
  console.log(`📊 Total artworks retrieved: ${artworks.length}`)

  // 모든 슬러그를 로그로 출력 (처음 5개만)
  console.log(
    `📋 First 5 artwork slugs:`,
    artworks.slice(0, 5).map((a) => a.slug)
  )

  // 특정 슬러그 검색
  const found = artworks.find((artwork) => artwork.slug === slug)

  if (found) {
    console.log(`✅ Found artwork:`, {
      id: found.id,
      title: found.title,
      slug: found.slug,
      year: found.year,
    })
  } else {
    console.log(`❌ No artwork found with slug: ${slug}`)

    // 유사한 슬러그 찾기
    const similar = artworks.filter(
      (artwork) => artwork.slug && artwork.slug.includes('grandpa')
    )

    if (similar.length > 0) {
      console.log(
        `🔍 Similar slugs found:`,
        similar.map((a) => ({
          slug: a.slug,
          title: a.title,
        }))
      )
    }
  }

  return found || null
}

// 기존 export들 (하위 호환성)
export const artworksData = fallbackArtworksData

/**
 * Server-side helper to fetch artworks via internal API with Next.js cache tags.
 * This enables ISR using revalidateTag("artworks") from the webhook.
 */
export async function fetchArtworksWithTag(revalidateSeconds: number = 3600) {
  // Ensure absolute URL – fallback to localhost during development
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : undefined) ||
    `http://localhost:${process.env.PORT || 3000}`

  const url = `${baseUrl}/api/artworks`

  try {
    const res = await fetch(url, {
      // force-cache + tag enables efficient ISR
      next: {
        tags: ['artworks'],
        revalidate: revalidateSeconds,
      },
    })

    if (!res.ok) {
      // fetch 성공했지만 404/500 등
      console.error('API responded with error:', res.status)
      return []
    }

    // JSON 파싱 실패(HTML 등) 대비
    let json
    try {
      json = await res.json()
    } catch (err) {
      console.error('Failed to parse JSON from /api/artworks:', err)
      return []
    }

    return (json.data || []) as Artwork[]
  } catch (error) {
    console.error('Failed to fetch /api/artworks:', error)
    return []
  }
}

/**
 * Alias for getArtworks for backward compatibility
 */
export async function fetchArtworks(): Promise<Artwork[]> {
  return await getArtworksFromSource()
}

// 무작위 추천 작품 가져오기 (현재 작품 제외)
export async function getRandomArtworks(
  currentSlug: string,
  count: number = 4
): Promise<Artwork[]> {
  try {
    const allArtworks = await getArtworks()

    // 현재 작품 제외
    const otherArtworks = allArtworks.filter(
      (artwork) => artwork.slug !== currentSlug
    )

    // 무작위로 섞기
    const shuffled = [...otherArtworks].sort(() => Math.random() - 0.5)

    // 지정된 개수만큼 반환
    return shuffled.slice(0, count)
  } catch (error) {
    console.error('🚨 getRandomArtworks error:', error)
    return []
  }
}
