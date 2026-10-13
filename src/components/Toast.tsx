"use client";

import { useEffect, useState } from "react";

const EVENT = "invitation:toast";

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: message }));
}

export async function copyText(text: string, done = "복사되었습니다.") {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // 구형 인앱 브라우저 폴백
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    el.remove();
  }
  toast(done);
}

export default function Toaster() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onToast = (e: Event) => {
      setMessage((e as CustomEvent<string>).detail);
      clearTimeout(timer);
      timer = setTimeout(() => setMessage(null), 2000);
    };
    window.addEventListener(EVENT, onToast);
    return () => {
      window.removeEventListener(EVENT, onToast);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`toast ${message ? "toast--show" : ""}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
