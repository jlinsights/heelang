import { isInsideContainedImage } from '@/components/artwork/artwork-lightbox'

// 1000×800 상자에 세로로 긴 족자(1:4)를 object-contain 으로 그리면
// 높이 800, 너비 200 → 가로 400~600 에만 그림이 있다
const box = { left: 0, top: 0, width: 1000, height: 800 }
const scroll = { width: 500, height: 2000 }

describe('isInsideContainedImage', () => {
  it('작품 위의 점은 안쪽이다', () => {
    expect(isInsideContainedImage({ x: 500, y: 400 }, box, scroll)).toBe(true)
  })

  it('좌우 여백(레터박스)의 점은 바깥이다', () => {
    expect(isInsideContainedImage({ x: 100, y: 400 }, box, scroll)).toBe(false)
    expect(isInsideContainedImage({ x: 900, y: 400 }, box, scroll)).toBe(false)
  })

  it('가로로 긴 작품은 위아래 여백이 바깥이다', () => {
    const wide = { width: 4000, height: 1000 } // 1000×250, 세로 275~525
    expect(isInsideContainedImage({ x: 500, y: 100 }, box, wide)).toBe(false)
    expect(isInsideContainedImage({ x: 500, y: 400 }, box, wide)).toBe(true)
  })

  it('원본 크기를 모르면 닫지 않도록 안쪽으로 본다', () => {
    expect(
      isInsideContainedImage({ x: 10, y: 10 }, box, { width: 0, height: 0 })
    ).toBe(true)
  })
})
