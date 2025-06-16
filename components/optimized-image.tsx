"use client";

import { generateAltText, getArtworkImageMeta } from "@/lib/image-utils";
import type { Artwork } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface OptimizedArtworkImageProps {
  artwork: Artwork;
  usage: "gallery-grid" | "gallery-detail" | "featured" | "hero" | "thumbnail";
  className?: string;
  aspectRatio?: string;
  showLoadingState?: boolean;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedArtworkImage({
  artwork,
  usage,
  className,
  aspectRatio,
  showLoadingState = true,
  priority,
  onLoad,
  onError,
}: OptimizedArtworkImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // artwork.slug와 artwork.year를 사용해서 최적화된 이미지 메타데이터 생성
  const imageMeta = getArtworkImageMeta(artwork.slug, artwork.year, usage);
  const altText = generateAltText(artwork.title, "artwork");

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  // 에러 발생 시 기존 imageUrl로 fallback
  const finalSrc = hasError ? artwork.imageUrl : imageMeta.src;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-100 dark:bg-gray-800",
        aspectRatio || "aspect-[3/4]",
        className
      )}
    >
      {/* 로딩 스켈레톤 */}
      {isLoading && showLoadingState && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
      )}

      {/* 최적화된 이미지 */}
      <Image
        src={finalSrc}
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

// 기존 ArtworkCard에서 사용할 수 있는 간편한 래퍼 컴포넌트들
export function GalleryGridImage({
  artwork,
  className,
  priority,
}: {
  artwork: Artwork;
  className?: string;
  priority?: boolean;
}) {
  return (
    <OptimizedArtworkImage
      artwork={artwork}
      usage="gallery-grid"
      className={className}
      priority={priority}
    />
  );
}

export function GalleryDetailImage({
  artwork,
  className,
}: {
  artwork: Artwork;
  className?: string;
}) {
  return (
    <OptimizedArtworkImage
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
  priority,
}: {
  artwork: Artwork;
  className?: string;
  priority?: boolean;
}) {
  return (
    <OptimizedArtworkImage
      artwork={artwork}
      usage="featured"
      className={className}
      priority={priority}
    />
  );
}

export function ThumbnailImage({
  artwork,
  className,
}: {
  artwork: Artwork;
  className?: string;
}) {
  return (
    <OptimizedArtworkImage
      artwork={artwork}
      usage="thumbnail"
      className={className}
      priority={false}
    />
  );
}
