'use client'

import { useCallback, useState, type SyntheticEvent } from 'react'

const MIN_RATIO = 0.25
const MAX_RATIO = 4
// 이 정도 차이는 눈에 띄지 않으니 교정하지 않는다 (레이아웃 이동 최소화)
const TOLERANCE = 0.05

/**
 * 데이터에서 추정한 비율로 먼저 자리를 잡고, 이미지가 로드되면 실제 픽셀 비율로 교정한다.
 * (Airtable의 aspectRatio·dimensions가 실제 사진과 다른 경우가 있어서)
 */
export function useImageRatio(estimated: number) {
  const [measured, setMeasured] = useState<number | null>(null)

  const onLoad = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => {
      const { naturalWidth, naturalHeight } = event.currentTarget
      if (naturalWidth <= 0 || naturalHeight <= 0) return
      const actual = Math.min(
        MAX_RATIO,
        Math.max(MIN_RATIO, naturalWidth / naturalHeight)
      )
      if (Math.abs(actual - estimated) / estimated > TOLERANCE)
        setMeasured(actual)
    },
    [estimated]
  )

  return [measured ?? estimated, onLoad] as const
}
