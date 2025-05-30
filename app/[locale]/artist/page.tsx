import Image from "next/image"
import { useTranslations } from "next-intl"
import { artistData } from "@/lib/artworks"

export default function ArtistPage() {
  const t = useTranslations('Artist')

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl font-serif">
            {t('title')}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/placeholder.svg?width=400&height=500&query=artist-portrait"
                alt={artistData.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-neutral-800 mb-4">{t('name')}</h2>
              <h3 className="text-xl font-medium text-neutral-700 mb-3">{artistData.name}</h3>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-4">{t('biography')}</h3>
              <p className="text-neutral-600 leading-relaxed">{artistData.bio}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-4">{t('artistStatement')}</h3>
              <p className="text-neutral-600 leading-relaxed">{artistData.statement}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 