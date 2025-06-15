import { fetchArtworksFromAirtable } from "@/lib/airtable";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const artworks = await fetchArtworksFromAirtable();

    if (!artworks) {
      return NextResponse.json({
        success: false,
        message: "Airtable data not available",
        data: [],
      });
    }

    return NextResponse.json({
      success: true,
      data: artworks,
    });
  } catch (error) {
    console.error("Failed to fetch artworks:", error);

    return NextResponse.json({
      success: false,
      message: "Failed to fetch artworks",
      data: [],
    });
  }
}
