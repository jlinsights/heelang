"use client"

import Link from "next/link"
import { MountainIcon } from "lucide-react"
import { ThemeToggleButton } from "./theme-toggle-button"
import { LanguageSwitcher } from "./language-switcher" // 추가
import { useTranslations } from "next-intl" // 서버 컴포넌트에서 사용하려면 getTranslations

export function SiteHeader() {
  const t = useTranslations("SiteHeader") // 클라이언트 컴포넌트에서 사용

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <MountainIcon className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
          <span className="font-bold sm:inline-block text-neutral-800 dark:text-neutral-200">
            {t("title")} {/* 번역된 텍스트 사용 */}
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2 text-sm ml-auto">
          {" "}
          {/* 간격 조정 */}
          <Link
            href="/gallery"
            className="px-2 py-1 text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            {t("galleryLink")} {/* 번역된 텍스트 사용 */}
          </Link>
          <Link
            href="/artist"
            className="px-2 py-1 text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            {t("artistLink")} {/* 번역된 텍스트 사용 */}
          </Link>
          <ThemeToggleButton />
          <LanguageSwitcher /> {/* 추가 */}
        </nav>
      </div>
    </header>
  )
}
