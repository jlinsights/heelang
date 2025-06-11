import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { ArrowLeft, User, Award } from 'lucide-react'

export default function ArtistsPage() {
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
              <Link href="/artists" className="text-ink font-medium">
                Artist
              </Link>
              <Link href="/exhibition" className="text-ink-light hover:text-ink transition-colors duration-200">
                Exhibition
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24">
        {/* Header */}
        <div className="bg-stone-50 dark:bg-slate-900 border-b border-border/20">
          <div className="container-max py-16">
            <div className="space-y-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  돌아가기
                </Link>
              </Button>
              <h1 className="font-display text-4xl lg:text-5xl text-ink mb-2">
                Artist
              </h1>
              <p className="text-ink-light text-lg">
                희랑 공경순 작가를 소개합니다
              </p>
            </div>
          </div>
        </div>

        {/* Artist Profile */}
        <div className="container-max py-16">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Profile Header with Image */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Profile Image */}
              <div className="relative">
                <div className="aspect-[4/5] relative overflow-hidden rounded-2xl bg-stone-100 dark:bg-slate-800">
                  <img
                    src="/Images/Artist/Artist.png"
                    alt="희랑 공경순 작가"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-ink/10 rounded-full -z-10"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-ink/10 rounded-full -z-10"></div>
              </div>

              {/* Profile Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="font-display text-3xl lg:text-4xl text-ink">희랑 공경순</h2>
                  <p className="font-korean text-xl text-ink-light">熙勆 孔慶順</p>
                  <div className="w-16 h-0.5 bg-ink/30"></div>
                </div>
                
                <p className="font-body text-lg text-ink-light leading-relaxed">
                  현대 서예의 새로운 경지를 개척하며, 전통과 현대를 아우르는 독창적인 작품 세계를 구축해온 서예가입니다. 
                  붓끝에서 피어나는 철학적 사유와 깊이 있는 성찰을 통해 서예의 예술적 가치를 재조명하고 있습니다.
                </p>

                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-stone-100 dark:bg-slate-800 text-ink-light text-sm rounded-full">
                    현대 서예가
                  </span>
                  <span className="px-3 py-1 bg-stone-100 dark:bg-slate-800 text-ink-light text-sm rounded-full">
                    동양서예협회 초대작가
                  </span>
                  <span className="px-3 py-1 bg-stone-100 dark:bg-slate-800 text-ink-light text-sm rounded-full">
                    서예 교육가
                  </span>
                </div>
              </div>
            </div>

            {/* Artist Statement */}
            <div className="bg-stone-50 dark:bg-slate-900 rounded-xl p-8 lg:p-12 space-y-6">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-ink-light" />
                <h3 className="font-display text-xl text-ink">작가의 말</h3>
              </div>
              
              <blockquote className="space-y-6">
                <p className="font-body text-lg lg:text-xl text-ink leading-relaxed">
                  "길은 걸어가는 것이며, 걸어가면서 만들어지는 것입니다. 인생의 매 순간이 하나의 길이며, 
                  붓을 들고 종이 위에 획을 그어나가는 것 또한 길을 만들어가는 과정입니다."
                </p>
                
                <p className="font-body text-base text-ink-light leading-relaxed">
                  이번 전시 '길'에서는 지나온 발자취와 앞으로 나아갈 방향에 대한 깊은 성찰을 담았습니다. 
                  각각의 작품은 인생의 한 구간을 상징하며, 전체적으로는 하나의 긴 여정을 표현합니다.
                  서예는 단순한 글씨가 아닌, 마음의 흔적이자 시간의 기록입니다.
                </p>
              </blockquote>
            </div>

            {/* Background */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-ink-light" />
                <h3 className="font-display text-xl text-ink">이력</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h4 className="font-display text-lg text-ink">학력</h4>
                  <ul className="space-y-2 font-body text-ink-light">
                    <li>• 한국예술종합학교 서예과 졸업</li>
                    <li>• 동대학원 서예학 석사</li>
                    <li>• 중국 서법협회 연수</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-display text-lg text-ink">주요 수상</h4>
                  <ul className="space-y-2 font-body text-ink-light">
                    <li>• 2024. 2 국제공모전 &lt;Art Beyond Boundaries&gt; 국제예술상</li>
                    <li>• 2023. 7 제63회 Kaishin 서법원대전 우수상</li>
                    <li>• 2021. 5 제14회 낙동예술대전 캘리그래피부문 대상</li>
                    <li>• 2024 제21회 대한민국 동양서예대전 대상</li>
                  </ul>
                </div>

                                 <div className="space-y-4">
                   <h4 className="font-display text-lg text-ink">주요 활동</h4>
                   <ul className="space-y-2 font-body text-ink-light">
                     <li>• 사단법인 동양서예협회 초대작가, 상임이사</li>
                     <li>• 한국서예문화원 강사</li>
                     <li>• 다수의 단체전 및 기획전 참여</li>
                     <li>• 서예 워크숍 및 강연 활동</li>
                   </ul>
                 </div>
              </div>
            </div>

            {/* Exhibition Info */}
            <div className="bg-gradient-to-r from-stone-50 to-stone-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-8 text-center space-y-4">
              <h3 className="font-display text-xl text-ink">현재 전시</h3>
              <p className="font-body text-lg text-ink-light">
                <strong className="text-ink">길 (Way)</strong><br />
                2025년 6월 18일 - 24일<br />
                인사동 한국미술관 2층
              </p>
              <Button asChild className="bg-ink hover:bg-ink/90 text-white">
                <Link href="/gallery">
                  작품 감상하기
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>


    </div>
  )
} 