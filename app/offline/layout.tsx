import type { Metadata } from 'next'
import type { ReactNode } from 'react'

// app/offline/page.tsx 는 클라이언트 컴포넌트라 metadata 를 내보낼 수 없어 여기서 정한다.
export const metadata: Metadata = {
  title: '인터넷 연결 없음',
}

export default function OfflineLayout({ children }: { children: ReactNode }) {
  return children
}
