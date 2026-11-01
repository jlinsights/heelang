import ContactPage from '@/app/contact/page'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

jest.mock('@/components/art-navigation', () => ({
  ArtNavigation: () => null,
  NavigationSpacer: () => null,
}))

function mockFetch(status: number, body: unknown) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  }) as unknown as typeof fetch
}

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText(/이름/), {
    target: { value: '홍길동' },
  })
  fireEvent.change(screen.getByLabelText(/이메일/), {
    target: { value: 'a@example.com' },
  })
  fireEvent.change(screen.getByLabelText(/제목/), { target: { value: '문의' } })
  fireEvent.change(screen.getByLabelText(/문의 내용/), {
    target: { value: '내용' },
  })
  fireEvent.click(screen.getByRole('button', { name: /문의 보내기/ }))
}

describe('문의 페이지 전송 결과', () => {
  it('API 가 200 { message } 를 돌려주면 성공으로 알리고 폼을 비운다', async () => {
    mockFetch(200, { message: '문의가 전송되었습니다.' })
    render(<ContactPage />)
    fillAndSubmit()

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        '문의가 전송되었습니다. 남겨 주신 이메일로 답변드리겠습니다.'
      )
    )
    expect(screen.getByRole('status')).not.toHaveTextContent('전송 실패')
    expect(screen.getByLabelText(/이름/)).toHaveValue('')
  })

  it('API 가 500 { error } 를 돌려주면 그 문구로 실패를 알리고 입력을 남긴다', async () => {
    mockFetch(500, {
      error: '문의 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    })
    render(<ContactPage />)
    fillAndSubmit()

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        '전송 실패 — 문의 전송 중 오류가 발생했습니다'
      )
    )
    expect(screen.getByLabelText(/이름/)).toHaveValue('홍길동')
  })
})
