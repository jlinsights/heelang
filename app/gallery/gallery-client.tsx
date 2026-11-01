'use client'

import { ArtNavigation, NavigationSpacer } from '@/components/art-navigation'
import { ArtworkList } from '@/components/gallery/artwork-list'
import { GalleryPagination } from '@/components/gallery/gallery-pagination'
import {
  GalleryToolbar,
  type ViewMode,
} from '@/components/gallery/gallery-toolbar'
import { JustifiedGrid } from '@/components/gallery/justified-grid'
import {
  filterArtworks,
  sortArtworks,
  type SortKey,
} from '@/lib/gallery/ordering'
import type { Artwork } from '@/lib/types'
import { useEffect, useMemo, useState } from 'react'

const ARTWORKS_PER_PAGE = 12
// 기본값을 렌더마다 새로 만들지 않도록 고정 (effect 의존성으로 쓰임)
const NO_ARTWORKS: Artwork[] = []

const CATEGORY_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'treasure', label: '문방사우' },
  { value: 'calligraphy', label: '서예' },
  { value: 'painting', label: '회화' },
  { value: 'mixed', label: '혼합매체' },
]

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'default', label: '전시 순서' },
  { value: 'year', label: '최신순' },
  { value: 'title', label: '제목순' },
  { value: 'category', label: '분류순' },
]

function collectTags(artworks: readonly Artwork[]) {
  const counts = new Map<string, number>()
  artworks.forEach((artwork) =>
    artwork.tags?.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1))
  )
  return Array.from(counts, ([tag, count]) => ({ tag, count })).sort((a, b) =>
    a.tag.localeCompare(b.tag)
  )
}

export default function GalleryClient({
  initialArtworks = NO_ARTWORKS,
}: {
  initialArtworks?: Artwork[]
}) {
  const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks)
  const [loading, setLoading] = useState(initialArtworks.length === 0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortKey>('default')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let cancelled = false

    async function loadArtworks() {
      if (initialArtworks.length === 0) {
        const { fallbackArtworksData } = await import('@/lib/artworks')
        if (!cancelled) setArtworks(fallbackArtworksData)
      }
      if (!cancelled) setLoading(false)

      try {
        const response = await fetch('/api/artworks')
        const result = await response.json()
        if (!cancelled && result.success && result.data?.length > 0) {
          setArtworks(result.data)
        }
      } catch (error) {
        // Airtable을 쓸 수 없으면 현재(초기/폴백) 데이터로 계속 보여준다
        console.warn('Gallery: using initial artworks', error)
      }
    }

    loadArtworks()
    return () => {
      cancelled = true
    }
  }, [initialArtworks])

  const visibleArtworks = useMemo(
    () =>
      sortArtworks(
        filterArtworks(artworks, {
          category: selectedCategory,
          tags: selectedTags,
        }),
        sortBy
      ),
    [artworks, selectedCategory, selectedTags, sortBy]
  )

  const categories = CATEGORY_OPTIONS.map((option) => ({
    ...option,
    count:
      option.value === 'all'
        ? artworks.length
        : artworks.filter((artwork) => artwork.category === option.value)
            .length,
  })).filter((option) => option.value === 'all' || option.count > 0)

  const tags = useMemo(() => collectTags(artworks), [artworks])

  const totalPages = Math.ceil(visibleArtworks.length / ARTWORKS_PER_PAGE)
  const pageArtworks = visibleArtworks.slice(
    (currentPage - 1) * ARTWORKS_PER_PAGE,
    currentPage * ARTWORKS_PER_PAGE
  )

  // 필터가 바뀌면 첫 페이지로
  const withPageReset =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value)
      setCurrentPage(1)
    }

  const toggleTag = withPageReset((tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  )

  const clearAll = () => {
    setSelectedCategory('all')
    setSelectedTags([])
    setSortBy('default')
    setCurrentPage(1)
  }

  const changePage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className='min-h-screen bg-background'>
      <ArtNavigation />
      <NavigationSpacer />

      <main className='container-art pb-24 pt-10 md:pt-16'>
        <header className='mb-10 md:mb-14 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='text-eyebrow'>
              Gallery
            </p>
            <h1 className='mt-3 font-display text-4xl md:text-6xl text-foreground'>
              작품
            </h1>
          </div>
          <p className='max-w-md text-sm md:text-base text-muted-foreground'>
            희랑 공경순의 서예 작품입니다. 작품은 원래 비율 그대로 보여
            드립니다.
          </p>
        </header>

        <GalleryToolbar
          total={visibleArtworks.length}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={withPageReset(setSelectedCategory)}
          tags={tags}
          selectedTags={selectedTags}
          onTagToggle={toggleTag}
          sortBy={sortBy}
          sortOptions={SORT_OPTIONS}
          onSortChange={withPageReset(setSortBy)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onClear={clearAll}
        />

        <section aria-label='작품 목록' className='mt-10 md:mt-12'>
          {loading ? (
            <GridSkeleton />
          ) : pageArtworks.length === 0 ? (
            <EmptyState onClear={clearAll} />
          ) : viewMode === 'grid' ? (
            <JustifiedGrid artworks={pageArtworks} prioritizeFirstRow />
          ) : (
            <ArtworkList artworks={pageArtworks} />
          )}
        </section>

        <div className='mt-16'>
          <GalleryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={changePage}
          />
        </div>
      </main>
    </div>
  )
}

function GridSkeleton() {
  const ratios = [0.5, 0.75, 1, 0.5, 1.4, 0.75, 0.5, 1]
  return (
    <div
      aria-busy='true'
      aria-label='작품을 불러오는 중'
      className='flex flex-wrap gap-x-4 gap-y-10 md:gap-x-6 [--row-h:9rem] sm:[--row-h:12rem] lg:[--row-h:16rem]'
    >
      {ratios.map((ratio, i) => (
        <div
          key={i}
          style={{ flex: `${ratio} 1 calc(var(--row-h) * ${ratio})` }}
        >
          <div
            className='w-full animate-pulse bg-muted'
            style={{ aspectRatio: ratio }}
          />
          <div className='mt-3 h-4 w-2/3 animate-pulse rounded bg-muted' />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className='border-y border-border py-20 text-center'>
      <p className='font-display text-xl text-foreground'>
        조건에 맞는 작품이 없습니다
      </p>
      <p className='mt-2 text-sm text-muted-foreground'>
        선택한 분류나 태그를 줄여 보세요.
      </p>
      <button
        type='button'
        onClick={onClear}
        className='mt-6 text-sm underline underline-offset-4 decoration-gold hover:text-foreground focus-art'
      >
        필터 초기화
      </button>
    </div>
  )
}
