'use client'

import { ArtworkLightbox } from '@/components/artwork/artwork-lightbox'
import { ArtworkDetailClient } from '@/components/artwork-detail-client'
import { useImageRatio } from '@/components/artwork/use-image-ratio'
import { ratioFromArtwork } from '@/lib/gallery/ordering'
import type { Artwork } from '@/lib/types'
import { ArrowLeft, ArrowRight, Expand } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useState } from 'react'

export interface ArtworkNeighbors {
  prev: Pick<Artwork, 'slug' | 'title'> | null
  next: Pick<Artwork, 'slug' | 'title'> | null
}

interface ArtworkDetailModalClientProps {
  artwork: Artwork
  recommendedArtworks: Artwork[]
  neighbors?: ArtworkNeighbors
}

/**
 * 작품 상세 — 레퍼런스: Telescope(큰 이미지 + 좌우 이동 + 오른쪽 메타 패널),
 * Record Club(하단 '다른 작품' 띠).
 */
export default function ArtworkDetailModalClient({
  artwork,
  recommendedArtworks,
  neighbors = { prev: null, next: null },
}: ArtworkDetailModalClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const closeLightbox = useCallback(() => setLightboxOpen(false), [])
  const [ratio, onImageLoad] = useImageRatio(ratioFromArtwork(artwork))

  return (
    <>
      <nav
        aria-label='작품 위치'
        className='mb-8 flex items-center justify-between text-sm text-muted-foreground'
      >
        <Link
          href='/gallery'
          className='inline-flex items-center gap-2 hover:text-foreground focus-art'
        >
          <ArrowLeft className='h-4 w-4' aria-hidden='true' />
          작품 목록
        </Link>
        <NeighborLinks neighbors={neighbors} />
      </nav>

      <div className='grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(20rem,2fr)] lg:gap-16'>
        {/* 작품 — 원래 비율, 자르지 않음 */}
        <div className='flex items-center justify-center bg-muted/60 px-6 py-10 md:px-12 md:py-16 lg:sticky lg:top-24 lg:h-[calc(100svh-8rem)] lg:self-start lg:py-10'>
          <button
            type='button'
            onClick={() => setLightboxOpen(true)}
            className='group relative w-full focus-art'
            style={{
              aspectRatio: ratio,
              maxWidth: `calc((100svh - 14rem) * ${ratio})`,
            }}
            aria-label={`「${artwork.title}」 크게 보기`}
          >
            {artwork.imageUrl && (
              <Image
                src={artwork.imageUrl}
                alt={`희랑 공경순, 「${artwork.title}」`}
                fill
                priority
                sizes='(max-width: 1024px) 90vw, 55vw'
                onLoad={onImageLoad}
                className='object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.25)]'
              />
            )}
            <span className='absolute bottom-2 right-2 rounded-full bg-background/80 p-2 text-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100'>
              <Expand className='h-4 w-4' aria-hidden='true' />
            </span>
          </button>
        </div>

        <ArtworkInfo artwork={artwork} />
      </div>

      {recommendedArtworks.length > 0 && (
        <MoreWorks artworks={recommendedArtworks} />
      )}

      {artwork.imageUrl && (
        <ArtworkLightbox
          open={lightboxOpen}
          onClose={closeLightbox}
          src={artwork.imageUrl}
          title={artwork.title}
        />
      )}
    </>
  )
}

function NeighborLinks({ neighbors }: { neighbors: ArtworkNeighbors }) {
  const link =
    'inline-flex items-center gap-1.5 hover:text-foreground focus-art'
  return (
    <div className='flex items-center gap-5'>
      {neighbors.prev ? (
        <Link
          href={`/gallery/${neighbors.prev.slug}`}
          className={link}
          aria-label={`이전 작품: ${neighbors.prev.title}`}
        >
          <ArrowLeft className='h-4 w-4' aria-hidden='true' />
          <span className='hidden sm:inline'>이전</span>
        </Link>
      ) : (
        <span aria-hidden='true' className='opacity-30'>
          <ArrowLeft className='h-4 w-4' />
        </span>
      )}
      {neighbors.next ? (
        <Link
          href={`/gallery/${neighbors.next.slug}`}
          className={link}
          aria-label={`다음 작품: ${neighbors.next.title}`}
        >
          <span className='hidden sm:inline'>다음</span>
          <ArrowRight className='h-4 w-4' aria-hidden='true' />
        </Link>
      ) : (
        <span aria-hidden='true' className='opacity-30'>
          <ArrowRight className='h-4 w-4' />
        </span>
      )}
    </div>
  )
}

