import { ArtNavigation, NavigationSpacer } from '@/components/art-navigation'
import type { ReactNode } from 'react'

/**
 * 404·오류처럼 본문 대신 상태를 알리는 화면. 사이트 메뉴를 그대로 두어 홈 말고도
 * 갈 곳이 있게 하고, 제목은 홈 히어로와 같은 세리프로 쓴다. 장식 아이콘은 두지 않는다.
 */
export function StatusPage({
  title,
  message,
  actions,
}: {
  title: ReactNode
  message: ReactNode
  actions: ReactNode
}) {
  return (
    <div className='min-h-screen bg-background'>
      <ArtNavigation />
      <NavigationSpacer />
      <main className='container-art flex min-h-[calc(100svh-12rem)] flex-col items-center justify-center py-24 text-center'>
        <h1 className='font-display text-4xl font-bold tracking-[0.04em] text-foreground md:text-5xl'>
          {title}
        </h1>
        <div className='mx-auto mt-6 h-px w-16 bg-gold' />
        <p className='mx-auto mt-6 max-w-sm text-lg leading-relaxed text-muted-foreground'>
          {message}
        </p>
        <div className='mt-10 flex flex-col items-center gap-4 sm:flex-row'>
          {actions}
        </div>
      </main>
    </div>
  )
}

export const statusPrimaryClass =
  'inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85 focus-art'

export const statusSecondaryClass =
  'hit-area text-sm text-muted-foreground underline-offset-4 decoration-gold hover:text-foreground hover:underline focus-art'
