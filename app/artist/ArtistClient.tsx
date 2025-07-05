"use client";

import { Artist } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";

interface ArtistClientProps {
  initialArtist: Artist;
}

export default function ArtistClient({ initialArtist }: ArtistClientProps) {
  const [artist, setArtist] = useState<Artist>(initialArtist);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 헤더 섹션 */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">작가 소개</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        {/* 작가 프로필 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* 프로필 이미지 */}
          <div className="lg:col-span-1">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={artist.profileImageUrl}
                alt={artist.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {artist.name}
              </h2>
              {artist.birthYear && (
                <p className="text-gray-600 mb-4">
                  {artist.birthYear}년생
                  {artist.birthPlace && ` • ${artist.birthPlace} 출생`}
                  {artist.currentLocation &&
                    ` • ${artist.currentLocation} 거주`}
                </p>
              )}
            </div>

            {/* 작가 소개 */}
            {artist.bio && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  작가 소개
                </h3>
                <p className="text-gray-700 leading-relaxed">{artist.bio}</p>
              </div>
            )}

            {/* 작가 노트 */}
            {artist.statement && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  작가 노트
                </h3>
                <p className="text-gray-700 leading-relaxed italic">
                  "{artist.statement}"
                </p>
              </div>
            )}

            {/* 연락처 정보 */}
            <div className="flex flex-wrap gap-4">
              {artist.email && (
                <a
                  href={`mailto:${artist.email}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {artist.email}
                </a>
              )}
              {artist.phone && (
                <a
                  href={`tel:${artist.phone}`}
                  className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {artist.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 상세 정보 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 학력 */}
          {artist.education && artist.education.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">학력</h3>
              <ul className="space-y-2">
                {artist.education.map((edu, index) => (
                  <li key={index} className="text-gray-700">
                    • {edu}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 전시 경력 */}
          {artist.exhibitions && artist.exhibitions.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                전시 경력
              </h3>
              <ul className="space-y-2">
                {artist.exhibitions.map((exhibition, index) => (
                  <li key={index} className="text-gray-700">
                    • {exhibition}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 수상 경력 */}
          {artist.awards && artist.awards.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                수상 경력
              </h3>
              <ul className="space-y-2">
                {artist.awards.map((award, index) => (
                  <li key={index} className="text-gray-700">
                    • {award}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 전문 분야 */}
          {artist.specialties && artist.specialties.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                전문 분야
              </h3>
              <div className="flex flex-wrap gap-2">
                {artist.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 영향을 받은 작가 */}
          {artist.influences && artist.influences.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                영향을 받은 작가
              </h3>
              <div className="flex flex-wrap gap-2">
                {artist.influences.map((influence, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {influence}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 기법 */}
          {artist.techniques && artist.techniques.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                주요 기법
              </h3>
              <div className="flex flex-wrap gap-2">
                {artist.techniques.map((technique, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {technique}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 소셜 링크 */}
        {artist.socialLinks && (
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              소셜 미디어
            </h3>
            <div className="flex justify-center gap-4">
              {artist.socialLinks.instagram && (
                <a
                  href={artist.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:shadow-lg transition-shadow"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
              {artist.socialLinks.facebook && (
                <a
                  href={artist.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-600 text-white rounded-full hover:shadow-lg transition-shadow"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {artist.socialLinks.website && (
                <a
                  href={artist.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-600 text-white rounded-full hover:shadow-lg transition-shadow"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                </a>
              )}
              {artist.socialLinks.youtube && (
                <a
                  href={artist.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-red-600 text-white rounded-full hover:shadow-lg transition-shadow"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
