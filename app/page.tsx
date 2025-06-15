'use client'

import { Logo } from '@/components/logo'
import { NoSSR } from '@/components/no-ssr'
import { SimpleThemeToggle } from '@/components/simple-theme-toggle'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
// import { PWAInstallButton } from '@/components/pwa-install-button'
import type { Artwork } from '@/lib/types'
import { useEffect, useState } from 'react'

// 히어로 섹션에서 사용할 Featured Works 컴포넌트
function HeroWithFeaturedWorks() {
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    async function loadFeaturedArtworks() {
      try {
        // 즉시 fallback 데이터 로드
        const { fallbackArtworksData } = await import('@/lib/artworks')
        const fallbackFeatured = fallbackArtworksData
          .filter(artwork => artwork.featured)
          .slice(0, 6) // 6개의 featured 작품 가져오기
        
        const initialArtworks = fallbackFeatured.length > 0 
          ? fallbackFeatured 
          : fallbackArtworksData.slice(0, 6)
        
        setFeaturedArtworks(initialArtworks)
        setLoading(false)
        
        // 백그라운드에서 Airtable 데이터 시도
        try {
          const { getFeaturedArtworks } = await import('@/lib/artworks')
          const airtableArtworks = await getFeaturedArtworks(6)
          
          if (airtableArtworks && airtableArtworks.length > 0) {
            setFeaturedArtworks(airtableArtworks)
            console.log('Updated with Airtable data')
          }
        } catch (airtableError) {
          console.log('Airtable fetch failed, using fallback data:', airtableError)
        }
      } catch (error) {
        console.error('Failed to load any data:', error)
        setLoading(false)
      }
    }

    loadFeaturedArtworks()
  }, [])

  // 자동 슬라이드 효과
  useEffect(() => {
    if (featuredArtworks.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % featuredArtworks.length)
      }, 5000) // 5초마다 변경
      
      return () => clearInterval(interval)
    }
  }, [featuredArtworks.length])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % featuredArtworks.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + featuredArtworks.length) % featuredArtworks.length)
  }

  if (loading || featuredArtworks.length === 0) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white">
          <div className="animate-pulse">
            <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-8"></div>
            <div className="h-8 bg-white/20 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  const currentArtwork = featuredArtworks[currentImageIndex]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 배경 이미지들 */}
      <div className="absolute inset-0">
        {featuredArtworks.map((artwork, index) => (
          <div
            key={artwork.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {artwork.imageUrl && (
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            )}
          </div>
        ))}
        {/* 배경 이미지 */}
        {!loading && featuredArtworks.length > 0 && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat hero-background-image"
            style={{
              backgroundImage: `url(${featuredArtworks[currentImageIndex]?.imageUrl || ''})`
            }}
          />
        )}
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
      </div>

      {/* 히어로 콘텐츠 */}
      <div className="relative z-10 text-center text-white px-4">
        {loading ? (
          <div className="animate-pulse">
            <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-8"></div>
            <div className="h-8 bg-white/20 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-96 mx-auto"></div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* 상단 영문 타이틀 */}
            <div className="text-center mb-6 md:mb-8">
              <p className="font-body text-xs md:text-sm lg:text-base text-white/60 tracking-[0.3em] uppercase text-shadow-lg mb-2">
                Contemporary Calligraphy Solo Exhibition
              </p>
              <p className="font-body text-xs md:text-sm text-white/50 tracking-wide text-shadow-lg">
                @heelang_calligraphy
              </p>
            </div>
            
            {/* 메인 타이틀 - 데스크탑에서 더 아래쪽에 배치 */}
            <div className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-[60vh]">
              <div className="mb-8 md:mb-12">
                <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold mb-4 md:mb-6 tracking-wider text-shadow-lg">
                  길 道
                </h1>
                <p className="font-display text-2xl md:text-4xl lg:text-5xl font-light tracking-[0.2em] text-white/90 text-shadow-lg">
                  WAY
                </p>
              </div>
              
              {/* 서브타이틀 */}
              <div className="text-center">
                <p className="font-body text-lg md:text-xl lg:text-2xl text-white/80 mb-8 md:mb-12 text-shadow-lg">
                  희랑 공경순 개인전
                </p>
                
                {/* 전시 정보 - 미니멀하고 세련되게 */}
                <div className="backdrop-blur-sm bg-black/20 rounded-2xl px-6 md:px-8 py-4 md:py-6 border border-white/10 max-w-md mx-auto">
                  <div className="space-y-3 md:space-y-4">
                    {/* 전시 기간 */}
                    <div className="text-center">
                      <p className="font-body text-sm md:text-base text-white/90 font-medium tracking-wide">
                        2025년 6월 18일 - 24일
                      </p>
                      <p className="font-body text-xs md:text-sm text-white/70 mt-1">
                        오전 10시 - 오후 6시
                      </p>
                    </div>
                    
                    {/* 구분선 */}
                    <div className="w-12 h-px bg-white/30 mx-auto"></div>
                    
                    {/* 장소 정보 */}
                    <div className="text-center">
                      <p className="font-body text-sm md:text-base text-white/90 font-medium">
                        인사동 한국미술관 2층
                      </p>
                      <p className="font-body text-xs md:text-sm text-white/70 mt-1">
                        후원: 사단법인 동양서예협회
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 이미지 네비게이션 - 더 미니멀하게 */}
      {!loading && featuredArtworks.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-all duration-300 backdrop-blur-sm"
            aria-label="이전 이미지"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-all duration-300 backdrop-blur-sm"
            aria-label="다음 이미지"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* 이미지 인디케이터 - 더 미니멀하게 */}
      {!loading && featuredArtworks.length > 1 && (
        <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-2">
            {featuredArtworks.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'bg-white'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`이미지 ${index + 1}로 이동`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between py-4">
            <Logo size="md" forceWhite={true} />
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/gallery" className="text-white/80 hover:text-white transition-colors duration-200 text-sm">
                Gallery
              </Link>
              <Link href="/artists" className="text-white/80 hover:text-white transition-colors duration-200 text-sm">
                Artist
              </Link>
              <Link href="/exhibition" className="text-white/80 hover:text-white transition-colors duration-200 text-sm">
                Exhibition
              </Link>
              <SimpleThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <SimpleThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-white/80 hover:text-white transition-colors"
                aria-label="메뉴 열기"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 py-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  href="/gallery" 
                  className="text-white/80 hover:text-white transition-colors duration-200 text-sm px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Gallery
                </Link>
                <Link 
                  href="/artists" 
                  className="text-white/80 hover:text-white transition-colors duration-200 text-sm px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Artist
                </Link>
                <Link 
                  href="/exhibition" 
                  className="text-white/80 hover:text-white transition-colors duration-200 text-sm px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Exhibition
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Featured Works Background */}
      <NoSSR fallback={
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-center text-white">
            <div className="animate-pulse">
              <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-8"></div>
              <div className="h-8 bg-white/20 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-white/20 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </section>
      }>
        <HeroWithFeaturedWorks />
      </NoSSR>

      {/* About Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <h2 className="font-display text-4xl text-ink mb-8">
                작가 소개
              </h2>
              <div className="space-y-6 font-body text-ink-light leading-relaxed">
                <p>
                  희랑(熙勆) 공경순은 전통 서예의 깊이와 현대적 감성을 조화롭게 
                  표현하는 서예가입니다. 30여 년간 붓과 먹으로 써내려온 그의 작품들은 
                  단순한 글씨를 넘어 삶의 철학과 예술적 영감을 담고 있습니다.
                </p>
                <p>
                  이번 개인전 &apos;길&apos;에서는 작가가 걸어온 예술적 여정과 
                  앞으로 나아갈 방향에 대한 성찰을 담은 작품들을 선보입니다.
                </p>
              </div>
              <div className="mt-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild variant="outline" size="lg">
                    <Link href="/artists">
                      자세히 보기
                    </Link>
                  </Button>
                  <Button asChild size="lg">
                    <Link href="/gallery">
                      작품 갤러리
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="animate-slide-in-right">
              <div className="relative max-w-md mx-auto">
                {/* 메인 이미지 컨테이너 */}
                <div className="relative">
                  {/* 배경 장식 요소들 */}
                  <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-full opacity-60 -z-10"></div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-tl from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full opacity-40 -z-10"></div>
                  
                  {/* 이미지 컨테이너 - 3:4 비율의 세로형 */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
                    <img
                      src="/Images/Artist/Artist.png"
                      alt="공경순 작가"
                      className="w-full h-full object-cover object-[center_top] transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* 우아한 프레임 효과 */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/5 via-transparent to-white/5 pointer-events-none"></div>
                  
                  {/* 미묘한 내부 그림자 */}
                  <div className="absolute inset-0 rounded-3xl shadow-inner opacity-20 pointer-events-none"></div>
                </div>
                
                {/* 하단 장식 라인 */}
                <div className="mt-6 flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-slate-50 dark:bg-slate-900">
        <div className="container-max text-center">
          <div className="animate-fade-in">
            <h2 className="font-display text-4xl mb-6 text-slate-900 dark:text-white">
              전시를 더 깊이 경험해보세요
            </h2>
            <p className="font-body text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
              온라인으로 만나는 특별한 서예 전시, 지금 바로 시작하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="default">
                <Link href="/exhibition">
                  전시 정보
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 