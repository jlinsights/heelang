import {
  fetchArtistFromAirtable,
  fetchArtworksFromAirtable,
  fetchFeaturedArtworks,
  fetchTreasureArtworks as fetchTreasureFromAirtable,
} from "./airtable";
import { getArtistImageUrl, getArtworkImageUrl } from "./image-utils";
import type { Artist, Artwork } from "./types";

// 로컬 fallback 데이터
export const fallbackArtistData: Artist = {
  name: "희랑 공경순 (孔敬順, Kong KyongSun)",
  bio: "서울에서 활동하는 현대 서예가입니다. 전통 서예의 정신을 계승하면서도 현대적인 미감을 탐구하며, 문자의 조형성과 먹의 물성을 통해 내면의 세계를 표현합니다. 사단법인 동양서예협회 초대작가로 활동하며, 다수의 개인전과 그룹전에 참여하였습니다. 그의 작품은 여러 미술관과 개인 컬렉션에 소장되어 있으며, 서예 교육을 통해 전통 문화의 계승에도 힘쓰고 있습니다.",
  statement:
    "나의 작업은 선과 공간, 여백의 관계를 탐구하는 과정입니다. 각 획은 순간의 호흡이며, 전체 구성은 우주적 질서와 조응하고자 하는 염원을 담고 있습니다. 전통에 뿌리를 두되, 동시대의 감성과 소통하는 새로운 서예의 가능성을 모색합니다. 문방사우(文房四友)를 통해 표현되는 서예의 본질과 현대적 해석을 통해 과거와 현재를 잇는 다리 역할을 하고자 합니다.",
  profileImageUrl: getArtistImageUrl("공경순 작가 프로필.png"),
  birthYear: 1980,
  education: [
    "서울대학교 미술대학 동양화과 졸업 (2003)",
    "동 대학원 동양화과 석사 (2005)",
    "중국 중앙미술학원 서법과 연수 (2010)",
  ],
  exhibitions: [
    "2025 개인전 '길(Way)' - 인사동 한국미술관",
    "2024 그룹전 '현대서예의 새로운 지평' - 예술의전당",
    "2023 개인전 '문방사우 팔제(文房四友 八題)' - 갤러리 현대",
    "2022 동양서예협회 초대전 - 세종문화회관",
    "2021 한중일 서예교류전 - 국립현대미술관",
  ],
  awards: [
    "2024 대한민국 서예대전 대상",
    "2023 동양서예협회 우수작가상",
    "2022 서울시 문화상 서예부문",
    "2021 한국서예학회 신진작가상",
  ],
  collections: [
    "국립현대미술관",
    "서울시립미술관",
    "인사동 한국미술관",
    "동양서예협회 소장품",
  ],
};

