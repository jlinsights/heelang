import fs from 'fs'
import path from 'path'

// next/cache 는 jsdom 에서 불러올 수 없다(TextEncoder 없음). 페이지 metadata 만 읽으면 된다.
jest.mock('next/cache', () => ({
  unstable_cache: <T>(fn: T) => fn,
}))
jest.mock('@/lib/airtable', () => ({ fetchArtistFromAirtable: jest.fn() }))

// 2025 개인전 페이지가 /exhibition → /exhibitions/gil 로 옮겨갔다.
// 옛 주소로 가는 링크가 남거나 리다이렉트가 사라지면 실패한다.
const ROOT = path.resolve(__dirname, '../..')
const read = (file: string) => fs.readFileSync(path.join(ROOT, file), 'utf8')

const LINK_FILES = [
  'components/art-navigation.tsx',
  'components/home/home-hero.tsx',
  'components/home/home-sections.tsx',
  'lib/constants.ts',
  'app/layout.tsx',
]

describe('전시 페이지 주소', () => {
  it.each(LINK_FILES)('%s 에 옛 주소 /exhibition 링크가 없다', (file) => {
    expect(read(file)).not.toMatch(/\/exhibition(?![s\w])/)
  })

  it('옛 주소 /exhibition 은 /exhibitions/gil 로 영구 이동한다', () => {
    const config = read('next.config.mjs')
    expect(config).toMatch(
      /source:\s*'\/exhibition',\s*destination:\s*'\/exhibitions\/gil',\s*permanent:\s*true/
    )
  })

  it('메뉴의 "전시" 는 아카이브로 간다', () => {
    expect(read('components/art-navigation.tsx')).toMatch(
      /href: '\/exhibitions',/
    )
    expect(read('lib/constants.ts')).toMatch(/href: '\/exhibitions' \}/)
  })

  // 히어로는 작가가 주인공이라 전시 링크를 두지 않는다 — 홈 '전시' 섹션이 맡는다.
  it('홈의 전시 섹션 링크는 2025 개인전 기록으로 간다', () => {
    expect(read('components/home/home-sections.tsx')).toMatch(
      /href='\/exhibitions\/gil'/
    )
  })

  it('아카이브 페이지 제목은 "전시" 다', async () => {
    const { metadata } = await import('@/app/exhibitions/page')
    expect(metadata.title).toBe('전시')
  })
})
