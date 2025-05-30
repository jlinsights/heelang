import { artworksData } from "@/lib/artworks"
import { ArtworkCard } from "@/components/artwork-card"

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl font-serif">
          작품 목록 (Gallery)
        </h1>
        <p className="mt-3 text-lg text-neutral-700 max-w-xl mx-auto">
          작가의 섬세한 필치와 독창적인 세계관이 담긴 작품들을 감상해보세요. (Explore the artworks showcasing the
          artist's delicate strokes and unique worldview.)
        </p>
      </header>
      {artworksData.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {artworksData.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : (
        <p className="text-center text-neutral-600">등록된 작품이 없습니다. (No artworks available.)</p>
      )}
    </div>
  )
}