function ArtworkInfo({ artwork }: { artwork: Artwork }) {
  const details: [string, string | number | undefined][] = [
    ['제작 연도', artwork.year],
    ['재료', artwork.medium],
    ['크기', artwork.dimensions],
    ['연작', artwork.series],
  ]
  const soldOut = artwork.available === false

  return (
    <div>
      <p className='text-xs tracking-[0.3em] uppercase text-muted-foreground'>
        희랑 공경순
      </p>
      <h1 className='mt-3 font-display text-3xl leading-tight text-foreground md:text-5xl'>
        {artwork.title}
      </h1>

      <dl className='mt-8 divide-y divide-border border-y border-border text-sm'>
        {details
          .filter(([, value]) => value !== undefined && value !== '')
          .map(([label, value]) => (
            <div key={label} className='grid grid-cols-[5.5rem_1fr] gap-4 py-3'>
              <dt className='text-muted-foreground'>{label}</dt>
              <dd className='text-foreground'>{value}</dd>
            </div>
          ))}
        {artwork.available !== undefined && (
          <div className='grid grid-cols-[5.5rem_1fr] gap-4 py-3'>
            <dt className='text-muted-foreground'>소장</dt>
            <dd className='flex items-center gap-2 text-foreground'>
              <span
                aria-hidden='true'
                className={`h-2 w-2 rounded-full ${soldOut ? 'bg-muted-foreground' : 'bg-gold'}`}
              />
              {soldOut ? '판매 완료' : '구매 문의 가능'}
              {artwork.price ? ` · ${artwork.price.toLocaleString()}원` : ''}
            </dd>
          </div>
        )}
      </dl>

      {artwork.description && (
        <p className='mt-8 leading-relaxed text-foreground/85'>
          {artwork.description}
        </p>
      )}

      {artwork.artistNote && (
        <figure className='mt-8 border-l-2 border-gold pl-5'>
          <figcaption className='text-xs tracking-[0.2em] uppercase text-muted-foreground'>
            작가 노트
          </figcaption>
          <blockquote className='mt-3 whitespace-pre-line font-display leading-relaxed text-foreground/90'>
            {artwork.artistNote}
          </blockquote>
        </figure>
      )}

      {artwork.tags && artwork.tags.length > 0 && (
        <ul className='mt-8 flex flex-wrap gap-2'>
          {artwork.tags.map((tag) => (
            <li
              key={tag}
              className='rounded-full border border-border px-3 py-1 text-xs text-muted-foreground'
            >
              #{tag}
            </li>
          ))}
        </ul>
      )}

      <div className='mt-10 flex flex-wrap items-center gap-3'>
        {soldOut ? (
          <span className='rounded-full border border-border px-6 py-3 text-sm text-muted-foreground'>
            판매 완료된 작품입니다
          </span>
        ) : (
          <Link
            href='/contact'
            className='inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-85 focus-art'
          >
            작품 문의하기
            <ArrowRight className='h-4 w-4' aria-hidden='true' />
          </Link>
        )}
        <ArtworkDetailClient title={artwork.title} slug={artwork.slug} />
      </div>
    </div>
  )
}

function MoreWorks({ artworks }: { artworks: Artwork[] }) {
  return (
    <section
      aria-labelledby='more-works'
      className='mt-24 border-t border-border pt-12'
    >
      <div className='mb-8 flex items-end justify-between'>
        <h2
          id='more-works'
          className='font-display text-2xl text-foreground md:text-3xl'
        >
          다른 작품
        </h2>
        <Link
          href='/gallery'
          className='text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-art'
        >
          전체 보기
        </Link>
      </div>
      <ul className='-mx-4 flex snap-x gap-6 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0'>
        {artworks.map((work) => (
          <li key={work.id} className='w-40 shrink-0 snap-start sm:w-48'>
            <Link
              href={`/gallery/${work.slug}`}
              className='group block focus-art'
            >
              <div className='relative aspect-[3/4] bg-muted'>
                {work.imageUrl && (
                  <Image
                    src={work.imageUrl}
                    alt={`희랑 공경순, 「${work.title}」`}
                    fill
                    sizes='192px'
                    loading='lazy'
                    className='object-contain p-3'
                  />
                )}
              </div>
              <p className='mt-3 font-display text-sm text-foreground line-clamp-1 underline-offset-4 decoration-gold group-hover:underline'>
                {work.title}
              </p>
              <p className='text-xs text-muted-foreground'>{work.year}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
