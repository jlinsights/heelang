import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/logo'
import { artworksData } from '@/lib/artworks'
import { Button } from '@/components/ui/button'

import { Calendar, Palette, Share, Ruler } from 'lucide-react'

interface ArtworkPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return artworksData.map((artwork) => ({
    slug: artwork.slug,
  }))
}

export async function generateMetadata({ params }: ArtworkPageProps) {
  const { slug } = await params
  const artwork = artworksData.find((artwork) => artwork.slug === slug)
  
  if (!artwork) {
    return {
      title: '작품을 찾을 수 없습니다 | 묵향 서예전',
      description: '요청하신 작품을 찾을 수 없습니다. 갤러리에서 다른 작품들을 감상해보세요.',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://calligraphy-catalog.vercel.app'
  const imageUrl = `${siteUrl}${artwork.imageUrl}`

  return {
    title: `${artwork.title} (${artwork.year}) | 공경순 개인전 | 묵향 서예전`,
    description: `${artwork.description} ${artwork.medium}, ${artwork.dimensions}. 공경순 작가의 ${artwork.year}년 작품입니다.`,
    keywords: [
      '서예', '현대서예', '공경순', '묵향', artwork.title, 
      '한국서예', 'calligraphy', 'korean art', `${artwork.year}`
    ],
    authors: [{ name: '공경순 (Kong Kyung Soon)' }],
    creator: '공경순',
    publisher: '묵향 서예전',
    openGraph: {
      title: `${artwork.title} | 공경순 서예 작품`,
      description: artwork.description,
      url: `${siteUrl}/gallery/${artwork.slug}`,
      siteName: '묵향 서예전',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 800,
          alt: `${artwork.title} - 공경순 작품`,
          type: 'image/jpeg',
        }
      ],
      locale: 'ko_KR',
      type: 'article',
      publishedTime: `${artwork.year}-01-01T00:00:00.000Z`,
      authors: ['공경순 (Kong Kyung Soon)'],
      section: '갤러리',
      tags: ['서예', '현대서예', '한국예술', artwork.title],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${artwork.title} | 공경순 서예 작품`,
      description: artwork.description,
      images: [imageUrl],
      creator: '@calligraphy_catalog',
      site: '@calligraphy_catalog',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${siteUrl}/gallery/${artwork.slug}`,
    },
    other: {
      'application/ld+json': JSON.stringify({
        "@context": "https://schema.org",
        "@type": "VisualArtwork",
        "name": artwork.title,
        "creator": {
          "@type": "Person",
          "name": "공경순",
          "alternateName": "Kong Kyung Soon"
        },
        "dateCreated": artwork.year.toString(),
        "artMedium": artwork.medium,
        "artform": "Calligraphy",
        "image": imageUrl,
        "description": artwork.description,
        "width": artwork.dimensions.split(' x ')[0],
        "height": artwork.dimensions.split(' x ')[1],
        "url": `${siteUrl}/gallery/${artwork.slug}`,
        "isPartOf": {
          "@type": "ExhibitionEvent",
          "name": "Silent Resonance - 공경순 개인전",
          "organizer": {
            "@type": "Organization",
            "name": "묵향 서예전"
          }
        }
      })
    }
  }
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const { slug } = await params
  const artwork = artworksData.find((artwork) => artwork.slug === slug)

  if (!artwork) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-xl border-b border-border/50 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between py-4">
            <Logo size="md" />
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/gallery" className="text-ink font-medium text-sm">
                Gallery
              </Link>
              <Link href="/artists" className="text-ink-light hover:text-ink transition-colors duration-200 text-sm">
                Artist
              </Link>
              <Link href="/exhibition" className="text-ink-light hover:text-ink transition-colors duration-200 text-sm">
                Exhibition
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {/* Breadcrumb - Fixed position */}
        <div className="fixed top-20 left-4 z-40">
          <Button asChild variant="ghost" size="sm" className="bg-background/80 backdrop-blur-sm">
            <Link href="/gallery">
              ← 갤러리
            </Link>
          </Button>
        </div>

        {/* Image Section - Optimized for full image viewing */}
        <div className="relative bg-stone-50 dark:bg-slate-900 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-center">
              <div className="relative max-w-4xl w-full bg-white dark:bg-slate-800 shadow-2xl rounded-lg overflow-hidden">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-auto object-contain max-h-[80vh]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Artwork Information - Enhanced section */}
        <div className="bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
              {/* Left: Main Info */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="font-display text-3xl lg:text-4xl text-ink leading-tight">
                    {artwork.title}
                  </h1>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-ink-light">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{artwork.year}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Palette className="h-4 w-4" />
                      <span>{artwork.medium}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Ruler className="h-4 w-4" />
                      <span>{artwork.dimensions}</span>
                    </div>
                  </div>
                </div>

                <div className="prose prose-stone dark:prose-invert max-w-none">
                  <p className="text-ink-light leading-relaxed">
                    {artwork.description}
                  </p>
                </div>
              </div>

              {/* Right: Artist Note & Actions */}
              <div className="space-y-8">
                {artwork.artistNote && (
                  <div className="bg-stone-50 dark:bg-slate-800/50 rounded-lg p-6">
                    <h3 className="font-display text-lg text-ink mb-4">작가 노트</h3>
                    <blockquote className="text-ink-light leading-relaxed italic">
                      "{artwork.artistNote}"
                    </blockquote>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share className="h-4 w-4" />
                    공유하기
                  </Button>
                  <Button variant="outline" size="sm">
                    작품 문의
                  </Button>
                </div>

                {/* Navigation to next/prev artwork */}
                <div className="pt-8 border-t border-border/20">
                  <div className="flex justify-between">
                    <Link 
                      href="/gallery" 
                      className="text-sm text-ink-light hover:text-ink transition-colors"
                    >
                      ← 갤러리로 돌아가기
                    </Link>
                    <span className="text-sm text-ink-light">
                      {artwork.year}년 작품
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 bg-stone-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex items-center justify-between text-sm">
            <Logo size="sm" />
            <div className="text-ink-light">
              © 2025 희랑 공경순 개인전. 후원: 사단법인 동양서예협회
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 