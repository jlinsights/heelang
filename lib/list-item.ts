// 줄바꿈 없는 공백(U+00A0). 소스에 글자 그대로 두면 일반 공백과 구분이 안 돼
// 누군가 지우기 쉽고, 포매터가 유니코드 이스케이프를 글자로 바꿔 버린다.
export const NBSP = String.fromCharCode(0xa0)

/**
 * 이력 항목("2024 | 단체전 | 김포아트홀")의 구분자 `|` 를 앞 단어에 묶는다.
 * `|` 앞 공백을 줄바꿈 없는 공백으로 바꿔, 좁은 화면에서 줄이 `|` 로 시작하지 않게 한다.
 */
export function keepSeparatorWithPrevious(item: string): string {
  return item.replace(/\s+\|\s+/g, `${NBSP}| `)
}
