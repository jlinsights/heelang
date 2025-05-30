import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { artworksData } from "@/lib/artworks"

export default function GalleryPage() {
  const t = useTranslations('Gallery')

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
            <Link href={`/gallery/${artwork.slug}`}>
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