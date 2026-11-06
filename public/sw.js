// 서비스 워커 버전 — 캐시 내용·전략을 바꾸면 올린다. 이름이 바뀐 옛 캐시는
// activate 에서 지워진다(옛 버전이 내주던 낡은 CSS·HTML 도 함께 사라진다).
const VERSION = 'v1.1.0'
const STATIC_CACHE = `static-${VERSION}`
const IMAGES_CACHE = `images-${VERSION}`
const API_CACHE = `api-${VERSION}`

// 연결이 끊겼을 때 보여 줄 페이지. 설치는 이 파일을 캐시해야만 성공한다.
const OFFLINE_URL = '/offline'

// 함께 미리 담아 두면 좋은 것들. 하나가 실패해도 설치를 막지 않는다.
// (예전 목록에 있던 globals.css 는 존재하지 않는 주소(404)라 cache.addAll 이
// 통째로 실패했고, 그래서 오프라인 페이지도 캐시되지 않았다.)
const OPTIONAL_PRECACHE = ['/', '/gallery', '/manifest.json']

// 이미지 파일 확장자
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']

// 설치 이벤트 - 필수 파일들을 캐시
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker: Installing...')
  
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE)
      // 오프라인 페이지는 필수 — 실패하면 설치가 실패하고 옛 워커가 계속 일한다
      await cache.add(OFFLINE_URL)
      // 나머지는 되는 것만 담는다
      await Promise.allSettled(OPTIONAL_PRECACHE.map((url) => cache.add(url)))
      // 즉시 활성화
      await self.skipWaiting()
    })()
  )
})

// 활성화 이벤트 - 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // 현재 버전이 아닌 캐시 삭제
            if (cacheName !== STATIC_CACHE && 
                cacheName !== IMAGES_CACHE && 
                cacheName !== API_CACHE) {
              console.log('🗑️ Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('🚀 Service Worker: Activation complete')
        // 모든 클라이언트에서 즉시 제어
        return self.clients.claim()
      })
  )
})

// Fetch 이벤트 - 네트워크 요청 처리
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // GET 요청만 처리
  if (request.method !== 'GET') return
  
  // 외부 도메인 요청은 무시
  if (url.origin !== location.origin) return
  
  // 요청 타입에 따른 캐시 전략
  if (isImageRequest(request)) {
    // 이미지: Cache First (캐시 우선)
    event.respondWith(cacheFirstStrategy(request, IMAGES_CACHE))
  } else if (isStaticAsset(request)) {
    // 정적 자원: Cache First
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE))
  } else if (isPageRequest(request)) {
    // 페이지: Network First (네트워크 우선)
    event.respondWith(networkFirstStrategy(request, STATIC_CACHE))
  } else {
    // 기타: Network First
    event.respondWith(networkFirstStrategy(request, API_CACHE))
  }
})

// 이미지 요청 확인
function isImageRequest(request) {
  const url = new URL(request.url)
  return IMAGE_EXTENSIONS.some(ext => url.pathname.includes(ext)) ||
         request.destination === 'image'
}

// 정적 자원 확인
function isStaticAsset(request) {
  const url = new URL(request.url)
  return url.pathname.includes('/_next/') ||
         url.pathname.includes('/static/') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.woff') ||
         url.pathname.endsWith('.woff2')
}

// 페이지 요청 확인
function isPageRequest(request) {
  const accept = request.headers.get('accept') || ''
  return request.mode === 'navigate' ||
         (request.method === 'GET' && accept.includes('text/html'))
}

// 캐시에 없는 페이지를 연결 없이 열었을 때의 응답.
// cache.match() 는 Promise 라 `match() || 대체응답` 은 늘 Promise 쪽을 고른다 —
// 그래서 예전에는 대체 응답이 한 번도 쓰이지 않았다. 결과를 기다린 뒤 고른다.
async function offlineResponse() {
  const cache = await caches.open(STATIC_CACHE)
  const cached = await cache.match(OFFLINE_URL)
  return cached || new Response('<!doctype html><meta charset="utf-8"><title>인터넷 연결 없음</title><p>인터넷 연결이 없습니다. 연결을 확인한 뒤 다시 시도해 주세요.</p>', {
    status: 503,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  })
}

// Cache First 전략 (캐시 우선)
async function cacheFirstStrategy(request, cacheName) {
  try {
    // 캐시에서 먼저 찾기
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      console.log('💾 Cache hit:', request.url)
      return cachedResponse
    }
    
    // 캐시에 없으면 네트워크에서 가져오기
    console.log('🌐 Cache miss, fetching:', request.url)
    const networkResponse = await fetch(request)
    
    // 성공적인 응답만 캐시
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('❌ Cache first strategy failed:', error)
    
    // 이미지 요청 실패 시 placeholder 반환
    if (isImageRequest(request)) {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="currentColor"><rect width="100%" height="100%" fill="#f3f0ea"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b6560">이미지를 로드할 수 없습니다</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      )
    }
    
    // 페이지 요청 실패 시 오프라인 페이지
    if (isPageRequest(request)) {
      return offlineResponse()
    }
    
    throw error
  }
}

// Network First 전략 (네트워크 우선)
async function networkFirstStrategy(request, cacheName) {
  try {
    // 네트워크에서 먼저 시도
    console.log('🌐 Network first:', request.url)
    const networkResponse = await fetch(request)
    
    // 성공적인 응답은 캐시에 저장
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('💾 Network failed, trying cache:', request.url)
    
    // 네트워크 실패 시 캐시에서 찾기
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // 캐시에도 없으면 오프라인 페이지
    if (isPageRequest(request)) {
      return offlineResponse()
    }
    
    throw error
  }
}

// 백그라운드 동기화 (선택사항)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  console.log('🔄 Background sync triggered')
  // 여기에 백그라운드에서 처리할 작업 추가
}

// 푸시 알림 (선택사항)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: '작품 보기',
          icon: '/icons/icon-96x96.png'
        },
        {
          action: 'close',
          title: '닫기'
        }
      ]
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/gallery')
    )
  }
}) 