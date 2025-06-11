'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/logo'
import { artworksData } from '@/lib/artworks'
import { Button } from '@/components/ui/button'
import { GalleryThumbnail } from '@/components/optimized-image'
import { ArrowLeft, Search } from 'lucide-react'
import { useReducedMotion } from '@/components/accessibility'
import { GallerySuspense } from '@/components/suspense-wrapper'
import { SearchFilter } from '@/components/search-filter'
import { LanguageSwitcher, useLocale } from '@/components/language-switcher'
import { 
  PageTransition, 
  FadeInContainer, 
  StaggerContainer, 
  AnimatedCard,
  SlideInContainer,
  HoverCard
} from '@/components/animations'

const ARTWORKS_PER_PAGE = 12

export default function GalleryClient() {
  const [currentPage, setCurrentPage] = useState(1)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [filteredArtworks, setFilteredArtworks] = useState(artworksData)
  const gridRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { locale, changeLocale } = useLocale()
  
  // 페이지네이션 계산 (필터링된 작품 기준)
  const totalPages = Math.ceil(filteredArtworks.length / ARTWORKS_PER_PAGE)
  const startIndex = (currentPage - 1) * ARTWORKS_PER_PAGE
  const endIndex = startIndex + ARTWORKS_PER_PAGE
  const currentArtworks = filteredArtworks.slice(startIndex, endIndex)

  // 필터 변경 시 첫 페이지로 리셋
  const handleFilteredResults = (results: typeof artworksData) => {
    setFilteredArtworks(results)
    setCurrentPage(1)
    setFocusedIndex(-1)
  }

  // 키보드 네비게이션 핸들러
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target !== document.body && !gridRef.current?.contains(event.target as Node)) {
        return
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          setFocusedIndex(prev => Math.max(0, prev - 1))
          break
        case 'ArrowRight':
          event.preventDefault()
          setFocusedIndex(prev => Math.min(currentArtworks.length - 1, prev + 1))
          break
        case 'ArrowUp':
          event.preventDefault()
          setFocusedIndex(prev => Math.max(0, prev - 4)) // 4 columns in xl
          break
        case 'ArrowDown':
          event.preventDefault()
          setFocusedIndex(prev => Math.min(currentArtworks.length - 1, prev + 4))
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < currentArtworks.length) {
            const artwork = currentArtworks[focusedIndex]
            window.location.href = `/gallery/${artwork.slug}`
          }
          break
        case 'Home':
          event.preventDefault()
          setFocusedIndex(0)
          break
        case 'End':
          event.preventDefault()
          setFocusedIndex(currentArtworks.length - 1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentArtworks, focusedIndex])

  // 포커스된 요소로 스크롤
  useEffect(() => {
    if (focusedIndex >= 0 && gridRef.current) {
      const focusedElement = gridRef.current.children[focusedIndex] as HTMLElement
      if (focusedElement) {
        focusedElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        focusedElement.focus()
      }
    }
  }, [focusedIndex])

  // 페이지 변경 시 포커스 리셋
  useEffect(() => {
    setFocusedIndex(-1)
  }, [currentPage])

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
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <FadeInContainer delay={0.1}>
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
                  <LanguageSwitcher 
                    currentLocale={locale} 
                    onLocaleChange={changeLocale}
                  />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </nav>
        </FadeInContainer>

        {/* Main Content */}
        <main className="pt-16">
          {/* Header */}
          <div className="bg-stone-50 dark:bg-slate-900 border-b border-border/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      돌아가기
                    </Link>
                  </Button>
                  <div>
                    <h1 className="font-display text-4xl lg:text-5xl text-ink mb-2">
                      Gallery
                    </h1>
                    <p className="text-ink-light text-lg">
                      총 {filteredArtworks.length}점의 작품 (페이지 {currentPage} / {totalPages})
                    </p>
                  </div>
                </div>
                
                <div className="hidden md:block">
                  <SearchFilter 
                    artworks={artworksData}
                    onFilteredResults={handleFilteredResults}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <FadeInContainer delay={0.3}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
              {/* Skip link for accessibility */}
              <a 
                href="#pagination" 
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-ink text-white p-2 rounded"
              >
                페이지네이션으로 건너뛰기
              </a>
              
              <div 
                ref={gridRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                role="grid"
                aria-label={`갤러리 작품 목록, ${currentArtworks.length}개 작품`}
              >
                <StaggerContainer>
                  {currentArtworks.map((artwork, index) => (
                    <AnimatedCard
                      key={artwork.id}
                      index={index}
                      className={`focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 rounded-lg ${
                        index === focusedIndex ? 'ring-2 ring-ink ring-offset-2' : ''
                      }`}
                    >
                      <Link 
                        href={`/gallery/${artwork.slug}`}
                        className="group space-y-4 block"
                        role="gridcell"
                        tabIndex={index === 0 ? 0 : -1}
                        aria-label={`${artwork.title}, ${artwork.year}년 작품`}
                        onFocus={() => setFocusedIndex(index)}
                        onMouseEnter={() => setFocusedIndex(index)}
                        onMouseLeave={() => setFocusedIndex(-1)}
                      >
                        <article className="space-y-4">
                          <div className="relative aspect-[4/5] bg-stone-100 dark:bg-slate-700 overflow-hidden rounded-lg">
                            <GalleryThumbnail
                              src={artwork.imageUrl}
                              alt={`${artwork.title} - 공경순 작가의 ${artwork.year}년 서예 작품`}
                              className="group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-display text-lg text-ink group-hover:text-ink/70 transition-colors line-clamp-2">
                              {artwork.title}
                            </h3>
                            <div className="space-y-1" aria-label="작품 정보">
                              <p className="text-sm text-ink-light">
                                <span className="sr-only">제작년도: </span>
                                {artwork.year}
                              </p>
                              <p className="text-sm text-ink-light">
                                <span className="sr-only">재료: </span>
                                {artwork.medium}
                              </p>
                              <p className="text-sm text-ink-light">
                                <span className="sr-only">크기: </span>
                                {artwork.dimensions}
                              </p>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </AnimatedCard>
                  ))}
                </StaggerContainer>
              </div>
              
              {/* Keyboard navigation instructions */}
              <div className="mt-8 text-center">
                <p className="text-sm text-ink-light">
                  키보드 네비게이션: 화살표 키로 이동, Enter/Space로 선택, Home/End로 처음/끝으로 이동
                </p>
              </div>
            </div>
          </FadeInContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <div id="pagination" className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-16">
              <div className="flex items-center justify-center space-x-2" role="navigation" aria-label="페이지네이션">
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
                  {startIndex + 1}-{Math.min(endIndex, filteredArtworks.length)}개 작품 (총 {filteredArtworks.length}개)
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8 bg-stone-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-between text-sm">
              <Logo size="sm" />
              <div className="text-ink-light">
                © 2025 희랑 공경순 개인전. 후원: 사단법인 동양서예협회
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  )
}