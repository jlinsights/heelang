import { fetchArtistFromAirtable } from "@/lib/airtable";
import { getCachedData, setCachedData } from "@/lib/cache";
import { Artist } from "@/lib/types";

const CACHE_KEY = "artist_data";
const CACHE_DURATION = 60 * 60 * 1000; // 1시간

export async function fetchArtist(): Promise<Artist | null> {
  try {
    // 캐시된 데이터 확인
    const cachedData = getCachedData(CACHE_KEY);
    if (cachedData) {
      return cachedData as Artist;
    }

    // Airtable에서 작가 데이터 가져오기
    const artist = await fetchArtistFromAirtable();

    if (!artist) {
      console.warn("No artist data found in Airtable");
      return getFallbackArtist();
    }

    // 캐시에 저장
    setCachedData(CACHE_KEY, artist, CACHE_DURATION);

    return artist;
  } catch (error) {
    console.error("Error fetching artist:", error);
    return getFallbackArtist();
  }
}

function getFallbackArtist(): Artist {
  return {
    id: "fallback-artist",
    name: "희랑 공경순",
    bio: "한국의 전통 서예와 현대적 감각을 결합한 독창적인 작품 세계를 구축하고 있는 서예 작가입니다.",
    profileImageUrl: "/images/artist-profile.jpg",
    birthYear: 1970,
    nationality: "한국",
    email: "contact@heelang.com",
    phone: "+82-10-0000-0000",
    website: "https://heelang.com",
    education: ["서울대학교 미술대학 서예과 졸업", "동 대학원 서예학 석사"],
    exhibitions: [
      '2023 개인전 "먹의 향기" - 갤러리 현대',
      '2022 단체전 "한국 현대 서예전" - 국립현대미술관',
    ],
    awards: ["2023 대한민국 서예대전 대상", "2022 한국서예협회 우수상"],
    specializations: ["전통 서예", "현대 서예", "캘리그래피"],
    influences: ["김정희", "추사 김정희", "원효대사"],
    techniques: ["해서", "행서", "초서", "전서"],
    socialLinks: {
      instagram: "https://instagram.com/heelang_art",
      facebook: "https://facebook.com/heelang.art",
      youtube: "https://youtube.com/@heelang",
      website: "https://heelang.com",
    },
  };
}

export async function fetchArtistWithTag(): Promise<Artist | null> {
  const artist = await fetchArtist();

  // Next.js 태그 추가 (서버 사이드에서만 동작)
  if (typeof window === "undefined") {
    try {
      const { unstable_cache } = await import("next/cache");
      return unstable_cache(async () => artist, ["artist"], {
        tags: ["artist"],
        revalidate: 3600,
      })();
    } catch (error) {
      console.error("Error with Next.js cache:", error);
      return artist;
    }
  }

  return artist;
}
