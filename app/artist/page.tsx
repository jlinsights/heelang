import Image from "next/image"
import { artistData } from "@/lib/artworks"

export default function ArtistPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl font-serif">
          작가 소개 (About the Artist)
        </h1>
      </header>

      <div className="lg:grid lg:grid-cols-3 lg:gap-12 items-start">
        <div className="lg:col-span-1 mb-8 lg:mb-0">
          <div className="aspect-square relative w-full max-w-sm mx-auto lg:max-w-none rounded-lg overflow-hidden shadow-lg bg-neutral-100">
            <Image
              src={`/placeholder.svg?width=500&height=500&query=${encodeURIComponent(artistData.profileImageUrlQuery)}`}
              alt={artistData.name}
              fill
              className="object-cover"
            />
          </div>
          <h2 className="text-2xl font-semibold text-neutral-800 text-center mt-6">{artistData.name}</h2>
        </div>

        <div className="lg:col-span-2 prose prose-neutral max-w-none">
          <h3 className="text-xl font-semibold text-neutral-800 mb-2">약력 (Biography)</h3>
          <p>{artistData.bio}</p>

          <h3 className="text-xl font-semibold text-neutral-800 mt-8 mb-2">작가 노트 (Artist's Statement)</h3>
          <p>{artistData.statement}</p>
        </div>
      </div>
    </div>
  )
}
