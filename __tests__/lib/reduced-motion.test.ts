import { readFileSync } from 'fs'
import path from 'path'

// 모션 감소 설정은 움직임만 없애고 상태 변화 신호(색·투명도 전환, 전송 중
// 스피너, 스켈레톤)는 남긴다. 예전 규칙은 모든 전환을 0.01ms 로 꺼 버렸다.
const css = readFileSync(path.join(process.cwd(), 'app/globals.css'), 'utf8')
const block = (() => {
  const start = css.indexOf('@media (prefers-reduced-motion: reduce)')
  expect(start).toBeGreaterThan(-1)
  // 중괄호 짝을 세어 미디어 쿼리 블록 전체를 잘라 낸다
  let depth = 0
  for (let i = css.indexOf('{', start); i < css.length; i++) {
    if (css[i] === '{') depth++
    if (css[i] === '}' && --depth === 0) return css.slice(start, i + 1)
  }
  throw new Error('reduced-motion 블록이 닫히지 않았다')
})()

describe('prefers-reduced-motion', () => {
  it('미디어 쿼리는 하나뿐이다', () => {
    expect(css.split('prefers-reduced-motion: reduce').length - 1).toBe(1)
  })

  it('전환을 전부 끄지 않고, 움직이지 않는 속성만 남긴다', () => {
    expect(block).not.toMatch(/transition-duration/)
    const props = block.match(/transition-property:([^!;]+)/)?.[1] ?? ''
    expect(props).toMatch(/\bopacity\b/)
    expect(props).toMatch(/\bcolor\b/)
    expect(props).not.toMatch(/transform|\ball\b|translate|scale/)
  })

  it('부드러운 스크롤을 끈다', () => {
    expect(block).toMatch(/html\s*{\s*scroll-behavior:\s*auto/)
  })

  it('진행 중 표시(스피너·스켈레톤)는 계속 돈다', () => {
    for (const cls of ['animate-spin', 'animate-pulse']) {
      expect(block).toMatch(
        new RegExp(
          `\\.${cls}\\s*{[^}]*animation-iteration-count:\\s*infinite\\s*!important`
        )
      )
    }
  })
})
