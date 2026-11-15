import { cn } from '@/lib/utils'
import {
  generateImageUrl,
  getImageSizes,
  generateAltText,
} from '@/lib/image-utils'

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('클래스네임들을 올바르게 병합한다', () => {
      expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
    })

    it('중복된 클래스를 올바르게 처리한다', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })

    it('조건부 클래스를 올바르게 처리한다', () => {
      expect(cn('base', true && 'active', false && 'inactive')).toBe(
        'base active'
      )
    })
  })
})

describe('Image Utils', () => {
  describe('generateImageUrl', () => {
    it('외부 URL은 그대로 반환한다', () => {
      const externalUrl = 'https://example.com/image.jpg'
      expect(generateImageUrl(externalUrl)).toBe(externalUrl)
    })

    it('개발 환경에서 placeholder는 그대로 반환한다', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      const placeholderUrl = '/placeholder.svg?width=100'
      expect(generateImageUrl(placeholderUrl)).toBe(placeholderUrl)

      process.env.NODE_ENV = originalEnv
    })

    it('로컬 이미지는 Next.js 이미지 최적화에 맡기고 원본 경로를 반환한다', () => {
      const result = generateImageUrl('/image.jpg')
      expect(result).toBe('/image.jpg')
    })
  })

  describe('getImageSizes', () => {
    it('작품 이미지 사이즈를 올바르게 반환한다', () => {
      const sizes = getImageSizes('artwork')
      expect(sizes).toBe(
        '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      )
    })

    it('작가 이미지 사이즈를 올바르게 반환한다', () => {
      const sizes = getImageSizes('artist')
      expect(sizes).toBe('(max-width: 768px) 100vw, 50vw')
    })
  })

  describe('generateAltText', () => {
    it('작품 alt 텍스트를 올바르게 생성한다', () => {
      const altText = generateAltText('고요한 메아리', 'artwork')
      expect(altText).toBe('희랑 공경순 작가의 서예 작품 "고요한 메아리"')
    })

    it('작가 alt 텍스트를 올바르게 생성한다', () => {
      const altText = generateAltText('프로필 사진', 'artist')
      expect(altText).toBe('희랑 공경순 작가 프로필 사진')
    })
  })
})
