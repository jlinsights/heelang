"use client";

import { Logo } from "@/components/logo";
import { SimpleThemeToggle } from "@/components/simple-theme-toggle";
import { Button } from "@/components/ui/button";
import type { Artwork } from "@/lib/types";
import { Calendar, Palette, Ruler, Share } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// 로딩 컴포넌트
function ArtworkLoading() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-xl border-b border-border/50 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between py-4">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="flex space-x-4">
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <div className="fixed top-20 left-4 z-40">
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="relative bg-stone-50 dark:bg-slate-900 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-center">
              <div className="relative max-w-4xl w-full bg-white dark:bg-slate-800 shadow-2xl rounded-lg overflow-hidden">
                <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ArtworkPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function loadArtwork() {
      try {
        // 즉시 fallback 데이터에서 찾기
        const { fallbackArtworksData } = await import("@/lib/artworks");
        const fallbackArtwork = fallbackArtworksData.find(
          (artwork) => artwork.slug === slug
        );

        if (fallbackArtwork) {
          setArtwork(fallbackArtwork);
          setLoading(false); // 즉시 로딩 완료
        }

        // 백그라운드에서 Airtable 데이터 시도
        try {
          const { getArtworkBySlug } = await import("@/lib/artworks");
          const airtableArtwork = await getArtworkBySlug(slug);

          // Airtable 데이터가 있으면 업데이트
          if (airtableArtwork) {
            setArtwork(airtableArtwork);
            console.log("Artwork updated with Airtable data");
          }
        } catch (airtableError) {
          console.log("Airtable fetch failed for artwork:", airtableError);
        }

        // fallback에서도 찾지 못한 경우
        if (!fallbackArtwork) {
          setError("작품을 찾을 수 없습니다.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load artwork:", error);
        setError("작품을 불러오는데 실패했습니다.");
        setLoading(false);
      }
    }

    loadArtwork();
  }, [slug]);

  if (loading) {
    return <ArtworkLoading />;
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink mb-4">
            작품을 찾을 수 없습니다
          </h1>
          <p className="text-ink-light mb-4">
            {error || "요청하신 작품을 찾을 수 없습니다."}
          </p>
          <div className="space-x-4">
            <Link href="/gallery">
              <Button>갤러리로 돌아가기</Button>
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-ink text-white rounded hover:bg-ink/90"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-xl border-b border-border/50 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between py-4">
            <Logo size="md" />
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/gallery" className="text-ink font-medium text-sm">
                Gallery
              </Link>
              <Link
                href="/artists"
                className="text-ink-light hover:text-ink transition-colors duration-200 text-sm"
              >
                Artist
              </Link>
              <Link
                href="/exhibition"
                className="text-ink-light hover:text-ink transition-colors duration-200 text-sm"
              >
                Exhibition
              </Link>
              <SimpleThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {/* Breadcrumb - Fixed position */}
        <div className="fixed top-20 left-4 z-40">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
          >
            <Link href="/gallery">← 갤러리</Link>
          </Button>
        </div>

        {/* Image Section - Optimized for full image viewing */}
        <div className="relative bg-stone-50 dark:bg-slate-900 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-center">
              <div className="relative max-w-4xl w-full bg-white dark:bg-slate-800 shadow-2xl rounded-lg overflow-hidden">
                {artwork.imageUrl && artwork.imageUrl.trim() !== "" ? (
                  <img
                    src={artwork.imageUrl}
                    alt={`${artwork.title} - 공경순 작가의 ${artwork.year}년 서예 작품`}
                    className="w-full h-auto object-contain max-h-[80vh]"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center text-ink-light">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🖼️</div>
                      <p className="text-lg">이미지 준비중</p>
                      <p className="text-sm mt-2">
                        작품 이미지를 준비하고 있습니다
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Artwork Information - Enhanced section */}
        <div className="bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Main Information */}
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-3xl lg:text-4xl text-ink mb-2">
                    {artwork.title}
                  </h1>
                  <p className="text-ink-light text-lg">
                    공경순 작가, {artwork.year}
                  </p>
                </div>

                <div className="prose prose-stone dark:prose-invert max-w-none">
                  <p className="text-ink-light leading-relaxed text-base lg:text-lg">
                    {artwork.description}
                  </p>
                </div>

                {artwork.artistNote && (
                  <div className="bg-stone-50 dark:bg-slate-800 p-6 rounded-lg">
                    <h3 className="font-display text-lg text-ink mb-3">
                      작가 노트
                    </h3>
                    <p className="text-ink-light italic leading-relaxed">
                      "{artwork.artistNote}"
                    </p>
                  </div>
                )}

                {/* Share Button */}
                <div className="pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: `${artwork.title} | 공경순 서예 작품`,
                          text: artwork.description,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("링크가 클립보드에 복사되었습니다.");
                      }
                    }}
                  >
                    <Share className="h-4 w-4 mr-2" />
                    공유하기
                  </Button>
                </div>
              </div>

              {/* Right Column - Technical Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-xl text-ink mb-4">
                    작품 정보
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-ink-light mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-ink text-sm">제작년도</p>
                        <p className="text-ink-light text-sm">{artwork.year}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Palette className="h-5 w-5 text-ink-light mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-ink text-sm">재료</p>
                        <p className="text-ink-light text-sm">
                          {artwork.medium}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Ruler className="h-5 w-5 text-ink-light mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-ink text-sm">크기</p>
                        <p className="text-ink-light text-sm">
                          {artwork.dimensions}
                        </p>
                      </div>
                    </div>

                    {artwork.category && (
                      <div className="flex items-start space-x-3">
                        <div className="h-5 w-5 flex items-center justify-center mt-0.5">
                          <div className="h-2 w-2 bg-ink-light rounded-full"></div>
                        </div>
                        <div>
                          <p className="font-medium text-ink text-sm">
                            카테고리
                          </p>
                          <p className="text-ink-light text-sm capitalize">
                            {artwork.category}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation to other artworks */}
                <div className="pt-6 border-t border-border">
                  <div className="flex justify-between">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/gallery">← 갤러리</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/artists">작가 소개 →</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
