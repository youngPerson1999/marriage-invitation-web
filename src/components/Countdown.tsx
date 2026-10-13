"use client";

import { wedding } from "@/config/wedding";
import { pad } from "@/lib/date";
import { useNow } from "@/lib/useNow";

const DAY = 86_400_000;

export default function Countdown() {
  const now = useNow();
  const target = new Date(wedding.date).getTime();
  const diff = now === null ? null : target - now;
  const remain = diff === null ? null : Math.max(0, diff);

  const units = [
    { label: "DAYS", value: remain === null ? "--" : String(Math.floor(remain / DAY)) },
    { label: "HOUR", value: remain === null ? "--" : pad(Math.floor((remain % DAY) / 3_600_000)) },
    { label: "MIN", value: remain === null ? "--" : pad(Math.floor((remain % 3_600_000) / 60_000)) },
    { label: "SEC", value: remain === null ? "--" : pad(Math.floor((remain % 60_000) / 1000)) },
  ];

  const couple = `${wedding.bride.shortName}, ${wedding.groom.shortName}의 결혼식`;
  const names = `${couple}이`;
  let caption: React.ReactNode = " ";
  if (diff !== null) {
    const dday = Math.ceil(diff / DAY);
    if (diff > 0 && dday > 0) caption = <>{names} <em>{dday}</em>일 남았습니다.</>;
    else if (diff > -DAY / 2) caption = <>오늘은 {couple} 날입니다.</>;
    else caption = <>{names} <em>{Math.floor(-diff / DAY)}</em>일 지났습니다.</>;
  }

  return (
    <div className="countdown">
      <div className="countdown__units" aria-hidden={remain === null}>
        {units.map((u, i) => (
          <div key={u.label} className="countdown__unit-wrap">
            {i > 0 && <span className="countdown__colon">:</span>}
            <div className="countdown__unit">
              <span className="countdown__label en">{u.label}</span>
              <span className="countdown__value en">{u.value}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="countdown__caption">{caption}</p>
    </div>
  );
}
