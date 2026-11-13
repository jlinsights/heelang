import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { CONTACT_EMAIL } from '@/lib/site'

// 문의 폼 데이터 스키마
const contactSchema = z.object({
  name: z.string().min(1, '이름을 입력해 주세요'),
  email: z.string().email('유효한 이메일 주소를 입력해 주세요'),
  phone: z.string().optional(),
  subject: z.string().min(1, '제목을 입력해 주세요'),
  message: z.string().min(1, '문의 내용을 입력해 주세요'),
})

// 방문자 입력을 메일 HTML 에 넣기 전에 이스케이프한다(HTML 주입 방지)
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 입력 데이터 검증
    const parsed = contactSchema.parse(body)
    const validatedData = {
      name: escapeHtml(parsed.name),
      email: escapeHtml(parsed.email),
      phone: parsed.phone ? escapeHtml(parsed.phone) : undefined,
      subject: escapeHtml(parsed.subject),
      message: escapeHtml(parsed.message),
    }

    // 이메일 전송 로직 (Nodemailer 사용)
    const { createTransport } = await import('nodemailer')

    // SMTP 설정 (환경변수 사용)
    const transporter = createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // 이메일 내용 구성
    const mailOptions = {
      from: `"희랑 갤러리 문의" <${process.env.SMTP_USER}>`,
      to: CONTACT_EMAIL,
      subject: `[희랑 갤러리 문의] ${parsed.subject}`,
      // 사이트 색(DESIGN.md)과 같은 값. 메일 앱은 CSS 변수를 못 읽어 값을 그대로 쓴다.
      html: `
        <div style="font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #fdfcfa; color: #1c1917; line-height: 1.7;">
          <h2 style="font-family: 'Noto Serif KR', 'AppleMyungjo', serif; font-weight: 400; font-size: 30px; margin: 0 0 16px; padding-bottom: 12px; border-bottom: 2px solid #b8892c;">
            희랑 갤러리 문의
          </h2>

          <table role="presentation" style="width: 100%; border-collapse: collapse; border-top: 1px solid #e7e3dc; font-size: 16px;">
            <tr>
              <td style="width: 88px; padding: 10px 0; color: #6b6560; border-bottom: 1px solid #e7e3dc; vertical-align: top;">이름</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e7e3dc;">${validatedData.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6b6560; border-bottom: 1px solid #e7e3dc; vertical-align: top;">이메일</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e7e3dc;">${validatedData.email}</td>
            </tr>
            ${
              validatedData.phone
                ? `<tr>
              <td style="padding: 10px 0; color: #6b6560; border-bottom: 1px solid #e7e3dc; vertical-align: top;">전화번호</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e7e3dc;">${validatedData.phone}</td>
            </tr>`
                : ''
            }
            <tr>
              <td style="padding: 10px 0; color: #6b6560; border-bottom: 1px solid #e7e3dc; vertical-align: top;">제목</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e7e3dc;">${validatedData.subject}</td>
            </tr>
          </table>

          <p style="margin: 24px 0 8px; font-size: 13px; color: #6b6560;">문의 내용</p>
          <div style="background-color: #f7f4ef; padding: 16px; border-radius: 12px; white-space: pre-wrap; font-size: 16px;">${validatedData.message}</div>

          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e7e3dc; color: #6b6560; font-size: 13px;">
            <p style="margin: 0;">이 메시지는 희랑 갤러리 웹사이트의 문의 폼을 통해 전송되었습니다.</p>
            <p style="margin: 4px 0 0;">전송 시간: ${new Date().toLocaleString('ko-KR', {
              timeZone: 'Asia/Seoul',
            })}</p>
          </div>
        </div>
      `,
    }

    // 이메일 전송
    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      { message: '문의가 성공적으로 전송되었습니다.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다.', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: '문의 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 }
    )
  }
}
