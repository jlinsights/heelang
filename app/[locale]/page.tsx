import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { artworksData } from "@/lib/artworks"

export default function HomePage() {
  const t = useTranslations('HomePage')
  const featuredArtwork = artworksData[0] || null // Select a featured artwork

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-24">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl font-serif">
          {t('title')}
        </h1>
        <p className="mt-6 text-lg leading-8 text-neutral-700 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/gallery">{t('viewGallery')}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/artist">{t('aboutArtist')}</Link>
          </Button>
        </div>
      </section>

      {featuredArtwork && (
        <section className="mt-16 sm:mt-24 lg:mt-32">
          <h2 className="text-2xl font-semibold text-neutral-800 text-center mb-8 sm:mb-12">
            {t('featuredWork')}
          </h2>
          <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
            <Link href={`/gallery/${featuredArtwork.slug}`}>
              <div className="aspect-[16/10] relative w-full">
                <Image
                  src={`/placeholder.svg?width=1200&height=750&query=${encodeURIComponent(featuredArtwork.imageUrlQuery)}`}
                  alt={featuredArtwork.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  priority
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-medium text-neutral-900">{featuredArtwork.title}</h3>
                <p className="text-sm text-neutral-600 mt-1">
                  {featuredArtwork.year} / {featuredArtwork.medium}
                </p>
              </div>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
} 