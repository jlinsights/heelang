import { artworksData } from "@/lib/artworks"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon } from "lucide-react"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  return artworksData.map((artwork) => ({
    slug: artwork.slug,
  }))
}

export default function ArtworkDetailPage({ params }: { params: { slug: string } }) {
  const artwork = artworksData.find((art) => art.slug === params.slug)

  if (!artwork) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link href="/gallery" className="inline-flex items-center text-neutral-700 hover:text-neutral-900">
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            작품 목록으로 (Back to Gallery)
          </Link>
        </Button>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-start">
        <div className="aspect-[4/3] lg:aspect-square relative w-full rounded-lg overflow-hidden shadow-lg bg-neutral-100">
          <Image
            src={`/placeholder.svg?width=1000&height=1000&query=${encodeURIComponent(artwork.imageUrlQuery)}`}
            alt={artwork.title}
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="mt-8 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl font-serif">{artwork.title}</h1>
          <div className="mt-3 space-y-1 text-neutral-700">
            <p>
              <span className="font-medium text-neutral-800">제작 연도 (Year):</span> {artwork.year}
            </p>
            <p>
              <span className="font-medium text-neutral-800">재료 (Medium):</span> {artwork.medium}
            </p>
            <p>
              <span className="font-medium text-neutral-800">크기 (Dimensions):</span> {artwork.dimensions}
            </p>
          </div>

          <div className="mt-6 prose prose-neutral max-w-none">
            <h2 className="text-xl font-semibold text-neutral-800 mt-6 mb-2">작품 설명 (Description)</h2>
            <p>{artwork.description}</p>
            {artwork.artistNote && (
              <>
                <h2 className="text-xl font-semibold text-neutral-800 mt-6 mb-2">작가 노트 (Artist's Note)</h2>
                <p>{artwork.artistNote}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
