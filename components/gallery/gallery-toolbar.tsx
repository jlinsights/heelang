'use client'

import type { SortKey } from '@/lib/gallery/ordering'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

export type ViewMode = 'grid' | 'list'

export interface CategoryOption {
  value: string
  label: string
  count: number
}

interface GalleryToolbarProps {
  total: number
  categories: CategoryOption[]
  selectedCategory: string
  onCategoryChange: (value: string) => void
  tags: { tag: string; count: number }[]
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  sortBy: SortKey
  sortOptions: { value: SortKey; label: string }[]
  onSortChange: (value: SortKey) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onClear: () => void
}

const chipBase =
  'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-art'
const chipIdle =
  'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
const chipActive = 'border-foreground bg-foreground text-background'

export function GalleryToolbar(props: GalleryToolbarProps) {
  const hasFilter =
    props.selectedCategory !== 'all' || props.selectedTags.length > 0

  return (
    <div className='space-y-4'>
      {/* 카테고리 칩 + 보기 전환 */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div
          role='group'
          aria-label='카테고리'
          className='flex flex-wrap gap-2'
        >
          {/* '전체' 하나뿐이면 고를 것이 없으니 칩을 숨긴다 */}
          {props.categories.length > 1 &&
            props.categories.map(({ value, label, count }) => {
              const active = props.selectedCategory === value
              return (
                <button
                  key={value}
                  type='button'
                  aria-pressed={active}
                  onClick={() => props.onCategoryChange(value)}
                  className={cn(chipBase, active ? chipActive : chipIdle)}
                >
                  {label}
                  <span
                    className={cn(
                      'tabular-nums text-xs',
                      active ? 'opacity-70' : 'opacity-60'
                    )}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
        </div>

        <div className='ml-auto flex items-center gap-5 text-sm'>
          <label className='flex items-center gap-2 text-muted-foreground'>
            <span className='sr-only sm:not-sr-only'>정렬</span>
            <select
              value={props.sortBy}
              onChange={(event) =>
                props.onSortChange(event.target.value as SortKey)
              }
              className='rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground focus-art'
            >
              {props.sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <ViewToggle
            viewMode={props.viewMode}
            onChange={props.onViewModeChange}
          />
        </div>
      </div>

      {/* 태그 — 가로 스크롤 한 줄 */}
      {props.tags.length > 0 && (
        <div
          role='group'
          aria-label='태그'
          className='-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0'
        >
          {props.tags.map(({ tag, count }) => {
            const active = props.selectedTags.includes(tag)
            return (
              <button
                key={tag}
                type='button'
                aria-pressed={active}
                onClick={() => props.onTagToggle(tag)}
                className={cn(
                  chipBase,
                  'py-1 text-xs',
                  active ? chipActive : chipIdle
                )}
              >
                #{tag}
                <span className='tabular-nums opacity-60'>{count}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* 결과 수 + 초기화 */}
      <div className='flex items-center gap-4 border-t border-border pt-4 text-sm'>
        <p className='text-muted-foreground' aria-live='polite'>
          <span className='font-medium tabular-nums text-foreground'>
            {props.total}
          </span>
          점의 작품
        </p>
        {hasFilter && (
          <button
            type='button'
            onClick={props.onClear}
            className='inline-flex items-center gap-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-art'
          >
            <X className='h-3.5 w-3.5' aria-hidden='true' />
            필터 초기화
          </button>
        )}
      </div>
    </div>
  )
}

function ViewToggle({
  viewMode,
  onChange,
}: {
  viewMode: ViewMode
  onChange: (mode: ViewMode) => void
}) {
  const modes: { value: ViewMode; label: string }[] = [
    { value: 'grid', label: '그리드' },
    { value: 'list', label: '목록' },
  ]
  return (
    <div
      role='group'
      aria-label='보기 방식'
      className='flex items-center gap-1'
    >
      {modes.map(({ value, label }, index) => (
        <span key={value} className='flex items-center gap-1'>
          {index > 0 && (
            <span aria-hidden='true' className='text-border'>
              /
            </span>
          )}
          <button
            type='button'
            aria-pressed={viewMode === value}
            onClick={() => onChange(value)}
            className={cn(
              'px-1 underline-offset-4 focus-art',
              viewMode === value
                ? 'text-foreground underline decoration-gold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {label}
          </button>
        </span>
      ))}
    </div>
  )
}
