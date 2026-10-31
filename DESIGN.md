---
name: 희랑 공경순
description: 서예가 희랑 공경순의 상설 온라인 포트폴리오 — 작품이 원래 비율로 걸리는 조용한 전시실
colors:
  ink-black: "#1c1917"
  ink-slate: "#292524"
  paper-white: "#fdfcfa"
  warm-paper: "#f7f4ef"
  mist: "#f3f0ea"
  stone-gray: "#6b6560"
  hairline: "#e7e3dc"
  seal-gold: "#b8892c"
  night-ink: "#12100e"
  night-paper: "#f3f0ea"
  night-stone: "#a8a29a"
  night-hairline: "#2a2622"
  night-gold: "#d4a64a"
typography:
  display:
    fontFamily: "Noto Serif KR, serif"
    fontSize: "clamp(4.5rem, 14vw, 10rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.08em"
  headline:
    fontFamily: "Noto Serif KR, serif"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Noto Serif KR, serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Noto Sans KR, Apple SD Gothic Neo, Malgun Gothic, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Noto Sans KR, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0.24em"
  label-ko:
    fontFamily: "Noto Sans KR, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.55
    letterSpacing: "0.06em"
rounded:
  none: "0px"
  sm: "2px"
  card: "12px"
  pill: "9999px"
spacing:
  gutter-mobile: "16px"
  gutter-tablet: "24px"
  gutter-desktop: "32px"
  section-mobile: "48px"
  section-tablet: "96px"
  section-desktop: "128px"
components:
  button-primary:
    backgroundColor: "{colors.ink-black}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-quiet:
    textColor: "{colors.stone-gray}"
    padding: "4px 0"
  chip:
    textColor: "{colors.stone-gray}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  chip-active:
    backgroundColor: "{colors.ink-black}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  tag:
    textColor: "{colors.stone-gray}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  artwork-tile:
    rounded: "{rounded.none}"
  lightbox-close:
    textColor: "{colors.paper-white}"
    rounded: "{rounded.pill}"
    padding: "8px"
---

# Design System: 희랑 공경순

## Overview

**Creative North Star: "The Quiet Scroll Room"**

이 사이트는 조용한 전시실이다. 흰 벽(종이색 배경) 위에 먹빛 글자가 놓이고,
작품은 족자든 횡액이든 원래 비율 그대로 걸린다. 인터페이스는 관람객과 작품
사이에서 한 걸음 물러선다. 장식은 작품이 하고, 화면은 캡션·여백·정렬로만
말한다.

밀도는 낮다. 한 화면에 하나의 주인공(작품 또는 제목)을 두고, 나머지는 작은
회색 캡션과 넓은 여백으로 받친다. 색은 거의 흑백이며, 금빛은 낙관(인장)처럼
드물게 찍힌다. 깊이는 작품에만 있다 — 벽에서 살짝 떠 있는 족자처럼 작품만
그림자를 갖고, UI 면은 평평하다.

라이트(흰 벽)가 기본이고 다크(밤의 전시실)는 선택이다. 다크는 같은 역할의
색을 뒤집은 것이며, 별도의 세계가 아니다.

**Key Characteristics:**
- 작품은 자르지 않는다 — 항상 원래 비율, `object-contain`
- 명조(Noto Serif KR) 제목 + 고딕(Noto Sans KR) 본문, 같은 Noto 계열
- 거의 흑백, 금빛은 가는 선과 표식에만
- 평평한 UI, 그림자는 작품에만
- 버튼·칩은 알약 모양, 작품 타일은 직각

## Colors

따뜻한 먹(sumi)과 한지 위에 인장 같은 금빛 하나. 무채색은 모두 같은 따뜻한
축(색상각 약 25–40°, 채도 낮음)에 있어 작품이 놓인 한지와 이어진다. 값은
`app/globals.css` 의 HSL 토큰이 원본이며(ASCA Ink System 동기화 시 이 토큰을
다시 매핑한다), 시맨틱 토큰(`background`, `foreground`, `muted`, `border`,
`ink`, `gold`)으로만 쓴다.

