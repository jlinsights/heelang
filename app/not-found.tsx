import {
  StatusPage,
  statusPrimaryClass,
  statusSecondaryClass,
} from '@/components/status-page'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

// 전역 not-found 페이지 (문구: COPY.md 상태 문구 표)
export default function NotFound() {
  return (
    <StatusPage
      title='404'
      message='죄송합니다. 찾으시는 페이지가 존재하지 않습니다.'
      actions={
        <>
          <Link href='/gallery' className={statusPrimaryClass}>
            작품 보기
            <ArrowRight className='h-4 w-4' aria-hidden='true' />
          </Link>
          <Link href='/' className={statusSecondaryClass}>
            홈으로 돌아가기
          </Link>
        </>
      }
    />
  )
}
