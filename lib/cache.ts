// 메모리 캐시 구현
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  private timers = new Map<string, NodeJS.Timeout>()

  set(key: string, data: any, ttlSeconds = 300) {
    // 기존 타이머 정리
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key)!)
    }

    const timestamp = Date.now()
    const ttl = ttlSeconds * 1000
    
    this.cache.set(key, { data, timestamp, ttl })

    // TTL 타이머 설정
    const timer = setTimeout(() => {
      this.delete(key)
    }, ttl)
    
    this.timers.set(key, timer)
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    
    if (!item) return null
    
    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.delete(key)
      return null
    }
    
    return item.data
  }

  delete(key: string) {
    this.cache.delete(key)
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key)!)
      this.timers.delete(key)
    }
  }

  clear() {
    this.timers.forEach(timer => clearTimeout(timer))
    this.cache.clear()
    this.timers.clear()
  }

  size() {
    return this.cache.size
  }

  // 만료된 캐시 정리
  cleanup() {
    const now = Date.now()
    const keysToDelete: string[] = []
    
    this.cache.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key)
      }
    })
    
    keysToDelete.forEach(key => this.delete(key))
  }
}

// 전역 메모리 캐시 인스턴스
export const memoryCache = new MemoryCache()

// 정기적인 캐시 정리 (5분마다)
if (typeof window === 'undefined') {
  setInterval(() => {
    memoryCache.cleanup()
  }, 5 * 60 * 1000)
}

// 브라우저 로컬 스토리지 캐시
export class LocalStorageCache {
  private prefix: string

  constructor(prefix = 'app_cache_') {
    this.prefix = prefix
  }

  set(key: string, data: any, ttlSeconds = 3600) {
    if (typeof window === 'undefined') return

    const item = {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    }

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(item))
    } catch (error) {
      console.warn('LocalStorage cache set failed:', error)
    }
  }

  get(key: string): any | null {
    if (typeof window === 'undefined') return null

    try {
      const itemStr = localStorage.getItem(this.prefix + key)
      if (!itemStr) return null

      const item = JSON.parse(itemStr)
      const now = Date.now()
      
      if (now - item.timestamp > item.ttl) {
        this.delete(key)
        return null
      }
      
      return item.data
    } catch (error) {
      console.warn('LocalStorage cache get failed:', error)
      return null
    }
  }

  delete(key: string) {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(this.prefix + key)
    } catch (error) {
      console.warn('LocalStorage cache delete failed:', error)
    }
  }

  clear() {
    if (typeof window === 'undefined') return
    
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.warn('LocalStorage cache clear failed:', error)
    }
  }

  // 만료된 항목 정리
  cleanup() {
    if (typeof window === 'undefined') return
    
    try {
      const keys = Object.keys(localStorage)
      const now = Date.now()
      
      keys.forEach(storageKey => {
        if (storageKey.startsWith(this.prefix)) {
          const itemStr = localStorage.getItem(storageKey)
          if (itemStr) {
            try {
              const item = JSON.parse(itemStr)
              if (now - item.timestamp > item.ttl) {
                localStorage.removeItem(storageKey)
              }
            } catch {
              // 파싱 에러가 있는 항목 제거
              localStorage.removeItem(storageKey)
            }
          }
        }
      })
    } catch (error) {
      console.warn('LocalStorage cache cleanup failed:', error)
    }
  }
}

// 전역 로컬 스토리지 캐시 인스턴스
export const localStorageCache = new LocalStorageCache()

// Next.js 캐시 설정 헬퍼
export const cacheConfig = {
  // 정적 자산 캐싱 (1년)
  static: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
  
  // 이미지 캐싱 (1주일)
  images: {
    'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
  },
  
  // API 응답 캐싱 (5분)
  api: {
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
  },
  
  // 페이지 캐싱 (1시간)
  pages: {
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=300',
  },
  
  // 캐시 무효화
  noCache: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
}

// 캐시 키 생성 헬퍼
export function generateCacheKey(...parts: string[]): string {
  return parts.filter(Boolean).join(':')
}

// 캐시된 함수 래퍼
export function withCache<T extends (...args: any[]) => any>(
  fn: T,
  ttlSeconds = 300
): T {
  return ((...args: any[]) => {
    const key = generateCacheKey(fn.name, JSON.stringify(args))
    
    // 캐시된 결과 확인
    const cached = memoryCache.get(key)
    if (cached !== null) {
      return cached
    }
    
    // 함수 실행 및 결과 캐싱
    const result = fn(...args)
    memoryCache.set(key, result, ttlSeconds)
    
    return result
  }) as T
}

// 캐시된 비동기 함수 래퍼
export function withAsyncCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  ttlSeconds = 300
): T {
  return (async (...args: any[]) => {
    const key = generateCacheKey(fn.name, JSON.stringify(args))
    
    // 캐시된 결과 확인
    const cached = memoryCache.get(key)
    if (cached !== null) {
      return cached
    }
    
    // 함수 실행 및 결과 캐싱
    const result = await fn(...args)
    memoryCache.set(key, result, ttlSeconds)
    
    return result
  }) as T
} 