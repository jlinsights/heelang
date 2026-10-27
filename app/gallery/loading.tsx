import { ArtNavigation, NavigationSpacer } from '@/components/art-navigation'

// 갤러리 그리드와 같은 비율 상자로 자리를 잡아, 로드 후 레이아웃이 크게 바뀌지 않게 한다
const RATIOS = [
  0.75, 0.5, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.25, 1.4, 0.5,
]

export default function Loading() {
  return (
    <div className='min-h-screen bg-background'>
      <ArtNavigation />
      <NavigationSpacer />
      <main
        aria-busy='true'
        aria-label='작품을 불러오는 중'
        className='container-art pb-24 pt-10 md:pt-16'
      >
        <div className='mb-10 md:mb-14 space-y-3'>
          <div className='h-3 w-20 animate-pulse rounded bg-muted' />
          <div className='h-10 w-32 animate-pulse rounded bg-muted md:h-14' />
        </div>
        <div className='mb-10 flex gap-2 border-b border-border pb-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className='h-7 w-20 animate-pulse rounded-full bg-muted'
            />
          ))}
        </div>
        <div className='flex flex-wrap gap-x-4 gap-y-10 md:gap-x-6 [--row-h:9rem] sm:[--row-h:12rem] lg:[--row-h:16rem]'>
          {RATIOS.map((ratio, i) => (
            <div
              key={i}
              style={{ flex: `${ratio} 1 calc(var(--row-h) * ${ratio})` }}
            >
              <div
                className='w-full animate-pulse bg-muted'
                style={{ aspectRatio: ratio }}
              />
              <div className='mt-3 h-4 w-2/3 animate-pulse rounded bg-muted' />
            </div>
          ))}
          <div aria-hidden='true' className='grow-[10] basis-0' />
        </div>
      </main>
    </div>
  )
}
