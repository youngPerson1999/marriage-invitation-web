"use client";

import { wedding } from "@/config/wedding";
import { openNaverDirections, type RouteMode } from "@/lib/directions";

const modes: { mode: RouteMode; label: string; icon: string }[] = [
  { mode: "public", label: "대중교통", icon: "🚇" },
  { mode: "car", label: "자동차", icon: "🚗" },
  { mode: "walk", label: "도보", icon: "🚶" },
];

export default function DirectionsButtons() {
  const { venue } = wedding;
  const goal = { lat: venue.lat, lng: venue.lng, name: venue.name };
  return (
    <div className="directions">
      <p className="directions__title">네이버 지도로 길찾기</p>
      <div className="directions__buttons">
        {modes.map((m) => (
          <button key={m.mode} type="button" className="directions__btn" onClick={() => openNaverDirections(goal, m.mode)}>
            <span aria-hidden>{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
