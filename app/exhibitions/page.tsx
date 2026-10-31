import { ArtNavigation, NavigationSpacer } from '@/components/art-navigation'
import { ExhibitionsArchive } from '@/components/exhibitions/exhibitions-archive'
import {
  getExhibitionLines,
  groupByYear,
  parseExhibitionLine,
} from '@/lib/exhibitions'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'

export const dynamic = 'force-static'
export const revalidate = 3600

// 작가 정보와 같은 Airtable Artist 레코드에서 읽는다. 갤러리처럼 서버에서 직접 부른다
// (자기 /api/* 를 HTTP 로 부르면 빌드 때 빈 목록이 박힌다).
const getCachedLines = unstable_cache(
  getExhibitionLines,
  ['exhibition-lines'],
  {
    revalidate: 3600,
  }
)

export const metadata: Metadata = {
  title: '전시',
  description:
    '희랑 공경순이 참여한 개인전과 단체전 기록. 연도별로 전시 이름과 장소를 정리했습니다.',
}

export default async function ExhibitionsPage() {
  const groups = groupByYear((await getCachedLines()).map(parseExhibitionLine))

  return (
    <div className='min-h-screen bg-background'>
      <ArtNavigation />
      <NavigationSpacer />

      <main className='container-art pb-24 pt-10 md:pt-16'>
        <header className='mb-10 grid gap-4 md:mb-14 md:grid-cols-[1fr_auto] md:items-end'>
          <div>
            <p className='text-eyebrow'>Exhibitions</p>
            <h1 className='mt-3 font-display text-4xl text-foreground md:text-6xl'>
              전시
            </h1>
          </div>
          <p className='max-w-sm text-muted-foreground leading-relaxed'>
            개인전과 단체전 기록입니다. 기록 페이지가 있는 전시는 눌러서 자세히
            볼 수 있습니다.
          </p>
        </header>

        <ExhibitionsArchive groups={groups} />
      </main>
    </div>
  )
}