### Primary
- **Ink Black** (`ink-black`): 본문 글자, 제목, 주 버튼 배경, 선택된 칩.
  화면에서 가장 진한 값이며 작품 속 먹과 같은 역할을 한다. 순흑이 아니라
  붉은 기가 아주 조금 도는 따뜻한 먹.
- **Ink Slate** (`ink-slate`): `ink` 토큰. 내비게이션 활성 상태와 푸터
  배경 등 먹빛 면.

### Secondary
- **Seal Gold** (`seal-gold`): 히어로 제목 아래 가는 선, 작가 노트 왼쪽
  테두리, 보기 방식 밑줄, 판매 가능 표시 점. 선과 점으로만 쓴다. 채도를 낮춘
  고금(古金)색이라 종이 위에서 선이 3:1 로 보인다.

### Neutral
- **Paper White** (`paper-white`): 기본 배경, 전시실의 벽. 순백보다 아주 조금
  따뜻해 작품 사진의 한지 바탕과 부딪히지 않는다.
- **Warm Paper** (`warm-paper`): 내비게이션 hover·활성 배경 같은 아주 옅은 면.
- **Mist** (`mist`): 스켈레톤, 작품 무대 뒤 옅은 면(`muted`).
- **Stone Gray** (`stone-gray`): 캡션, 메타데이터(연도·재료), 보조 링크,
  섹션 머리표. 종이 배경에서 5.6:1.
- **Hairline** (`hairline`): 칩 테두리, 구분선.
- **Night Ink / Night Paper / Night Stone / Night Hairline**: 다크 테마(밤의
  전시실)의 배경, 글자, 보조 글자(7.5:1), 구분선. 다크도 같은 따뜻한 축이다.
- **Night Gold** (`night-gold`): 다크 테마의 금빛. 어두운 배경에서 밝게 올린다.

### Named Rules
**The Seal Rule.** 금빛은 인장이다. 1–2px 선, 8px 이하 점, 밑줄에만 쓴다.
면을 채우거나 글자색·버튼 배경으로 쓰지 않는다.

**The Ink-on-Paper Rule.** 새 색을 들이지 않는다. 의미가 필요하면 먹의
농담(검정→회색)으로 위계를 만든다. 브랜드색 하드코딩(`text-pink-500` 등)은
쓰지 않는다.

**The Contrast Floor Rule.** 글자는 배경과 4.5:1 이상. 가장 옅은 글자 토큰
`ink-lighter` 도 종이 위 4.7:1(다크 5.4:1)로 맞춰 두었다. 먹색 면(푸터) 위
글자는 회색 토큰이 아니라 `paper` 의 불투명도(75%)로 만든다.

**The Warm Axis Rule.** 새 무채색을 들일 때 차가운 회색(slate·gray·zinc)을
쓰지 않는다. 기존 토큰 축 위에서 명도만 바꾼다.

## Typography

**Display Font:** Noto Serif KR (with serif)
**Body Font:** Noto Sans KR (with Apple SD Gothic Neo, Malgun Gothic)

**Character:** 명조는 붓의 끝맺음을 닮은 목소리로 제목만 맡고, 고딕은 캡션과
본문을 조용히 받친다. 같은 Noto 계열이라 한글 자형의 골격이 맞는다.

### Hierarchy
- **Display** (700, clamp(4.5rem, 14vw, 10rem), 1): 전시 제목 「길 道」처럼
  사이트 전체에 하나뿐인 표제. 글자 사이를 0.08em 벌려 두 글자를 따로 세운다.
- **Headline** (400, 3rem / 모바일 1.875rem, 1.3): 섹션 제목(대표 작품, 작가,
  전시)과 페이지 제목. 굵게 쓰지 않는다.
