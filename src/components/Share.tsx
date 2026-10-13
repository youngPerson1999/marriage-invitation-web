"use client";

import Script from "next/script";
import { wedding } from "@/config/wedding";
import { copyText, toast } from "./Toast";
import { LinkIcon, ShareIcon } from "./icons";
import Reveal from "./Reveal";

const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

type KakaoSDK = {
  isInitialized(): boolean;
  init(key: string): void;
  Share: { sendDefault(options: Record<string, unknown>): void };
};
declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}

const pageUrl = () => window.location.origin + window.location.pathname;

export async function shareInvitation() {
  const data = { title: wedding.meta.title, text: wedding.meta.description, url: pageUrl() };
  if (navigator.share) {
    try {
      await navigator.share(data);
    } catch {
      /* 사용자가 취소 */
    }
    return;
  }
  copyText(data.url, "청첩장 링크가 복사되었습니다.");
}

function shareKakao() {
  const Kakao = window.Kakao;
  if (!Kakao || !KAKAO_KEY) {
    toast("카카오톡 공유를 불러오지 못했습니다.");
    return;
  }
  if (!Kakao.isInitialized()) Kakao.init(KAKAO_KEY);
  const url = pageUrl();
  Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: wedding.meta.title,
      description: wedding.meta.description,
      imageUrl: window.location.origin + wedding.meta.ogImage,
      link: { mobileWebUrl: url, webUrl: url },
    },
    buttons: [{ title: "청첩장 보기", link: { mobileWebUrl: url, webUrl: url } }],
  });
}

export default function Share() {
  return (
    <Reveal className="section share">
      {KAKAO_KEY && (
        <Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js" strategy="lazyOnload" />
      )}
      <div className="share__buttons">
        {KAKAO_KEY && (
          <button type="button" className="btn btn--kakao" onClick={shareKakao}>
            카카오톡으로 공유하기
          </button>
        )}
        <button type="button" className="btn btn--outline" onClick={shareInvitation}>
          <ShareIcon width={16} height={16} />
          청첩장 공유하기
        </button>
        <button type="button" className="btn btn--outline" onClick={() => copyText(pageUrl(), "청첩장 링크가 복사되었습니다.")}>
          <LinkIcon width={16} height={16} />
          링크 복사하기
        </button>
      </div>
      <p className="share__thanks">
        {wedding.groom.name} <span>♥</span> {wedding.bride.name}
      </p>
    </Reveal>
  );
}
