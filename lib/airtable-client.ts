/*
  Airtable Client Helper
  ----------------------
  1. 환경 변수 검사 (build-time 에러 방지)
  2. Singleton 패턴으로 Airtable Base 재사용 → 연결 비용/Rate-Limit 보호
  3. requestTimeout 기본 5초, endpointUrl 명시
*/

/** 필수 ENV 확인 */
function assertAirtableEnv() {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error(
      "[Airtable] AIRTABLE_API_KEY 또는 AIRTABLE_BASE_ID 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요."
    );
  }
}

let basePromise: Promise<
  ReturnType<typeof import("airtable").default>["base"]
> | null = null;

/**
 * 재사용 가능한 Airtable Base 인스턴스 반환
 */
export async function getBase() {
  if (basePromise) return basePromise;

  assertAirtableEnv();
  basePromise = (async () => {
    const { default: Airtable } = await import("airtable");
    const airtable = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY!,
      requestTimeout: 5000,
      endpointUrl: "https://api.airtable.com",
    });
    return airtable.base(process.env.AIRTABLE_BASE_ID!);
  })();

  return basePromise;
}
