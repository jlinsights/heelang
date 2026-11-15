import { ArtNavigation, NavigationSpacer } from '@/components/art-navigation'
import { getNeighbors } from '@/lib/gallery/ordering'
import { notFound } from 'next/navigation'
import ClientEntry from './ClientEntry'

// 빌드 시점에 slug 가 있는 작품 페이지를 모두 만든다
export async function generateStaticParams() {
  try {
    const { getArtworks } = await import('@/lib/artworks')
    const artworks = await getArtworks()
    return artworks
      .filter((artwork) => artwork.slug && artwork.slug.trim() !== '')
      .map((artwork) => ({ slug: artwork.slug }))
  } catch (error) {
    console.error('generateStaticParams error:', error)
    return []
  }
}

interface ArtworkDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ArtworkDetailPage({
  params,
}: ArtworkDetailPageProps) {
  // Next.js 15에서는 params가 Promise입니다
  const { slug } = await params

  console.log('🔧 ArtworkDetailPage: Loading artwork with slug:', slug)

  try {
    // 서버에서 작품 데이터 가져오기
    const { getArtworkBySlug, getArtworks, getRandomArtworks } = await import(
      '@/lib/artworks'
    )
    const artwork = await getArtworkBySlug(slug)

    if (!artwork) {
      console.log('🚨 ArtworkDetailPage: Artwork not found for slug:', slug)
      notFound()
    }

    // 추천 작품 + 갤러리 기본 순서 기준 이전/다음 작품
    const [recommendedArtworks, allArtworks] = await Promise.all([
      getRandomArtworks(slug, 8),
      getArtworks(),
    ])
    const { prev, next } = getNeighbors(allArtworks, slug)
    const neighbors = {
      prev: prev && { slug: prev.slug, title: prev.title },
      next: next && { slug: next.slug, title: next.title },
    }

    console.log('✅ ArtworkDetailPage: Artwork loaded:', artwork.title)

    return (
      <div className='min-h-screen bg-background'>
        <ArtNavigation />
        <NavigationSpacer />
        <main className='container-art pb-24 pt-8 md:pt-12'>
          <ClientEntry
            artwork={artwork}
            recommendedArtworks={recommendedArtworks}
            neighbors={neighbors}
          />
        </main>
      </div>
    )
  } catch (error) {
    console.error('🚨 ArtworkDetailPage error:', error)
    notFound()
  }
}
