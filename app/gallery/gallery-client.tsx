'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { artworksData } from '@/lib/artworks'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const ARTWORKS_PER_PAGE = 8

export default function GalleryClient() {
  const [currentPage, setCurrentPage] = useState(1)
  
  // 보물 시리즈를 첫 번째 페이지에 순서대로 배치
  const treasureArtworks = artworksData
    .filter(artwork => artwork.title.includes('보물'))
    .sort((a, b) => {
      // 보물 1, 2, 3, ... 8 순으로 정렬
      const numA = parseInt(a.title.match(/보물 (\d+)/)?.[1] || '0')
      const numB = parseInt(b.title.match(/보물 (\d+)/)?.[1] || '0')
      return numA - numB
    })
  
  const otherArtworks = artworksData.filter(artwork => !artwork.title.includes('보물'))
  
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
                  {currentPage === 1 && (
                    <p className="text-ink text-sm mt-2 font-medium">
                      📎 첫 번째 페이지: 보물 1 ~ 보물 8 시리즈
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
                    <img
                      src={artwork.imageUrl}
                      alt={`${artwork.title} - 공경순 작가의 ${artwork.year}년 서예 작품`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
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