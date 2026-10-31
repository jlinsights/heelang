# CLAUDE.md

> ⚠️ **AGENTS.md 와 쌍둥이 문서다.** 한쪽을 고치면 반드시 다른 쪽도 같이 고친다.

이 저장소에서 작업하는 에이전트(Claude Code 등)를 위한 안내.

## 프로젝트 개요

희랑 공경순(Kong Kyung Soon) 작가의 서예 개인전 「길 道 (Way)」 온라인 전시
사이트. Next.js App Router 기반이며, 작품·작가 정보는 Airtable 에서 읽고
실패하면 로컬 폴백 데이터를 쓴다.

**현재 수치는 문서에 옮겨 적지 않는다** (작품 수, 테스트 수, 페이지당 작품 수
등). 값이 필요하면 해당 파일이나 데이터를 직접 확인할 것 — 문서에 박힌 숫자는
반드시 낡는다.

## 개발 명령

```bash
# 개발
npm run dev              # localhost:3000
npm run dev:turbo        # Turbo 모드

# 빌드·배포
npm run build            # 프로덕션 빌드
npm run start            # 프로덕션 서버
npm run deploy           # Vercel 프로덕션 배포
npm run deploy:preview   # Vercel 프리뷰 배포

# 품질·테스트
npm run lint             # ESLint
npm run type-check       # tsc --noEmit
npm run test             # Jest
npm run test:watch
npm run test:coverage
npm run test:ci

# 에셋
npm run optimize-images     # 작품 이미지 최적화 (thumb/medium/large)
node scripts/image-ratios.js # 작품 이미지 픽셀 비율 → lib/gallery/image-ratios.json
```

- 셸 환경에 `NODE_ENV` 가 설정돼 있으면 `next build` 가 깨진다 →
  `env -u NODE_ENV npm run build`

## 아키텍처

### 기술 스택

- **Framework**: Next.js 15 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS + shadcn/ui. 색·서체는 시맨틱 토큰(`background`,
  `foreground`, `muted`, `border`, `ink`, `gold`, `font-display`)만 쓴다 — ASCA
  Ink System 토큰 동기화로 일괄 재스타일링할 수 있게
- **State**: React hooks, zustand v5 (`lib/store/ui-store.ts`)
- **CMS**: Airtable (`Artworks`, `Artist` 테이블)
- **Images**: `public/Images/` 로컬 파일 + next/image, sharp
- **Deploy**: Vercel, ISR (`revalidateTag('artworks')`)

### 디렉터리

```
HEELANG/
├── app/
│   ├── api/                 # Airtable 연동 API (artworks, artist, contact …)
│   ├── page.tsx             # 홈 — components/home/* 조립만 한다
│   ├── gallery/
│   │   ├── page.tsx         # 서버: Airtable 직접 조회(unstable_cache, 'artworks' 태그)
│   │   ├── gallery-client.tsx # 필터·정렬·보기 전환·페이지네이션
│   │   ├── loading.tsx      # 그리드와 같은 비율 상자 스켈레톤
│   │   └── [slug]/          # 작품 상세 (generateStaticParams, 이전/다음 계산)
│   ├── artist/ exhibition/ contact/ offline/
│   └── layout.tsx
├── components/
│   ├── home/                # home-hero(EXHIBITION 상수), home-sections, use-featured-artworks
│   ├── gallery/             # justified-grid, artwork-list, gallery-toolbar, gallery-pagination
│   ├── artwork/             # artwork-lightbox, use-image-ratio
│   ├── artwork-detail-modal-client.tsx # 작품 상세 본문(이미지 무대 + 캡션 표 + 다른 작품)
│   ├── art-navigation.tsx   # 상단 내비게이션 (NavigationSpacer 와 함께)
│   └── ui/                  # shadcn/ui
├── lib/
│   ├── airtable.ts          # Airtable → Artwork 매핑
│   ├── artworks.ts          # getArtworks() + fallbackArtworksData
│   ├── gallery/
│   │   ├── ordering.ts      # sortArtworks, filterArtworks, getNeighbors, ratioFromArtwork
│   │   └── image-ratios.json # 생성 파일 — 직접 편집하지 말 것
│   ├── image-utils.ts       # getArtworkImageUrl → /Images/Artworks/{year}/{slug}-medium.jpg
│   └── types.ts
├── scripts/                 # optimize-images.js, image-ratios.js, airtable 점검 스크립트
└── public/Images/           # Artworks/{year}/, Artist/
```

### 데이터

1. **Airtable** (`AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`) 이 기본 출처
2. **폴백**: `lib/artworks.ts` 의 `fallbackArtworksData` — Airtable 을 못 쓰면
   사용
3. **이미지**: `imageUrl` 은 Airtable 값이 아니라 `slug`·`year` 로 만든 로컬
   경로 (`-medium.jpg`). 크기별 파일은 `-thumb.jpg`, `-medium.jpg`, `-large.jpg`

⚠️ **서버 컴포넌트에서 자기 `/api/*` 를 HTTP 로 부르지 말 것.** 빌드 시점엔
서버가 없어 빈 목록이 정적 HTML 에 박힌다. 갤러리가 이 때문에 폴백 → 실데이터로
두 번 갈아 끼우며 레이아웃이 밀렸다(CLS). 서버에서는 `getArtworks()` 를 직접
부르고, 재검증이 필요하면 `unstable_cache(..., { tags: ['artworks'] })` 로
감싼다. (`lib/artworks.ts` 의 `fetchArtworksWithTag` 가 그 옛 방식이다.)

