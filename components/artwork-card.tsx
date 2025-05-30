import Link from "next/link"
import Image from "next/image"
import type { Artwork } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ArtworkCardProps {
  artwork: Artwork
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg h-full flex flex-col">
      <Link href={`/gallery/${artwork.slug}`} className="block group h-full flex flex-col">
        <CardHeader className="p-0">
          <div className="aspect-[4/3] relative overflow-hidden">
            <Image
              src={`/placeholder.svg?width=400&height=300&query=${encodeURIComponent(artwork.imageUrlQuery)}`}
              alt={artwork.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-medium text-neutral-800 group-hover:text-primary">
            {artwork.title}
          </CardTitle>
          <p className="text-sm text-neutral-600 mt-1">{artwork.year}</p>
          <p className="text-xs text-neutral-500 mt-0.5">{artwork.medium}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-sm text-primary group-hover:underline">더보기 (View Details)</p>
        </CardFooter>
      </Link>
    </Card>
  )
}
