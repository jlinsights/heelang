import type { Artwork } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'

/** 목록 보기 — 작품 캡션(제목·연도·재료·크기)을 표처럼 정렬해 한눈에 비교 */
export function ArtworkList({ artworks }: { artworks: readonly Artwork[] }) {
  return (
    <ul className='divide-y divide-border border-y border-border'>
      {artworks.map((artwork) => (
        <li key={artwork.id}>
          <Link
            href={`/gallery/${artwork.slug}`}
            className='group grid grid-cols-[4rem_1fr] sm:grid-cols-[5rem_1fr_auto] items-center gap-4 sm:gap-6 py-4 focus-art hover:bg-muted/50 transition-colors'
          >
            <div className='relative h-20 w-16 sm:h-24 sm:w-20 bg-muted'>
              {artwork.imageUrl && (
                <Image
                  src={artwork.imageUrl}
                  alt=''
                  fill
                  sizes='80px'
                  className='object-contain'
                />
              )}
            </div>
            <div className='min-w-0'>
              <p className='font-display text-base md:text-lg text-foreground truncate group-hover:underline underline-offset-4 decoration-gold'>
                {artwork.title}
              </p>
              <p className='mt-1 text-sm text-muted-foreground truncate'>
                {[artwork.medium, artwork.dimensions]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </div>
            <p className='hidden sm:block text-sm tabular-nums text-muted-foreground'>
              {artwork.year}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
