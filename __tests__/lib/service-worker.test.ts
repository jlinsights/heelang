/**
 * public/sw.js 를 가짜 캐시·네트워크 위에서 돌려 본다.
 * 예전 워커는 프리캐시 목록의 '/globals.css'(404) 때문에 cache.addAll 이 통째로
 * 실패해 '/offline' 을 담지 못했고, `cache.match() || 대체응답` 실수로 대체 응답도
 * 쓰이지 않았다. 그래서 처음 여는 페이지에서 연결이 끊기면 브라우저 오류 화면이 떴다.
 */
import { readFileSync } from 'fs'
import path from 'path'
import vm from 'vm'

type Handler = (event: FakeEvent) => void
interface FakeEvent {
  request?: FakeRequest
  waitUntil: (p: Promise<unknown>) => void
  respondWith: (p: Promise<unknown> | unknown) => void
}
interface FakeRequest {
  url: string
  method: string
  mode: string
  destination: string
  headers: { get: (name: string) => string | null }
}
interface FakeResponse {
  ok: boolean
  status: number
  body: string
  clone: () => FakeResponse
}

const ORIGIN = 'https://heelang.test'

function response(body: string, status = 200): FakeResponse {
  const r: FakeResponse = {
    ok: status >= 200 && status < 300,
    status,
    body,
    clone: () => r,
  }
  return r
}

function setup(opts: { online: Set<string>; networkDown?: boolean }) {
  const stores = new Map<string, Map<string, FakeResponse>>()
  const keyOf = (req: string | FakeRequest) =>
    new URL(typeof req === 'string' ? req : req.url, ORIGIN).pathname

  const fetchImpl = async (req: string | FakeRequest) => {
    if (opts.networkDown) throw new TypeError('Failed to fetch')
    const p = keyOf(req)
    return opts.online.has(p) ? response(`page:${p}`) : response('missing', 404)
  }

  const openCache = async (name: string) => {
    if (!stores.has(name)) stores.set(name, new Map())
    const store = stores.get(name)!
    return {
      add: async (req: string) => {
        const res = await fetchImpl(req)
        if (!res.ok) throw new TypeError(`bad status ${res.status}`)
        store.set(keyOf(req), res)
      },
      addAll: async (reqs: string[]) => {
        const all = await Promise.all(reqs.map((r) => fetchImpl(r)))
        if (all.some((r) => !r.ok)) throw new TypeError('addAll failed')
        reqs.forEach((r, i) => store.set(keyOf(r), all[i]))
      },
      put: async (req: FakeRequest, res: FakeResponse) => {
        store.set(keyOf(req), res)
      },
      match: async (req: string | FakeRequest) => store.get(keyOf(req)),
    }
  }

  const handlers: Record<string, Handler> = {}
  const skipWaiting = jest.fn(async () => undefined)
  class FakeResponseCtor {
    ok: boolean
    constructor(
      public body: string,
      public init: { status: number }
    ) {
      this.ok = init.status < 300
    }
  }

  const sandbox = {
    self: {
      addEventListener: (type: string, fn: Handler) => {
        handlers[type] = fn
      },
      skipWaiting,
      clients: { claim: async () => undefined },
      registration: { showNotification: async () => undefined },
    },
    caches: {
      open: openCache,
      keys: async () => [...stores.keys()],
      delete: async (n: string) => stores.delete(n),
    },
    fetch: fetchImpl,
    location: { origin: ORIGIN },
    URL,
    Response: FakeResponseCtor,
    Promise,
    console: { log: () => {}, error: () => {} },
    clients: { openWindow: async () => undefined },
  }
  vm.runInNewContext(
    readFileSync(path.join(process.cwd(), 'public/sw.js'), 'utf8'),
    sandbox
  )

  const install = async () => {
    let done: Promise<unknown> = Promise.resolve()
    handlers.install({
      waitUntil: (p) => (done = p),
      respondWith: () => {},
    })
    await done
  }

  const navigate = async (pathname: string) => {
    let res: unknown
    handlers.fetch({
      request: {
        url: ORIGIN + pathname,
        method: 'GET',
        mode: 'navigate',
        destination: 'document',
        headers: { get: () => 'text/html' },
      },
      waitUntil: () => {},
      respondWith: (p) => (res = p),
    })
    return (await res) as FakeResponse | FakeResponseCtor | undefined
  }

  return { install, navigate, stores, skipWaiting, opts }
}

const SITE = new Set(['/', '/gallery', '/manifest.json', '/offline'])

describe('서비스 워커 설치', () => {
  it('/offline 을 미리 담고 바로 활성화한다', async () => {
    const sw = setup({ online: SITE })
    await sw.install()
    const cached = [...sw.stores.values()].flatMap((s) => [...s.keys()])
    expect(cached).toContain('/offline')
    expect(sw.skipWaiting).toHaveBeenCalled()
  })

  it('선택 항목 하나가 404 여도 /offline 은 담긴다', async () => {
    const sw = setup({ online: new Set(['/offline', '/manifest.json']) })
    await sw.install()
    const cached = [...sw.stores.values()].flatMap((s) => [...s.keys()])
    expect(cached).toContain('/offline')
    expect(cached).not.toContain('/gallery')
  })

  it('존재하지 않는 /globals.css 를 프리캐시 목록에 두지 않는다', () => {
    const src = readFileSync(path.join(process.cwd(), 'public/sw.js'), 'utf8')
    expect(src).not.toMatch(/['"]\/globals\.css['"]/)
  })
})

describe('연결이 끊긴 채 처음 여는 페이지', () => {
  it('캐시해 둔 오프라인 페이지를 보여 준다', async () => {
    const sw = setup({ online: SITE })
    await sw.install()
    sw.opts.networkDown = true
    const res = (await sw.navigate('/exhibitions')) as FakeResponse
    expect(res.body).toBe('page:/offline')
  })

  it('오프라인 페이지마저 없으면 503 안내 문서를 돌려준다(빈 응답이 아니다)', async () => {
    const sw = setup({ online: SITE, networkDown: true })
    const res = (await sw.navigate('/exhibitions')) as unknown as {
      init: { status: number }
      body: string
    }
    expect(res).toBeDefined()
    expect(res.init.status).toBe(503)
    expect(res.body).toContain('인터넷 연결이 없습니다')
  })

  it('한 번 본 페이지는 캐시에서 다시 연다', async () => {
    const sw = setup({ online: SITE })
    await sw.install()
    await sw.navigate('/gallery')
    sw.opts.networkDown = true
    const res = (await sw.navigate('/gallery')) as FakeResponse
    expect(res.body).toBe('page:/gallery')
  })
})
