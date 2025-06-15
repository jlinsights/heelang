import { KakaoMap } from '@/components/kakao-map'
import { Logo } from '@/components/logo'
import { SimpleThemeToggle } from '@/components/simple-theme-toggle'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Mail, MapPin, Phone, User } from 'lucide-react'
import Link from 'next/link'

const exhibitionInfo = {
  title: "길",
  titleEn: "Way",
  subtitle: "희랑 공경순 개인전",
  subtitleChinese: "熙勆 孔慶順",
  period: "2025.06.18 - 06.24",
  venue: "인사동 한국미술관 2층",
  address: "서울특별시 종로구 인사동길 41-1",
  hours: "10:00 - 18:00",
  closed: "전시 기간 중 무휴",
  admission: "무료",
  artist: {
    name: "희랑 공경순",
    title: "희랑글씨 대표",
    phone: "010-3019-1417",
    email: "heelang@orientalcalligraphy.org"
  }
}

const programs = [
  {
    title: "작가와의 만남",
    schedule: "6월 21일(토) 14:00",
    duration: "60분",
    capacity: "30명",
    description: "희랑 공경순 작가와 함께하는 특별한 대화 시간"
  },
  {
    title: "서예 시연",
    schedule: "매일 15:00",
    duration: "30분",
    capacity: "제한없음",
    description: "작가의 실제 서예 창작 과정을 지켜보는 특별한 시간"
  },
  {
    title: "갤러리 토크",
    schedule: "6월 22일(일) 16:00",
    duration: "45분",
    capacity: "20명",
    description: "작품에 담긴 철학과 의미에 대한 깊이 있는 해설"
  }
]

