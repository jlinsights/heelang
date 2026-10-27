/**
 * @jest-environment node
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { readImageRatios } = require('../../../scripts/image-ratios')
import manifest from '@/lib/gallery/image-ratios.json'
import { ratioFromArtwork } from '@/lib/gallery/ordering'

describe('image-ratios.json', () => {
  // 작품 이미지를 추가·교체했는데 매니페스트를 다시 만들지 않으면 여기서 실패한다
  it('public/ 의 실제 이미지 픽셀 비율과 일치한다 (node scripts/image-ratios.js 로 갱신)', async () => {
    expect(manifest).toEqual(await readImageRatios())
  })
})

describe('ratioFromArtwork + 매니페스트', () => {
  const [path, ratio] = Object.entries(manifest as Record<string, number>)[0]

  it('imageUrl 이 매니페스트에 있으면 데이터 값보다 실제 픽셀 비율을 우선한다', () => {
    expect(
      ratioFromArtwork({
        imageUrl: path,
        aspectRatio: '?',
        dimensions: '70cm x 140cm',
      })
    ).toBe(ratio)
  })

  it('매니페스트에 없는 이미지는 기존 추정 순서를 따른다', () => {
    expect(
      ratioFromArtwork({
        imageUrl: '/Images/none.jpg',
        aspectRatio: '2/3',
        dimensions: '',
      })
    ).toBeCloseTo(2 / 3)
  })
})
