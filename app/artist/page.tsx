"use client";

import { Logo } from "@/components/logo";
import { SimpleThemeToggle } from "@/components/simple-theme-toggle";
import { Button } from "@/components/ui/button";
import type { Artist } from "@/lib/types";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  Globe,
  Instagram,
  MapPin,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// 로딩 컴포넌트
function ArtistLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-xl border-b border-border/50 z-50">
        <div className="container-max">
          <div className="flex items-center justify-between py-6">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="hidden md:flex items-center space-x-8">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24">
        <div className="container-max py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ArtistPage() {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArtist() {
      try {
        // 즉시 fallback 데이터 로드
        const { fallbackArtistData } = await import("@/lib/artworks");
        setArtist(fallbackArtistData);
        setLoading(false);

        // 백그라운드에서 Airtable 데이터 시도
        try {
          const { getArtist } = await import("@/lib/artworks");
          const airtableArtist = await getArtist();

          if (airtableArtist) {
            setArtist(airtableArtist);
            console.log("Artist updated with Airtable data");
          }
        } catch (airtableError) {
          console.log("Airtable fetch failed for artist:", airtableError);
        }
      } catch (error) {
        console.error("Failed to load artist data:", error);
        setLoading(false);
      }
    }

    loadArtist();
  }, []);

  if (loading || !artist) {
    return <ArtistLoading />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-xl border-b border-border/50 z-50">
        <div className="container-max">
          <div className="flex items-center justify-between py-6">
            <Logo size="md" />
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/artist" className="text-ink font-medium">
                작가 소개
              </Link>
              <Link
                href="/gallery"
                className="text-ink-light hover:text-ink transition-colors duration-200"
              >
                작품 갤러리
              </Link>
              <Link
                href="/exhibition"
                className="text-ink-light hover:text-ink transition-colors duration-200"
              >
                전시 정보
              </Link>
              <Link
                href="/contact"
                className="text-ink-light hover:text-ink transition-colors duration-200"
              >
                문의하기
              </Link>
              <SimpleThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24">
        <div className="container-max py-16">
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <div className="mb-12">
              <Button asChild variant="ghost" size="sm" className="group">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  돌아가기
                </Link>
              </Button>
            </div>

            {/* Artist Profile */}
            <div className="grid lg:grid-cols-3 gap-16 mb-20">
              {/* Profile Image */}
              <div className="lg:col-span-1">
                <div className="relative group">
                  <div className="aspect-[3/4] relative overflow-hidden rounded-3xl bg-stone-100 dark:bg-slate-800 shadow-2xl">
                    {artist.profileImageUrl &&
                    artist.profileImageUrl.trim() !== "" ? (
                      <img
                        src={artist.profileImageUrl}
                        alt={`${artist.name} 작가`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="eager"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ink-light">
                        <div className="text-center">
                          <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="text-sm">프로필 이미지 준비중</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-ink/5 to-ink/10 rounded-full -z-10 blur-xl"></div>
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-ink/5 to-ink/10 rounded-full -z-10 blur-xl"></div>
                </div>

                {/* Social Links */}
                {artist.socialLinks && (
                  <div className="mt-8 flex justify-center space-x-4">
                    {artist.socialLinks.instagram && (
                      <a
                        href={`https://instagram.com/${artist.socialLinks.instagram.replace(
                          "@",
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-ink/5 hover:bg-ink/10 rounded-full flex items-center justify-center transition-colors group"
                      >
                        <Instagram className="h-5 w-5 text-ink-light group-hover:text-ink transition-colors" />
                      </a>
                    )}
                    {artist.socialLinks.website && (
                      <a
                        href={artist.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-ink/5 hover:bg-ink/10 rounded-full flex items-center justify-center transition-colors group"
                      >
                        <Globe className="h-5 w-5 text-ink-light group-hover:text-ink transition-colors" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Name and Basic Info */}
                <div className="space-y-6">
                  <div>
                    <h1 className="font-display text-4xl lg:text-5xl text-ink mb-3 leading-tight">
                      {artist.name}
                    </h1>
                    {artist.birthYear && (
                      <div className="flex items-center text-ink-light text-lg">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>출생 {artist.birthYear}년</span>
                      </div>
                    )}
                  </div>

                  <div className="w-16 h-1 bg-gradient-to-r from-ink to-ink/30 rounded-full"></div>
                </div>

                {/* Bio */}
                {artist.bio && (
                  <div className="prose prose-lg max-w-none">
                    <p className="text-ink-light leading-relaxed text-lg">
                      {artist.bio}
                    </p>
                  </div>
                )}

                {/* Artist Statement */}
                {artist.statement && (
                  <div className="bg-stone-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-border/30">
                    <h3 className="font-display text-xl text-ink mb-4 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      작가 노트
                    </h3>
                    <p className="text-ink-light leading-relaxed italic">
                      "{artist.statement}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Information Sections */}
            <div className="grid md:grid-cols-2 gap-12">
              {/* Education */}
              {artist.education && artist.education.length > 0 && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl text-ink flex items-center">
                    <BookOpen className="h-6 w-6 mr-3 text-ink-light" />
                    학력
                  </h2>
                  <div className="space-y-4">
                    {artist.education.map((edu, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 group"
                      >
                        <div className="w-2 h-2 bg-ink/30 rounded-full mt-3 group-hover:bg-ink transition-colors"></div>
                        <p className="text-ink-light leading-relaxed flex-1">
                          {edu}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Awards */}
              {artist.awards && artist.awards.length > 0 && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl text-ink flex items-center">
                    <Award className="h-6 w-6 mr-3 text-ink-light" />
                    수상 경력
                  </h2>
                  <div className="space-y-4">
                    {artist.awards.map((award, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 group"
                      >
                        <div className="w-2 h-2 bg-ink/30 rounded-full mt-3 group-hover:bg-ink transition-colors"></div>
                        <p className="text-ink-light leading-relaxed flex-1">
                          {award}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exhibitions */}
              {artist.exhibitions && artist.exhibitions.length > 0 && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl text-ink flex items-center">
                    <MapPin className="h-6 w-6 mr-3 text-ink-light" />
                    전시 경력
                  </h2>
                  <div className="space-y-4">
                    {artist.exhibitions.map((exhibition, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 group"
                      >
                        <div className="w-2 h-2 bg-ink/30 rounded-full mt-3 group-hover:bg-ink transition-colors"></div>
                        <p className="text-ink-light leading-relaxed flex-1">
                          {exhibition}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Collections */}
              {artist.collections && artist.collections.length > 0 && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl text-ink flex items-center">
                    <User className="h-6 w-6 mr-3 text-ink-light" />
                    소장처
                  </h2>
                  <div className="space-y-4">
                    {artist.collections.map((collection, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 group"
                      >
                        <div className="w-2 h-2 bg-ink/30 rounded-full mt-3 group-hover:bg-ink transition-colors"></div>
                        <p className="text-ink-light leading-relaxed flex-1">
                          {collection}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Call to Action */}
            <div className="mt-20 text-center">
              <div className="bg-gradient-to-r from-stone-50 to-stone-100 dark:from-slate-800 dark:to-slate-700 rounded-3xl p-12 border border-border/30">
                <h3 className="font-display text-2xl text-ink mb-4">
                  작품을 감상해보세요
                </h3>
                <p className="text-ink-light mb-8 max-w-2xl mx-auto">
                  희랑 공경순 작가의 서예 작품들을 갤러리에서 만나보실 수
                  있습니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="group">
                    <Link href="/gallery">
                      작품 갤러리 보기
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/exhibition">전시 정보 확인</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
