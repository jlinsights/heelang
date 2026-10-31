import { ArtNavigation, NavigationSpacer } from '@/components/art-navigation'
import imageRatios from '@/lib/gallery/image-ratios.json'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const exhibitionInfo = {
  title: '길',
  hanja: '道',
  titleEn: 'WAY',
  subtitle: '희랑 공경순 개인전',
  subtitleChinese: '熙勆 孔慶順',
  period: '2025. 6. 18 — 6. 24',
  venue: '인사동 한국미술관 2층',
  address: '서울특별시 종로구 인사동길 41-1',
  directions: '지하철 3호선 안국역 6번 출구에서 도보 5분',
  hours: '10:00 – 18:00 · 전시 기간 중 무휴',
  admission: '무료',
  sponsor: '사단법인 동양서예협회',
  artist: {
    name: '희랑 공경순',
    title: '희랑글씨 대표',
    phone: '010-3019-1417',
    email: 'heelang@orientalcalligraphy.org',
  },
}

// 전시 표제작. 작품은 자르지 않는다 — 비율은 실제 이미지에서 잰 값을 쓴다.
const keyArtwork = {
  slug: 'heelang-way-2025',
  title: '길',
  src: '/Images/Artworks/2025/heelang-way-2025-medium.jpg',
}
const keyArtworkRatio =
  (imageRatios as Record<string, number>)[keyArtwork.src] ?? 1

const programs = [
  {
    title: '작가와의 만남',
    schedule: '6월 21일(토) 14:00',
    duration: '60분',
    capacity: '30명',
    description: '희랑 공경순 작가와 함께하는 특별한 대화 시간',
  },
  {
    title: '서예 시연',
    schedule: '매일 15:00',
    duration: '30분',
    capacity: '제한없음',
    description: '작가의 실제 서예 창작 과정을 지켜보는 특별한 시간',
  },
  {
    title: '갤러리 토크',
    schedule: '6월 22일(일) 16:00',
    duration: '45분',
    capacity: '20명',
    description: '작품에 담긴 철학과 의미에 대한 깊이 있는 해설',
  },
]

const details: Array<[string, string]> = [
  ['기간', exhibitionInfo.period],
  ['장소', exhibitionInfo.venue],
  ['주소', exhibitionInfo.address],
  ['교통', exhibitionInfo.directions],
  ['관람 시간', exhibitionInfo.hours],
  ['입장료', exhibitionInfo.admission],
  ['주최', exhibitionInfo.sponsor],
]

export default function ExhibitionPage() {
  return (
    <div className='min-h-screen bg-background'>
      <ArtNavigation />
      <NavigationSpacer />

      <main className='container-art pb-24 pt-10 md:pt-16'>
        <header className='mb-10 md:mb-14 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='text-eyebrow'>Exhibition</p>
            <h1 className='mt-3 font-display text-4xl md:text-6xl text-foreground'>
              「{exhibitionInfo.title} {exhibitionInfo.hanja}」
              <span className='ml-3 align-middle text-eyebrow'>
                {exhibitionInfo.titleEn}
              </span>
            </h1>
            <p className='mt-3 text-muted-foreground'>
              {exhibitionInfo.subtitle} · {exhibitionInfo.subtitleChinese}
            </p>
          </div>
          <p className='max-w-md text-sm md:text-base text-muted-foreground'>
            인생의 매 순간이 하나의 길이며, 붓을 들고 종이 위에 획을 그어나가는
            것 또한 길을 만들어가는 과정입니다.
          </p>
        </header>

        <div className='grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16'>
          <figure>
            <Link
              href={`/gallery/${keyArtwork.slug}`}
              className='group block focus-art'
            >
              <div
                className='relative mx-auto w-full max-w-xl'
                style={{ aspectRatio: keyArtworkRatio }}
              >
                <Image
                  src={keyArtwork.src}
                  alt={`희랑 공경순, ${keyArtwork.title} (2025)`}
                  fill
                  sizes='(min-width: 1024px) 40vw, 100vw'
                  className='object-contain [filter:drop-shadow(0_24px_40px_rgba(0,0,0,0.25))]'
                  priority
                />
              </div>
              <figcaption className='mt-4 text-center text-sm text-muted-foreground group-hover:text-foreground transition-colors'>
                {keyArtwork.title} · 2025 · 전시 표제작
              </figcaption>
            </Link>
          </figure>

          <div>
            <p className='text-sm text-muted-foreground'>
              전시는 끝났습니다. 출품작은 갤러리에서 볼 수 있습니다.
            </p>

            <dl className='mt-6 divide-y divide-border border-y border-border text-sm'>
              {details.map(([label, value]) => (
                <div
                  key={label}
                  className='grid grid-cols-[5.5rem_1fr] gap-4 py-3'
                >
                  <dt className='text-muted-foreground'>{label}</dt>
                  <dd className='text-foreground tabular-nums'>{value}</dd>
                </div>
              ))}
              <div className='grid grid-cols-[5.5rem_1fr] gap-4 py-3'>
                <dt className='text-muted-foreground'>작가</dt>
                <dd className='space-y-1 text-foreground tabular-nums'>
                  <p>
                    {exhibitionInfo.artist.name}
                    <span className='text-muted-foreground'>
                      {' '}
                      · {exhibitionInfo.artist.title}
                    </span>
                  </p>
                  <p>
                    <a
                      href={`tel:${exhibitionInfo.artist.phone}`}
                      className='hover:underline underline-offset-4 focus-art'
                    >
                      {exhibitionInfo.artist.phone}
                    </a>
                  </p>
                  <p>
                    <a
                      href={`mailto:${exhibitionInfo.artist.email}`}
                      className='break-all hover:underline underline-offset-4 focus-art'
                    >
                      {exhibitionInfo.artist.email}
                    </a>
                  </p>
                </dd>
              </div>
            </dl>

            <div className='mt-8 flex flex-wrap items-center gap-x-8 gap-y-4'>
              <Link
                href='/gallery'
                className='inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-85 focus-art'
              >
                출품작 보기
                <ArrowRight className='h-4 w-4' aria-hidden='true' />
              </Link>
              <Link
                href='/artist'
                className='group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground focus-art'
              >
                작가 소개
                <ArrowRight
                  className='h-4 w-4 transition-transform group-hover:translate-x-0.5'
                  aria-hidden='true'
                />
              </Link>
            </div>
          </div>
        </div>

        <section aria-labelledby='programs-title' className='mt-20 md:mt-28'>
          <p className='text-eyebrow-ko'>전시 기간 중 열린 행사</p>
          <h2
            id='programs-title'
            className='mt-3 font-display text-3xl md:text-4xl text-foreground'
          >
            특별 프로그램
          </h2>

          <ul className='mt-8 divide-y divide-border border-y border-border md:grid md:grid-cols-3 md:divide-x md:divide-y-0'>
            {programs.map((program) => (
              <li
                key={program.title}
                className='py-6 md:px-6 md:first:pl-0 md:last:pr-0'
              >
                <h3 className='font-display text-xl text-foreground'>
                  {program.title}
                </h3>
                <p className='mt-2 text-sm text-muted-foreground tabular-nums'>
                  {program.schedule} · {program.duration} · 정원{' '}
                  {program.capacity}
                </p>
                <p className='mt-3 text-sm leading-relaxed text-foreground/85'>
                  {program.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
