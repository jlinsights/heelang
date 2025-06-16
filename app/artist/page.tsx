"use client";

import { ArtNavigation, NavigationSpacer } from "@/components/art-navigation";
import { PageHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fallbackArtistData, getArtist } from "@/lib/artworks";
import type { Artist } from "@/lib/types";
import {
  Award,
  BookOpen,
  Calendar,
  Globe,
  GraduationCap,
  Instagram,
  Mail,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ArtistPage() {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArtistData = async () => {
    try {
      setError(null);
      const artistData = await getArtist();
      setArtist(artistData);
    } catch (err) {
      console.error("Error fetching artist data:", err);
      setError("작가 정보를 불러오는데 실패했습니다.");
      // 에러 발생 시 fallback 데이터 사용
      setArtist(fallbackArtistData);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // 캐시 클리어를 위한 API 호출
      await fetch("/api/artist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clearCache" }),
      });

      await fetchArtistData();
    } catch (err) {
      console.error("Error refreshing artist data:", err);
      setError("데이터 새로고침에 실패했습니다.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchArtistData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-paper via-paper-warm to-paper-cream dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <ArtNavigation />
        <NavigationSpacer />
        <div className="pb-16 pt-32">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ink mx-auto mb-4"></div>
                <p className="text-ink-light dark:text-gray-300">
                  작가 정보를 불러오는 중...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-paper via-paper-warm to-paper-cream dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <ArtNavigation />
        <NavigationSpacer />
        <div className="pb-16 pt-32">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-ink-light dark:text-gray-300 mb-4">
                  작가 정보를 불러올 수 없습니다.
                </p>
                <Button onClick={handleRefresh} variant="outline">
                  다시 시도
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-paper via-paper-warm to-paper-cream dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ArtNavigation />
      <NavigationSpacer />

      <div className="pb-16 pt-32">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* 페이지 헤더 */}
          <PageHeader
            breadcrumb={[{ label: "홈", href: "/" }, { label: "작가 소개" }]}
            title="작가 소개"
            subtitle="희랑 공경순"
            description="전통 서예의 정신과 현대적 감각을 조화시키는 서예가"
            badge="Artist"
            variant="default"
            size="lg"
          >
            <Button
              onClick={handleRefresh}
              variant="ghost"
              size="sm"
              disabled={refreshing}
              className="text-ink-light hover:text-ink dark:text-gray-300 dark:hover:text-white"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              새로고침
            </Button>
          </PageHeader>

          {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* 왼쪽: 프로필 사진 및 기본 정보 */}
            <div className="lg:col-span-1">
              <Card className="sticky top-28 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-stone-200 dark:border-gray-700 shadow-lg">
                <CardContent className="p-6">
                  {/* 프로필 사진 */}
                  <div className="relative w-full aspect-[3/4] mb-6 rounded-lg overflow-hidden bg-stone-100 dark:bg-gray-700">
                    <Image
                      src={
                        artist.profileImageUrl || "/images/artist-profile.jpg"
                      }
                      alt={`${artist.name} 프로필 사진`}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                      priority
                    />
                  </div>

                  {/* 기본 정보 */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-ink dark:text-white mb-2 font-serif">
                      {artist.name}
                    </h2>
                    {artist.birthYear && (
                      <p className="text-ink-light dark:text-gray-300 mb-4">
                        {new Date().getFullYear() - artist.birthYear}세
                      </p>
                    )}
                  </div>

                  <Separator className="my-6 dark:border-gray-600" />

                  {/* 연락처 정보 */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-ink dark:text-white flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      연락처
                    </h3>

                    {artist.email && (
                      <a
                        href={`mailto:${artist.email}`}
                        className="flex items-center text-ink-light dark:text-gray-300 hover:text-ink dark:hover:text-white transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        {artist.email}
                      </a>
                    )}

                    {artist.phone && (
                      <a
                        href={`tel:${artist.phone}`}
                        className="flex items-center text-ink-light dark:text-gray-300 hover:text-ink dark:hover:text-white transition-colors"
                      >
                        <span className="w-4 h-4 mr-2 text-center">📞</span>
                        {artist.phone}
                      </a>
                    )}

                    {artist.website && (
                      <a
                        href={artist.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-ink-light dark:text-gray-300 hover:text-ink dark:hover:text-white transition-colors"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        웹사이트
                      </a>
                    )}

                    {artist.socialLinks?.instagram && (
                      <a
                        href={artist.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-ink-light dark:text-gray-300 hover:text-ink dark:hover:text-white transition-colors"
                      >
                        <Instagram className="w-4 h-4 mr-2" />
                        Instagram
                      </a>
                    )}

                    {artist.socialLinks?.facebook && (
                      <a
                        href={artist.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-ink-light dark:text-gray-300 hover:text-ink dark:hover:text-white transition-colors"
                      >
                        <span className="w-4 h-4 mr-2 text-center">📘</span>
                        Facebook
                      </a>
                    )}

                    {artist.socialLinks?.youtube && (
                      <a
                        href={artist.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-ink-light dark:text-gray-300 hover:text-ink dark:hover:text-white transition-colors"
                      >
                        <span className="w-4 h-4 mr-2 text-center">📺</span>
                        YouTube
                      </a>
                    )}
                  </div>

                  {/* 기본 정보 */}
                  {(artist.birthPlace || artist.currentLocation) && (
                    <>
                      <Separator className="my-6 dark:border-gray-600" />
                      <div className="space-y-3">
                        <h3 className="font-semibold text-ink dark:text-white">
                          기본 정보
                        </h3>
                        {artist.birthPlace && (
                          <div className="flex items-center text-ink-light dark:text-gray-300">
                            <span className="w-4 h-4 mr-2 text-center">🏠</span>
                            <span className="text-sm">
                              출생지: {artist.birthPlace}
                            </span>
                          </div>
                        )}
                        {artist.currentLocation && (
                          <div className="flex items-center text-ink-light dark:text-gray-300">
                            <span className="w-4 h-4 mr-2 text-center">📍</span>
                            <span className="text-sm">
                              현재 거주지: {artist.currentLocation}
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <Separator className="my-6 dark:border-gray-600" />

                  {/* 갤러리 방문 안내 */}
                  <div className="text-center">
                    <Button asChild className="w-full">
                      <a href="/gallery">작품 갤러리 보기</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 오른쪽: 상세 정보 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 작가 소개 */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-stone-200 dark:border-gray-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-ink dark:text-white">
                    <BookOpen className="w-5 h-5 mr-2" />
                    작가 소개
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-ink-light dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {artist.bio}
                  </p>
                </CardContent>
              </Card>

              {/* 작가 노트 */}
              {artist.statement && (
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-stone-200 dark:border-gray-700 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-ink dark:text-white">
                      <BookOpen className="w-5 h-5 mr-2" />
                      작가 노트
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="border-l-4 border-stone-300 pl-4 italic text-ink-light dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {artist.statement}
                    </blockquote>
                  </CardContent>
                </Card>
              )}

              {/* 학력 */}
              {artist.education && artist.education.length > 0 && (
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-stone-200 dark:border-gray-700 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-ink dark:text-white">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      학력
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {artist.education.map((edu, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-stone-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-ink-light dark:text-gray-300">
                            {edu}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* 수상 경력 */}
              {artist.awards && artist.awards.length > 0 && (
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-stone-200 dark:border-gray-700 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-ink dark:text-white">
                      <Award className="w-5 h-5 mr-2" />
                      수상 경력
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {artist.awards.map((award, index) => (
                        <li key={index} className="flex items-start">
                          <Badge
                            variant="secondary"
                            className="mr-3 mt-0.5 flex-shrink-0"
                          >
                            수상
                          </Badge>
                          <span className="text-ink-light dark:text-gray-300">
                            {award}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* 전시 경력 */}
              {artist.exhibitions && artist.exhibitions.length > 0 && (
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-stone-200 dark:border-gray-700 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-ink dark:text-white">
                      <Calendar className="w-5 h-5 mr-2" />
                      전시 경력
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* 개인전과 단체전 분리 */}
                      {(() => {
                        const soloExhibitions = artist.exhibitions.filter(
                          (ex) =>
                            ex.includes("개인전") ||
                            ex.includes("solo") ||
                            ex.includes("Solo")
                        );
                        const groupExhibitions = artist.exhibitions.filter(
                          (ex) =>
                            !ex.includes("개인전") &&
                            !ex.includes("solo") &&
                            !ex.includes("Solo")
                        );

                        return (
                          <>
                            {soloExhibitions.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-ink dark:text-white mb-3">
                                  개인전
                                </h4>
                                <ul className="space-y-2">
                                  {soloExhibitions.map((exhibition, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <div className="w-2 h-2 bg-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                      <span className="text-ink-light dark:text-gray-300">
                                        {exhibition}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {groupExhibitions.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-ink dark:text-white mb-3">
                                  단체전
                                </h4>
                                <ul className="space-y-2">
                                  {groupExhibitions.map((exhibition, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <div className="w-2 h-2 bg-stone-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                      <span className="text-ink-light dark:text-gray-300">
                                        {exhibition}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 소장처 */}
              {artist.collections && artist.collections.length > 0 && (
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-stone-200 dark:border-gray-700 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-ink dark:text-white">
                      <BookOpen className="w-5 h-5 mr-2" />
                      작품 소장처
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {artist.collections.map((collection, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-stone-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-ink-light dark:text-gray-300">
                            {collection}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* 작가 철학 */}
              {artist.philosophy && (
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-stone-200 dark:border-gray-700 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-ink dark:text-white">
                      <BookOpen className="w-5 h-5 mr-2" />
                      작가 철학
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="border-l-4 border-gold pl-4 italic text-ink-light dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {artist.philosophy}
                    </blockquote>
                  </CardContent>
                </Card>
              )}

              {/* 전문 분야 */}
              {artist.specialties && artist.specialties.length > 0 && (
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-stone-200 dark:border-gray-700 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-ink dark:text-white">
                      <Award className="w-5 h-5 mr-2" />
                      전문 분야
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {artist.specialties.map((specialty, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-sm"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 주요 기법 및 재료 */}
              {(artist.techniques && artist.techniques.length > 0) ||
                (artist.materials && artist.materials.length > 0 && (
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-stone-200 dark:border-gray-700 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center text-ink dark:text-white">
                        <BookOpen className="w-5 h-5 mr-2" />
                        기법 및 재료
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {artist.techniques && artist.techniques.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-ink dark:text-white mb-3">
                            주요 기법
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {artist.techniques.map((technique, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-sm"
                              >
                                {technique}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {artist.materials && artist.materials.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-ink dark:text-white mb-3">
                            주요 재료
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {artist.materials.map((material, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-sm"
                              >
                                {material}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

              {/* 영향받은 작가/사상 */}
              {artist.influences && artist.influences.length > 0 && (
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-stone-200 dark:border-gray-700 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-ink dark:text-white">
                      <BookOpen className="w-5 h-5 mr-2" />
                      영향받은 작가/사상
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {artist.influences.map((influence, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-ink-light dark:text-gray-300">
                            {influence}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* 교육 경력 */}
              {artist.teachingExperience &&
                artist.teachingExperience.length > 0 && (
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-stone-200 dark:border-gray-700 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center text-ink dark:text-white">
                        <GraduationCap className="w-5 h-5 mr-2" />
                        교육 경력
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {artist.teachingExperience.map((experience, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-stone-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-ink-light dark:text-gray-300">
                              {experience}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

              {/* 출판물 */}
              {artist.publications && artist.publications.length > 0 && (
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-stone-200 dark:border-gray-700 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-ink dark:text-white">
                      <BookOpen className="w-5 h-5 mr-2" />
                      출판물
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {artist.publications.map((publication, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-stone-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-ink-light dark:text-gray-300">
                            {publication}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* 소속 단체 */}
              {artist.memberships && artist.memberships.length > 0 && (
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-stone-200 dark:border-gray-700 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-ink dark:text-white">
                      <Award className="w-5 h-5 mr-2" />
                      소속 단체
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {artist.memberships.map((membership, index) => (
                        <li key={index} className="flex items-start">
                          <Badge
                            variant="secondary"
                            className="mr-3 mt-0.5 flex-shrink-0"
                          >
                            소속
                          </Badge>
                          <span className="text-ink-light dark:text-gray-300">
                            {membership}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
