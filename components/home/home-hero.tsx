'use client'

import { useImageRatio } from '@/components/artwork/use-image-ratio'
import { ratioFromArtwork } from '@/lib/gallery/ordering'
import type { Artwork } from '@/lib/types'
import { ArrowDown, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const EXHIBITION = {
  title: '길',
  hanja: '道',
  english: 'WAY',
  artist: '희랑 공경순',
  period: '2025. 6. 18 — 6. 24',
  hours: '오전 10시 – 오후 6시',
  venue: '인사동 한국미술관 2층',
  sponsor: '사단법인 동양서예협회',
} as const

/**
 * 히어로 — 레퍼런스: Harvest "Time in This Time" (블러 처리한 작품 위 중앙 세리프 타이틀),
 * Squarespace 순수미술 템플릿(조용한 세리프 + 작품).
 * 서예 작품은 자르지 않는다: 블러 배경은 장식, 실제 작품은 원래 비율로 오른쪽에 둔다.
 * 자동 전환 없음 — 정적 이미지라 일시정지 컨트롤이 필요 없다(WCAG 2.2.2).
 */
export function HomeHero({ artwork }: { artwork: Artwork | null }) {
  return (
    <section
      aria-labelledby='hero-title'
      className='relative isolate overflow-hidden border-b border-border'
    >
      {artwork?.imageUrl && (
        <div aria-hidden='true' className='absolute inset-0 -z-10'>
          <Image
            src={artwork.imageUrl}
            alt=''
            fill
            sizes='10vw'
            className='scale-125 object-cover opacity-40 blur-3xl'
          />
          <div className='absolute inset-0 bg-background/75' />
        </div>
      )}

      <div className='container-art grid min-h-[calc(100svh-4rem)] items-center gap-12 py-16 md:grid-cols-[1.1fr_1fr] md:gap-16 md:py-24'>
        <div className='text-center md:text-left'>
          <p className='text-eyebrow-ko'>
            {EXHIBITION.artist} 개인전
            <span aria-hidden='true' className='mx-2'>
              ·
            </span>
            <span className='text-eyebrow'>Contemporary Calligraphy</span>
          </p>

          <h1
            id='hero-title'
            className='mt-8 font-display font-bold leading-none tracking-[0.08em] text-foreground text-[clamp(4.5rem,14vw,10rem)]'
          >
            {EXHIBITION.title}{' '}
            <span lang='zh-Hant' className='text-ink-light'>
              {EXHIBITION.hanja}
            </span>
          </h1>
          <div className='mx-auto mt-6 h-px w-16 bg-gold md:mx-0' />
          <p className='mt-6 font-display text-2xl tracking-[0.4em] text-foreground/80 md:text-3xl'>
            {EXHIBITION.english}
          </p>

          <dl className='mx-auto mt-10 grid max-w-sm grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-left text-sm tabular-nums md:mx-0'>
            <dt className='text-muted-foreground'>기간</dt>
            <dd className='text-foreground'>{EXHIBITION.period}</dd>
            <dt className='text-muted-foreground'>장소</dt>
            <dd className='text-foreground'>{EXHIBITION.venue}</dd>
          </dl>

          <div className='mt-10 flex flex-col items-center gap-4 sm:flex-row md:items-start'>
            <Link
              href='/gallery'
              className='inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85 focus-art'
            >
              작품 보기
              <ArrowRight className='h-4 w-4' aria-hidden='true' />
            </Link>
            <Link
              href='/exhibitions/gil'
              className='text-sm text-muted-foreground underline-offset-4 decoration-gold hover:text-foreground hover:underline focus-art'
            >
              전시 안내
            </Link>
          </div>
        </div>

        <HeroArtwork artwork={artwork} />
      </div>

      <a
        href='#featured'
        className='absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-muted-foreground hover:text-foreground focus-art md:block'
        aria-label='대표 작품으로 이동'
      >
        <ArrowDown className='h-5 w-5' aria-hidden='true' />
      </a>
    </section>
  )
}

function HeroArtwork({ artwork }: { artwork: Artwork | null }) {
  if (!artwork) {
    return (
      <div
        aria-hidden='true'
        className='mx-auto h-[min(60svh,34rem)] w-full max-w-xs animate-pulse bg-muted'
      />
    )
  }

  return <HeroFigure artwork={artwork} />
}

function HeroFigure({ artwork }: { artwork: Artwork }) {
  const [ratio, onImageLoad] = useImageRatio(ratioFromArtwork(artwork))

  return (
    <figure className='mx-auto w-full max-w-md'>
      <Link href={`/gallery/${artwork.slug}`} className='group block focus-art'>
        <div
          className='relative mx-auto max-h-[64svh] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]'
          style={{
            aspectRatio: ratio,
            width: `min(100%, calc(64svh * ${ratio}))`,
          }}
        >
          {artwork.imageUrl && (
            <Image
              src={artwork.imageUrl}
              alt={`희랑 공경순, 「${artwork.title}」`}
              fill
              priority
              sizes='(max-width: 768px) 80vw, 40vw'
              onLoad={onImageLoad}
              className='object-contain'
            />
          )}
        </div>
        <figcaption className='mt-4 text-center text-sm text-muted-foreground'>
          <span className='font-display text-foreground group-hover:underline underline-offset-4 decoration-gold'>
            {artwork.title}
          </span>
          {artwork.year ? `, ${artwork.year}` : ''}
          {artwork.medium ? ` · ${artwork.medium}` : ''}
        </figcaption>
      </Link>
    </figure>
  )
}
