import { ArtNavigation, NavigationSpacer } from '@/components/art-navigation'

// 작품 상세와 같은 2단 구성(왼쪽 작품 무대, 오른쪽 캡션 표)으로 자리를 잡는다
export default function Loading() {
  return (
    <div className='min-h-screen bg-background'>
      <ArtNavigation />
      <NavigationSpacer />
      <main
        aria-busy='true'
        aria-label='작품을 불러오는 중'
        className='container-art pb-24 pt-8 md:pt-12'
      >
        <div className='mb-8 flex justify-between'>
          <div className='h-4 w-20 animate-pulse rounded bg-muted' />
          <div className='h-4 w-24 animate-pulse rounded bg-muted' />
        </div>
        <div className='grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(20rem,2fr)] lg:gap-16'>
          <div className='flex items-center justify-center bg-muted/60 px-6 py-10 lg:h-[calc(100svh-8rem)]'>
            <div className='aspect-[1/2] h-[60svh] max-h-full animate-pulse bg-muted' />
          </div>
          <div className='space-y-4'>
            <div className='h-3 w-24 animate-pulse rounded bg-muted' />
            <div className='h-10 w-2/3 animate-pulse rounded bg-muted md:h-12' />
            <div className='mt-8 divide-y divide-border border-y border-border'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='flex gap-6 py-3'>
                  <div className='h-4 w-16 animate-pulse rounded bg-muted' />
                  <div className='h-4 w-32 animate-pulse rounded bg-muted' />
                </div>
              ))}
            </div>
            <div className='space-y-2 pt-6'>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className='h-4 w-full animate-pulse rounded bg-muted'
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
