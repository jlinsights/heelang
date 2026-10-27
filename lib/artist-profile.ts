// 홈 '작가' 섹션과 작품 상세의 작가 소개가 같은 문장·사진을 쓰도록 한곳에 둔다.
// 경로는 대소문자까지 public/ 과 같아야 한다 (Vercel 은 Linux — __tests__/lib/public-asset-paths.test.ts)
export const ARTIST_PROFILE = {
  name: '희랑 공경순',
  intro:
    '전통 서예의 깊이와 현대적 감각을 조화시키며, 문방사우의 정신을 현대에 되살리는 작업을 하고 있습니다.',
  portraitUrl: '/Images/Artist/artist-medium.jpg',
} as const

export const BRUSHWAYS = {
  name: '현대서예 작가그룹 브러시웨이즈',
  url: 'https://brushways.org',
} as const
