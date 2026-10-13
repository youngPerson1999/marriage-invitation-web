const TZ = "Asia/Seoul";
const WEEKDAYS_KO = ["일", "월", "화", "수", "목", "금", "토"] as const;
const WEEKDAYS_EN = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;

export type DateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
};

/** 서버(UTC)·브라우저 시간대와 무관하게 항상 한국 시간 기준으로 분해 */
export function toKstParts(iso: string): DateParts {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    weekday: "short",
    hourCycle: "h23",
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    weekday: weekdayMap[get("weekday")],
  };
}

export const weekdayKo = (w: number) => WEEKDAYS_KO[w];
export const weekdayEn = (w: number) => WEEKDAYS_EN[w];
export const WEEKDAY_LABELS = WEEKDAYS_KO;

/** "낮 12시 30분" / "오후 3시" 형태 */
export function formatKoTime(hour: number, minute: number) {
  const period = hour < 12 ? "오전" : hour === 12 ? "낮" : "오후";
  const h = hour > 12 ? hour - 12 : hour;
  return `${period} ${h}시${minute ? ` ${minute}분` : ""}`;
}

/** 해당 월 달력 (주 단위 배열, 빈칸은 null) */
export function buildMonthMatrix(year: number, month: number): (number | null)[][] {
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const pad = (n: number) => String(n).padStart(2, "0");
export { pad };
