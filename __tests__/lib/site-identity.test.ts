import fs from 'fs'
import path from 'path'
import { keepSeparatorWithPrevious, NBSP } from '@/lib/list-item'
import { SITE_NAME, SITE_TITLE_TEMPLATE } from '@/lib/site'

// 2025 개인전 「길 道」는 끝났고 사이트는 상설 포트폴리오다 (PRODUCT.md).
// 전시 이름이 사이트 이름·탭 제목·로고 대체 텍스트로 되돌아오면 안 된다.
// 전시 아카이브 페이지(app/exhibition)와 작품 소개 문구는 예외.
const ROOT = path.resolve(__dirname, '../..')
const IDENTITY_FILES = [
  'app/layout.tsx',
  'app/gallery/page.tsx',
  'app/artist/page.tsx',
  'app/contact/layout.tsx',
  'components/logo.tsx',
  'components/art-navigation.tsx',
  'lib/site.ts',
]

describe('사이트 이름', () => {
  it('사이트 이름은 작가 이름이다', () => {
    expect(SITE_NAME).toBe('희랑 공경순')
  })

  it('페이지 제목 뒤에 사이트 이름이 붙는다', () => {
    expect(SITE_TITLE_TEMPLATE.replace('%s', '문의')).toBe('문의 | 희랑 공경순')
  })

  // 2025 전시를 '지난 행사'로 기록하는 문장(구조화 데이터의 ExhibitionEvent)은 괜찮다.
  // 막는 것은 전시 이름을 사이트 이름처럼 쓰던 옛 표현이다.
  it.each(IDENTITY_FILES)(
    '%s 에 전시 이름을 사이트 이름으로 쓴 곳이 없다',
    (file) => {
      const source = fs.readFileSync(path.join(ROOT, file), 'utf8')
      expect(source).not.toMatch(/희랑 공경순 개인전|길 \(Way\) 展/)
    }
  )
})

describe('페이지별 제목', () => {
  // 전시 페이지만은 2025 개인전 기록이라 전시 이름을 제목으로 쓴다.
  it('전시 페이지 제목은 지난 개인전 이름이다', async () => {
    const { metadata } = await import('@/app/exhibitions/gil/page')
    expect(metadata.title).toBe('2025 개인전 「길 道」')
  })

  it('문의 페이지 제목은 "문의" 다', async () => {
    const { metadata } = await import('@/app/contact/layout')
    expect(metadata.title).toBe('문의')
  })
})

describe('keepSeparatorWithPrevious', () => {
  it('NBSP 는 U+00A0 이다', () => {
    expect(NBSP.charCodeAt(0)).toBe(0xa0)
  })

  it('구분자 | 를 앞 단어에 붙여 줄 머리에 오지 않게 한다', () => {
    expect(keepSeparatorWithPrevious('2024 | 단체전 | 김포아트홀')).toBe(
      `2024${NBSP}| 단체전${NBSP}| 김포아트홀`
    )
  })

  it('구분자 앞뒤 공백이 여러 개여도 하나로 정리한다', () => {
    expect(keepSeparatorWithPrevious('2025  |   개인전')).toBe(
      `2025${NBSP}| 개인전`
    )
  })

  it('구분자가 없으면 그대로 둔다', () => {
    expect(keepSeparatorWithPrevious('일본 교토예술대학교 졸업 (2025)')).toBe(
      '일본 교토예술대학교 졸업 (2025)'
    )
  })
})
