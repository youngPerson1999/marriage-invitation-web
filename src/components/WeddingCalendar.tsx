import { wedding } from "@/config/wedding";
import { buildMonthMatrix, formatKoTime, pad, toKstParts, WEEKDAY_LABELS, weekdayKo } from "@/lib/date";
import Countdown from "./Countdown";
import DaysTogether from "./DaysTogether";
import Reveal from "./Reveal";

export default function WeddingCalendar() {
  const d = toKstParts(wedding.date);
  const weeks = buildMonthMatrix(d.year, d.month);
  const holidays = new Set<string>(wedding.holidays);
  const isHoliday = (day: number) => holidays.has(`${d.year}-${pad(d.month)}-${pad(day)}`);

  return (
    <Reveal className="section calendar">
      <p className="calendar__date en">
        {d.year}.{pad(d.month)}.{pad(d.day)}
      </p>
      <p className="calendar__time">
        {weekdayKo(d.weekday)}요일 {formatKoTime(d.hour, d.minute)}
      </p>
      <table className="calendar__table">
        <caption className="sr-only">
          {d.year}년 {d.month}월 달력
        </caption>
        <thead>
          <tr>
            {WEEKDAY_LABELS.map((w, i) => (
              <th key={w} scope="col" className={i === 0 ? "is-red" : undefined}>
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                if (!day) return <td key={di} />;
                const cls = [day === d.day && "is-wedding", (di === 0 || isHoliday(day)) && "is-red"].filter(Boolean).join(" ");
                return (
                  <td key={di} className={cls || undefined}>
                    <span aria-current={day === d.day ? "date" : undefined}>{day}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <Countdown />
      <DaysTogether />
    </Reveal>
  );
}
