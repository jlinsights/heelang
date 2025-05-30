"use client"

import { Languages } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { locales, defaultLocale } from "@/i18n"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()
  const t = useTranslations("LanguageSwitcher")

  const onSelectLocale = (locale: string) => {
    let newPath = pathname
    const currentPathWithoutLocale = pathname.startsWith(`/${currentLocale}`)
      ? pathname.substring(`/${currentLocale}`.length) || "/"
      : pathname

    if (locale === defaultLocale) {
      newPath = currentPathWithoutLocale
    } else {
      newPath = `/${locale}${currentPathWithoutLocale}`
    }

    // Ensure leading slash for root path if it becomes empty
    if (newPath === "") newPath = "/"
    if (locale !== defaultLocale && !newPath.startsWith(`/${locale}`)) {
      newPath = `/${locale}${newPath.startsWith("/") ? "" : "/"}${newPath}`
    }
    if (newPath !== "/" && newPath.endsWith("/")) {
      newPath = newPath.slice(0, -1)
    }

    router.push(newPath)
  }

  const languageNames: { [key: string]: string } = {
    ko: t('korean'),
    en: t('english'),
    ja: t('japanese'),
    zh: t('chinese'),
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change language">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((localeCode) => (
          <DropdownMenuItem
            key={localeCode}
            onClick={() => onSelectLocale(localeCode)}
            disabled={currentLocale === localeCode}
            className="cursor-pointer"
          >
            {languageNames[localeCode] || localeCode}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
