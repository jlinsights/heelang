'use client'

import ArtworkDetailModalClient, {
  type ArtworkNeighbors,
} from '@/components/artwork-detail-modal-client'
import type { Artwork } from '@/lib/types'

export default function ClientEntry({
  artwork,
  recommendedArtworks,
  neighbors,
}: {
  artwork: Artwork
  recommendedArtworks: Artwork[]
  neighbors: ArtworkNeighbors
}) {
  return (
    <ArtworkDetailModalClient
      artwork={artwork}
      recommendedArtworks={recommendedArtworks}
      neighbors={neighbors}
    />
  )
}
