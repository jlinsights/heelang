import { ExhibitionsArchive } from '@/components/exhibitions/exhibitions-archive'
import { groupByYear, parseExhibitionLine } from '@/lib/exhibitions'
import { render, screen, within } from '@testing-library/react'

const groups = groupByYear(
  [
    '2025 | 개인전 | 길(Way) | 인사동 한국미술관',
    '2025 | 단체전 | 제65회 魁心書法院展 | 일본 긴자 요쿄홀',
    '2024 | 단체전 | Art Beyond Boundaries | 일본 롯폰기 국립신미술관',
  ].map(parseExhibitionLine)
)

describe('ExhibitionsArchive', () => {
  it('연도마다 제목을 두고 그 해의 전시를 목록으로 보여 준다', () => {
    render(<ExhibitionsArchive groups={groups} />)
    const years = screen.getAllByRole('heading', { level: 2 })
    expect(years.map((h) => h.textContent)).toEqual(['2025', '2024'])

    const section2025 = years[0].closest('section') as HTMLElement
    expect(within(section2025).getAllByRole('listitem')).toHaveLength(2)
  })

  it('구분과 장소를 함께 보여 준다', () => {
    render(<ExhibitionsArchive groups={groups} />)
    expect(
      screen.getByText('단체전 · 일본 롯폰기 국립신미술관')
    ).toBeInTheDocument()
  })

  it('기록 페이지가 있는 전시만 링크가 된다', () => {
    render(<ExhibitionsArchive groups={groups} />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', '/exhibitions/gil')
    expect(links[0]).toHaveAccessibleName(/길\(Way\)/)
  })
})
