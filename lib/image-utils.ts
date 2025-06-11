import { IMAGE_CONFIG } from './constants'

// 이미지 URL 생성 함수
export function generateImageUrl(
  src: string,
  width?: number,
  height?: number,
  quality: number = 75
): string {
  if (src.startsWith('http')) {
    return src // 외부 URL은 그대로 반환
  }

  // 개발 환경에서는 placeholder 사용
  if (process.env.NODE_ENV === 'development' && src.includes('placeholder')) {
    return src
  }

  // 실제 이미지 최적화 서비스 URL 생성 (예: Vercel, CloudFlare Images 등)
  const params = new URLSearchParams()
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  params.set('q', quality.toString())
  
  return `${src}?${params.toString()}`
}

// 반응형 이미지 sizes 속성 생성
export function getImageSizes(type: 'artwork' | 'profile' | 'thumbnail'): string {
  switch (type) {
    case 'artwork':
      return IMAGE_CONFIG.artworkImageSizes
    case 'profile':
      return IMAGE_CONFIG.profileImageSize
    case 'thumbnail':
      return '(max-width: 768px) 50vw, 25vw'
    default:
      return '100vw'
  }
}

// 이미지 preload 링크 생성
export function generatePreloadLink(src: string, sizes?: string) {
  return {
    rel: 'preload',
    as: 'image',
    href: src,
    ...(sizes && { imageSizes: sizes }),
  }
}

// 이미지 alt 텍스트 생성 (접근성 향상)
export function generateAltText(title: string, type: 'artwork' | 'profile'): string {
  switch (type) {
    case 'artwork':
      return `서예 작품: ${title}`
    case 'profile':
      return `작가 프로필 사진: ${title}`
    default:
      return title
  }
} 