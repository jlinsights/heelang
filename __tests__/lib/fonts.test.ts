import { readFileSync } from 'fs'
import path from 'path'

const read = (file: string) =>
  readFileSync(path.join(process.cwd(), file), 'utf8')

// 한글 웹 서체 두 벌이 페이지마다 750KB–1.2MB 라 휴대폰 첫 방문이 느렸다(2026-11 결정).
// 제목 명조(Noto Serif KR)만 웹 서체로 받고, 본문은 기기의 한글 고딕을 쓴다.
describe('서체 전달', () => {
  it('본문 고딕은 웹 서체로 받지 않는다', () => {
    const layout = read('app/layout.tsx')
    expect(layout).not.toMatch(/Noto_Sans_KR/)
    expect(layout).toMatch(/Noto_Serif_KR\(/)
  })

  it('본문 서체는 기기 한글 고딕으로 시작한다', () => {
    const body = read('tailwind.config.ts').match(/body:\s*\[([^\]]*)\]/)?.[1]
    expect(body).toBeDefined()
    expect(body).not.toMatch(/var\(--font-/)
    expect(body).toMatch(/^\s*'Apple SD Gothic Neo'/)
    expect(body).toMatch(/'Malgun Gothic'/)
    expect(body).toMatch(/'sans-serif'\s*$/)
  })
})