- **Title** (400, 1.875rem → md 3rem, 1.25): 작품 상세의 작품명.
- **Body** (400, 1rem, 1.7): 작품 설명, 작가 소개. 한글 기준 한 줄 30–40자.
- **Label** (400, 0.8125rem, 0.24em, 대문자): 라틴 섹션 머리표
  (`Featured Works`, `Gallery`). `.text-eyebrow`.
- **Label KO** (500, 0.8125rem, 0.06em): 한글 머리표(작가명, 작가 노트).
  `.text-eyebrow-ko`.

### Named Rules
**The Keep-All Rule.** 한글은 어절 단위로 줄바꿈한다(`word-break: keep-all`).
제목은 `text-wrap: balance`, 문단은 `pretty`.

**The Latin-Only Tracking Rule.** 넓은 자간(0.2em 이상)은 라틴 대문자에만
쓴다. 한글에 넓은 자간을 주면 글자가 흩어져 읽힌다.

**The Quiet Headline Rule.** 명조 제목은 400(많아야 500). 700은 Display
하나만 쓴다.

## Layout

- **컨테이너:** 최대 폭 80rem(`max-w-7xl`), 좌우 여백 16 → 24 → 32px
  (`container-art`).
- **섹션 리듬:** 위아래 여백 48px(모바일) → 96px(md) → 128px(lg)
  (`section-padding`).
- **히어로:** 화면 높이(`100svh`)에서 내비게이션을 뺀 높이, md 이상 2단
  (글 1.1fr : 작품 1fr). 모바일은 가운데 정렬 1단.
- **갤러리:** 저스티파이드 그리드 — 행 높이를 맞추고 각 타일은 작품의 실제
  비율 폭을 가진다. 화면 순서 = 읽기 순서 = Tab 순서. 목록 보기는 80px 썸네일
  + 캡션.
- **작품 상세:** 큰 화면에서 고정 이미지 무대(화면 높이 - 8rem) + 오른쪽 캡션
  표. 모바일은 위아래로 쌓는다.
- 320–1440px 어느 폭에서도 가로 스크롤이 생기지 않아야 한다.

## Elevation & Depth

UI 는 평평하다. 내비게이션은 반투명 흰 면 + 흐림(backdrop-blur) + 가는
아래선으로만 떠 있고, 칩·버튼·목록은 그림자가 없다. 그림자는 작품에만 있다.

홈 히어로 뒤에는 대표 작품 자체를 크게 흐려(blur 64px, 125% 확대, 불투명도
40%) 깐다. 장식이 아니라 그 작품의 먹빛이 벽에 번진 공기이며, 스크린 리더에는
숨긴다(`aria-hidden`). 다른 표면에 이 기법을 쓸 때도 반드시 그 화면의 실제
작품에서 가져온다.

### Shadow Vocabulary
- **Hung Scroll** (`box-shadow: 0 30px 60px -30px rgba(0,0,0,0.45)`): 홈
  히어로 대표 작품. 벽에서 살짝 떨어진 족자.
- **Stage Drop** (`filter: drop-shadow(0 24px 40px rgba(0,0,0,0.25))`): 작품
  상세 이미지. 투명 여백이 있는 작품도 윤곽을 따라 그림자가 진다.

### Named Rules
**The Lifted Artwork Rule.** 그림자는 작품 이미지에만 준다. 카드·패널·버튼에
`shadow-soft`/`medium`/`strong` 을 새로 쓰지 않는다(옛 컴포넌트에 남아 있는
것은 정리 대상).

## Shapes

- **작품 타일과 작품 이미지:** 직각(0, 포커스 링을 위해 타일 링크만 2px).
  작품의 가장자리는 종이의 가장자리다.
- **버튼·칩·태그·페이지 번호:** 알약 모양(완전한 둥근 끝).
- **shadcn 기반 카드·대화상자:** 12px(`--radius: 0.75rem`). 새 화면에서는
  카드보다 여백과 구분선으로 묶는 쪽을 먼저 고른다.
