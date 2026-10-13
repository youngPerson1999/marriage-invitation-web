"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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

type Failure = "no-key" | "auth" | "script";
const FAILURE_TEXT: Record<Failure, string> = {
  "no-key": "NEXT_PUBLIC_NAVER_MAP_CLIENT_ID 환경변수가 빌드에 포함되지 않았습니다. Vercel에 설정 후 재배포하세요.",
  auth: "네이버 지도 인증 실패: Client ID 또는 Web 서비스 URL(현재 도메인) 등록을 확인하세요.",
  script: "네이버 지도 스크립트를 불러오지 못했습니다. (네트워크/광고 차단 확인)",
};

const noopSubscribe = () => () => {};
/** 주소에 ?debug 가 있으면 지도 실패 원인을 화면에 표시 */
const useDebug = () =>
  useSyncExternalStore(noopSubscribe, () => window.location.search.includes("debug"), () => false);

export default function NaverMap({ lat, lng, name, zoom = 16 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [failure, setFailure] = useState<Failure | null>(CLIENT_ID ? null : "no-key");
  const debug = useDebug();

  useEffect(() => {
    if (failure) console.warn(`[NaverMap] ${FAILURE_TEXT[failure]} (origin: ${window.location.origin})`);
  }, [failure]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !CLIENT_ID) return;

    let cancelled = false;
    let map: { destroy?: () => void } | undefined;

    // 인증 실패(도메인 미등록, 잘못된 키 등) 시 SDK가 호출하는 전역 콜백
    window.navermap_authFailure = () => setFailure("auth");

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
        if (!cancelled) setFailure((f) => f ?? "script");
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

  if (failure) {
    return (
      <div className="naver-map naver-map--fallback" data-failure={failure}>
        <PinIcon width={28} height={28} />
        <p>{name}</p>
        {debug && <p className="naver-map__debug">{FAILURE_TEXT[failure]}</p>}
      </div>
    );
  }
  return <div ref={ref} className="naver-map" role="img" aria-label={`${name} 위치 지도`} />;
}
