"use client";

import { wedding } from "@/config/wedding";
import { openNaverDirections, type RouteMode } from "@/lib/directions";
import { CarIcon, TransitIcon } from "./icons";

const modes: { mode: RouteMode; label: string; Icon: typeof TransitIcon }[] = [
  { mode: "public", label: "대중교통 길찾기", Icon: TransitIcon },
  { mode: "car", label: "자동차 길찾기", Icon: CarIcon },
];

export default function DirectionsButtons() {
  const { venue } = wedding;
  const goal = { lat: venue.lat, lng: venue.lng, name: venue.name };
  return (
    <div className="directions">
      <p className="directions__title">네이버 지도로 길찾기</p>
      <div className="directions__buttons">
        {modes.map(({ mode, label, Icon }) => (
          <button key={mode} type="button" className="btn btn--outline directions__btn" onClick={() => openNaverDirections(goal, mode)}>
            <Icon width={16} height={16} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
