'use client'

import { JustifiedGrid } from '@/components/gallery/justified-grid'
import type { Artwork } from '@/lib/types'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { EXHIBITION } from './home-hero'

function SectionLabel({ children }: { children: string }) {
  return (
    <p className='text-xs tracking-[0.3em] uppercase text-muted-foreground'>
      {children}
    </p>
  )
}

function TextLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className='group inline-flex items-center gap-2 text-sm text-foreground underline-offset-4 decoration-gold hover:underline focus-art'
    >
      {children}
      <ArrowRight
        className='h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none'
        aria-hidden='true'
      />
    </Link>
  )
}

/** 대표 작품 — 레퍼런스: Midjourney 탐색 그리드(비율 유지), Squarespace 작품 행 */
export function HomeFeatured({
  artworks,
  loading,
}: {
  artworks: readonly Artwork[]
  loading: boolean
}) {
  return (
    <section
      id='featured'
      aria-labelledby='featured-title'
      className='section-padding'
    >
      <div className='container-art'>
        <div className='mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between'>
          <div>
            <SectionLabel>Featured Works</SectionLabel>
            <h2
              id='featured-title'
              className='mt-3 font-display text-3xl md:text-5xl text-foreground'
            >
              대표 작품
            </h2>
          </div>
          <TextLink href='/gallery'>전체 작품 보기</TextLink>
        </div>

        {loading ? (
          <div aria-busy='true' className='h-64 animate-pulse bg-muted' />
        ) : (
          <JustifiedGrid artworks={artworks} centered={artworks.length < 5} />
        )}
      </div>
    </section>
  )
}

/** 작가 — 문장 중심 편집 레이아웃. 소개 문구는 기존 사이트 카피를 그대로 사용 */
export function HomeArtist({ portraitUrl }: { portraitUrl: string }) {
  return (
    <section
      aria-labelledby='artist-title'
      className='section-padding border-y border-border bg-muted/40'
    >
      <div className='container-art grid items-center gap-12 md:grid-cols-[2fr_3fr] md:gap-20'>
        <div className='relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden bg-muted'>
          <Image
            src={portraitUrl}
            alt='희랑 공경순 작가'
            fill
            sizes='(max-width: 768px) 80vw, 33vw'
            className='object-cover'
          />
        </div>
        <div>
          <SectionLabel>Artist</SectionLabel>
          <h2
            id='artist-title'
            className='mt-3 font-display text-3xl md:text-5xl text-foreground'
          >
            희랑 공경순
          </h2>
          <blockquote className='mt-8 border-l-2 border-gold pl-6 font-display text-xl leading-relaxed text-foreground/90 md:text-2xl'>
            전통 서예의 깊이와 현대적 감각을 조화시키며, 문방사우의 정신을
            현대에 되살리는 작업을 하고 있습니다.
          </blockquote>
          <div className='mt-10'>
            <TextLink href='/artist'>작가 소개 더보기</TextLink>
          </div>
        </div>
      </div>
    </section>
  )
}

/** 전시 안내 — 아이콘 카드 대신 전시장 캡션 판(plaque)처럼 정의 목록으로 */
export function HomeExhibition() {
  const rows: [string, string, string?][] = [
    ['기간', EXHIBITION.period, '월요일 휴관'],
    ['시간', EXHIBITION.hours],
    ['장소', EXHIBITION.venue, '서울시 종로구 인사동길'],
    ['관람', '무료 · 사전 예약 불필요', '단체 관람 문의 환영'],
    ['후원', EXHIBITION.sponsor],
  ]

  return (
    <section aria-labelledby='exhibition-title' className='section-padding'>
      <div className='container-art grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20'>
        <div>
          <SectionLabel>Exhibition</SectionLabel>
          <h2
            id='exhibition-title'
            className='mt-3 font-display text-3xl md:text-5xl text-foreground'
          >
            전시 안내
          </h2>
          <p className='mt-6 max-w-xs text-sm text-muted-foreground'>
            인사동에서 열리는 {EXHIBITION.artist} 개인전 「{EXHIBITION.title}{' '}
            {EXHIBITION.hanja}」에 초대합니다.
          </p>
          <div className='mt-8'>
            <TextLink href='/exhibition'>전시 상세 정보</TextLink>
          </div>
        </div>

        <dl className='divide-y divide-border border-y border-border'>
          {rows.map(([label, value, note]) => (
            <div
              key={label}
              className='grid grid-cols-[4.5rem_1fr] gap-4 py-5 md:grid-cols-[6rem_1fr] md:py-6'
            >
              <dt className='text-sm text-muted-foreground'>{label}</dt>
              <dd>
                <p className='font-display text-lg text-foreground md:text-xl'>
                  {value}
                </p>
                {note && (
                  <p className='mt-1 text-sm text-muted-foreground'>{note}</p>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
