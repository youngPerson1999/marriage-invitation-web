"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** 스크롤 시 부드럽게 나타나는 효과 (IntersectionObserver, JS 미동작 시에도 내용 표시) */
export default function Reveal({ children, className = "", as: Tag = "section", id }: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }
    // 이미 화면 안에 있는 요소는 깜빡임 없이 그대로 노출
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.classList.add("reveal");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref as never} id={id} className={className}>
      {children}
    </Tag>
  );
}
