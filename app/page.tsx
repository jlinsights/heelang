'use client'

import { ARTIST_PROFILE } from '@/lib/artist-profile'
import { ArtNavigation, NavigationSpacer } from '@/components/art-navigation'
import { HomeHero } from '@/components/home/home-hero'
import {
  HomeArtist,
  HomeExhibition,
  HomeFeatured,
} from '@/components/home/home-sections'
import { useFeaturedArtworks } from '@/components/home/use-featured-artworks'
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

export default function HomePage() {
  const { artworks, loading } = useFeaturedArtworks(8)
  const portraitUrl = useArtistPortrait()

  return (
    <div className='min-h-screen bg-background'>
      <ArtNavigation />
      <NavigationSpacer />
      <main>
        <HomeHero artwork={artworks[0] ?? null} />
        <HomeFeatured artworks={artworks} loading={loading} />
        <HomeArtist portraitUrl={portraitUrl} />
        <HomeExhibition />
      </main>
    </div>
  )
}
