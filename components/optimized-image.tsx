"use client";

import { generateAltText, getArtworkImageMeta } from "@/lib/image-utils";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  slug: string;
  year: string | number;
  title: string;
  usage: "gallery-grid" | "gallery-detail" | "featured" | "hero" | "thumbnail";
  className?: string;
  aspectRatio?: string;
  showLoadingState?: boolean;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  slug,
  year,
  title,
  usage,
  className,
  aspectRatio,
  showLoadingState = true,
  priority,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const imageMeta = getArtworkImageMeta(slug, year, usage);
  const altText = generateAltText(title, "artwork");

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // 에러 상태 렌더링
  if (hasError) {
    return (
      <div
        className={cn(
          "w-full h-full bg-gradient-zen flex items-center justify-center",
          aspectRatio,
          className
        )}
      >
        <div className="text-center text-ink-lighter">
          <div className="w-16 h-16 mx-auto mb-4 bg-ink-lighter/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-sm">이미지를 불러올 수 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", aspectRatio, className)}>
      {/* 로딩 상태 */}
      {showLoadingState && isLoading && (
        <div className="absolute inset-0 bg-stone-light animate-pulse z-10" />
      )}

      {/* 최적화된 이미지 */}
      <Image
        src={imageMeta.src}
        sizes={imageMeta.sizes}
        alt={altText}
        fill
        className={cn(
          "object-cover transition-all duration-700 ease-out",
          isLoading && showLoadingState && "scale-110 blur-sm opacity-0",
          !isLoading && "scale-100 blur-0 opacity-100"
        )}
        loading={priority ? "eager" : (imageMeta.loading as "eager" | "lazy")}
        priority={priority ?? imageMeta.priority}
        onLoad={handleLoad}
        onError={handleError}
        quality={85}
      />
    </div>
  );
}

interface ArtworkImageProps {
  artwork: {
    slug: string;
    title: string;
    year: string | number;
  };
  usage: "gallery-grid" | "gallery-detail" | "featured" | "hero" | "thumbnail";
  className?: string;
  aspectRatio?: string;
  showLoadingState?: boolean;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function ArtworkImage({
  artwork,
  usage,
  className,
  aspectRatio,
  showLoadingState = true,
  priority,
  onLoad,
  onError,
}: ArtworkImageProps) {
  return (
    <OptimizedImage
      slug={artwork.slug}
      year={artwork.year}
      title={artwork.title}
      usage={usage}
      className={className}
      aspectRatio={aspectRatio}
      showLoadingState={showLoadingState}
      priority={priority}
      onLoad={onLoad}
      onError={onError}
    />
  );
}

// 사용 편의를 위한 프리셋 컴포넌트들
export function GalleryGridImage({
  artwork,
  className,
  priority,
}: {
  artwork: { slug: string; title: string; year: string | number };
  className?: string;
  priority?: boolean;
}) {
  return (
    <ArtworkImage
      artwork={artwork}
      usage="gallery-grid"
      aspectRatio="aspect-[3/4]"
      className={className}
      priority={priority}
    />
  );
}

export function GalleryDetailImage({
  artwork,
  className,
}: {
  artwork: { slug: string; title: string; year: string | number };
  className?: string;
}) {
  return (
    <ArtworkImage
      artwork={artwork}
      usage="gallery-detail"
      className={className}
      priority={true}
    />
  );
}

export function FeaturedImage({
  artwork,
  className,
}: {
  artwork: { slug: string; title: string; year: string | number };
  className?: string;
}) {
  return (
    <ArtworkImage
      artwork={artwork}
      usage="featured"
      aspectRatio="aspect-[4/5]"
      className={className}
      priority={true}
    />
  );
}

export function ThumbnailImage({
  artwork,
  className,
}: {
  artwork: { slug: string; title: string; year: string | number };
  className?: string;
}) {
  return (
    <ArtworkImage
      artwork={artwork}
      usage="thumbnail"
      aspectRatio="aspect-square"
      className={className}
      showLoadingState={false}
    />
  );
}