⚠️ **public/ 경로는 대소문자까지 정확히, 파일명은 URL-safe 하게.** macOS 는
대소문자를 무시해 로컬에서는 `/images/artist/…` 도 열리지만 Vercel(Linux)에서는
404 다(실제로 작가 사진이 운영에서 깨져 있었다). 폴더는 `public/Images/`. 또
`&`·공백이 든 파일명은 next/image 최적화기가 거부한다(로고가 alt 텍스트만
보였다). `__tests__/lib/public-asset-paths.test.ts` 가 둘 다 검사한다.

⚠️ **zustand v5**: 객체를 반환하는 selector 는 `useShallow` 로 감싸야 한다.
아니면 매 렌더 새 객체 → 무한 렌더 루프.

## 갤러리 레이아웃 원칙

- **작품을 자르지 않는다.** 서예 작품은 족자(세로로 긴)·횡액(가로로 긴)이 섞여
  있어 정사각 썸네일로 자르면 작품이 훼손된다. 항상 `object-contain`.
- **저스티파이드 그리드**(`components/gallery/justified-grid.tsx`): 각 타일
  `flex: {ratio} 1 calc(var(--row-h) * {ratio})` + `aspect-ratio`. CSS columns
  와 달리 화면 순서 = 읽기 순서 = Tab 순서가 유지된다.
- **비율 결정** — `ratioFromArtwork()`:
  1. `lib/gallery/image-ratios.json` 의 실제 픽셀 비율 (`[0.25, 4]` 로 제한)
  2. Airtable `aspectRatio` → `dimensions`("가로 x 세로") 순 추정. Airtable
     `aspectRatio` 는 `"?"`, `"70cm x 140cm"` 같은 깨진 값이 많다
  3. 그래도 틀리면 `useImageRatio` 가 이미지 로드 후 5% 넘게 다를 때만 교정
- 작품 이미지를 추가·교체하면 `node scripts/image-ratios.js` 를 다시 돌린다.
  `__tests__/lib/gallery/image-ratios.test.ts` 가 불일치 시 실패한다.
- 기본 정렬은 보물(treasure) 연작 우선. 이전/다음 작품은 이 기본 순서 기준.
- 페이지당 작품 수: `app/gallery/gallery-client.tsx` 의 `ARTWORKS_PER_PAGE`.

## 접근성

- **테마는 라이트가 기본.** OS 다크 설정을 따르지 않고, 사용자가 토글로 고른
  값만 `heelang-theme-choice` 에 저장한다(`components/simple-theme-toggle.tsx`).
  예전 `theme` 키는 첫 방문 때 자동 저장된 값이라 읽지 않는다.
- 홈 히어로는 자동 전환하지 않는다(WCAG 2.2.2 — 일시정지 컨트롤 불필요).
- 라이트박스: `role="dialog"`, `aria-modal`, Esc 닫기, 포커스 가두기, 닫으면
  포커스 복귀, 열린 동안 스크롤 잠금.
- 장식용 반복 애니메이션(`animate-bounce` 등)은 쓰지 않는다.

## 환경 변수

```bash
# Airtable (없으면 로컬 폴백 데이터)
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id

# 사이트 URL
NEXT_PUBLIC_SITE_URL=https://heelang.vercel.app

# 재검증 웹훅 보호 (선택)
REVALIDATE_SECRET=your_secret
```

## 테스트

- Jest + Testing Library, `__tests__/` 와 `*.test.tsx`
- 커버리지 목표: `jest.config.js` 의 threshold 참조
- Airtable 호출은 mock
- E2E·시각 회귀 테스트는 아직 없다. 레이아웃 변경은 실제 브라우저로 320·768·
  1024·1440 폭에서 가로 넘침과 CLS(layout-shift `sources`)를 확인한다.

## 자주 하는 작업

### 작품 추가

1. 최적화 이미지를 `public/Images/Artworks/{year}/` 에 추가
   (`npm run optimize-images`)
2. `node scripts/image-ratios.js` 로 비율 매니페스트 갱신
3. Airtable `Artworks` 테이블 또는 `lib/artworks.ts` 의 `fallbackArtworksData`
   수정
4. slug 규칙: `heelang-{title}-{year}`

### 스타일 변경

- `tailwind.config.ts`, `app/globals.css` — 새 색을 하드코딩하지 말고 시맨틱
  토큰 사용
- 테마: `components/theme-provider.tsx`

## 배포

- Vercel 팀 **goodman-ksways**(Pro) 의 `heelang` 프로젝트
  (https://vercel.com/goodman-ksways/heelang). 2026-10-31 개인 팀
  jlinsights-projects 에서 이관했다 — 프로젝트 ID 는 그대로다.
- `main` 푸시 = 프로덕션 배포(GitHub `jlinsights/heelang` 연동). CLI 는
  `--scope goodman-ksways` 로 쓰고, 처음 한 번 `vercel link --yes --team
  goodman-ksways --project heelang` 으로 연결한다(`.vercel/` 은 git 제외)
- 도메인: heelang.orientalcalligraphy.org, heelang.vercel.app
- 환경 변수는 Vercel 대시보드(Production·Preview·Development)에 설정.
  Airtable 키는 Production 에만 있어 Preview 배포는 로컬 폴백 데이터를 쓴다
- ISR: Airtable 웹훅이 `POST /api/revalidate` 에
  `{ "tag": "artworks", "secret": … }` 를 보내면 `revalidateTag('artworks')` 로
  갤러리 정적 페이지가 갱신된다 (`REVALIDATE_SECRET` 이 설정돼 있으면 secret
  일치 필요)
- 보안 헤더(CSP 등)는 `next.config.mjs`
