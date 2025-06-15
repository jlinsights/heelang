import { IMAGE_CONFIG } from "./constants";

// 이미지 URL 생성 함수
export function generateImageUrl(
  src: string,
  width?: number,
  height?: number,
  quality: number = 75
): string {
  if (src.startsWith("http")) {
    return src; // 외부 URL은 그대로 반환
  }

  // 개발 환경에서는 placeholder 사용
  if (process.env.NODE_ENV === "development" && src.includes("placeholder")) {
    return src;
  }

  // 실제 이미지 최적화 서비스 URL 생성 (예: Vercel, CloudFlare Images 등)
  const params = new URLSearchParams();
  if (width) params.set("w", width.toString());
  if (height) params.set("h", height.toString());
  params.set("q", quality.toString());

  return `${src}?${params.toString()}`;
}

// 반응형 이미지 sizes 속성 생성
export function getImageSizes(
  type: "artwork" | "profile" | "thumbnail"
): string {
  switch (type) {
    case "artwork":
      return IMAGE_CONFIG.artworkImageSizes;
    case "profile":
      return IMAGE_CONFIG.profileImageSize;
    case "thumbnail":
      return "(max-width: 768px) 50vw, 25vw";
    default:
      return "100vw";
  }
}

// 이미지 preload 링크 생성
export function generatePreloadLink(src: string, sizes?: string) {
  return {
    rel: "preload",
    as: "image",
    href: src,
    ...(sizes && { imageSizes: sizes }),
  };
}

// 이미지 alt 텍스트 생성 (접근성 향상)
export function generateAltText(
  title: string,
  type: "artwork" | "profile"
): string {
  switch (type) {
    case "artwork":
      return `서예 작품: ${title}`;
    case "profile":
      return `작가 프로필 사진: ${title}`;
    default:
      return title;
  }
}

/**
 * 작품 slug와 연도를 기반으로 로컬 이미지 URL을 생성합니다.
 */
export function getArtworkImageUrl(
  slug: string,
  year: string | number,
  size: "thumb" | "medium" | "large" | "original" = "original"
): string {
  const yearStr = year.toString();

  // 실제 파일은 크기 접미사 없이 저장되어 있음
  return `/Images/Artworks/${yearStr}/${slug}.jpg`;
}

/**
 * 아티스트 프로필 이미지 URL을 생성합니다.
 */
export function getArtistImageUrl(filename: string): string {
  return `/Images/Artist/${filename}`;
}

/**
 * 이미지가 존재하는지 확인하는 함수 (클라이언트 사이드에서만 사용)
 */
export function checkImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      // 서버 사이드에서는 항상 true 반환
      resolve(true);
      return;
    }

    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * 여러 이미지 크기 중 존재하는 첫 번째 이미지 URL을 반환합니다.
 */
export async function getAvailableImageUrl(
  slug: string,
  year: string | number
): Promise<string> {
  const sizes: Array<"original" | "large" | "medium" | "thumb"> = [
    "original",
    "large",
    "medium",
    "thumb",
  ];

  for (const size of sizes) {
    const url = getArtworkImageUrl(slug, year, size);
    const exists = await checkImageExists(url);
    if (exists) {
      return url;
    }
  }

  // 모든 이미지가 없으면 기본 medium 크기 반환
  return getArtworkImageUrl(slug, year, "medium");
}
