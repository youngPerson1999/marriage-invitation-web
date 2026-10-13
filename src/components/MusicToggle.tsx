"use client";

import { useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { MusicOffIcon, MusicOnIcon } from "./icons";

/**
 * 배경음악 토글. 모바일 브라우저 자동재생 정책 때문에 사용자가 직접 눌러야 재생됩니다.
 * preload="none" 으로 첫 로딩 성능에 영향을 주지 않습니다.
 */
export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setUnavailable(true);
      }
    } else {
      audio.pause();
    }
  };

  if (!wedding.bgm || unavailable) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={wedding.bgm}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setUnavailable(true)}
      />
      <button
        type="button"
        className={`music ${playing ? "is-playing" : ""}`}
        onClick={toggle}
        aria-label={playing ? "배경음악 끄기" : "배경음악 켜기"}
        aria-pressed={playing}
      >
        {playing ? <MusicOnIcon /> : <MusicOffIcon />}
      </button>
    </>
  );
}
