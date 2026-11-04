import OfflinePage from '@/app/offline/page'
import { metadata } from '@/app/offline/layout'
import { render, screen } from '@testing-library/react'

describe('오프라인 페이지', () => {
  it('제목이 h1 이다', () => {
    render(<OfflinePage />)
    expect(
      screen.getByRole('heading', { level: 1, name: '인터넷 연결 없음' })
    ).toBeInTheDocument()
  })

  it('실제로 되는 일만 안내한다 — 한 번 본 페이지만 캐시에서 다시 열린다', () => {
    render(<OfflinePage />)
    expect(
      screen.getByText(
        '한 번 본 페이지와 작품은 연결이 없어도 다시 볼 수 있습니다.'
      )
    ).toBeInTheDocument()
    expect(screen.queryByText(/캐시된 버전으로 감상/)).not.toBeInTheDocument()
  })

  it('다음 행동으로 갈 수 있다', () => {
    render(<OfflinePage />)
    expect(
      screen.getByRole('button', { name: /다시 시도/ })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /홈으로 가기/ })).toHaveAttribute(
      'href',
      '/'
    )
    expect(screen.getByRole('link', { name: /갤러리 보기/ })).toHaveAttribute(
      'href',
      '/gallery'
    )
  })

  it('탭 제목은 페이지 이름이다', () => {
    expect(metadata.title).toBe('인터넷 연결 없음')
  })
})
