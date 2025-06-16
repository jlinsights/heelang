import { fetchArtistFromAirtable } from "@/lib/airtable";
import { fallbackArtistData } from "@/lib/artworks";
import type { Artist } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

// 캐시 설정
let cachedArtist: Artist | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5분

async function getCachedArtist(): Promise<Artist> {
  const now = Date.now();

  // 캐시가 유효한지 확인
  if (cachedArtist && now - cacheTimestamp < CACHE_DURATION) {
    console.log("📦 Using cached artist data");
    return cachedArtist;
  }

  // 새로운 데이터 가져오기
  try {
    const artist = await fetchArtistFromAirtable();

    if (artist) {
      cachedArtist = artist;
      cacheTimestamp = now;
      console.log("✅ Cached artist data from Airtable");
      return artist;
    } else {
      console.warn("⚠️ No artist found in Airtable, using fallback data");
      cachedArtist = fallbackArtistData;
      cacheTimestamp = now;
      return fallbackArtistData;
    }
  } catch (error) {
    console.error("❌ Error fetching artist from Airtable:", error);
    console.log("🔄 Using fallback artist data");
    cachedArtist = fallbackArtistData;
    cacheTimestamp = now;
    return fallbackArtistData;
  }
}

export async function GET(request: NextRequest) {
  try {
    const artist = await getCachedArtist();

    return NextResponse.json({
      success: true,
      data: artist,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch artist data",
        data: fallbackArtistData,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "clearCache") {
      cachedArtist = null;
      cacheTimestamp = 0;
      console.log("🗑️ Artist cache cleared");

      return NextResponse.json({
        success: true,
        message: "Cache cleared successfully",
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid action",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process request",
      },
      { status: 500 }
    );
  }
}
