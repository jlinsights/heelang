"use client"

import { Languages } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useLocale } from "next-intl" // useTranslations 추가

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// locales와 defaultLocale은 i18n.ts 또는 navigation.ts에서 가져와야 합니다.
// 여기서는 예시로 직접 정의합니다. 실제 프로젝트에서는 import 하세요.
const locales = ["ko", "en", "ja", "zh"]
const defaultLocale = "ko"

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()
  // const t = useTranslations("LanguageSwitcher"); // 번역된 언어 이름을 위해

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
    // router.refresh(); // 필요에 따라
  }

  const languageNames: { [key: string]: string } = {
    ko: "한국어", // t('korean')
    en: "English", // t('english')
    ja: "日本語", // t('japanese')
    zh: "中文", // t('chinese')
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
