'use client'

import { useEffect } from 'react'

/**
 * public/sw.js 를 등록한다(운영 빌드에서만).
 *
 * 새 워커는 설치되면 스스로 skipWaiting·clients.claim 으로 바로 넘겨받는다.
 * 페이지는 네트워크 우선이라 다음 이동부터 새 내용이 나오므로, 묻는 대화상자
 * (confirm)나 강제 새로 고침을 하지 않는다 — 감상 중이던 화면이 갑자기
 * 바뀌거나 입력하던 문의 내용이 사라지지 않게.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .catch((error: unknown) => {
          console.error('서비스 워커 등록 실패:', error)
        })
    }
  }, [])

  return null
}
