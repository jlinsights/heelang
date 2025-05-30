import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { useTranslations } from "next-intl"
import { artworksData } from "@/lib/artworks"
import { Button } from "@/components/ui/button"

interface ArtworkPageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const { slug, locale } = await params
  const t = useTranslations('ArtworkDetail')
  const artwork = artworksData.find(work => work.slug === slug)

  if (!artwork) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="outline">
            <Link href="/gallery">{t('backToGallery')}</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="aspect-[4/5] relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={`/placeholder.svg?width=800&height=1000&query=${encodeURIComponent(artwork.imageUrlQuery || artwork.title)}`}
                alt={artwork.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">{artwork.title}</h1>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-neutral-700">{t('year')}:</span>
                <span className="text-neutral-600">{artwork.year}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-medium text-neutral-700">{t('medium')}:</span>
                <span className="text-neutral-600">{artwork.medium}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-medium text-neutral-700">{t('dimensions')}:</span>
                <span className="text-neutral-600">{artwork.dimensions}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-3">{t('description')}</h3>
              <p className="text-neutral-600 leading-relaxed">{artwork.description}</p>
            </div>
            
            {artwork.artistNote && (
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">{t('artistNote')}</h3>
                <p className="text-neutral-600 leading-relaxed">{artwork.artistNote}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 