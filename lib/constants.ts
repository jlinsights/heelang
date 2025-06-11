// 앱 전체에서 사용하는 상수들
export const APP_CONFIG = {
  name: '묵향 서예전',
  nameEn: 'Calligraphy Catalog',
  description: '현대 서예가의 작품을 온라인으로 감상할 수 있는 다국어 지원 전시 카탈로그',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  author: {
    name: '이름 예시',
    email: 'artist@example.com',
  },
} as const

// 이미지 관련 상수
export const IMAGE_CONFIG = {
  defaultPlaceholder: '/placeholder.svg',
  artworkImageSizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  profileImageSize: '(max-width: 768px) 100vw, 300px',
} as const

// 페이지네이션 관련 상수
export const PAGINATION_CONFIG = {
  artworksPerPage: 12,
  maxPaginationPages: 10,
} as const

// SEO 관련 상수
export const SEO_CONFIG = {
  keywords: ['서예', 'calligraphy', 'art', 'exhibition', 'Korean art', '한국 전통 예술'],
  twitterHandle: '@calligraphy_art',
} as const 