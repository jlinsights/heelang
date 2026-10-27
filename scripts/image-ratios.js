const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

// 작품 이미지의 실제 픽셀 비율(가로/세로)을 lib/gallery/image-ratios.json 에 기록한다.
// Airtable 의 aspectRatio·dimensions 가 실제 사진과 달라, 갤러리가 이미지 로드 후
// 비율을 고치면서 레이아웃이 밀렸다(CLS). 미리 알고 있으면 처음부터 제자리에 놓인다.
// 사용: node scripts/image-ratios.js  (작품 이미지를 추가·교체한 뒤)

const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const ARTWORKS_DIR = path.join(PUBLIC_DIR, 'Images', 'Artworks')
const OUTPUT = path.join(__dirname, '..', 'lib', 'gallery', 'image-ratios.json')
// imageUrl 은 항상 -medium.jpg 를 가리킨다 (lib/image-utils.ts getArtworkImageUrl)
const SERVED_SUFFIX = '-medium.jpg'
const PRECISION = 1e4

function listServedImages(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return listServedImages(full)
    return entry.name.endsWith(SERVED_SUFFIX) ? [full] : []
  })
}

async function ratioOf(file) {
  const { width, height, orientation } = await sharp(file).metadata()
  if (!width || !height)
    throw new Error(`이미지 크기를 읽을 수 없습니다: ${file}`)
  // EXIF 5~8 은 90° 회전 — 브라우저는 회전된 모습으로 그린다
  const [w, h] = orientation >= 5 ? [height, width] : [width, height]
  return Math.round((w / h) * PRECISION) / PRECISION
}

async function readImageRatios() {
  const files = listServedImages(ARTWORKS_DIR).sort()
  const entries = await Promise.all(
    files.map(async (file) => [
      '/' + path.relative(PUBLIC_DIR, file).split(path.sep).join('/'),
      await ratioOf(file),
    ])
  )
  return Object.fromEntries(entries)
}

module.exports = { readImageRatios }

if (require.main === module) {
  readImageRatios()
    .then((ratios) => {
      fs.writeFileSync(OUTPUT, JSON.stringify(ratios, null, 2) + '\n')
      console.log(`✅ ${Object.keys(ratios).length}개 이미지 비율 → ${OUTPUT}`)
    })
    .catch((error) => {
      console.error('❌ 이미지 비율 생성 실패:', error)
      process.exit(1)
    })
}
