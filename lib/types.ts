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
  // Airtable 연동을 위한 추가 필드들
  featured?: boolean
  category?: string
  tags?: string[]
  price?: number
  available?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface SocialLinks {
  instagram?: string
  facebook?: string
  twitter?: string
  website?: string
}

export interface Artist {
  name: string
  bio: string
  statement: string
  profileImageUrl: string
  // Airtable 연동을 위한 추가 필드들
  birthYear?: number
  education?: string[]
  exhibitions?: string[]
  awards?: string[]
  collections?: string[]
  website?: string
  email?: string
  phone?: string
  socialLinks?: SocialLinks
}

// 페이지 컴포넌트 Props 타입들
export interface PageProps {
  params: { [key: string]: string | string[] | undefined }
  searchParams: { [key: string]: string | string[] | undefined }
}

export interface LayoutProps {
  children: React.ReactNode
  params?: { [key: string]: string | string[] | undefined }
}

// 테마 관련 타입들
export type Theme = 'light' | 'dark' | 'system'

// 언어 관련 타입들
export type Locale = 'ko' | 'en' | 'ja' | 'zh'

// 갤러리 상태 타입들
export interface GalleryState {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  searchQuery: string
  selectedCategory: string
  sortBy: 'year' | 'title' | 'featured'
  sortOrder: 'asc' | 'desc'
}

// 에러 관련 타입들
export interface AppError {
  message: string
  code?: string
  statusCode?: number
  details?: any
}

// API 응답 타입들
export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: AppError
  timestamp: string
}

// 연락처 폼 타입들
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
}

// SEO 관련 타입들
export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  canonicalUrl?: string
}

// 유틸리티 타입들
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// 이벤트 핸들러 타입들
export type EventHandler<T = Event> = (event: T) => void
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>

// 전역 타입 확장
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
} 