'use client'

import { Logo } from '@/components/logo'
import { SimpleThemeToggle } from '@/components/simple-theme-toggle'
import { Button } from '@/components/ui/button'
import type { Artwork } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const ARTWORKS_PER_PAGE = 8

// 로딩 컴포넌트
function GalleryLoading() {
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
        <div className="bg-stone-50 dark:bg-slate-900 border-b border-border/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 lg:py-16">
            <div className="space-y-4">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function GalleryClient() {
  const [currentPage, setCurrentPage] = useState(1)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadArtworks() {
      try {
        // 즉시 fallback 데이터 로드
        const { fallbackArtworksData } = await import("@/lib/artworks");
        setArtworks(fallbackArtworksData);
        setLoading(false); // 즉시 로딩 완료

        // 백그라운드에서 Airtable 데이터 시도
        try {
          const response = await fetch('/api/artworks');
          const result = await response.json();

          // Airtable 데이터가 있으면 업데이트
          if (result.success && result.data && result.data.length > 0) {
            setArtworks(result.data);
            console.log("Gallery updated with Airtable data:", result.data.length, "artworks");
          } else {
            console.log("No Airtable data available, using fallback data");
          }
        } catch (airtableError) {
          console.log(
            "Airtable fetch failed, using fallback data:",
            airtableError
          );
          // fallback 데이터는 이미 설정되어 있으므로 추가 작업 불필요
        }
      } catch (error) {
        console.error("Failed to load gallery data:", error);
        setError("작품을 불러오는데 실패했습니다.");
        setLoading(false);
      }
    }

    loadArtworks();
  }, []);

  if (loading) {
    return <GalleryLoading />;
  }

  if (error && artworks.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink mb-4">
            오류가 발생했습니다
          </h1>
          <p className="text-ink-light mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-ink text-white rounded hover:bg-ink/90"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 보물 시리즈를 첫 번째 페이지에 순서대로 배치
  const treasureArtworks = artworks
    .filter(artwork => artwork.title.includes('보물'))
    .sort((a, b) => {
      // 보물 1, 2, 3, ... 8 순으로 정렬
      const numA = parseInt(a.title.match(/보물 (\d+)/)?.[1] || '0')
      const numB = parseInt(b.title.match(/보물 (\d+)/)?.[1] || '0')
      return numA - numB
    })
  
  const otherArtworks = artworks.filter(artwork => !artwork.title.includes('보물'))
  
  // 보물 시리즈를 먼저 배치하고 나머지 작품들을 뒤에 배치
  const reorderedArtworks = [...treasureArtworks, ...otherArtworks]
  
  // 페이지네이션 계산
  const totalPages = Math.ceil(reorderedArtworks.length / ARTWORKS_PER_PAGE)
  const startIndex = (currentPage - 1) * ARTWORKS_PER_PAGE
  const endIndex = startIndex + ARTWORKS_PER_PAGE
  const currentArtworks = reorderedArtworks.slice(startIndex, endIndex)

  // 페이지 번호 배열 생성 (최대 5개 페이지 번호 표시)
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const start = Math.max(1, currentPage - 2)
      const end = Math.min(totalPages, start + maxVisiblePages - 1)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    
    return pages
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
              <Link href="/artists" className="text-ink-light hover:text-ink transition-colors duration-200 text-sm">
                Artist
              </Link>
              <Link href="/exhibition" className="text-ink-light hover:text-ink transition-colors duration-200 text-sm">
                Exhibition
              </Link>
              <SimpleThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {/* Header */}
        <div className="bg-stone-50 dark:bg-slate-900 border-b border-border/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 lg:py-16">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-4">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    돌아가기
                  </Link>
                </Button>
                <div>
                  <h1 className="font-display text-3xl lg:text-4xl xl:text-5xl text-ink mb-2">
                    Gallery
                  </h1>
                  <p className="text-ink-light text-base lg:text-lg">
                    총 {reorderedArtworks.length}점의 작품 (페이지 {currentPage} / {totalPages}) - 페이지당 8작품
                  </p>
                  {currentPage === 1 && treasureArtworks.length > 0 && (
                    <p className="text-ink text-sm mt-2 font-medium">
                      📎 첫 번째 페이지: 《文房四友 八題》 ; 문방사우를 주제로 한 여덟 개의 서예 작품
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid - 4x2 Layout (8 artworks) */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {currentArtworks.map((artwork) => (
              <Link 
                key={artwork.id}
                href={`/gallery/${artwork.slug}`}
                className="group space-y-4 block"
              >
                <article className="space-y-3">
                  <div className="relative aspect-[3/4] bg-stone-100 dark:bg-slate-700 overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    {artwork.imageUrl && artwork.imageUrl.trim() !== '' ? (
                      <img
                        src={artwork.imageUrl}
                        alt={`${artwork.title} - 공경순 작가의 ${artwork.year}년 서예 작품`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ink-light">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🖼️</div>
                          <p className="text-sm">이미지 준비중</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-base lg:text-lg text-ink group-hover:text-ink/70 transition-colors line-clamp-2">
                      {artwork.title}
                    </h3>
                    <div className="space-y-0.5">
                      <p className="text-xs lg:text-sm text-ink-light">
                        {artwork.year}
                      </p>
                      <p className="text-xs lg:text-sm text-ink-light line-clamp-1">
                        {artwork.medium}
                      </p>
                      <p className="text-xs lg:text-sm text-ink-light line-clamp-1">
                        {artwork.dimensions}
                      </p>
                    </div>
                    {artwork.artistNote && (
                      <p className="text-xs text-ink-light italic line-clamp-2">
                        "{artwork.artistNote}"
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-16">
            <div className="flex items-center justify-center space-x-2">
              {/* 이전 페이지 버튼 */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-24"
              >
                ← 이전
              </Button>

              {/* 페이지 번호들 */}
              {getPageNumbers().map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 p-0 ${
                    currentPage === pageNum 
                      ? 'bg-ink text-white hover:bg-ink/90' 
                      : ''
                  }`}
                >
                  {pageNum}
                </Button>
              ))}

              {/* 다음 페이지 버튼 */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-24"
              >
                다음 →
              </Button>
            </div>
            
            {/* 페이지 정보 */}
            <div className="text-center mt-4">
              <p className="text-sm text-ink-light">
                {startIndex + 1}-{Math.min(endIndex, reorderedArtworks.length)}개 작품 (총 {reorderedArtworks.length}개)
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}