- 장식용 그라디언트(`--gradient-zen` 등)는 옛 내비게이션에만 남아 있다. 새
  표면에서 쓰지 않는다.

## Components

### Buttons
조용하고 단단하다. 하나의 주 행동만 먹색 알약으로 둔다.
- **Shape:** 알약(9999px).
- **Primary:** 먹색 배경, 흰 글자, 14px 500, 위아래 12px 좌우 24px.
  "작품 보기", "작품 문의하기".
- **Hover / Focus:** hover 는 불투명도 85%. 포커스는 먹색 2px 링 + 배경색
  간격(`focus-art`).
- **Quiet:** 회색 글자 링크 + 화살표("전시 안내", "작가 소개 더보기").
  hover 에서 먹색, 화살표가 2px 오른쪽으로.

### Chips
- **Style:** 가는 회색 테두리, 회색 글자, 14px, 알약. 옆에 숫자(작품 수)를
  흐리게.
- **State:** 선택되면 먹색 배경 + 흰 글자(`aria-pressed`). 태그 칩은 13px,
  위아래 4px 로 한 단계 작다.

### Cards / Containers
- 작품은 카드에 담지 않는다. 타일 자체가 작품이고 캡션은 그 아래 글자로만.
- 작가 소개처럼 묶음이 필요하면 구분선과 여백으로 나눈다.

### Navigation
- **Style:** 상단 고정, 반투명 흰 면 + 흐림 + 가는 아래선. 왼쪽 로고, 오른쪽
  메뉴 5개(홈·갤러리·작가·전시·문의) + 테마 토글.
- **States:** 기본 회색 글자, hover·활성은 먹색 글자 + 옅은 종이 배경.
- **Mobile:** 메뉴 버튼 → 오른쪽에서 열리는 시트(320px).

### Artwork Tile (signature)
저스티파이드 그리드의 한 칸. 작품의 실제 비율 상자 + 아래 캡션(명조 제목,
고딕 연도·재료). hover 는 이미지가 아니라 캡션 쪽 변화로만 반응한다. 이미지에
확대·자르기 효과를 주지 않는다.

### Lightbox (signature)
검정 90% 배경 위 작품 전체 화면(`object-contain`), 오른쪽 위 흰 닫기 버튼.
Esc 로 닫고, 포커스를 가두고, 닫으면 원래 자리로 포커스를 돌려준다.

### Caption Table
작품 상세의 정보 표(제작 연도, 크기, 재료 등). 왼쪽 회색 라벨, 오른쪽 먹색
값, 숫자는 같은 폭 숫자(`tabular-nums`).

## Do's and Don'ts

### Do:
- **Do** 작품을 항상 원래 비율로 보여 준다(`object-contain`, 비율은
  `lib/gallery/image-ratios.json`).
- **Do** 색은 시맨틱 토큰(`foreground`, `muted-foreground`, `border`, `gold`)
  으로만 쓴다.
- **Do** 금빛은 1–2px 선과 작은 점에만 쓴다(The Seal Rule).
- **Do** 한글 머리표는 `.text-eyebrow-ko`, 라틴 대문자 머리표는
  `.text-eyebrow` 를 쓴다.
- **Do** 새 화면을 라이트와 다크 둘 다에서 대비 4.5:1 이상으로 확인한다.

### Don't:
- **Don't** 작품을 정사각 썸네일로 자르거나 hover 에서 확대하지 않는다.
- **Don't** 명조 제목을 700 으로 쓰지 않는다(Display 하나만 예외).
- **Don't** 한글에 0.2em 이상의 자간을 주지 않는다.
- **Don't** 카드·버튼·패널에 그림자를 새로 주지 않는다. 그림자는 작품 몫이다.
- **Don't** 금빛·분홍·보라 같은 색을 면이나 글자색으로 들이지 않는다.
- **Don't** 장식용 그라디언트나 반복 애니메이션(`animate-bounce` 등)을 쓰지
  않는다.
