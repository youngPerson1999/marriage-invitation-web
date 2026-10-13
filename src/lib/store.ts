import "server-only";

/**
 * RSVP 저장소: Upstash Redis REST API (Vercel Marketplace → Storage → Upstash for Redis 연결 시
 * 환경변수가 자동 주입됩니다). 별도 SDK 없이 fetch만 사용합니다.
 */
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = "rsvp:list";

export const storeEnabled = Boolean(url && token);

async function redis<T>(command: (string | number)[]): Promise<T> {
  const res = await fetch(url!, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis error ${res.status}`);
  const json = (await res.json()) as { result: T };
  return json.result;
}

export async function saveRsvp(entry: Record<string, unknown>) {
  if (!storeEnabled) {
    // 저장소 미연결 시 Vercel 로그(Functions → Logs)에서 확인 가능
    console.log("[rsvp]", JSON.stringify(entry));
    return;
  }
  await redis(["LPUSH", KEY, JSON.stringify(entry)]);
}

export async function listRsvp(): Promise<Record<string, unknown>[]> {
  if (!storeEnabled) return [];
  const rows = await redis<string[]>(["LRANGE", KEY, 0, -1]);
  return rows.map((r) => JSON.parse(r));
}
