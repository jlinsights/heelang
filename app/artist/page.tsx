"use client";

import { Logo } from "@/components/logo";
import { SimpleThemeToggle } from "@/components/simple-theme-toggle";
import { Button } from "@/components/ui/button";
import type { Artist } from "@/lib/types";
import { ArrowLeft, Award, User } from "lucide-react";
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
        <div className="bg-stone-50 dark:bg-slate-900 border-b border-border/20">
          <div className="container-max py-16">
            <div className="space-y-4">
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="container-max py-16">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-16 h-0.5 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ArtistsPage() {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArtist() {
      try {
        // 즉시 fallback 데이터 로드
        const { fallbackArtistData } = await import("@/lib/artworks");
        setArtist(fallbackArtistData);
        setLoading(false); // 즉시 로딩 완료

        // 백그라운드에서 Airtable 데이터 시도
        try {
          const { getArtist } = await import("@/lib/artworks");
          const airtableArtist = await getArtist();

          // Airtable 데이터가 있으면 업데이트
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
        {/* Header */}
        <div className="bg-stone-50 dark:bg-slate-900 border-b border-border/20">
          <div className="container-max py-16">
            <div className="space-y-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  돌아가기
                </Link>
              </Button>
              <h1 className="font-display text-4xl lg:text-5xl text-ink mb-2">
                Artist
              </h1>
              <p className="text-ink-light text-lg">
                희랑 공경순 작가를 소개합니다
              </p>
            </div>
          </div>
        </div>

        {/* Artist Profile */}
        <div className="container-max py-16">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Profile Header with Image */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Profile Image */}
              <div className="relative">
                <div className="aspect-[4/5] relative overflow-hidden rounded-2xl bg-stone-100 dark:bg-slate-800">
                  {artist.profileImageUrl &&
                  artist.profileImageUrl.trim() !== "" ? (
                    <img
                      src={artist.profileImageUrl}
                      alt={`${artist.name} 작가`}
                      className="w-full h-full object-cover"
                      loading="eager"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink-light">
                      <div className="text-center">
                        <div className="text-6xl mb-4">👤</div>
                        <p className="text-lg">프로필 이미지 준비중</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-ink/10 rounded-full -z-10"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-ink/10 rounded-full -z-10"></div>
              </div>

              {/* Profile Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="font-display text-3xl lg:text-4xl text-ink">
                    {artist.name}
                  </h2>
                  {artist.birthYear && (
                    <p className="font-korean text-xl text-ink-light">
                      출생: {artist.birthYear}년
                    </p>
                  )}
                  <div className="w-16 h-0.5 bg-ink/30"></div>
                </div>

                <p className="font-body text-lg text-ink-light leading-relaxed">
                  {artist.bio}
                </p>

                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-stone-100 dark:bg-slate-800 text-ink-light text-sm rounded-full">
                    현대 서예가
                  </span>
                  <span className="px-3 py-1 bg-stone-100 dark:bg-slate-800 text-ink-light text-sm rounded-full">
                    동양서예협회 초대작가
                  </span>
                  <span className="px-3 py-1 bg-stone-100 dark:bg-slate-800 text-ink-light text-sm rounded-full">
                    서예 교육가
                  </span>
                  {artist.birthYear && (
                    <span className="px-3 py-1 bg-stone-100 dark:bg-slate-800 text-ink-light text-sm rounded-full">
                      {artist.birthYear}년생
                    </span>
                  )}
                </div>

                {/* Social Links */}
                {(artist.socialLinks?.website ||
                  artist.socialLinks?.instagram ||
                  artist.socialLinks?.facebook) && (
                  <div className="flex gap-4 pt-4">
                    {artist.socialLinks?.website && (
                      <a
                        href={artist.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-light hover:text-ink transition-colors"
                      >
                        🌐 웹사이트
                      </a>
                    )}
                    {artist.socialLinks?.instagram && (
                      <a
                        href={artist.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-light hover:text-ink transition-colors"
                      >
                        📷 Instagram
                      </a>
                    )}
                    {artist.socialLinks?.facebook && (
                      <a
                        href={artist.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-light hover:text-ink transition-colors"
                      >
                        📘 Facebook
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Artist Statement */}
            <div className="bg-stone-50 dark:bg-slate-900 rounded-xl p-8 lg:p-12 space-y-6">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-ink-light" />
                <h3 className="font-display text-xl text-ink">작가의 말</h3>
              </div>

              <blockquote className="space-y-6">
                <p className="font-body text-lg lg:text-xl text-ink leading-relaxed">
                  "{artist.statement}"
                </p>
              </blockquote>
            </div>

            {/* Background */}
            {(artist.education?.length ||
              artist.awards?.length ||
              artist.exhibitions?.length ||
              artist.collections?.length) && (
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-ink-light" />
                  <h3 className="font-display text-xl text-ink">이력</h3>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                  {artist.education && artist.education.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-display text-lg text-ink">학력</h4>
                      <ul className="space-y-2 font-body text-ink-light">
                        {artist.education.map((edu, index) => (
                          <li key={index}>• {edu}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {artist.awards && artist.awards.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-display text-lg text-ink">
                        주요 수상
                      </h4>
                      <ul className="space-y-2 font-body text-ink-light">
                        {artist.awards.map((award, index) => (
                          <li key={index}>• {award}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {artist.exhibitions && artist.exhibitions.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-display text-lg text-ink">
                        주요 전시
                      </h4>
                      <ul className="space-y-2 font-body text-ink-light">
                        {artist.exhibitions.map((exhibition, index) => (
                          <li key={index}>• {exhibition}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {artist.collections && artist.collections.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-display text-lg text-ink">
                        작품 소장
                      </h4>
                      <ul className="space-y-2 font-body text-ink-light">
                        {artist.collections.map((collection, index) => (
                          <li key={index}>• {collection}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Exhibition Info */}
            <div className="bg-gradient-to-r from-stone-50 to-stone-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-8 text-center space-y-4">
              <h3 className="font-display text-xl text-ink">현재 전시</h3>
              <p className="font-body text-lg text-ink-light">
                <strong className="text-ink">길 (Way)</strong>
                <br />
                2025년 6월 18일 - 24일
                <br />
                오전 10시 - 오후 6시
                <br />
                인사동 한국미술관 2층
                <br />
                <span className="text-sm">후원: 사단법인 동양서예협회</span>
              </p>
              <Button asChild className="bg-ink hover:bg-ink/90 text-white">
                <Link href="/exhibition">전시 정보 보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
