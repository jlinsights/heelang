export interface Artwork {
  id: string
  slug: string
  title: string
  year: number
  medium: string
  dimensions: string
  description: string
  imageUrl: string // For placeholder generation
  imageUrlQuery?: string // For placeholder query generation
  artistNote?: string
}

export interface Artist {
  name: string
  bio: string
  statement: string
  profileImageUrl: string // For placeholder generation
}
