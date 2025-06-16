'use client'

import { ArtNavigation, NavigationSpacer } from '@/components/art-navigation'
import { PageHeader } from '@/components/section-header'
import { Button } from '@/components/ui/button'
import { fallbackArtworksData } from '@/lib/artworks'
import type { Artwork } from '@/lib/types'
import { Instagram, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ContactPage() {
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFeaturedArtworks() {
      try {
        // getFeaturedArtworks 함수를 사용하여 안전하게 데이터 가져오기
        const { getFeaturedArtworks } = await import('@/lib/artworks')
        const featured = await getFeaturedArtworks(4)
        
        setFeaturedArtworks(featured)
        setLoading(false)
      } catch (error) {
        console.error('Failed to load featured artworks:', error)
        // 에러 발생 시 fallback 데이터 사용
        const fallbackFeatured = fallbackArtworksData
          .filter(artwork => artwork.featured)
          .slice(0, 4)
        setFeaturedArtworks(fallbackFeatured)
        setLoading(false)
      }
    }

    loadFeaturedArtworks()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-paper via-paper-warm to-paper-cream dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ArtNavigation />
      <NavigationSpacer />

      {/* Main Content */}
      <main className="section-padding">
        <div className="container-art">
          {/* Page Header */}
          <PageHeader
            breadcrumb={[{ label: "홈", href: "/" }, { label: "문의하기" }]}
            title="Contact"
            subtitle="문의하기"
            description="전시에 대한 문의사항이나 관람 예약을 위해 언제든지 연락 주세요."
            badge="Contact"
            variant="default"
            size="lg"
          />

          {/* Contact Information */}
          <section 
            className="section-padding relative overflow-hidden mb-16"
            style={{
              backgroundImage: featuredArtworks[1] ? `url(${featuredArtworks[1].imageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-slate-50/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg"></div>
            <div className="relative z-10">
              <h2 className="font-display text-3xl text-ink dark:text-white text-center mb-16">Contact Information</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center space-y-4">
                  <Phone className="h-10 w-10 mx-auto text-ink-light dark:text-gray-300 mb-3" />
                  <h3 className="font-body text-lg font-medium mb-2 text-ink dark:text-white">전화</h3>
                  <p className="text-ink-light dark:text-gray-300">010-3019-1417</p>
                </div>
                
                <div className="text-center space-y-4">
                  <Mail className="h-10 w-10 mx-auto text-ink-light dark:text-gray-300 mb-3" />
                  <h3 className="font-body text-lg font-medium mb-2 text-ink dark:text-white">이메일</h3>
                  <p className="text-ink-light dark:text-gray-300">heelang@orientalcalligraphy.org</p>
                </div>
                
                <div className="text-center space-y-4">
                  <Instagram className="h-10 w-10 mx-auto text-ink-light dark:text-gray-300 mb-3" />
                  <h3 className="font-body text-lg font-medium mb-2 text-ink dark:text-white">인스타그램</h3>
                  <p className="text-ink-light dark:text-gray-300">
                    <a href="https://instagram.com/heelang_calligraphy" target="_blank" rel="noopener noreferrer" className="hover:text-ink dark:hover:text-white transition-colors">
                      @heelang_calligraphy
                    </a>
                  </p>
                </div>
                
                <div className="text-center space-y-4">
                  <MapPin className="h-10 w-10 mx-auto text-ink-light dark:text-gray-300 mb-3" />
                  <h3 className="font-body text-lg font-medium mb-2 text-ink dark:text-white">위치</h3>
                  <p className="text-ink-light dark:text-gray-300">경기 김포시 김포한강5로 321 (구래동)<br />김포한강듀클래스 14층 1435호 희랑글씨</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section 
            className="section-padding relative overflow-hidden"
            style={{
              backgroundImage: featuredArtworks[2] ? `url(${featuredArtworks[2].imageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-background/85 dark:bg-gray-800/85 backdrop-blur-sm rounded-lg"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-display text-3xl text-ink dark:text-white text-center mb-16">문의하기</h2>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-ink dark:text-white mb-2">이름</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink/20 dark:focus:ring-white/20 bg-background/90 dark:bg-gray-700/90 backdrop-blur-sm text-ink dark:text-white placeholder:text-ink-light dark:placeholder:text-gray-400"
                      placeholder="홍길동"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink dark:text-white mb-2">연락처</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink/20 dark:focus:ring-white/20 bg-background/90 dark:bg-gray-700/90 backdrop-blur-sm text-ink dark:text-white placeholder:text-ink-light dark:placeholder:text-gray-400"
                      placeholder="010-1234-5678"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-ink dark:text-white mb-2">이메일</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink/20 dark:focus:ring-white/20 bg-background/90 dark:bg-gray-700/90 backdrop-blur-sm text-ink dark:text-white placeholder:text-ink-light dark:placeholder:text-gray-400"
                    placeholder="example@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-ink dark:text-white mb-2">문의 유형</label>
                  <select className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink/20 dark:focus:ring-white/20 bg-background/90 dark:bg-gray-700/90 backdrop-blur-sm text-ink dark:text-white">
                    <option>일반 문의</option>
                    <option>관람 예약</option>
                    <option>단체 관람</option>
                    <option>작품 구매</option>
                    <option>기타</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-ink dark:text-white mb-2">문의 내용</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink/20 dark:focus:ring-white/20 bg-background/90 dark:bg-gray-700/90 backdrop-blur-sm resize-none text-ink dark:text-white placeholder:text-ink-light dark:placeholder:text-gray-400"
                    placeholder="문의하실 내용을 자세히 적어주세요."
                  ></textarea>
                </div>
                
                <Button type="submit" className="w-full btn-art">
                  <Send className="h-4 w-4 mr-2" />
                  문의 보내기
                </Button>
              </form>
            </div>
          </section>

          {/* Additional Information */}
          <section className="mt-16 text-center">
            <div className="bg-paper/50 dark:bg-gray-800/50 rounded-lg p-8 border border-border/30 dark:border-gray-600/30">
              <h3 className="font-display text-xl text-ink dark:text-white mb-4">방문 안내</h3>
              <div className="space-y-2 text-ink-light dark:text-gray-300">
                <p>• 개인 관람: 사전 예약 없이 자유롭게 관람 가능</p>
                <p>• 단체 관람: 10명 이상 시 사전 예약 필수</p>
                <p>• 작가와의 만남: 매주 토요일 오후 2시 (사전 예약)</p>
                <p>• 주차: 건물 지하 주차장 이용 가능 (2시간 무료)</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
} 