import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { parseRsvp } from "@/lib/rsvp";
import { listRsvp, saveRsvp, storeEnabled } from "@/lib/store";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  // 허니팟 필드가 채워져 있으면 봇으로 간주하고 조용히 성공 처리
  if (body && typeof body === "object" && (body as Record<string, unknown>).website) {
    return NextResponse.json({ ok: true });
  }

  const parsed = parseRsvp(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  try {
    await saveRsvp({ ...parsed.data, createdAt: new Date().toISOString() });
  } catch (err) {
    console.error("[rsvp] save failed", err);
    return NextResponse.json({ error: "잠시 후 다시 시도해주세요." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

/** 관리자 조회: /api/rsvp?key=RSVP_ADMIN_KEY (&format=csv) */
export async function GET(req: NextRequest) {
  const adminKey = process.env.RSVP_ADMIN_KEY;
  const key = req.nextUrl.searchParams.get("key") ?? "";
  const authorized =
    !!adminKey && key.length === adminKey.length && timingSafeEqual(Buffer.from(key), Buffer.from(adminKey));
  if (!authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!storeEnabled) return NextResponse.json({ error: "저장소(Upstash Redis)가 연결되지 않았습니다." }, { status: 503 });

  const rows = await listRsvp();
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

  if (req.nextUrl.searchParams.get("format") === "csv") {
    const cols = ["createdAt", "side", "attend", "name", "phone", "count", "meal", "message"];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = "﻿" + [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
    return new NextResponse(csv, {
      headers: { ...headers, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="rsvp.csv"' },
    });
  }

  const attending = rows.filter((r) => r.attend === "yes");
  return NextResponse.json(
    {
      total: rows.length,
      attendingGuests: attending.reduce((n, r) => n + Number(r.count ?? 1), 0),
      groomSide: attending.filter((r) => r.side === "groom").reduce((n, r) => n + Number(r.count ?? 1), 0),
      brideSide: attending.filter((r) => r.side === "bride").reduce((n, r) => n + Number(r.count ?? 1), 0),
      rows,
    },
    { headers },
  );
}
