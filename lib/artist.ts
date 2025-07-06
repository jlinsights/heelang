import { fetchArtistFromAirtable } from "@/lib/airtable";
import { Artist } from "@/lib/types";

const CACHE_KEY = "artist_data";
const CACHE_DURATION = 60 * 60 * 1000; // 1시간

export async function fetchArtist(id: string): Promise<Artist | null> {
  try {
    console.log(`Fetching artist with ID: ${id}`);

    // 에어테이블에서 작가 데이터 가져오기
    const artist = await fetchArtistFromAirtable(id);

    if (!artist) {
      console.log(`No artist found with ID: ${id}`);
      return null;
    }

    console.log(`Successfully fetched artist: ${artist.name}`);
    return artist;
  } catch (error) {
    console.error("Error fetching artist:", error);
    return null;
  }
}

// 모든 작가 데이터를 가져오는 함수 추가
export async function fetchAllArtists(): Promise<Artist[]> {
  try {
    console.log("Fetching all artists from Airtable");

    // 에어테이블에서 모든 작가 데이터 가져오기
    const { fetchAllArtistsFromAirtable } = await import("./airtable");
    const artists = await fetchAllArtistsFromAirtable();

    console.log(`Successfully fetched ${artists.length} artists`);
    return artists;
  } catch (error) {
    console.error("Error fetching all artists:", error);
    return [];
  }
}

// 작가 데이터 검색 함수
export async function searchArtists(query: string): Promise<Artist[]> {
  try {
    const allArtists = await fetchAllArtists();

    if (!query.trim()) {
      return allArtists;
    }

    const searchTerm = query.toLowerCase();
    return allArtists.filter(
      (artist) =>
        artist.name.toLowerCase().includes(searchTerm) ||
        artist.bio.toLowerCase().includes(searchTerm) ||
        artist.statement?.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error("Error searching artists:", error);
    return [];
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
  const artist = await fetchArtist("fallback-artist");

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
