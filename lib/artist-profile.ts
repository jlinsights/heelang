// 홈 '작가' 섹션과 작품 상세의 작가 소개가 같은 문장·사진을 쓰도록 한곳에 둔다.
// 경로는 대소문자까지 public/ 과 같아야 한다 (Vercel 은 Linux — __tests__/lib/public-asset-paths.test.ts)
export const ARTIST_PROFILE = {
  name: '희랑 공경순',
  hanja: '熙勆 孔慶順',
  // 홈 첫 화면 한 줄 소개. Airtable 작가 소개("전통 서예의 정신을 계승하면서도 현대적인
  // 미감을 탐구하며")에서 가져온 문장이다 — 새 수식어를 지어 붙이지 않는다.
  tagline: '전통 서예의 정신을 계승하며 현대적인 미감을 탐구하는 서예가',
  intro:
    '전통 서예의 깊이와 현대적 감각을 조화시키며, 문방사우의 정신을 현대에 되살리는 작업을 하고 있습니다.',
  portraitUrl: '/Images/Artist/artist-medium.jpg',
} as const

export const BRUSHWAYS = {
  name: '현대서예 작가그룹 브러시웨이즈',
  url: 'https://brushways.org',
} as const
