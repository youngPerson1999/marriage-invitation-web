import Image from "next/image";
import { wedding } from "@/config/wedding";
import { formatKoTime, toKstParts, weekdayEn, weekdayKo } from "@/lib/date";

export default function Cover() {
  const d = toKstParts(wedding.date);
  return (
    <header className="cover">
      <div className="cover__date">
        <p className="cover__ymd en">
          {d.year} / {d.month} / {d.day}
        </p>
        <p className="cover__weekday en">{weekdayEn(d.weekday)}</p>
      </div>
      <div className="cover__photo">
        <Image
          src={wedding.coverImage}
          alt={`${wedding.groom.name}, ${wedding.bride.name} 웨딩 사진`}
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 480px) 100vw, 480px"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="cover__info">
        <h1 className="cover__names">
          {wedding.groom.name}
          <span className="cover__dot" aria-hidden>
            ·
          </span>
          <span className="sr-only">그리고</span>
          {wedding.bride.name}
        </h1>
        <p>
          {d.year}년 {d.month}월 {d.day}일 {weekdayKo(d.weekday)}요일 {formatKoTime(d.hour, d.minute)}
        </p>
        <p>
          {wedding.venue.name} {wedding.venue.hall}
        </p>
      </div>
    </header>
  );
}
