import { ARTIST_PROFILE, BRUSHWAYS } from '@/lib/artist-profile'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

/**
 * 작품 상세 하단의 작가 소개 — 레퍼런스: brushways.org 작품 페이지의
 * 'About the Calligrapher'. 작품을 본 뒤 바로 작가로 이어지게 한다.
 */
export function ArtworkArtistAside() {
  return (
    <section
      aria-labelledby='artwork-artist'
      className='mt-24 grid items-center gap-8 border-t border-border pt-12 sm:grid-cols-[8rem_1fr] sm:gap-10'
    >
      <div className='relative aspect-[4/5] w-28 overflow-hidden bg-muted sm:w-32'>
        <Image
          src={ARTIST_PROFILE.portraitUrl}
          alt={`${ARTIST_PROFILE.name} 작가`}
          fill
          sizes='128px'
          loading='lazy'
          className='object-cover'
        />
      </div>
      <div>
        <p className='text-xs tracking-[0.3em] uppercase text-muted-foreground'>
          About the Artist
        </p>
        <h2
          id='artwork-artist'
          className='mt-2 font-display text-2xl text-foreground md:text-3xl'
        >
          {ARTIST_PROFILE.name}
        </h2>
        <blockquote className='mt-4 max-w-2xl border-l-2 border-gold pl-5 font-display leading-relaxed text-foreground/85'>
          {ARTIST_PROFILE.intro}
        </blockquote>
        <div className='mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm'>
          <Link
            href='/artist'
            className='group inline-flex items-center gap-2 text-foreground underline-offset-4 decoration-gold hover:underline focus-art'
          >
            작가 소개
            <ArrowRight
              className='h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none'
              aria-hidden='true'
            />
          </Link>
          <a
            href={BRUSHWAYS.url}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1.5 text-muted-foreground underline-offset-4 decoration-gold hover:text-foreground hover:underline focus-art'
          >
            {BRUSHWAYS.name}
            <ArrowUpRight className='h-4 w-4' aria-hidden='true' />
            <span className='sr-only'>(새 탭에서 열림)</span>
          </a>
        </div>
      </div>
    </section>
  )
}