export const fallbackArtworksData: Artwork[] = [
  // 2025년 작품
  {
    id: "25",
    slug: "heelang-journey-2025",
    title: "여행 (Journey)",
    year: 2025,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "70 x 140 cm",
    aspectRatio: "1/2",
    description:
      "인생의 여행길에서 마주하는 다양한 풍경과 감정을 담은 작품입니다.",
    imageUrl: getArtworkImageUrl("heelang-journey-2025", 2025, "medium"),
    imageUrlQuery: "journey calligraphy life path",
    artistNote:
      "길 위에서 느끼는 모든 순간들이 하나의 작품으로 완성되었습니다.",
    featured: false,
    category: "recent",
    available: true,
  },
  {
    id: "24",
    slug: "heelang-bloom-as-you-are-2025",
    title: "있는 그대로 피어나다 (Bloom As You Are)",
    year: 2025,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "100 x 70 cm",
    aspectRatio: "10/7",
    description:
      "자신만의 방식으로 피어나는 꽃처럼, 각자의 고유한 아름다움을 표현한 작품입니다.",
    imageUrl: getArtworkImageUrl(
      "heelang-bloom-as-you-are-2025",
      2025,
      "medium"
    ),
    imageUrlQuery: "bloom authentic self calligraphy",
    artistNote:
      "억지로 만들어진 아름다움이 아닌, 자연스러운 본질의 아름다움을 추구했습니다.",
    featured: true,
    category: "recent",
    available: true,
  },
  {
    id: "23",
    slug: "heelang-a-boy-2025",
    title: "소년 (A Boy)",
    year: 2025,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "50 x 70 cm",
    aspectRatio: "5/7",
    description: "순수함과 호기심으로 가득한 소년의 마음을 담은 작품입니다.",
    imageUrl: getArtworkImageUrl("heelang-a-boy-2025", 2025, "medium"),
    imageUrlQuery: "boy innocence youth calligraphy",
    artistNote: "잃어버린 순수함에 대한 그리움을 서예로 표현했습니다.",
    featured: false,
    category: "recent",
    available: true,
  },
  {
    id: "22",
    slug: "heelang-fortune-2025",
    title: "복 (Fortune)",
    year: 2025,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "90 x 90 cm",
    aspectRatio: "1/1",
    description: "진정한 복이 무엇인지에 대한 성찰을 담은 작품입니다.",
    imageUrl: getArtworkImageUrl("heelang-fortune-2025", 2025, "medium"),
    imageUrlQuery: "fortune blessing happiness calligraphy",
    artistNote:
      "물질적 풍요보다는 마음의 평안함에서 오는 복을 표현하고자 했습니다.",
    featured: false,
    category: "recent",
    available: true,
  },
  {
    id: "21",
    slug: "heelang-way-2025",
    title: "길 (Way)",
    year: 2025,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "140 x 70 cm",
    aspectRatio: "2/1",
    description: "인생의 길, 예술의 길에 대한 깊은 사유를 담은 작품입니다.",
    imageUrl: getArtworkImageUrl("heelang-way-2025", 2025, "medium"),
    imageUrlQuery: "way path life journey calligraphy",
    artistNote: "올바른 길에 대한 끊임없는 탐구와 성찰의 과정을 표현했습니다.",
    featured: true,
    category: "recent",
    available: true,
  },

  // 2024년 작품
  {
    id: "20",
    slug: "heelang-celebration-2024",
    title: "축하 (Celebration)",
    year: 2024,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "70 x 100 cm",
    aspectRatio: "7/10",
    description: "삶의 소중한 순간들을 축하하는 마음을 담은 작품입니다.",
    imageUrl: getArtworkImageUrl("heelang-celebration-2024", 2024, "medium"),
    imageUrlQuery: "celebration joy life moments calligraphy",
    artistNote:
      "일상의 작은 기쁨들도 충분히 축하받을 만한 가치가 있다는 생각을 담았습니다.",
    featured: false,
    category: "2024",
    available: true,
  },
  {
    id: "19",
    slug: "heelang-one-day-one-good-day-2024",
    title: "하루 한 번 좋은 날 (One Day One Good Day)",
    year: 2024,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "50 x 70 cm",
    aspectRatio: "5/7",
    description:
      "매일을 좋은 날로 만들어가는 긍정적인 마음가짐을 표현한 작품입니다.",
    imageUrl: getArtworkImageUrl(
      "heelang-one-day-one-good-day-2024",
      2024,
      "medium"
    ),
    imageUrlQuery: "good day positive mindset daily life calligraphy",
    artistNote: "하루하루를 감사한 마음으로 살아가는 삶의 태도를 담았습니다.",
    featured: false,
    category: "2024",
    available: true,
  },
  {
    id: "18",
    slug: "heelang-ups-and-downs-2024",
    title: "기복 (Ups and Downs)",
    year: 2024,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "70 x 140 cm",
    aspectRatio: "1/2",
    description:
      "인생의 기복과 변화를 담담히 받아들이는 마음을 표현한 작품입니다.",
    imageUrl: getArtworkImageUrl("heelang-ups-and-downs-2024", 2024, "medium"),
    imageUrlQuery: "ups downs life changes acceptance calligraphy",
    artistNote:
      "인생의 오르막과 내리막을 모두 받아들이는 평정심을 표현했습니다.",
    featured: false,
    category: "2024",
    available: true,
  },
  {
    id: "17",
    slug: "heelang-truth-within-the-ordinary-2024",
    title: "평범함 속의 진리 (Truth Within the Ordinary)",
    year: 2024,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "100 x 70 cm",
    aspectRatio: "10/7",
    description:
      "일상의 평범한 순간들 속에서 발견되는 깊은 진리를 담은 작품입니다.",
    imageUrl: getArtworkImageUrl(
      "heelang-truth-within-the-ordinary-2024",
      2024,
      "medium"
    ),
    imageUrlQuery: "truth ordinary daily life wisdom calligraphy",
    artistNote: "특별함을 찾기보다는 평범함 속에 숨어있는 진리에 주목했습니다.",
    featured: false,
    category: "2024",
    available: true,
  },
  {
    id: "16",
    slug: "heelang-whisper-of-nature-2024",
    title: "자연의 속삭임 (Whisper of Nature)",
    year: 2024,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "90 x 90 cm",
    aspectRatio: "1/1",
    description:
      "자연이 들려주는 미세한 소리와 움직임을 서예로 표현한 작품입니다.",
    imageUrl: getArtworkImageUrl(
      "heelang-whisper-of-nature-2024",
      2024,
      "medium"
    ),
    imageUrlQuery: "nature whisper natural sounds calligraphy",
    artistNote: "자연과의 교감 속에서 느끼는 평온함과 경이로움을 담았습니다.",
    featured: false,
    category: "2024",
    available: true,
  },
  {
    id: "15",
    slug: "heelang-stem-2024",
    title: "줄기 (Stem)",
    year: 2024,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "140 x 70 cm",
    aspectRatio: "2/1",
    description:
      "식물의 줄기처럼 곧게 뻗어나가는 의지와 성장을 표현한 작품입니다.",
    imageUrl: getArtworkImageUrl("heelang-stem-2024", 2024, "medium"),
    imageUrlQuery: "stem plant growth strength calligraphy",
    artistNote:
      "굽히지 않는 의지와 끊임없는 성장의 의미를 줄기의 형상에 담았습니다.",
    featured: false,
    category: "2024",
    available: true,
  },

  // 2023년 작품
  {
    id: "14",
    slug: "heelang-breath-2023",
    title: "호흡 (Breath)",
    year: 2023,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "70 x 100 cm",
    aspectRatio: "7/10",
    description:
      "생명의 가장 기본이 되는 호흡의 리듬과 흐름을 표현한 작품입니다.",
    imageUrl: getArtworkImageUrl("heelang-breath-2023", 2023, "medium"),
    imageUrlQuery: "breath life rhythm flow calligraphy",
    artistNote:
      "호흡의 들숨과 날숨처럼 반복되는 생명의 리듬을 서예로 표현했습니다.",
    featured: false,
    category: "2023",
    available: true,
  },
  {
    id: "13",
    slug: "heelang-inkstone-2023",
    title: "벼루 (Inkstone)",
    year: 2023,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "50 x 70 cm",
    aspectRatio: "5/7",
    description:
      "서예가의 가장 소중한 도구인 벼루에 대한 경외심을 담은 작품입니다.",
    imageUrl: getArtworkImageUrl("heelang-inkstone-2023", 2023, "medium"),
    imageUrlQuery: "inkstone calligraphy tool tradition respect calligraphy",
    artistNote: "천년을 함께하는 벼루에 대한 깊은 애정과 존경을 표현했습니다.",
    featured: false,
    category: "2023",
    available: true,
  },
  {
    id: "12",
    slug: "heelang-memories-2023",
    title: "기억 (Memories)",
    year: 2023,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "90 x 90 cm",
    aspectRatio: "1/1",
    description: "소중했던 기억들이 마음 속에 남긴 흔적들을 담은 작품입니다.",
    imageUrl: getArtworkImageUrl("heelang-memories-2023", 2023, "medium"),
    imageUrlQuery: "memories past emotional traces calligraphy",
    artistNote:
      "시간이 지나도 변하지 않는 소중한 기억들의 가치를 표현했습니다.",
    featured: false,
    category: "2023",
    available: true,
  },

  // 2022년 작품 (보물 시리즈)
  {
    id: "11",
    slug: "heelang-treasure-8-2022",
    title: "벼루 (硯, Inkstone)",
    year: 2022,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "70 x 70 cm",
    aspectRatio: "1/1",
    description:
      "보물 시리즈의 여덟 번째 작품으로, 내면의 보물에 대한 탐구를 담았습니다.",
    imageUrl: getArtworkImageUrl("heelang-treasure-8-2022", 2022, "medium"),
    imageUrlQuery: "treasure 8 inner wealth calligraphy",
    artistNote: "진정한 보물은 마음 속에 있다는 깨달음을 표현했습니다.",
    featured: false,
    category: "treasure",
    available: true,
  },
  {
    id: "10",
    slug: "heelang-treasure-7-2022",
    title: "먹 (墨, Ink Stick)",
    year: 2022,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "70 x 70 cm",
    aspectRatio: "1/1",
    description: "보물 시리즈의 일곱 번째 작품으로, 지혜의 가치를 탐구합니다.",
    imageUrl: getArtworkImageUrl("heelang-treasure-7-2022", 2022, "medium"),
    imageUrlQuery: "treasure 7 wisdom value calligraphy",
    artistNote: "물질적 가치를 넘어선 정신적 보물의 의미를 담았습니다.",
    featured: false,
    category: "treasure",
    available: true,
  },
  {
    id: "9",
    slug: "heelang-treasure-6-2022",
    title: "붓 (筆, Brush)",
    year: 2022,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "70 x 70 cm",
    aspectRatio: "1/1",
    description:
      "보물 시리즈의 여섯 번째 작품으로, 인간관계의 소중함을 표현합니다.",
    imageUrl: getArtworkImageUrl("heelang-treasure-6-2022", 2022, "medium"),
    imageUrlQuery: "treasure 6 relationships human connection calligraphy",
    artistNote:
      "사람과 사람 사이의 진실한 연결이 가장 큰 보물임을 깨달았습니다.",
    featured: false,
    category: "treasure",
    available: true,
  },
  {
    id: "8",
    slug: "heelang-treasure-5-2022",
    title: "종이 (紙, Paper)",
    year: 2022,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "70 x 70 cm",
    aspectRatio: "1/1",
    description: "보물 시리즈의 다섯 번째 작품으로, 시간의 소중함을 다룹니다.",
    imageUrl: getArtworkImageUrl("heelang-treasure-5-2022", 2022, "medium"),
    imageUrlQuery: "treasure 5 time precious moments calligraphy",
    artistNote: "지나간 시간은 다시 돌아오지 않는 진정한 보물입니다.",
    featured: false,
    category: "treasure",
    available: true,
  },
  {
    id: "7",
    slug: "heelang-treasure-4-2022",
    title: "붓 (筆, Brush)",
    year: 2022,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "70 x 70 cm",
    aspectRatio: "1/1",
    description:
      "보물 시리즈의 네 번째 작품으로, 건강한 몸과 마음의 가치를 탐구합니다.",
    imageUrl: getArtworkImageUrl("heelang-treasure-4-2022", 2022, "medium"),
    imageUrlQuery: "treasure 4 health body mind wellness calligraphy",
    artistNote: "건강한 몸과 마음이야말로 모든 행복의 기초가 되는 보물입니다.",
    featured: false,
    category: "treasure",
    available: true,
  },
  {
    id: "6",
    slug: "heelang-treasure-3-2022",
    title: "종이 (紙, Paper)",
    year: 2022,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "70 x 70 cm",
    aspectRatio: "1/1",
    description: "보물 시리즈의 세 번째 작품으로, 사랑의 의미를 탐구합니다.",
    imageUrl: getArtworkImageUrl("heelang-treasure-3-2022", 2022, "medium"),
    imageUrlQuery: "treasure 3 love affection heart calligraphy",
    artistNote: "진실한 사랑은 주고받을수록 더 커지는 신비로운 보물입니다.",
    featured: true,
    category: "treasure",
    available: true,
  },
  {
    id: "5",
    slug: "heelang-treasure-2-2022",
    title: "벼루 (硯, Inkstone)",
    year: 2022,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "70 x 70 cm",
    aspectRatio: "1/1",
    description:
      "보물 시리즈의 두 번째 작품으로, 평화로운 마음의 가치를 표현합니다.",
    imageUrl: getArtworkImageUrl("heelang-treasure-2-2022", 2022, "medium"),
    imageUrlQuery: "treasure 2 peace tranquility mind calligraphy",
    artistNote:
      "어떤 외적 조건보다도 내면의 평화가 진정한 부라는 것을 표현했습니다.",
    featured: false,
    category: "treasure",
    available: true,
  },
  {
    id: "4",
    slug: "heelang-treasure-1-2022",
    title: "먹 (墨, Ink Stick)",
    year: 2022,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "70 x 70 cm",
    aspectRatio: "1/1",
    description:
      "보물 시리즈의 첫 번째 작품으로, 감사하는 마음의 소중함을 담았습니다.",
    imageUrl: getArtworkImageUrl("heelang-treasure-1-2022", 2022, "medium"),
    imageUrlQuery: "treasure 1 gratitude appreciation heart calligraphy",
    artistNote:
      "모든 것에 감사할 수 있는 마음이야말로 가장 큰 보물이라는 깨달음을 담았습니다.",
    featured: false,
    category: "treasure",
    available: true,
  },

  // 2021년 작품
  {
    id: "3",
    slug: "heelang-black-and-white-2021",
    title: "흑백 (Black and White)",
    year: 2021,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "70 x 100 cm",
    aspectRatio: "7/10",
    description:
      "흑과 백의 대비를 통해 삶의 이중성과 조화를 표현한 작품입니다.",
    imageUrl: getArtworkImageUrl(
      "heelang-black-and-white-2021",
      2021,
      "medium"
    ),
    imageUrlQuery: "black white contrast duality life calligraphy",
    artistNote:
      "상반된 것들이 만나 이루는 완전한 조화의 아름다움을 추구했습니다.",
    featured: false,
    category: "2021",
    available: true,
  },
  {
    id: "2",
    slug: "heelang-echo-2021",
    title: "메아리 (Echo)",
    year: 2021,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "90 x 90 cm",
    aspectRatio: "1/1",
    description: "마음의 소리가 울려 퍼지는 메아리의 감동을 담은 작품입니다.",
    imageUrl: getArtworkImageUrl("heelang-echo-2021", 2021, "medium"),
    imageUrlQuery: "echo sound reverberation heart emotion calligraphy",
    artistNote:
      "내면의 목소리가 세상과 공명하며 만들어내는 아름다운 울림을 표현했습니다.",
    featured: false,
    category: "2021",
    available: true,
  },
  {
    id: "1",
    slug: "heelang-hologram-2021",
    title: "홀로그램 (Hologram)",
    year: 2021,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "70 x 100 cm",
    aspectRatio: "7/10",
    description: "다차원적 현실과 환상의 경계를 탐구한 실험적 작품입니다.",
    imageUrl: getArtworkImageUrl("heelang-hologram-2021", 2021, "medium"),
    imageUrlQuery: "hologram dimension reality illusion modern calligraphy",
    artistNote:
      "전통 서예와 현대적 감각의 만남을 통해 새로운 차원의 작품을 시도했습니다.",
    featured: false,
    category: "2021",
    available: true,
  },
];

