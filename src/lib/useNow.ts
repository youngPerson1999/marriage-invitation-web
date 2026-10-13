"use client";

import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};
const getSnapshot = () => Math.floor(Date.now() / 1000) * 1000;
const getServerSnapshot = () => null;

/**
 * 1초마다 갱신되는 현재 시각(ms). 서버 렌더링/첫 하이드레이션에서는 null을 반환해
 * 정적 HTML과 클라이언트 결과가 어긋나는 hydration mismatch를 방지합니다.
 */
export function useNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
