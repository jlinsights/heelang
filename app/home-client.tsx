'use client'

import { ARTIST_PROFILE } from '@/lib/artist-profile'
import { ArtNavigation, NavigationSpacer } from '@/components/art-navigation'
import { HomeHero } from '@/components/home/home-hero'
import {
  HomeArtist,
  HomeExhibition,
  HomeFeatured,
} from '@/components/home/home-sections'
import type { Artwork } from '@/lib/types'
import { useEffect, useState } from 'react'

const DEFAULT_PORTRAIT = ARTIST_PROFILE.portraitUrl

function useArtistPortrait() {
  const [url, setUrl] = useState<string>(DEFAULT_PORTRAIT)

  useEffect(() => {
    let cancelled = false
    fetch('/api/artist')
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        const remote = result?.data?.profileImageUrl
        if (!cancelled && typeof remote === 'string' && remote) setUrl(remote)
      })
      .catch((error) => console.warn('Artist portrait: using default', error))
    return () => {
      cancelled = true
    }
  }, [])

  return url
}

/** 대표작은 서버(app/page.tsx)에서 받아 첫 HTML 에 그린다. 작가 사진만 클라이언트에서 갈아 끼운다. */
export default function HomeClient({ artworks }: { artworks: Artwork[] }) {
  const portraitUrl = useArtistPortrait()

  return (
    <div className='min-h-screen bg-background'>
      <ArtNavigation />
      <NavigationSpacer />
      <main>
        <HomeHero artwork={artworks[0] ?? null} />
        <HomeFeatured artworks={artworks} loading={false} />
        <HomeArtist portraitUrl={portraitUrl} />
        <HomeExhibition />
      </main>
    </div>
  )
}
