import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { artworksData } from "@/lib/artworks"

interface GalleryPageProps {
  params: Promise<{ locale: string }>
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { locale } = await params
  const t = useTranslations('Gallery')

  // 기본 언어(ko)는 URL에 포함하지 않음
  const getLocalizedPath = (path: string) => {
    if (locale === 'ko') {
      return path
    }
    return `/${locale}${path}`
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl font-serif">
          {t('title')}
        </h1>
        <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artworksData.map((artwork) => (
          <div key={artwork.id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-105">
            <Link href={getLocalizedPath(`/gallery/${artwork.slug}`)}>
              <div className="aspect-[4/3] relative">
                <Image
                  src={`/placeholder.svg?width=600&height=450&query=${encodeURIComponent(artwork.imageUrlQuery || artwork.title)}`}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-neutral-900 mb-2">{artwork.title}</h3>
                <p className="text-sm text-neutral-600">
                  {artwork.year}{t('year')} / {artwork.medium}
                </p>
                <p className="text-sm text-neutral-500 mt-2">{artwork.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
} 