export default function ExhibitionPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-xl border-b border-border/50 z-50">
        <div className="container-max">
          <div className="flex items-center justify-between py-6">
            <Logo size="md" />
            <div className="hidden md:flex items-center space-x-8">
                          <Link href="/artist" className="text-ink-light hover:text-ink transition-colors duration-200">
              작가 소개
            </Link>
            <Link href="/gallery" className="text-ink-light hover:text-ink transition-colors duration-200">
              작품 갤러리
            </Link>
            <Link href="/exhibition" className="text-ink font-medium">
              전시 정보
            </Link>
            <Link href="/contact" className="text-ink-light hover:text-ink transition-colors duration-200">
              문의하기
            </Link>
              <SimpleThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section 
        className="section-padding pt-32 pb-12 relative overflow-hidden"
        style={{
          backgroundImage: `url('/Images/Artworks/2025/heelang-way-2025-large.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* 배경 오버레이 */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
        
        <div className="container-max relative z-10">
          <div className="flex items-center mb-8">
            <Button asChild variant="ghost" size="sm" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
              <Link href="/">
                ← 돌아가기
              </Link>
            </Button>
          </div>
          
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="font-display text-5xl lg:text-6xl text-white drop-shadow-lg">{exhibitionInfo.title}</h1>
              <p className="font-english text-xl text-white/90 drop-shadow-md">{exhibitionInfo.titleEn}</p>
              <div className="w-16 h-0.5 bg-white/50 mx-auto"></div>
              <p className="font-korean text-2xl text-white/90 drop-shadow-md">{exhibitionInfo.subtitle}</p>
              <p className="font-korean text-lg text-white/80 drop-shadow-md">{exhibitionInfo.subtitleChinese}</p>
            </div>
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto border border-white/10">
              <p className="font-body text-lg text-white/90 leading-relaxed">
                인생의 매 순간이 하나의 길이며, 붓을 들고 종이 위에 획을 그어나가는 것 또한 길을 만들어가는 과정입니다. 
                희랑 공경순 작가의 서예 철학이 담긴 특별한 개인전입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exhibition Details */}
      <section className="section-padding pt-0 pb-16">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Date & Venue */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-ink/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-ink-light" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display text-xl text-ink">전시 기간</h3>
                      <div className="flex items-center space-x-3 text-lg">
                        <span className="font-body text-ink-light">{exhibitionInfo.period}</span>
                      </div>
                      <p className="font-body text-sm text-ink-light">{exhibitionInfo.closed}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-ink/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-ink-light" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display text-xl text-ink">전시 장소</h3>
                      <div className="space-y-1">
                        <p className="font-body text-ink-light">{exhibitionInfo.venue}</p>
                        <p className="font-body text-sm text-ink-light">{exhibitionInfo.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours & Contact */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-ink/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-ink-light" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display text-xl text-ink">관람 시간</h3>
                      <div className="flex items-center space-x-3">
                        <span className="font-body text-ink-light">{exhibitionInfo.hours}</span>
                      </div>
                      <p className="font-body text-sm text-ink-light">입장료: {exhibitionInfo.admission}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-ink/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-ink-light" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display text-xl text-ink">작가 정보</h3>
                      <div className="space-y-2">
                        <p className="font-body text-ink">{exhibitionInfo.artist.name}</p>
                        <p className="font-body text-sm text-ink-light">{exhibitionInfo.artist.title}</p>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-ink-light" />
                          <span className="font-body text-ink-light">{exhibitionInfo.artist.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-ink-light" />
                          <span className="font-body text-ink-light">{exhibitionInfo.artist.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section 
        className="section-padding relative overflow-hidden"
        style={{
          backgroundImage: `url('/Images/Artworks/2022/heelang-treasure-6-2022-large.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* 배경 오버레이 */}
        <div className="absolute inset-0 bg-slate-900/70 dark:bg-black/80"></div>
        
        <div className="container-max relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl text-white mb-4 drop-shadow-lg">Special Programs</h2>
            <div className="w-16 h-0.5 bg-white/50 mx-auto mb-6"></div>
            <p className="font-body text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
              전시와 함께 진행되는 특별 프로그램을 통해 더욱 깊이 있는 서예 경험을 만나보세요.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-display text-xl text-white drop-shadow-md">{program.title}</h3>
                  <p className="font-body text-white/90 leading-relaxed drop-shadow-sm">{program.description}</p>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-white/30">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm text-white/80">일정</span>
                    <span className="font-body text-sm text-white">{program.schedule}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm text-white/80">소요시간</span>
                    <span className="font-body text-sm text-white">{program.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm text-white/80">정원</span>
                    <span className="font-body text-sm text-white">{program.capacity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section 
        className="section-padding relative overflow-hidden"
        style={{
          backgroundImage: `url('/Images/Artworks/2023/heelang-breath-2023-large.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* 배경 오버레이 */}
        <div className="absolute inset-0 bg-slate-800/75 dark:bg-black/85"></div>
        
        <div className="container-max relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl text-white mb-4 drop-shadow-lg">Location</h2>
            <div className="w-16 h-0.5 bg-white/50 mx-auto mb-6"></div>
            <p className="font-body text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
              한국 전통 문화의 중심지 인사동에서 만나는 특별한 서예 전시
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 space-y-6 border border-white/20">
              <div className="text-center space-y-4">
                <h3 className="font-display text-2xl text-white drop-shadow-md">{exhibitionInfo.venue}</h3>
                <p className="font-body text-white/90 drop-shadow-sm">{exhibitionInfo.address}</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/30">
                <KakaoMap
                  latitude={37.5735}
                  longitude={126.9854}
                  placeName="인사동 한국미술관"
                  address="서울특별시 종로구 인사동길 41-1"
                  className="border-0"
                />
              </div>
              
              <div className="text-center space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="font-body text-sm text-white/90">
                      <strong className="text-white">지하철</strong><br />
                      1호선 종각역 3번 출구 도보 5분<br />
                      3호선 안국역 6번 출구 도보 5분
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="font-body text-sm text-white/90">
                      <strong className="text-white">버스</strong><br />
                      인사동 정류장 (02-017)<br />
                      간선버스, 지선버스 이용 가능
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <p className="font-body text-sm text-white/90">
                    <strong className="text-white">주차 안내</strong><br />
                    인사동 한국미술관 주차장 이용 가능 (전시 관람객 2시간 무료)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  )
} 