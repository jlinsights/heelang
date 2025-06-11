export interface Artwork {
  id: string
  slug: string
  title: string
  year: number
  medium: string
  dimensions: string
  aspectRatio: string // CSS aspect-ratio 값 (예: "2/1", "1/1", "5/7")
  description: string
  imageUrl: string
  imageUrlQuery?: string
  artistNote?: string
}

export interface Artist {
  name: string
  bio: string
  statement: string
  profileImageUrl: string
} 