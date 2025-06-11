# 🎨 희랑 공경순 개인전 | 길 (Way) 展

> **"길"**을 주제로 한 공경순 작가의 현대 서예 작품 온라인 전시관

현대 서예의 아름다움과 철학을 온라인으로 감상할 수 있는 디지털 갤러리입니다.

## ✨ 주요 기능

- 🎨 **작품 갤러리**: 25점의 서예 작품을 4x3 그리드로 구성된 페이지네이션으로 감상
- 🔍 **작품 검색**: 제목, 년도, 재료별 실시간 검색 및 필터링
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- ⌨️ **키보드 네비게이션**: 접근성을 고려한 키보드 조작 지원
- 🌙 **다크/라이트 테마**: 사용자 환경에 맞는 테마 선택
- 🚀 **Progressive Web App**: 모바일 앱처럼 사용 가능

## 🚀 라이브 사이트

**배포 URL**: [https://heelang.vercel.app](https://heelang.vercel.app)

[![Powered by Vercel](https://img.shields.io/badge/Powered%20by-Vercel-black)](https://vercel.com)

## 🛠 기술 스택

- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React 19 Hooks
- **Build Tool**: Turbopack
- **Deployment**: Vercel
- **Testing**: Jest + Testing Library

## 📱 갤러리 레이아웃

### 반응형 그리드 시스템
- **데스크톱 (1024px+)**: 4열 × 3행 = 12개 작품
- **태블릿 (768px-1023px)**: 3열 × 4행 = 12개 작품  
- **모바일 (~767px)**: 2열 × 6행 = 12개 작품

### 페이지네이션
- 페이지당 12개 작품 표시
- 직관적인 이전/다음 버튼
- 페이지 번호 네비게이션 (최대 5개)
- 전체 작품 수 및 현재 위치 정보

## 📁 프로젝트 구조

```
HEELANG/
├── app/                   # App Router 구조
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 페이지
│   ├── gallery/           # 갤러리 섹션
│   │   ├── page.tsx       # 갤러리 메인
│   │   ├── gallery-client.tsx # 클라이언트 컴포넌트
│   │   ├── loading.tsx    # 로딩 UI
│   │   └── [slug]/        # 개별 작품 페이지
│   ├── artists/           # 작가 소개
│   ├── exhibition/        # 전시 정보
│   ├── contact/           # 연락처
│   └── offline/           # 오프라인 페이지
├── components/            # 재사용 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── animations/       # 애니메이션 컴포넌트
│   ├── optimized-image.tsx # 최적화된 이미지
│   ├── search-filter.tsx # 검색 필터
│   └── theme-toggle.tsx  # 테마 토글
├── lib/                  # 유틸리티 및 데이터
│   ├── artworks.ts       # 작품 데이터
│   ├── utils.ts          # 공통 유틸리티
│   └── types.ts          # 타입 정의
├── styles/               # 스타일 파일
├── public/               # 정적 자산
│   ├── images/           # 작품 이미지
│   └── icons/            # 아이콘
└── scripts/              # 빌드 스크립트
    └── optimize-images.js # 이미지 최적화
```

## 🏃‍♂️ 로컬 개발

### 시작하기

```bash
# 저장소 클론
git clone https://github.com/jlinsights/HEELANG.git
cd HEELANG

# 의존성 설치
npm install

# 개발 서버 실행 (localhost:3000)
npm run dev
```

### 개발 명령어

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버
npm start

# 린팅
npm run lint

# 테스트 실행
npm test

# 테스트 (watch 모드)
npm run test:watch

# 커버리지 확인
npm run test:coverage

# 이미지 최적화
npm run optimize-images
```

### 배포 명령어

```bash
# Vercel 프로덕션 배포
npm run deploy

# Vercel 프리뷰 배포
npm run deploy:preview
```

## 🎯 페이지별 기능

### 메인 페이지 (`/`)
- 전시 소개 및 컨셉
- 주요 작품 하이라이트
- 전시 정보 요약
- 갤러리 바로가기

### 갤러리 (`/gallery`)
- **4x3 그리드 레이아웃**: 한 페이지에 12개 작품
- **실시간 검색**: 제목, 년도, 재료별 필터링
- **키보드 네비게이션**: 화살표 키로 작품 탐색
- **페이지네이션**: 전체 작품을 페이지별로 구성

### 작품 상세 (`/gallery/[slug]`)
- 고해상도 작품 이미지
- 상세 작품 정보 (제목, 년도, 재료, 크기)
- 작가 노트 및 작품 해설
- 이전/다음 작품 네비게이션

### 작가 소개 (`/artists`)
- 공경순 작가 프로필
- 전시 경력 및 수상 내역
- 작가의 서예 철학

### 전시 정보 (`/exhibition`)
- 전시 개요 및 기획 의도
- 후원 기관 정보
- 전시 일정 및 관련 행사

## 🎨 작품 컬렉션

총 **25점**의 서예 작품으로 구성:

- **주제**: "길(Way)"의 다양한 해석
- **장르**: 현대 서예, 전통 서예
- **재료**: 지본채색, 지본묵서, 견본채색 등
- **크기**: 다양한 규격의 작품들

## 🌟 주요 특징

### 성능 최적화
- **Next.js App Router**: 최신 React 19 기능 활용
- **이미지 최적화**: 자동 WebP 변환 및 레이지 로딩
- **번들 분석**: @next/bundle-analyzer로 성능 모니터링
- **Vercel Edge**: 전 세계 CDN을 통한 빠른 로딩

### 접근성 (Accessibility)
- **WCAG 2.1 AA 준수**: 스크린 리더 지원
- **키보드 네비게이션**: 모든 기능을 키보드로 조작 가능
- **고대비 모드**: 시각 장애인을 위한 테마
- **의미론적 HTML**: 검색 엔진 최적화

### 사용자 경험 (UX)
- **Progressive Web App**: 모바일 앱처럼 설치 가능
- **오프라인 지원**: 네트워크 없이도 기본 탐색 가능
- **부드러운 애니메이션**: Framer Motion을 활용한 자연스러운 전환
- **직관적 UI**: 미니멀한 디자인으로 작품에 집중

## 🔧 개발자를 위한 정보

### 기술적 특징
- **TypeScript 5**: 완전한 타입 안정성
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **Radix UI**: 헤드리스 UI 컴포넌트
- **React 19**: 최신 React 기능 활용
- **ESLint + Prettier**: 코드 품질 관리

### 테스트
- **Unit Tests**: Jest + Testing Library
- **Component Tests**: React 컴포넌트 테스트
- **E2E Tests**: 사용자 시나리오 테스트
- **Visual Regression**: 스크린샷 기반 테스트

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🙏 후원 및 지원

**주최**: 희랑 공경순  
**후원**: 사단법인 동양서예협회

---

> 🎨 **"길"이라는 주제를 통해 현대 서예의 아름다움과 철학을 전 세계와 공유합니다** 🌍

[![Korean Calligraphy](https://img.shields.io/badge/Korean-Calligraphy-red)](https://github.com/jlinsights/HEELANG)
[![Modern Art](https://img.shields.io/badge/Modern-Art-blue)](https://github.com/jlinsights/HEELANG)
[![Digital Gallery](https://img.shields.io/badge/Digital-Gallery-green)](https://github.com/jlinsights/HEELANG)
