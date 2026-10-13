export type RsvpInput = {
  side: "groom" | "bride";
  attend: "yes" | "no";
  name: string;
  phone?: string;
  count: number;
  meal: "yes" | "no" | "unknown";
  message?: string;
};

export const OPEN_RSVP_EVENT = "invitation:open-rsvp";

/** 서버/클라이언트 공통 검증 */
export function parseRsvp(body: unknown): { ok: true; data: RsvpInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "잘못된 요청입니다." };
  const b = body as Record<string, unknown>;
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

  const side = b.side === "groom" || b.side === "bride" ? b.side : null;
  const attend = b.attend === "yes" || b.attend === "no" ? b.attend : null;
  const meal = b.meal === "yes" || b.meal === "no" || b.meal === "unknown" ? b.meal : "unknown";
  const name = str(b.name, 20);
  const phone = str(b.phone, 20).replace(/[^0-9-]/g, "");
  const message = str(b.message, 200);
  const count = Math.min(10, Math.max(1, Math.floor(Number(b.count) || 1)));

  if (!side) return { ok: false, error: "신랑측/신부측을 선택해주세요." };
  if (!attend) return { ok: false, error: "참석 여부를 선택해주세요." };
  if (!name) return { ok: false, error: "성함을 입력해주세요." };

  return { ok: true, data: { side, attend, name, phone: phone || undefined, count, meal, message: message || undefined } };
}
