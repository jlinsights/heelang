'use client'

import type { Artwork } from '@/lib/types'
import { useEffect, useState } from 'react'

/**
 * 대표작 목록. 로컬 폴백 데이터로 즉시 그린 뒤, Airtable(API) 데이터가 오면 교체한다.
 * 폴백에 대표작이 없으면 앞에서부터 limit개를 쓴다.
 */
export function useFeaturedArtworks(limit: number) {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { fallbackArtworksData } = await import('@/lib/artworks')
      const featured = fallbackArtworksData.filter(
        (artwork) => artwork.featured
      )
      if (!cancelled) {
        setArtworks(
          (featured.length > 0 ? featured : fallbackArtworksData).slice(
            0,
            limit
          )
        )
        setLoading(false)
      }

      try {
        const response = await fetch('/api/artworks')
        const result = await response.json()
        const live: Artwork[] = (result.data ?? []).filter(
          (artwork: Artwork) => artwork.featured
        )
        if (!cancelled && live.length > 0) setArtworks(live.slice(0, limit))
      } catch (error) {
        console.warn('Featured artworks: using local data', error)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [limit])

  return { artworks, loading }
}
