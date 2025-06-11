import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin, Send } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-xl border-b border-border/50 z-50">
        <div className="container-max">
          <div className="flex items-center justify-between py-6">
            <Logo size="md" />
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
              <Link href="/contact" className="text-ink font-medium">
                Contact
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32">
        {/* Header */}
        <section className="section-padding pb-12">
          <div className="container-max">
            <div className="flex items-center mb-8">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  ← 돌아가기
                </Link>
              </Button>
            </div>
            
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="font-display text-5xl lg:text-6xl text-ink">Contact</h1>
                <div className="w-16 h-0.5 bg-ink/30 mx-auto"></div>
              </div>
              <p className="font-body text-lg text-ink-light max-w-2xl mx-auto leading-relaxed">
                전시에 대한 문의사항이나 관람 예약을 위해 언제든지 연락 주세요.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="section-padding bg-slate-50/50 dark:bg-slate-800/50">
          <div className="container-max">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl text-ink text-center mb-16">Contact Information</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center space-y-4">
                  <Phone className="h-10 w-10 mx-auto text-ink-light mb-3" />
                  <h3 className="font-body text-lg font-medium mb-2">전화</h3>
                  <p className="text-ink-light">02-123-4567</p>
                </div>
                
                <div className="text-center space-y-4">
                  <Mail className="h-10 w-10 mx-auto text-ink-light mb-3" />
                  <h3 className="font-body text-lg font-medium mb-2">이메일</h3>
                  <p className="text-ink-light">info@calligraphy.com</p>
                </div>
                
                <div className="text-center space-y-4">
                  <MapPin className="h-10 w-10 mx-auto text-ink-light mb-3" />
                  <h3 className="font-body text-lg font-medium mb-2">위치</h3>
                  <p className="text-ink-light">서울특별시 강남구 테헤란로 123</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="section-padding">
          <div className="container-max">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-display text-3xl text-ink text-center mb-16">문의하기</h2>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">이름</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ink/20 bg-background"
                      placeholder="홍길동"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">연락처</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ink/20 bg-background"
                      placeholder="010-1234-5678"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">이메일</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ink/20 bg-background"
                    placeholder="example@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">문의 유형</label>
                  <select className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ink/20 bg-background">
                    <option>일반 문의</option>
                    <option>관람 예약</option>
                    <option>단체 관람</option>
                    <option>작품 구매</option>
                    <option>기타</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">문의 내용</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ink/20 bg-background resize-none"
                    placeholder="문의하고 싶은 내용을 자세히 적어주세요."
                  ></textarea>
                </div>
                
                <div className="text-center">
                  <Button type="submit" className="w-full gap-2">
                    <Send className="h-4 w-4" />
                    문의 보내기
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding bg-slate-50/50 dark:bg-slate-800/50">
          <div className="container-max">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl text-ink text-center mb-16">자주 묻는 질문</h2>
              
              <div className="space-y-6">
                <div className="bg-background rounded-lg p-6 border border-border/50">
                  <h3 className="font-display text-lg text-ink mb-3">예약 없이 관람이 가능한가요?</h3>
                  <p className="text-ink-light">네, 현장에서도 관람 가능합니다. 다만 성수기에는 대기가 있을 수 있어 사전 예약을 권장합니다.</p>
                </div>
                
                <div className="bg-background rounded-lg p-6 border border-border/50">
                  <h3 className="font-display text-lg text-ink mb-3">관람 시간은 얼마나 걸리나요?</h3>
                  <p className="text-ink-light">자유 관람 시 약 60-90분, 도슨트 해설과 함께하면 약 120분 정도 소요됩니다.</p>
                </div>
                
                <div className="bg-background rounded-lg p-6 border border-border/50">
                  <h3 className="font-display text-lg text-ink mb-3">주차는 가능한가요?</h3>
                  <p className="text-ink-light">예술의 전당 주차장을 이용하실 수 있으며, 전시 관람객에게는 2시간 무료 주차 혜택이 있습니다.</p>
                </div>
                
                <div className="bg-background rounded-lg p-6 border border-border/50">
                  <h3 className="font-display text-lg text-ink mb-3">사진 촬영이 가능한가요?</h3>
                  <p className="text-ink-light">지정된 포토존에서는 개인 촬영이 가능하나, 작품 보호를 위해 플래시는 사용하실 수 없습니다.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>


    </div>
  )
} 