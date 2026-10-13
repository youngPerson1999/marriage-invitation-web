"use client";

import { wedding } from "@/config/wedding";
import { useNow } from "@/lib/useNow";

export default function DaysTogether() {
  const now = useNow();
  const start = new Date(wedding.firstMetDate).getTime();
  // 처음 만난 날을 1일로 계산
  const days = now === null ? null : Math.floor((now - start) / 86_400_000) + 1;
  return (
    <div className="together">
      <p className="together__title">함께 보낸 소중한 날</p>
      <p className="together__count">
        <span className="en">+ {days === null ? "    " : days.toLocaleString("ko-KR")}</span>
        <small>일</small>
      </p>
    </div>
  );
}
