'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/logo'
import { artworksData } from '@/lib/artworks'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin } from 'lucide-react'
import { PWAInstallButton } from '@/components/pwa-install-button'
import { 
  PageTransition, 
  FadeInContainer, 
  SlideInContainer, 
  StaggerContainer,
  AnimatedCard,
  TypewriterText,
  FloatingElement
} from '@/components/animations'

export default function HomePage() {
  const featuredArtworks = artworksData.slice(0, 3)

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <FadeInContainer delay={0.1}>
          <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-xl border-b border-border/50 z-50">
            <div className="container-max">
              <div className="flex items-center justify-between py-6">
                <FloatingElement>
                  <Logo size="md" />
                </FloatingElement>
                <div className="hidden md:flex items-center space-x-8">
                  <Link href="/gallery" className="text-ink-light hover:text-ink transition-colors duration-200">
                    Gallery
                  </Link>
                  <Link href="/artists" className="text-ink-light hover:text-ink transition-colors duration-200">
                    Artist
                  </Link>
                  <Link href="/exhibition" className="text-ink-light hover:text-ink transition-colors duration-200">
                    Exhibition
                  </Link>
                  <PWAInstallButton />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </nav>
        </FadeInContainer>

              {/* Hero Section */}
        <section className="relative min-h-screen pt-32 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('/Images/Artworks/2025/heelang-way-2025.jpg')`,
              }}
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-background/75 dark:bg-background/85" />
          </div>

          <div className="container-max relative z-10">
            <div className="flex flex-col-reverse lg:flex-row lg:items-center min-h-[calc(100vh-8rem)]">
              {/* Content - Right on desktop, bottom on mobile */}
              <div className="lg:w-1/2 lg:order-2 space-y-12 py-12 lg:py-20">
                <FadeInContainer delay={0.3}>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <SlideInContainer delay={0.5} direction="right">
                        <div className="text-ink-light font-body text-sm tracking-wider uppercase">
                          희랑 공경순 개인전
                        </div>
                      </SlideInContainer>
                      <SlideInContainer delay={0.7} direction="right">
                        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-ink leading-tight">
                          <TypewriterText text="길" delay={0.9} /><br />
                          <span className="italic">
                            <TypewriterText text="Way" delay={1.2} />
                          </span>
                        </h1>
                      </SlideInContainer>
                      <SlideInContainer delay={1.5} direction="right">
                        <div className="w-16 h-0.5 bg-ink/30"></div>
                      </SlideInContainer>
                    </div>
                    
                    <div className="space-y-6">
                      <FadeInContainer delay={1.7}>
                        <p className="font-korean text-xl md:text-2xl text-ink leading-relaxed">
                          熙勆 孔慶順 個人展
                        </p>
                      </FadeInContainer>
                      <FadeInContainer delay={1.9}>
                        <p className="font-body text-base md:text-lg text-ink-light leading-relaxed max-w-lg">
                          인생의 여정을 붓끝에 담아낸 희랑 공경순 작가의 개인전. 
                          '길'이라는 주제로 펼쳐지는 서예의 깊은 성찰과 아름다움을 만나보세요.
                        </p>
                      </FadeInContainer>
                    </div>
                  </div>
                </FadeInContainer>

                <SlideInContainer delay={2.1} direction="up">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-ink-light">
                      <Calendar className="h-4 w-4" />
                      <span>2025년 6월 18일 - 24일, 오전 10시 - 오후 6시</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-ink-light">
                      <MapPin className="h-4 w-4" />
                      <span>인사동 한국미술관 2층</span>
                    </div>
                  </div>
                </SlideInContainer>

                <SlideInContainer delay={2.3} direction="up">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" className="bg-ink hover:bg-ink/90 text-primary-foreground">
                      <Link href="/gallery">
                        작품 감상 →
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/exhibition">
                        전시 정보
                      </Link>
                    </Button>
                  </div>
                </SlideInContainer>
              </div>

            {/* Image Area - Left on desktop, top on mobile */}
            <div className="lg:w-1/2 lg:order-1 lg:h-[calc(100vh-8rem)] flex items-center justify-center py-8 lg:py-0">
              <div className="relative w-full max-w-md lg:max-w-lg">
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 lg:-bottom-8 lg:-right-8 w-24 lg:w-32 h-24 lg:h-32 bg-ink/10 rounded-full -z-10"></div>
                <div className="absolute -top-4 -left-4 lg:-top-8 lg:-left-8 w-16 lg:w-24 h-16 lg:h-24 bg-ink/10 rounded-full -z-10"></div>
                
                {/* Title overlay for mobile */}
                <div className="lg:hidden text-center text-white bg-black/50 backdrop-blur-sm rounded-lg p-4 mx-4">
                  <h2 className="font-korean text-lg font-medium">길 (Way)</h2>
                  <p className="text-sm opacity-90">공경순 작품</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Works */}
      <section className="section-padding bg-slate-50/50 dark:bg-slate-800/50">
        <div className="container-max">
          <FadeInContainer delay={0.2}>
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl text-ink mb-4">Featured Works</h2>
              <div className="w-16 h-0.5 bg-ink/30 mx-auto mb-6"></div>
              <p className="font-body text-lg text-ink-light max-w-2xl mx-auto">
                대표작을 통해 작가의 세계관과 서예 철학을 엿볼 수 있습니다.
              </p>
            </div>
          </FadeInContainer>

          <StaggerContainer className="grid md:grid-cols-3 gap-12">
            {featuredArtworks.map((artwork, index) => (
              <AnimatedCard key={artwork.id} index={index}>
                <Link 
                  href={`/gallery/${artwork.slug}`}
                  className="group space-y-6 block"
                >
                  <div className="artwork-container">
                    <div className="aspect-[4/5] relative bg-stone-100 dark:bg-slate-700 overflow-hidden rounded-lg">
                      <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-display text-xl text-ink group-hover:text-ink/70 transition-colors">
                      {artwork.title}
                    </h3>
                    <div className="space-y-1">
                      <p className="font-body text-sm text-ink-light">{artwork.year} · {artwork.medium}</p>
                      <p className="font-body text-sm text-ink-light">{artwork.dimensions}</p>
                    </div>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Artist Statement */}
      <section className="section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-6">
              <h2 className="font-display text-4xl text-ink">Artist Statement</h2>
              <div className="w-16 h-0.5 bg-ink/30 mx-auto"></div>
            </div>
            
            <blockquote className="space-y-8">
              <p className="font-body text-2xl text-ink leading-relaxed">
                "길은 걸어가는 것이며, 걸어가면서 만들어지는 것입니다."
              </p>
              <p className="font-body text-lg text-ink-light leading-relaxed max-w-3xl mx-auto">
                인생의 매 순간이 하나의 길이며, 붓을 들고 종이 위에 획을 그어나가는 것 또한 길을 만들어가는 과정입니다. 
                이번 전시에서는 '길'이라는 주제로, 지나온 발자취와 앞으로 나아갈 방향에 대한 깊은 성찰을 담았습니다.
              </p>
              <div className="pt-4">
                <cite className="font-body text-ink-light">— 희랑 공경순</cite>
              </div>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container-max">
          <div className="flex items-center justify-between">
            <Logo size="sm" />
            <div className="font-body text-sm text-ink-light">
              © 2025 희랑 공경순 개인전. 후원: 사단법인 동양서예협회
            </div>
          </div>
        </div>
      </footer>
    </div>
    </PageTransition>
  )
} 