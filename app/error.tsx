'use client'

import {
  StatusPage,
  statusPrimaryClass,
  statusSecondaryClass,
} from '@/components/status-page'
import Link from 'next/link'
import { useEffect } from 'react'

// 렌더 중 오류가 나면 Next.js 기본 화면 대신 사이트 안의 한 페이지로 알린다.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <StatusPage
      title='페이지를 불러오지 못했습니다'
      message='잠시 후 다시 시도해 주세요.'
      actions={
        <>
          <button type='button' onClick={reset} className={statusPrimaryClass}>
            다시 시도
          </button>
          <Link href='/' className={statusSecondaryClass}>
            홈으로 돌아가기
          </Link>
        </>
      }
    />
  )
}
