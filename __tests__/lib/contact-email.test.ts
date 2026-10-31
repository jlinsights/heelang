import fs from 'fs'
import path from 'path'
import { CONTACT_EMAIL } from '@/lib/site'

// 문의 이메일은 lib/site.ts 한곳에서만 정한다. 문의 페이지에 보이는 주소와
// 문의 폼이 실제로 보내는 주소가 어긋나면 문의가 엉뚱한 곳으로 간다.
const ROOT = path.resolve(__dirname, '../..')
const read = (file: string) => fs.readFileSync(path.join(ROOT, file), 'utf8')

describe('문의 이메일', () => {
  it('작가 문의 주소는 hrks.417@gmail.com 이다', () => {
    expect(CONTACT_EMAIL).toBe('hrks.417@gmail.com')
  })

  it.each(['app/contact/page.tsx', 'app/api/contact/route.ts'])(
    '%s 는 주소를 직접 적지 않고 CONTACT_EMAIL 을 쓴다',
    (file) => {
      const source = read(file)
      expect(source).toMatch(/CONTACT_EMAIL/)
      expect(source).not.toMatch(/heelang@orientalcalligraphy\.org/)
    }
  )
})
