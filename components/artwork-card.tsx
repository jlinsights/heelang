import { Artwork } from "@/lib/types";
import Link from "next/link";

interface ArtworkCardProps {
  artwork: Artwork;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <Link href={`/gallery/${artwork.slug}`} className="group">
      <div className="artwork-container bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 overflow-hidden">
        <div
          className="relative overflow-hidden bg-stone-100 dark:bg-slate-700"
          style={{ aspectRatio: artwork.aspectRatio }}
        >
          {artwork.imageUrl && artwork.imageUrl.trim() !== "" ? (
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <div className="text-center">
                <div className="text-3xl mb-2">🖼️</div>
                <p className="text-xs">이미지 준비중</p>
              </div>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-crimson text-lg font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
            {artwork.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {artwork.year} • {artwork.dimensions}
          </p>
        </div>
      </div>
    </Link>
  );
}
