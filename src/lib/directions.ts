/**
 * 네이버 지도 길찾기: 네이버 지도 앱 → 네이버 앱(인앱 브라우저) → 모바일/PC 웹 순서로 시도합니다.
 *
 * 앱이 실행되면 브라우저가 백그라운드로 전환(visibilitychange/pagehide)되므로,
 * 일정 시간 안에 화면이 숨겨지지 않으면 "앱 없음"으로 보고 다음 단계로 넘어갑니다.
 */
export type RouteMode = "public" | "car";

type Goal = { lat: number; lng: number; name: string };

const TRY_TIMEOUT = 1500;

export function naverMapAppUrl(goal: Goal, mode: RouteMode) {
  const params = new URLSearchParams({
    dlat: String(goal.lat),
    dlng: String(goal.lng),
    dname: goal.name,
    appname: window.location.hostname || "wedding.invitation",
  });
  return `nmap://route/${mode}?${params}`;
}

/** 모바일 웹 길찾기 (WGS84 좌표, PC에서도 새 지도 페이지로 연결됨) */
export function naverMapWebUrl(goal: Goal, mode: RouteMode) {
  const pathType = { car: 0, public: 1 }[mode];
  const params = new URLSearchParams({
    menu: "route",
    ename: goal.name,
    ex: String(goal.lng),
    ey: String(goal.lat),
    pathType: String(pathType),
    showMap: "true",
  });
  return `https://m.map.naver.com/route.nhn?${params}`;
}

/** 네이버 앱 인앱 브라우저로 웹 길찾기 열기 */
export function naverAppUrl(webUrl: string) {
  return `naversearchapp://inappbrowser?url=${encodeURIComponent(webUrl)}&target=new&version=6`;
}

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));

/** 앱 스킴을 열어보고, 앱이 열렸으면 true */
function tryOpen(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (opened: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("blur", onBlur);
      resolve(opened);
    };
    const onHide = () => document.hidden && finish(true);
    const onBlur = () => setTimeout(() => document.hidden && finish(true), 300);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    window.addEventListener("blur", onBlur);
    const timer = setTimeout(() => finish(document.hidden), TRY_TIMEOUT);
    window.location.href = url;
  });
}

export async function openNaverDirections(goal: Goal, mode: RouteMode = "public") {
  const webUrl = naverMapWebUrl(goal, mode);
  if (!isMobile()) {
    window.open(webUrl, "_blank", "noopener,noreferrer");
    return;
  }
  if (await tryOpen(naverMapAppUrl(goal, mode))) return;
  if (await tryOpen(naverAppUrl(webUrl))) return;
  window.location.href = webUrl;
}
