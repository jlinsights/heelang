# 🎨 묵향 서예전 (Calligraphy Catalog)

현대 서예가의 작품을 온라인으로 감상할 수 있는 다국어 지원 전시 카탈로그입니다.

## ✨ 주요 기능

- 🌍 **4개 언어 지원**: 한국어, English, 日本語, 中文
- 🎨 **작품 갤러리**: 서예 작품들의 고화질 이미지와 상세 정보
- 👨‍🎨 **작가 소개**: 서예가의 경력과 작가 노트
- 📱 **반응형 디자인**: 모든 기기에서 최적화된 경험
- 🔄 **실시간 언어 전환**: 헤더에서 즉시 언어 변경 가능

## 🚀 배포

이 프로젝트는 Vercel에 배포되어 있습니다:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jlinsights/calligraphy-catalog)

## 🛠 기술 스택

- **Framework**: Next.js 15
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **다국어**: next-intl
- **UI 컴포넌트**: Radix UI + shadcn/ui
- **배포**: Vercel

## 🌍 지원 언어 및 경로

- **한국어** (기본): `/`
- **영어**: `/en`
- **일본어**: `/ja`
- **중국어**: `/zh`

## 📁 프로젝트 구조

```
calligraphy-catalog/
├── app/
│   ├── [locale]/          # 언어별 라우팅
│   │   ├── page.tsx       # 메인 페이지
│   │   ├── gallery/       # 갤러리 페이지
│   │   └── artist/        # 작가 소개 페이지
│   └── globals.css
├── components/
│   ├── ui/                # shadcn/ui 컴포넌트
│   ├── site-header.tsx    # 사이트 헤더
│   ├── site-footer.tsx    # 사이트 푸터
│   └── language-switcher.tsx # 언어 전환기
├── messages/              # 다국어 메시지 파일
│   ├── ko.json           # 한국어
│   ├── en.json           # 영어
│   ├── ja.json           # 일본어
│   └── zh.json           # 중국어
├── lib/
│   ├── artworks.ts       # 작품 데이터
│   └── types.ts          # 타입 정의
├── i18n.ts               # 다국어 설정
└── middleware.ts         # 언어 라우팅 미들웨어
```

## 🏃‍♂️ 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 🎯 페이지별 기능

### 메인 페이지 (`/`)
- 서예전 소개
- 주요 작품 미리보기
- 갤러리 및 작가 소개 링크

### 갤러리 (`/gallery`)
- 모든 작품 목록
- 작품별 미리보기 이미지
- 제작년도, 재료, 크기 정보

### 작품 상세 (`/gallery/[slug]`)
- 고화질 작품 이미지
- 상세 작품 정보
- 작가 노트 (있는 경우)

### 작가 소개 (`/artist`)
- 작가 프로필 사진
- 약력 및 경력
- 작가 노트

## 🌐 다국어 지원

이 프로젝트는 `next-intl`을 사용하여 완전한 다국어 지원을 제공합니다:

- **자동 언어 감지**: 브라우저 언어 설정에 따른 자동 리다이렉트
- **SEO 최적화**: 언어별 URL 구조
- **문화적 번역**: 각 언어권의 문화적 맥락을 고려한 전문 번역

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

🎨 **한국 전통 서예의 아름다움을 전 세계와 공유합니다** 🌍
