/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'

// 실제로 메일을 보내지 않고, 보낼 메일 내용을 붙잡는다
const sendMail = jest.fn().mockResolvedValue({})
jest.mock('nodemailer', () => ({
  createTransport: () => ({ sendMail }),
}))

import { POST } from '@/app/api/contact/route'

const request = (body: Record<string, string>) =>
  new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    body: JSON.stringify(body),
  })

const base = {
  name: '홍길동',
  email: 'visitor@example.com',
  subject: '작품 문의',
  message: '「먹」 작품을 문의합니다.',
}

async function sentHtml(body: Record<string, string>): Promise<string> {
  sendMail.mockClear()
  const res = await POST(request(body))
  expect(res.status).toBe(200)
  return sendMail.mock.calls[0][0].html as string
}

describe('문의 메일 본문', () => {
  it('사이트 색·서체로 쓴다 (Arial·부트스트랩 기본색 없음)', async () => {
    const html = await sentHtml(base)
    expect(html).toContain('#1c1917') // 먹색 글자
    expect(html).toContain('#b8892c') // 금빛 제목 밑줄
    expect(html).toContain('Noto Sans KR')
    expect(html).not.toMatch(/Arial|#3498db|#2c3e50|#495057|#6c757d|#dee2e6/)
  })

  it('방문자 입력은 이스케이프되어 HTML 로 해석되지 않는다', async () => {
    const html = await sentHtml({
      ...base,
      name: '<b>굵게</b>',
      message: '<script>alert(1)</script>',
    })
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(html).toContain('&lt;b&gt;굵게&lt;/b&gt;')
  })

  it('전화번호는 적었을 때만 줄이 생긴다', async () => {
    expect(await sentHtml(base)).not.toContain('전화번호')
    expect(await sentHtml({ ...base, phone: '010-0000-0000' })).toContain(
      '010-0000-0000'
    )
  })
})
