import type { Metadata } from 'next'
import type { ReactNode } from 'react'

// app/contact/page.tsx 는 클라이언트 컴포넌트라 metadata 를 내보낼 수 없어 여기서 정한다.
export const metadata: Metadata = {
  title: '문의',
  description: '희랑 공경순 작가에게 작품 구매, 전시, 강연 등을 문의하세요.',
}

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children
}
