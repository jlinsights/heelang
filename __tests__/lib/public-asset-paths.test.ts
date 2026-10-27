/**
 * @jest-environment node
 */
import fs from 'fs'
import path from 'path'

// macOS 파일시스템은 대소문자를 구분하지 않아 로컬에서는 '/images/artist/…' 도 열리지만,
// Vercel(Linux)에서는 404 가 난다 (2026-10-27 운영에서 작가 사진이 깨져 있었음).
// fs.existsSync 도 대소문자를 무시하므로, 경로를 한 단계씩 readdir 결과와 정확히 비교한다.

const ROOT = path.join(__dirname, '..', '..')
const PUBLIC_DIR = path.join(ROOT, 'public')
const SOURCE_DIRS = ['app', 'components', 'lib']
// 공백·& 가 든 경로도 잡아야 하므로 문자 클래스에 공백을 허용한다 (아래에서 따로 금지)
const ASSET_PATH =
  /['"`](\/(?:images|logos)\/[^'"`$\n]+?\.(?:jpe?g|png|webp|avif|svg))['"`]/gi

function existsWithExactCase(relativePath: string): boolean {
  let dir = PUBLIC_DIR
  for (const segment of relativePath.split('/').filter(Boolean)) {
    if (!fs.existsSync(dir) || !fs.readdirSync(dir).includes(segment))
      return false
    dir = path.join(dir, segment)
  }
  return true
}

function listSourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return listSourceFiles(full)
    return /\.(ts|tsx|js)$/.test(entry.name) ? [full] : []
  })
}

describe('public/ 이미지 경로', () => {
  const references = SOURCE_DIRS.flatMap((dir) =>
    listSourceFiles(path.join(ROOT, dir)).flatMap((file) =>
      [...fs.readFileSync(file, 'utf8').matchAll(ASSET_PATH)].map((m) => ({
        file: path.relative(ROOT, file),
        asset: m[1],
      }))
    )
  )

  it('코드에 적힌 이미지 경로가 있다 (검사 대상이 비어 있지 않음)', () => {
    expect(references.length).toBeGreaterThan(0)
  })

  it('모든 이미지 경로가 대소문자까지 정확히 실제 파일과 일치한다', () => {
    const missing = references.filter(
      ({ asset }) => !existsWithExactCase(asset)
    )
    expect(missing).toEqual([])
  })

  // next/image 최적화기(/_next/image)는 '&'·공백이 든 경로를 "isn't a valid image" 로
  // 거부한다 → 로고가 alt 텍스트만 보였다 (2026-10-27). 파일명은 URL-safe 하게.
  it('이미지 경로에 공백이나 & 가 없다', () => {
    const unsafe = references.filter(({ asset }) => /[\s&]/.test(asset))
    expect(unsafe).toEqual([])
  })
})
