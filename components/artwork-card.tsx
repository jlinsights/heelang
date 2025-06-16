"use client";

import { GalleryGridImage } from "@/components/optimized-image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Artwork } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Calendar, Eye, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ArtworkCardProps {
  artwork: Artwork;
  variant?: "default" | "minimal" | "featured" | "compact";
  className?: string;
  showMetadata?: boolean;
  showActions?: boolean;
  priority?: boolean;
}

export function ArtworkCard({
  artwork,
  variant = "default",
  className,
  showMetadata = true,
  showActions = false,
  priority = false,
}: ArtworkCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    default: "card-art hover-lift",
    minimal: "bg-transparent border-none shadow-none hover:shadow-soft",
    featured: "card-art-elevated hover:shadow-strong hover:-translate-y-2",
    compact: "card-art hover:shadow-medium",
  };

  const imageAspectRatio = {
    default: "aspect-[3/4]",
    minimal: "aspect-[3/4]",
    featured: "aspect-[4/5]",
    compact: "aspect-square",
  };

  return (
    <Card
      className={cn(cardVariants[variant], className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* 이미지 컨테이너 */}
        <div className="relative overflow-hidden rounded-t-xl">
          <Link
            href={`/gallery/${artwork.slug}`}
            className="block group focus-art rounded-t-xl"
            aria-label={`${artwork.title} 작품 상세보기`}
          >
            <div
              className={cn(
                "relative overflow-hidden bg-stone-light",
                imageAspectRatio[variant]
              )}
            >
              {artwork.slug ? (
                <GalleryGridImage
                  artwork={{
                    slug: artwork.slug,
                    title: artwork.title,
                    year: artwork.year,
                  }}
                  className="group-hover:scale-110 group-focus:scale-110 transition-transform duration-700 ease-out"
                  priority={priority}
                />
              ) : (
                <div className="w-full h-full bg-gradient-zen flex items-center justify-center">
                  <div className="text-center text-ink-lighter">
                    <div className="w-16 h-16 mx-auto mb-4 bg-ink-lighter/20 rounded-full flex items-center justify-center">
                      <Eye className="w-8 h-8" />
                    </div>
                    <p className="text-sm">이미지 준비중</p>
                  </div>
                </div>
              )}

              {/* 호버 오버레이 */}
              <div
                className={cn(
                  "absolute inset-0 bg-black/0 transition-all duration-300",
                  isHovered && "bg-black/10"
                )}
              />

              {/* 카테고리 배지 */}
              {artwork.category && variant !== "compact" && (
                <div className="absolute top-3 left-3">
                  <Badge
                    variant="secondary"
                    className="glass text-xs font-medium text-ink bg-paper/80 border-paper/50"
                  >
                    {getCategoryLabel(artwork.category)}
                  </Badge>
                </div>
              )}

              {/* Featured 배지 */}
              {artwork.featured && variant === "featured" && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-ink text-paper text-xs font-medium">
                    추천작
                  </Badge>
                </div>
              )}

              {/* 액션 버튼들 */}
              {showActions && (
                <div
                  className={cn(
                    "absolute bottom-3 right-3 flex space-x-2 transition-all duration-300",
                    isHovered
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2"
                  )}
                >
                  <button className="p-2 glass rounded-full hover:bg-paper/50 transition-colors focus-art">
                    <Heart className="w-4 h-4 text-ink" />
                  </button>
                  <button className="p-2 glass rounded-full hover:bg-paper/50 transition-colors focus-art">
                    <Share2 className="w-4 h-4 text-ink" />
                  </button>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* 콘텐츠 */}
        {variant !== "minimal" && (
          <div className="p-4 md:p-6">
            {/* 제목과 설명 */}
            <div className="mb-4">
              <Link
                href={`/gallery/${artwork.slug}`}
                className="group focus-art rounded"
              >
                <h3 className="font-display text-lg md:text-xl font-semibold text-ink mb-2 group-hover:text-ink-dark transition-colors line-clamp-2">
                  {artwork.title}
                </h3>
              </Link>

              {artwork.description && variant !== "compact" && (
                <p className="text-sm text-ink-light leading-relaxed line-clamp-2">
                  {artwork.description}
                </p>
              )}

              {/* 작가 노트 미리보기 */}
              {artwork.artistNote && variant === "featured" && (
                <div className="mt-3 p-3 bg-stone-50 rounded-lg">
                  <p className="text-xs text-ink-lighter italic line-clamp-2">
                    "{artwork.artistNote}"
                  </p>
                </div>
              )}

              {/* 태그 */}
              {artwork.tags &&
                artwork.tags.length > 0 &&
                variant === "featured" && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {artwork.tags.slice(0, 3).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs px-2 py-0.5 text-ink-lighter border-ink-lighter/30"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {artwork.tags.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0.5 text-ink-lighter border-ink-lighter/30"
                      >
                        +{artwork.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

              {/* 시리즈 정보 */}
              {artwork.series && variant !== "compact" && (
                <div className="mt-2">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-ink/5 text-ink-light border-ink/10"
                  >
                    시리즈: {artwork.series}
                  </Badge>
                </div>
              )}
            </div>

            {/* 메타데이터 */}
            {showMetadata && (
              <div className="space-y-2">
                {artwork.year && (
                  <div className="flex items-center text-xs text-ink-lighter">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{artwork.year}년</span>
                  </div>
                )}

                {artwork.medium && variant !== "compact" && (
                  <p className="text-xs text-ink-lighter">{artwork.medium}</p>
                )}

                {artwork.dimensions && variant === "featured" && (
                  <p className="text-xs text-ink-lighter">
                    {artwork.dimensions}
                  </p>
                )}

                {/* 가격 정보 (featured 모드에서만) */}
                {artwork.price && variant === "featured" && (
                  <div className="flex items-center text-xs text-ink-lighter">
                    <span className="mr-1">💰</span>
                    <span>
                      {typeof artwork.price === "number"
                        ? `₩${artwork.price.toLocaleString()}`
                        : artwork.price}
                    </span>
                  </div>
                )}

                {/* 판매 상태 */}
                {artwork.available !== undefined && variant === "featured" && (
                  <div className="flex items-center text-xs">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        artwork.available ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span
                      className={
                        artwork.available ? "text-green-600" : "text-red-600"
                      }
                    >
                      {artwork.available ? "판매 가능" : "판매 완료"}
                    </span>
                  </div>
                )}

                {/* 전시 정보 */}
                {artwork.exhibition && variant === "featured" && (
                  <div className="flex items-center text-xs text-ink-lighter">
                    <span className="mr-1">🏛️</span>
                    <span className="line-clamp-1">{artwork.exhibition}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 미니멀 버전 콘텐츠 */}
        {variant === "minimal" && (
          <div className="pt-3">
            <Link
              href={`/gallery/${artwork.slug}`}
              className="group focus-art rounded"
            >
              <h3 className="font-display text-base font-medium text-ink group-hover:text-ink-dark transition-colors line-clamp-1">
                {artwork.title}
              </h3>
            </Link>
            {artwork.year && (
              <p className="text-xs text-ink-lighter mt-1">{artwork.year}년</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 카테고리 라벨 변환 함수
function getCategoryLabel(category: string): string {
  const categoryLabels: Record<string, string> = {
    treasure: "문방사우",
    calligraphy: "서예",
    painting: "회화",
    mixed: "혼합매체",
    installation: "설치",
    sculpture: "조각",
    digital: "디지털",
    photography: "사진",
  };

  return categoryLabels[category] || category;
}

// 작품 그리드 컴포넌트
interface ArtworkGridProps {
  artworks: Artwork[];
  variant?: "default" | "minimal" | "featured" | "compact";
  columns?: 2 | 3 | 4 | 5;
  className?: string;
  showMetadata?: boolean;
  showActions?: boolean;
}

export function ArtworkGrid({
  artworks,
  variant = "default",
  columns = 4,
  className,
  showMetadata = true,
  showActions = false,
}: ArtworkGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  };

  const gaps = {
    default: "gap-6 md:gap-8",
    minimal: "gap-4 md:gap-6",
    featured: "gap-8 md:gap-10",
    compact: "gap-4",
  };

  return (
    <div className={cn("grid", gridCols[columns], gaps[variant], className)}>
      {artworks.map((artwork, index) => (
        <ArtworkCard
          key={artwork.id}
          artwork={artwork}
          variant={variant}
          showMetadata={showMetadata}
          showActions={showActions}
          priority={index < 4} // 첫 4개 이미지는 우선 로딩
        />
      ))}
    </div>
  );
}

// 로딩 스켈레톤 컴포넌트
export function ArtworkCardSkeleton({
  variant = "default",
}: {
  variant?: "default" | "minimal" | "featured" | "compact";
}) {
  const imageAspectRatio = {
    default: "aspect-[3/4]",
    minimal: "aspect-[3/4]",
    featured: "aspect-[4/5]",
    compact: "aspect-square",
  };

  return (
    <Card className="card-art">
      <CardContent className="p-0">
        <div
          className={cn(
            "bg-stone-light animate-pulse rounded-t-xl",
            imageAspectRatio[variant]
          )}
        />

        {variant !== "minimal" && (
          <div className="p-4 md:p-6 space-y-3">
            <div className="h-6 bg-stone-light animate-pulse rounded" />
            <div className="h-4 bg-stone-light animate-pulse rounded w-3/4" />
            <div className="h-3 bg-stone-light animate-pulse rounded w-1/2" />
          </div>
        )}

        {variant === "minimal" && (
          <div className="pt-3 space-y-2">
            <div className="h-5 bg-stone-light animate-pulse rounded" />
            <div className="h-3 bg-stone-light animate-pulse rounded w-1/3" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
