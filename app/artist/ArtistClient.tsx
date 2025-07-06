"use client";

import { ArtNavigation, NavigationSpacer } from "@/components/art-navigation";
import { Artist } from "@/lib/types";
import {
  BookOpen,
  Building,
  Calendar,
  GraduationCap,
  Instagram,
  Mail,
  Palette,
  Phone,
  Trophy,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ArtistClientProps {
  initialArtist: Artist;
}

export default function ArtistClient({ initialArtist }: ArtistClientProps) {
  const [artist, setArtist] = useState<Artist>(initialArtist);

  // 섹션 렌더링 헬퍼 함수
  const renderSection = (
    title: string,
    items: string[] | undefined,
    icon: React.ReactNode
  ) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        </div>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="text-muted-foreground leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 네비게이션 헤더 */}
      <ArtNavigation />
      <NavigationSpacer />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 섹션 */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4">작가 소개</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
        </div>

        {/* 메인 콘텐츠 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* 왼쪽 프로필 섹션 - 더 넓게 조정 (2/5 비율) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 프로필 사진 */}
            <div className="relative">
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-border">
                <Image
                  src="/images/Artist/Artist-large.jpg"
                  alt={artist.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* 작가 이름과 인스타그램 */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {artist.name}
              </h2>
              {artist.socialLinks?.instagram && (
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                  <Instagram className="w-5 h-5 text-pink-500 dark:text-pink-400" />
                  <a
                    href={artist.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 transition-colors"
                  >
                    Instagram
                  </a>
                </div>
              )}
            </div>

            {/* 연락처 - 프로필 사진 바로 아래 */}
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4 text-center lg:text-left">
                연락처
              </h3>
              <div className="space-y-4">
                {artist.email && (
                  <div className="flex items-center justify-center lg:justify-start gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <a
                      href={`mailto:${artist.email}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {artist.email}
                    </a>
                  </div>
                )}
                {artist.phone && (
                  <div className="flex items-center justify-center lg:justify-start gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <a
                      href={`tel:${artist.phone}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {artist.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 오른쪽 정보 섹션 - 더 좁게 조정 (3/5 비율) */}
          <div className="lg:col-span-3 space-y-8">
            {/* 작가 소개 */}
            {artist.bio && (
              <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  작가 소개
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {artist.bio}
                </p>
              </div>
            )}

            {/* 학력 */}
            {renderSection(
              "학력",
              artist.education,
              <GraduationCap className="w-5 h-5" />
            )}

            {/* 전시 경력 */}
            {renderSection(
              "전시 경력",
              artist.exhibitions,
              <Palette className="w-5 h-5" />
            )}

            {/* 수상 내역 */}
            {renderSection(
              "수상 내역",
              artist.awards,
              <Trophy className="w-5 h-5" />
            )}

            {/* 교육 경력 */}
            {renderSection(
              "교육 경력",
              artist.teachingExperience,
              <Users className="w-5 h-5" />
            )}

            {/* 출판물 */}
            {renderSection(
              "출판물",
              artist.publications,
              <BookOpen className="w-5 h-5" />
            )}

            {/* 소속 단체 */}
            {renderSection(
              "소속 단체",
              artist.memberships,
              <Building className="w-5 h-5" />
            )}

            {/* 소장처 */}
            {renderSection(
              "소장처",
              artist.collections,
              <Calendar className="w-5 h-5" />
            )}

            {/* 작가 철학 */}
            {artist.philosophy && (
              <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  작가 철학
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {artist.philosophy}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
