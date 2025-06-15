"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// 스폰서 로고 컴포넌트
function SponsorLogo({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc,
  fallbackClassName,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackSrc?: string;
  fallbackClassName?: string;
}) {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [usingFallback, setUsingFallback] = useState(false);

  const handleImageError = () => {
    if (fallbackSrc && currentSrc === src) {
      setCurrentSrc(fallbackSrc);
      setUsingFallback(true);
    } else {
      setImageError(true);
    }
  };

  if (imageError) {
    return (
      <div
        className={`flex items-center justify-center text-xs text-[#fcfcfc]/40 ${className}`}
      >
        {alt}
      </div>
    );
  }

  const imageClassName =
    usingFallback && fallbackClassName ? fallbackClassName : className;

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={imageClassName}
      onError={handleImageError}
    />
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#222222] text-[#fcfcfc] dark:bg-[#111111] py-12">
      <div className="container mx-auto px-4">
        {/* 회사 정보 및 메뉴 링크 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* 회사 정보 */}
          <div className="md:col-span-1 lg:col-span-1">
            <Link href="/" className="block mb-4">
              <Image
                src="/logos/Logo & Tagline_black BG.png"
                alt="동양서예협회 | Oriental Calligraphy Association"
                width={200}
                height={80}
                className="h-16 w-auto object-contain"
                priority
              />
            </Link>
            <div className="mt-4 space-y-1">
              <p className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70">
                고유번호: 209-82-11380
              </p>
              <p className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70">
                ☎︎ 0502-5550-8700
              </p>
              <p className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70">
                FAX: 0504-256-6600
              </p>
              <p className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70">
                info@orientalcalligraphy.org
              </p>
              <p className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70">
                서울시 성북구 보문로 57-1,
              </p>
              <p className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70">
                중앙빌딩 6층 (보문동7가)
              </p>
              <p className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70">
                무통장 입금계좌: 신한은행 100-028-611714
              </p>
            </div>
          </div>

          {/* 전시 메뉴 */}
          <div>
            <h3 className="text-sm font-medium mb-4">전시</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/exhibitions/current"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  현재 전시
                </Link>
              </li>
              <li>
                <Link
                  href="/exhibitions/upcoming"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  예정 전시
                </Link>
              </li>
              <li>
                <Link
                  href="/exhibitions/past"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  지난 전시
                </Link>
              </li>
              <li>
                <Link
                  href="/exhibitions/online"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  온라인 전시
                </Link>
              </li>
            </ul>
          </div>

          {/* 작품 메뉴 */}
          <div>
            <h3 className="text-sm font-medium mb-4">작품</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/artworks?category=한글서예"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  한글서예
                </Link>
              </li>
              <li>
                <Link
                  href="/artworks?category=한자서예"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  한자서예
                </Link>
              </li>
              <li>
                <Link
                  href="/artworks?category=문인화"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  문인화
                </Link>
              </li>
              <li>
                <Link
                  href="/artworks?category=수묵화"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  수묵화
                </Link>
              </li>
              <li>
                <Link
                  href="/artworks?category=민화"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  민화
                </Link>
              </li>
              <li>
                <Link
                  href="/artworks?category=현대서예"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  현대서예
                </Link>
              </li>
              <li>
                <Link
                  href="/artworks?category=캘리그라피"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  캘리그라피
                </Link>
              </li>
              <li>
                <Link
                  href="/artworks?category=전각"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  전각
                </Link>
              </li>
              <li>
                <Link
                  href="/artworks?category=서각"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  서각
                </Link>
              </li>
            </ul>
          </div>

          {/* 작가 메뉴 */}
          <div>
            <h3 className="text-sm font-medium mb-4">작가</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/artist"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  작가 소개
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  작품 갤러리
                </Link>
              </li>
              <li>
                <Link
                  href="/exhibition"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  전시 정보
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* 소개 메뉴 */}
          <div>
            <h3 className="text-sm font-medium mb-4">소개</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  개요
                </Link>
              </li>
              <li>
                <Link
                  href="/regulations"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  회칙
                </Link>
              </li>
              <li>
                <Link
                  href="/about/history"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  연혁
                </Link>
              </li>
              <li>
                <Link
                  href="/organization"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  조직도
                </Link>
              </li>
              <li>
                <Link
                  href="/brand"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  브랜드
                </Link>
              </li>
            </ul>
          </div>

          {/* 소식 메뉴 */}
          <div>
            <h3 className="text-sm font-medium mb-4">소식</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/notice"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  공지사항
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  행사
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  뉴스
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-xs text-[#fcfcfc]/70 dark:text-[#fcfcfc]/70 hover:text-[#fcfcfc] dark:hover:text-white transition-colors"
                >
                  갤러리
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 뉴스레터 구독 및 법적 페이지 링크 */}
        <div className="border-t border-[#fcfcfc]/10 dark:border-[#fcfcfc]/10 pt-6 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-6">
            {/* 뉴스레터 구독 */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Link
                href="https://orientalcalligraphy.stibee.com/subscribe/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-wider hover:text-[#fcfcfc]/80 transition-colors"
              >
                뉴스레터 구독
              </Link>
            </div>

            {/* 구분선 */}
            <div className="hidden md:block w-px h-8 bg-[#fcfcfc]/20"></div>

            {/* 법적 페이지 링크 */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link
                href="/terms-of-service"
                className="text-xs text-[#fcfcfc]/70 hover:text-[#fcfcfc] transition-colors"
              >
                이용약관
              </Link>
              <Link
                href="/privacy-policy"
                className="text-xs text-[#fcfcfc]/70 hover:text-[#fcfcfc] transition-colors"
              >
                개인정보처리방침
              </Link>
              <Link
                href="/copyright-policy"
                className="text-xs text-[#fcfcfc]/70 hover:text-[#fcfcfc] transition-colors"
              >
                저작권 정책
              </Link>
              <Link
                href="/email-refuse"
                className="text-xs text-[#fcfcfc]/70 hover:text-[#fcfcfc] transition-colors"
              >
                이메일 무단수집 거부
              </Link>
            </div>
          </div>
        </div>

        {/* 저작권 및 파트너 로고 */}
        <div className="border-t border-[#fcfcfc]/10 dark:border-[#fcfcfc]/10 pt-6 mt-6">
          {/* 파트너 */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 opacity-60 mb-6">
            {/* 삼성금융네트웍스 */}
            <Link
              href="https://familyoffices.vip/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#fcfcfc]/40 hover:text-[#fcfcfc]/70 transition-colors"
            >
              삼성금융네트웍스
            </Link>

            {/* 예술의전당 */}
            <Link
              href="https://www.sac.or.kr/site/main/home"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#fcfcfc]/40 hover:text-[#fcfcfc]/70 transition-colors"
            >
              예술의전당
            </Link>

            {/* 대한검정회 */}
            <Link
              href="https://www.hanja.ne.kr/index_original.asp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#fcfcfc]/40 hover:text-[#fcfcfc]/70 transition-colors"
            >
              대한검정회
            </Link>

            {/* 서울특별시 */}
            <Link
              href="https://www.seoul.go.kr/main/index.jsp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#fcfcfc]/40 hover:text-[#fcfcfc]/70 transition-colors"
            >
              서울특별시
            </Link>

            {/* 문화체육관광부 */}
            <Link
              href="https://www.mcst.go.kr/kor/main/jsp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#fcfcfc]/40 hover:text-[#fcfcfc]/70 transition-colors"
            >
              문화체육관광부
            </Link>
          </div>

          {/* 저작권 표시 */}
          <div className="text-center">
            <p className="text-xs text-[#fcfcfc]/60 dark:text-[#fcfcfc]/60">
              © The Asian Society of Calligraphic Arts (ASCA). All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