/**
 * 작품 데이터를 가져오는 통합 함수 (Airtable 우선, fallback 지원)
 */
export async function getArtworks(): Promise<Artwork[]> {
  try {
    const airtableData = await fetchArtworksFromAirtable();
    if (airtableData && airtableData.length > 0) {
      return airtableData;
    }
  } catch (error) {
    console.warn("Failed to fetch from Airtable, using fallback data:", error);
  }

  return fallbackArtworksData;
}

/**
 * 작가 정보를 가져오는 통합 함수 (Airtable 우선, fallback 지원)
 */
export async function getArtist(): Promise<Artist> {
  try {
    const airtableData = await fetchArtistFromAirtable();
    if (airtableData) {
      return airtableData;
    }
  } catch (error) {
    console.warn(
      "Failed to fetch artist from Airtable, using fallback data:",
      error
    );
  }

  return fallbackArtistData;
}

/**
 * 추천 작품들을 가져오는 통합 함수
 */
export async function getFeaturedArtworks(
  limit: number = 3
): Promise<Artwork[]> {
  try {
    const airtableData = await fetchFeaturedArtworks(limit);
    if (airtableData && airtableData.length > 0) {
      return airtableData;
    }
  } catch (error) {
    console.warn(
      "Failed to fetch featured artworks from Airtable, using fallback data:",
      error
    );
  }

  // fallback: featured가 true인 작품들 또는 최신 작품들
  const featured = fallbackArtworksData.filter((artwork) => artwork.featured);
  if (featured.length >= limit) {
    return featured.slice(0, limit);
  }

  const remaining = limit - featured.length;
  const latest = fallbackArtworksData
    .filter((artwork) => !artwork.featured)
    .slice(0, remaining);

  return [...featured, ...latest];
}

