import fs from 'fs'
import path from 'path'
import { SITE_NAME } from '@/lib/site'

// 화면 문구 규칙 (COPY.md). 보조용언은 띄어 쓰고, 설치 앱 이름은 사이트 이름과 같다.
const ROOT = path.resolve(__dirname, '../..')
const UI_DIRS = ['app', 'components']

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(full)
    return /\.(ts|tsx)$/.test(entry.name) ? [full] : []
  })
}

const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), 'utf8')

describe('화면 문구 규칙', () => {
  const files = UI_DIRS.flatMap((dir) => sourceFiles(path.join(ROOT, dir)))

  it.each(['해주세요', '해보세요'])('"%s" 를 붙여 쓰지 않는다', (phrase) => {
    const hits = files
      .filter((file) => fs.readFileSync(file, 'utf8').includes(phrase))
      .map((file) => path.relative(ROOT, file))
    expect(hits).toEqual([])
  })

  it('설치 앱 이름은 사이트 이름이다', () => {
    const manifest = JSON.parse(read('public/manifest.json'))
    expect(manifest.name).toBe(SITE_NAME)
    expect(read('app/layout.tsx')).not.toContain('묵향 서예전')
  })

  it('끝난 전시 이름을 앱 이름·설명에 쓰지 않는다', () => {
    const manifest = JSON.parse(read('public/manifest.json'))
    expect(
      `${manifest.name} ${manifest.short_name} ${manifest.description}`
    ).not.toMatch(/길|전시/)
  })
})
