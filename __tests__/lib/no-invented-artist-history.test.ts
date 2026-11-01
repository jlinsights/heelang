import fs from 'fs'
import path from 'path'

// 작가 이력(전시·수상·소장)은 Airtable Artist 레코드가 출처다. 코드 안에 지어낸 이력을
// 폴백으로 두면 Airtable 이 실패할 때 사실이 아닌 이력이 화면에 나간다 (2026-10-31 정리).
const ROOT = path.resolve(__dirname, '../..')
const SOURCE_DIRS = ['app', 'components', 'lib']

// 실제로 코드에 있던 지어낸 항목들. Airtable 에는 없는 전시·소장처다.
const INVENTED = [
  '먹의 향기',
  '묵향의 현재',
  '전통과 혁신',
  '한국 현대 서예전',
  '인사동 한국미술관 영구소장',
  '제주민속촌 미술관 소장',
  '김포시립미술관 소장',
  '동아미술제 특선',
  // app/api/artist 폴백에 있던 지어낸 소개·이력 (2026-11-01 삭제)
  '새로운 지평',
  '개인전 다수',
]

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(full)
    return /\.(ts|tsx)$/.test(entry.name) ? [full] : []
  })
}

describe('지어낸 작가 이력', () => {
  const files = SOURCE_DIRS.flatMap((dir) => sourceFiles(path.join(ROOT, dir)))

  it('검사할 소스 파일이 있다', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  it.each(INVENTED)('"%s" 가 소스에 없다', (phrase) => {
    const hits = files
      .filter((file) => fs.readFileSync(file, 'utf8').includes(phrase))
      .map((file) => path.relative(ROOT, file))
    expect(hits).toEqual([])
  })
})
