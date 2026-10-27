'use client'

import { useImageRatio } from '@/components/artwork/use-image-ratio'
import { ratioFromArtwork } from '@/lib/gallery/ordering'
import type { Artwork } from '@/lib/types'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'

interface JustifiedGridProps {
  artworks: readonly Artwork[]
  className?: string
  /** 첫 줄 이미지를 우선 로드할지 (페이지 최상단 그리드일 때만) */
  prioritizeFirstRow?: boolean
  /** 작품이 적을 때: 줄을 늘리지 않고 가운데 정렬 (홈 대표작 등) */
  centered?: boolean
}

/**
 * 작품 비율을 그대로 유지하는 저스티파이드 그리드.
 * 각 항목의 flex-grow/basis를 가로세로 비율에 비례시켜, 자르지 않고 줄을 꽉 채운다.
 * CSS columns(세로 채움)와 달리 정렬 순서와 Tab 순서가 왼쪽→오른쪽으로 유지된다.
 * 줄 높이는 --row-h 로 반응형 조정한다.
 */
export function JustifiedGrid({
  artworks,
  className,
  prioritizeFirstRow = false,
  centered = false,
}: JustifiedGridProps) {
  return (
    <ul
      className={cn(
        'flex flex-wrap gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14',
        centered
          ? 'justify-center sm:gap-x-12 [--row-h:14rem] sm:[--row-h:18rem] lg:[--row-h:24rem]'
          : '[--row-h:9rem] sm:[--row-h:12rem] lg:[--row-h:16rem]',
        className
      )}
    >
      {artworks.map((artwork, index) => (
        <ArtworkTile
          key={artwork.id}
          artwork={artwork}
          priority={prioritizeFirstRow && index < 4}
          centered={centered}
        />
      ))}
      {/* 마지막 줄이 과하게 늘어나지 않도록 남는 공간을 흡수 */}
      {!centered && <li aria-hidden='true' className='grow-[10] basis-0' />}
    </ul>
  )
}

function ArtworkTile({
  artwork,
  priority,
  centered,
}: {
  artwork: Artwork
  priority: boolean
  centered: boolean
}) {
  const [ratio, onImageLoad] = useImageRatio(ratioFromArtwork(artwork))
  const basis = `calc(var(--row-h) * ${ratio})`
  // 가운데 정렬 모드는 늘리지 않고 고정 높이로, 그리드 모드는 비율만큼 늘려 줄을 채운다
  const itemStyle: CSSProperties = centered
    ? { flex: `0 1 ${basis}`, minWidth: '8rem' }
    : { flex: `${ratio} 1 ${basis}` }

  return (
    <li style={itemStyle} className='min-w-0'>
      <Link
        href={`/gallery/${artwork.slug}`}
        className='group block focus-art rounded-sm'
      >
        <div
          className='relative w-full overflow-hidden bg-muted'
          style={{ aspectRatio: ratio }}
        >
          {artwork.imageUrl && (
            <Image
              src={artwork.imageUrl}
              alt={`희랑 공경순, 「${artwork.title}」`}
              fill
              priority={priority}
              onLoad={onImageLoad}
              sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
              className='object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100'
            />
          )}
        </div>
        <div className='mt-3 space-y-0.5'>
          <p className='font-display text-sm md:text-base text-foreground leading-snug line-clamp-2 break-keep underline-offset-4 decoration-gold group-hover:underline'>
            {artwork.title}
          </p>
          <p className='text-xs text-muted-foreground line-clamp-1'>
            {[artwork.year, artwork.medium].filter(Boolean).join(' · ')}
          </p>
        </div>
      </Link>
    </li>
  )
}
