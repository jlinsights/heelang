import { ArtworkDetailClient } from "@/components/artwork-detail-client";
import { Logo } from "@/components/logo";
import { GalleryDetailImage } from "@/components/optimized-image";
import { SimpleThemeToggle } from "@/components/simple-theme-toggle";
import { Button } from "@/components/ui/button";
import { Calendar, Palette, Ruler } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// generateStaticParams 함수 - 빌드 시점에 모든 유효한 slug 생성
export async function generateStaticParams() {
  try {
    console.log("🔧 generateStaticParams: Starting...");

    // Airtable에서 모든 작품 데이터 가져오기
    const { getArtworks } = await import("@/lib/artworks");
    const artworks = await getArtworks();

    console.log(`🔧 generateStaticParams: Found ${artworks.length} artworks`);

    // 유효한 slug만 필터링
    const validSlugs = artworks
      .filter((artwork) => artwork.slug && artwork.slug.trim() !== "")
      .map((artwork) => ({
        slug: artwork.slug,
      }));

    console.log(
      `🔧 generateStaticParams: Generated ${validSlugs.length} static params`
    );
    console.log(
      "🔧 generateStaticParams: Slugs:",
      validSlugs.map((p) => p.slug)
    );

    return validSlugs;
  } catch (error) {
    console.error("🚨 generateStaticParams error:", error);
    return [];
  }
}

interface ArtworkDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArtworkDetailPage({
  params,
}: ArtworkDetailPageProps) {
  // Next.js 15에서는 params가 Promise입니다
  const { slug } = await params;

  console.log("🔧 ArtworkDetailPage: Loading artwork with slug:", slug);

  try {
    // 서버에서 작품 데이터 가져오기
    const { getArtworkBySlug } = await import("@/lib/artworks");
    const artwork = await getArtworkBySlug(slug);

    if (!artwork) {
      console.log("🚨 ArtworkDetailPage: Artwork not found for slug:", slug);
      notFound();
    }

    console.log("✅ ArtworkDetailPage: Artwork loaded:", artwork.title);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <Logo className="w-8 h-8" showLink={false} />
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  희랑
                </span>
              </Link>
              <div className="flex items-center space-x-4">
                <Link href="/gallery">
                  <Button variant="ghost" size="sm">
                    갤러리로 돌아가기
                  </Button>
                </Link>
                <SimpleThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                <GalleryDetailImage
                  artwork={artwork}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {artwork.title}
                </h1>

                <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{artwork.year}년</span>
                  </div>

                  {artwork.medium && (
                    <div className="flex items-center space-x-1">
                      <Palette className="w-4 h-4" />
                      <span>{artwork.medium}</span>
                    </div>
                  )}

                  {artwork.dimensions && (
                    <div className="flex items-center space-x-1">
                      <Ruler className="w-4 h-4" />
                      <span>{artwork.dimensions}</span>
                    </div>
                  )}
                </div>
              </div>

              {artwork.description && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    작품 설명
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {artwork.description}
                  </p>
                </div>
              )}

              {artwork.tags && artwork.tags.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    태그
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {artwork.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <ArtworkDetailClient
                  title={artwork.title}
                  slug={artwork.slug}
                />
                <Link href="/contact">
                  <Button size="sm">작품 문의하기</Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("🚨 ArtworkDetailPage error:", error);
    notFound();
  }
}
