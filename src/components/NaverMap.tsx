"use client";

import { useEffect, useRef, useState } from "react";
import { PinIcon } from "./icons";

/** 네이버 클라우드 플랫폼 > Maps > Application 의 Client ID (Dynamic Map 사용 설정 필요) */
const CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
const SCRIPT_ID = "naver-map-sdk";

/* 사용하는 범위만 최소한으로 선언한 타입 */
type LatLng = object;
type NaverMaps = {
  LatLng: new (lat: number, lng: number) => LatLng;
  Map: new (el: HTMLElement, options: Record<string, unknown>) => { destroy?: () => void };
  Marker: new (options: Record<string, unknown>) => unknown;
  Position: Record<string, unknown>;
};
declare global {
  interface Window {
    naver?: { maps: NaverMaps };
    navermap_authFailure?: () => void;
  }
}

let loader: Promise<NaverMaps> | null = null;

function loadSdk(): Promise<NaverMaps> {
  if (window.naver?.maps) return Promise.resolve(window.naver.maps);
  if (loader) return loader;
  loader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${CLIENT_ID}`;
    script.async = true;
    script.onload = () => (window.naver?.maps ? resolve(window.naver.maps) : reject(new Error("naver maps unavailable")));
    script.onerror = () => {
      loader = null;
      reject(new Error("naver maps script failed"));
    };
    document.head.appendChild(script);
  });
  return loader;
}

type Props = { lat: number; lng: number; name: string; zoom?: number };

export default function NaverMap({ lat, lng, name, zoom = 16 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(!CLIENT_ID);

  useEffect(() => {
    const el = ref.current;
    if (!el || !CLIENT_ID) return;

    let cancelled = false;
    let map: { destroy?: () => void } | undefined;

    // 인증 실패(도메인 미등록, 잘못된 키 등) 시 SDK가 호출하는 전역 콜백
    window.navermap_authFailure = () => setFailed(true);

    const init = async () => {
      try {
        const maps = await loadSdk();
        if (cancelled) return;
        const position = new maps.LatLng(lat, lng);
        map = new maps.Map(el, {
          center: position,
          zoom,
          // 페이지 스크롤이 지도에 갇히지 않도록 드래그/휠 줌 비활성화, 확대 버튼만 제공
          draggable: false,
          scrollWheel: false,
          pinchZoom: false,
          keyboardShortcuts: false,
          disableDoubleClickZoom: true,
          zoomControl: true,
          zoomControlOptions: { position: maps.Position.TOP_RIGHT },
        });
        new maps.Marker({ position, map, title: name });
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    // 화면 근처에 왔을 때만 SDK 로드 → 첫 로딩 성능 보호
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          init();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      map?.destroy?.();
    };
  }, [lat, lng, name, zoom]);

  if (failed) {
    return (
      <div className="naver-map naver-map--fallback">
        <PinIcon width={28} height={28} />
        <p>{name}</p>
      </div>
    );
  }
  return <div ref={ref} className="naver-map" role="img" aria-label={`${name} 위치 지도`} />;
}
