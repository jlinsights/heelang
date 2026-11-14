import { readFileSync } from 'fs'
import path from 'path'

// 「 는 전각 문장부호라 글자 상자의 왼쪽 절반이 빈다. 제목 맨 앞에 오면 위 라벨보다
// 반 글자 들어가 보이므로, 첫 괄호만 반 글자 내어 단다.
describe('제목 맨 앞의 「', () => {
  it('「길 道」 전시 기록 제목은 첫 괄호를 반 글자 내어 단다', () => {
    const src = readFileSync(
      path.join(process.cwd(), 'app/exhibitions/gil/page.tsx'),
      'utf8'
    )
    const h1 = src.slice(src.indexOf('<h1'), src.indexOf('</h1>'))
    expect(h1).toMatch(/<span className='-ml-\[0\.5em\]'>「<\/span>/)
  })
})
