"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { ArrowIcon, ChevronIcon, CloseIcon } from "./icons";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";

const INITIAL = 6;
const photos = wedding.gallery;

function Lightbox({ index, onClose, onMove }: { index: number; onClose: () => void; onMove: (delta: number) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    document.documentElement.classList.add("scroll-lock");
    return () => document.documentElement.classList.remove("scroll-lock");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onMove(-1);
      if (e.key === "ArrowRight") onMove(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onMove]);

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label="사진 크게 보기"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) onMove(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="lightbox__top">
        <span className="en">
          {index + 1} / {photos.length}
        </span>
        <button type="button" onClick={onClose} aria-label="닫기">
          <CloseIcon width={26} height={26} />
        </button>
      </div>
      <div className="lightbox__stage">
        <Image key={photos[index]} src={photos[index]} alt={`갤러리 사진 ${index + 1}`} fill sizes="100vw" style={{ objectFit: "contain" }} priority />
      </div>
      <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={() => onMove(-1)} aria-label="이전 사진">
        <ArrowIcon width={28} height={28} />
      </button>
      <button type="button" className="lightbox__nav lightbox__nav--next" onClick={() => onMove(1)} aria-label="다음 사진">
        <ArrowIcon width={28} height={28} style={{ transform: "scaleX(-1)" }} />
      </button>
    </dialog>
  );
}

export default function Gallery() {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const visible = expanded ? photos : photos.slice(0, INITIAL);

  const move = useCallback((delta: number) => {
    setActive((i) => (i === null ? i : (i + delta + photos.length) % photos.length));
  }, []);

  return (
    <Reveal className="section gallery">
      <SectionTitle en="GALLERY" ko="우리의 순간들" />
      <ul className="gallery__grid">
        {visible.map((src, i) => (
          <li key={src}>
            <button type="button" onClick={() => setActive(i)} aria-label={`사진 ${i + 1} 크게 보기`}>
              <Image src={src} alt="" fill sizes="(max-width: 480px) 33vw, 160px" style={{ objectFit: "cover" }} />
            </button>
          </li>
        ))}
      </ul>
      {photos.length > INITIAL && (
        <button type="button" className="btn btn--text gallery__more" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
          {expanded ? "접기" : "더보기"}
          <ChevronIcon width={16} height={16} style={{ transform: expanded ? "rotate(180deg)" : undefined }} />
        </button>
      )}
      {active !== null && <Lightbox index={active} onClose={() => setActive(null)} onMove={move} />}
    </Reveal>
  );
}
