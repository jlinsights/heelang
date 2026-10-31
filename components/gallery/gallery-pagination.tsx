'use client'

import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface GalleryPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const MAX_VISIBLE = 5

function visiblePages(current: number, total: number): number[] {
  const start = Math.max(1, Math.min(current - 2, total - MAX_VISIBLE + 1))
  const end = Math.min(total, start + MAX_VISIBLE - 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export function GalleryPagination({
  currentPage,
  totalPages,
  onPageChange,
}: GalleryPaginationProps) {
  if (totalPages <= 1) return null

  const navButton =
    'inline-flex min-h-11 items-center gap-2 px-1 text-sm text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-30 focus-art'

  return (
    <nav
      aria-label='페이지'
      className='flex items-center justify-between border-t border-border pt-6'
    >
      <button
        type='button'
        className={navButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ArrowLeft className='h-4 w-4' aria-hidden='true' />
        이전
      </button>

      <ol className='flex items-center gap-1'>
        {visiblePages(currentPage, totalPages).map((page) => (
          <li key={page}>
            <button
              type='button'
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={cn(
                'h-11 min-w-11 rounded-full px-2 text-sm tabular-nums focus-art',
                page === currentPage
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {page}
            </button>
          </li>
        ))}
      </ol>

      <button
        type='button'
        className={navButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        다음
        <ArrowRight className='h-4 w-4' aria-hidden='true' />
      </button>
    </nav>
  )
}
