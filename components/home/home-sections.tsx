'use client'

import { ARTIST_PROFILE } from '@/lib/artist-profile'
import { JustifiedGrid } from '@/components/gallery/justified-grid'
import type { Artwork } from '@/lib/types'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { EXHIBITION } from './home-hero'

function SectionLabel({ children }: { children: string }) {
  return <p className='text-eyebrow'>{children}</p>
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
            alt={`${ARTIST_PROFILE.name} 작가`}
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
            {ARTIST_PROFILE.name}
          </h2>
          <blockquote className='mt-8 border-l-2 border-gold pl-6 font-display text-xl leading-relaxed text-foreground/90 md:text-2xl'>
            {ARTIST_PROFILE.intro}
          </blockquote>
          <div className='mt-10'>
            <TextLink href='/artist'>작가 소개 더보기</TextLink>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * 전시 기록 — 전시장 캡션 판(plaque)처럼 정의 목록으로.
 * 2025 개인전은 끝났으므로 관람 안내(시간·예약·휴관)가 아니라 지난 전시의 기록만 둔다.
 */
export function HomeExhibition() {
  const rows: [string, string, string?][] = [
    ['기간', EXHIBITION.period],
    ['장소', EXHIBITION.venue, '서울시 종로구 인사동길'],
    ['주최', EXHIBITION.sponsor],
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
            전시
          </h2>
          <p className='mt-6 max-w-xs text-sm text-muted-foreground'>
            2025년 인사동에서 열린 {EXHIBITION.artist} 개인전{' '}
            {/* 「길 道」와 조사 '의' 사이에서 줄이 바뀌지 않게 묶는다 */}
            <span className='whitespace-nowrap'>
              「{EXHIBITION.title} {EXHIBITION.hanja}」의
            </span>{' '}
            기록입니다. 출품작은 갤러리에서 볼 수 있습니다.
          </p>
          <div className='mt-8 flex flex-col items-start gap-3'>
            <TextLink href='/exhibitions/gil'>전시 기록 보기</TextLink>
            <TextLink href='/exhibitions'>모든 전시</TextLink>
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
