'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string // 원본 이미지 경로 (확장자 제외)
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
  aspectRatio?: string
  quality?: 'thumb' | 'medium' | 'large'
  onLoad?: () => void
  onError?: () => void
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export function OptimizedImage({
  src,
  alt,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  aspectRatio,
  quality = 'medium',
  onLoad,
  onError,
  placeholder = 'empty',
  blurDataURL
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer로 레이지 로딩 최적화
  useEffect(() => {
    if (priority || !containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px' // 50px 미리 로드
      }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [priority])

  // 원본 이미지를 직접 사용 (최적화된 파일이 없는 경우)
  const imageSrc = src

  const handleLoad = useCallback(() => {
    setIsLoading(false)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }, [onError])

  // 블러 플레이스홀더 생성
  const getPlaceholderDataURL = () => {
    if (blurDataURL) return blurDataURL
    
    // 기본 블러 플레이스홀더 (10x10 그레이 이미지)
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAhEQABBAIDAAMAAAAAAAAAAAABAAIDESExkWGhsdHw/9oADAMBAAIRAxEAPwCdwLjU9JsoEwlhcoAowNjOhGB7n/L+8fDM9VGr6s0nGrxzA9XKDQ9Nw88x14fDR3tK4NDXqKOQcZXdHIZDQvBkPb+Y4AwpF11rkBiVcEhbHEOr/MAOVQ84VB3T/9k='
  }

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-stone-100 dark:bg-slate-800 text-stone-400",
          className
        )}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <span className="text-sm">이미지를 불러올 수 없습니다</span>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      {/* 블러 플레이스홀더 */}
      {placeholder === 'blur' && (isLoading || !isInView) && (
        <img
          src={getPlaceholderDataURL()}
          alt=""
          className={cn(
            "absolute inset-0 w-full h-full object-cover scale-110 filter blur-lg",
            aspectRatio ? "" : "aspect-[4/5]"
          )}
          style={aspectRatio ? { aspectRatio } : undefined}
          aria-hidden="true"
        />
      )}

      {/* 로딩 스켈레톤 */}
      {placeholder === 'empty' && (isLoading || !isInView) && (
        <div 
          className={cn(
            "absolute inset-0 bg-stone-200 dark:bg-slate-700 animate-pulse",
            aspectRatio ? "" : "aspect-[4/5]"
          )}
          style={aspectRatio ? { aspectRatio } : undefined}
        />
      )}
      
      {/* 최적화된 이미지 */}
      {isInView && (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          style={aspectRatio ? { aspectRatio } : undefined}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          sizes={sizes}
        />
      )}

      {/* 로딩 인디케이터 */}
      {isLoading && isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-ink/30 border-t-ink animate-spin rounded-full" />
        </div>
      )}
    </div>
  )
}

// 갤러리 썸네일용 특화 컴포넌트
export function GalleryThumbnail({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, 'quality' | 'aspectRatio'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      quality="thumb"
      aspectRatio="4/5"
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      className={cn("rounded-lg", className)}
      {...props}
    />
  )
}

// 개별 작품 페이지용 특화 컴포넌트
export function ArtworkDetail({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, 'quality'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      quality="large"
      sizes="(max-width: 768px) 100vw, 90vw"
      priority
      className={className}
      {...props}
    />
  )
} 