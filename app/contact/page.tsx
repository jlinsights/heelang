'use client'

import { ArtNavigation, NavigationSpacer } from '@/components/art-navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CONTACT_EMAIL } from '@/lib/site'
import { Loader2, Send } from 'lucide-react'
import { useState } from 'react'

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  // 토스트를 띄울 Toaster 가 없어 결과가 보이지 않았다 → 폼 아래에 직접 알린다
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null
  )
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      // API 는 성공 시 { message }, 실패 시 { error } 를 돌려준다 — 판정은 HTTP 상태로 한다
      const result: { message?: string; error?: string } = await response
        .json()
        .catch(() => ({}))

      if (response.ok) {
        setStatus({
          ok: true,
          message:
            '문의가 전송되었습니다. 남겨 주신 이메일로 답변드리겠습니다.',
        })

        // 폼 초기화
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        })
      } else {
        setStatus({
          ok: false,
          message: result.error || '문의 전송 중 오류가 발생했습니다.',
        })
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setStatus({
        ok: false,
        message: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen bg-background'>
      <ArtNavigation />
      <NavigationSpacer />

      <main className='container-art pb-24 pt-10 md:pt-16'>
        <header className='mb-10 md:mb-14 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='text-eyebrow'>Contact</p>
            <h1 className='mt-3 font-display text-4xl md:text-6xl text-foreground'>
              문의하기
            </h1>
          </div>
          <p className='max-w-md text-sm md:text-base text-muted-foreground'>
            작품 구매, 전시 관련 문의, 기타 궁금한 사항이 있으시면 언제든지
            연락해 주세요.
          </p>
        </header>

        <div className='grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16'>
          <section aria-labelledby='contact-info-title'>
            <h2 id='contact-info-title' className='text-eyebrow-ko'>
              연락처
            </h2>
            <dl className='mt-4 divide-y divide-border border-y border-border text-sm'>
              <div className='grid grid-cols-[5.5rem_1fr] gap-4 py-3'>
                <dt className='text-muted-foreground'>이메일</dt>
                <dd>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className='break-all text-foreground underline-offset-4 hover:underline focus-art'
                  >
                    {CONTACT_EMAIL}
                  </a>
                </dd>
              </div>
              <div className='grid grid-cols-[5.5rem_1fr] gap-4 py-3'>
                <dt className='text-muted-foreground'>전화</dt>
                <dd className='tabular-nums'>
                  <a
                    href='tel:010-3019-1417'
                    className='text-foreground underline-offset-4 hover:underline focus-art'
                  >
                    010-3019-1417
                  </a>
                </dd>
              </div>
              <div className='grid grid-cols-[5.5rem_1fr] gap-4 py-3'>
                <dt className='text-muted-foreground'>주소</dt>
                <dd className='text-foreground'>
                  〶10068 경기 김포시 김포한강8로 173-88, 611동 602호 (마산동,
                  한강신도시 동일스위트 더파크뷰 1단지)
                </dd>
              </div>
              <div className='grid grid-cols-[5.5rem_1fr] gap-4 py-3'>
                <dt className='text-muted-foreground'>운영 시간</dt>
                <dd className='text-foreground tabular-nums'>
                  월–금 10:00 – 18:00
                  <br />
                  토–일 10:00 – 17:00
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby='contact-form-title'>
            <h2 id='contact-form-title' className='text-eyebrow-ko'>
              문의 보내기
            </h2>
            <p className='mt-2 text-sm text-muted-foreground'>
              <span aria-hidden='true'>*</span> 표시는 꼭 적어 주세요.
            </p>
            <div className='mt-6'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>이름 *</Label>
                    <Input
                      id='name'
                      name='name'
                      type='text'
                      placeholder='이름을 입력해 주세요'
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='phone'>전화번호</Label>
                    <Input
                      id='phone'
                      name='phone'
                      type='tel'
                      placeholder='전화번호를 입력해 주세요'
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='email'>이메일 *</Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='이메일을 입력해 주세요'
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='subject'>제목 *</Label>
                  <Input
                    id='subject'
                    name='subject'
                    type='text'
                    placeholder='문의 제목을 입력해 주세요'
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='message'>문의 내용 *</Label>
                  <Textarea
                    id='message'
                    name='message'
                    placeholder='문의 내용을 자세히 입력해 주세요'
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50 focus-art sm:w-auto'
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        className='h-4 w-4 animate-spin'
                        aria-hidden='true'
                      />
                      전송 중...
                    </>
                  ) : (
                    <>
                      문의 보내기
                      <Send className='h-4 w-4' aria-hidden='true' />
                    </>
                  )}
                </button>
                <p
                  role='status'
                  aria-live='polite'
                  className='min-h-[1.5rem] text-sm text-foreground'
                >
                  {status && (
                    <>
                      <span
                        aria-hidden='true'
                        className={`mr-2 inline-block h-2 w-2 rounded-full align-middle ${status.ok ? 'bg-gold' : 'bg-foreground'}`}
                      />
                      {status.ok ? '' : '전송 실패 — '}
                      {status.message}
                    </>
                  )}
                </p>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