/**
 * 보물 시리즈 작품들을 가져오는 통합 함수
 */
export async function getTreasureArtworks(): Promise<Artwork[]> {
  try {
    const airtableData = await fetchTreasureFromAirtable();
    if (airtableData.length > 0) {
      return airtableData;
    }
  } catch (error) {
    console.warn(
      "Failed to fetch treasure artworks from Airtable, using fallback data:",
      error
    );
  }

  return fallbackArtworksData.filter(
    (artwork) =>
      artwork.title.includes("보물") ||
      artwork.title.toLowerCase().includes("treasure") ||
      artwork.category === "treasure"
  );
}

/**
 * 특정 작품을 ID로 가져오는 함수
 */
export async function getArtworkById(id: string): Promise<Artwork | null> {
  const artworks = await getArtworks();
  return artworks.find((artwork) => artwork.id === id) || null;
}

/**
 * 특정 작품을 slug로 가져오는 함수 (즉시 fallback 지원)
 */
export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  // 즉시 fallback에서 찾기
  const fallbackArtwork = fallbackArtworksData.find(
    (artwork) => artwork.slug === slug
  );

  try {
    // 백그라운드에서 Airtable 데이터 시도
    const airtableData = await fetchArtworksFromAirtable();
    if (airtableData && airtableData.length > 0) {
      const airtableArtwork = airtableData.find(
        (artwork) => artwork.slug === slug
      );
      if (airtableArtwork) {
        return airtableArtwork;
      }
    }
  } catch (error) {
    console.warn("Failed to fetch from Airtable for slug:", slug, error);
  }

  return fallbackArtwork || null;
}

// 기존 export들 (하위 호환성)
export const artistData = fallbackArtistData;
export const artworksData = fallbackArtworksData;
