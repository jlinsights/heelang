import { readFileSync } from 'fs'
import path from 'path'

// next/image 의 priority 는 미리 받기(<link rel=preload>)만 만들고 fetchpriority 를
// 붙이지 않는다. 그래서 첫 화면 작품 사진이 'Low' 로 요청돼, 휴대폰에서 제목 서체
// 파일(약 800KB, High)에 밀려 늦게 떴다(Lighthouse 작품 상세 LCP 4.6초).
// 첫 화면 사진은 priority 와 함께 fetchPriority='high' 를 직접 넘긴다.
const read = (file: string) =>
  readFileSync(path.join(process.cwd(), file), 'utf8')

// 파일 안의 <Image ...> 태그마다 priority 가 있으면 fetchPriority 도 있어야 한다
function priorityImages(src: string) {
  return [...src.matchAll(/<Image\b[\s\S]*?\/>/g)]
    .map((m) => m[0])
    .filter((tag) => /\bpriority\b/.test(tag))
}

describe('첫 화면 작품 사진의 요청 우선순위', () => {
  it.each([
    ['홈 대표 작품', 'components/home/home-hero.tsx', /fetchPriority='high'/],
    [
      '작품 상세 본 사진',
      'components/artwork-detail-modal-client.tsx',
      /fetchPriority='high'/,
    ],
    [
      '갤러리 첫 줄',
      'components/gallery/justified-grid.tsx',
      /fetchPriority=\{priority \? 'high' : undefined\}/,
    ],
  ])(
    '%s는 priority 와 함께 fetchPriority 를 높인다',
    (_name, file, expected) => {
      const tags = priorityImages(read(file))
      expect(tags.length).toBeGreaterThan(0)
      for (const tag of tags) expect(tag).toMatch(expected)
    }
  )
})
