"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { MountainIcon } from "lucide-react"
import { ThemeToggleButton } from "./theme-toggle-button"
import { LanguageSwitcher } from "./language-switcher"
import { useTranslations, useLocale } from "next-intl"

export function SiteHeader() {
  const t = useTranslations("SiteHeader")
  const locale = useLocale()
  
  // 기본 언어(ko)는 URL에 포함하지 않음
  const getLocalizedPath = (path: string) => {
    if (locale === 'ko') {
      return path
    }
    return `/${locale}${path}`
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link 
          href={getLocalizedPath("/")} 
          className="mr-6 flex items-center space-x-2"
          aria-label={t("goToHome")}
        >
          <MountainIcon 
            className="h-6 w-6 text-neutral-700 dark:text-neutral-300"
            aria-hidden="true"
          />
          <span className="font-bold sm:inline-block text-neutral-800 dark:text-neutral-200">
            {t("title")}
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2 text-sm ml-auto" role="navigation" aria-label={t("mainNavigation")}>
          <Link
            href={getLocalizedPath("/gallery")}
            className="px-2 py-1 text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500 rounded"
          >
            {t("galleryLink")}
          </Link>
          <Link
            href={getLocalizedPath("/artist")}
            className="px-2 py-1 text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500 rounded"
          >
            {t("artistLink")}
          </Link>
          <ThemeToggleButton />
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}
