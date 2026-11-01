import fs from 'fs'
import path from 'path'

// 푸터 저작권은 작가 이름으로 쓴다. 협회(ASCA) 이름으로 되돌아오면 안 된다.
// 포매터가 긴 줄을 나누므로 공백을 하나로 모아 비교한다
const layout = fs
  .readFileSync(path.resolve(__dirname, '../../app/layout.tsx'), 'utf8')
  .replace(/\s+/g, ' ')

describe('푸터 저작권', () => {
  it('작가 이름과 작품 이미지 저작권 안내를 쓴다', () => {
    expect(layout).toContain(
      '© {new Date().getFullYear()} {SITE_NAME}. 작품 이미지의 저작권은 작가에게 있습니다.'
    )
  })

  it('협회 이름을 저작권자로 쓰지 않는다', () => {
    expect(layout).not.toMatch(/©[^<]*ASCA/)
  })
})
