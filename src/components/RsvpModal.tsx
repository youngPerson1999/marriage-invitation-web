"use client";

import { useEffect, useState, type FormEvent } from "react";
import { wedding } from "@/config/wedding";
import { formatKoTime, pad, toKstParts, weekdayKo } from "@/lib/date";
import { OPEN_RSVP_EVENT, parseRsvp } from "@/lib/rsvp";
import Modal from "./Modal";
import { toast } from "./Toast";
import { BuildingIcon, CalendarIcon, GuestsIcon, PinIcon } from "./icons";

const HIDE_KEY = "rsvp-hide-until";
const DONE_KEY = "rsvp-submitted";

const todayKst = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(new Date());

function safeGet(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* 사파리 프라이빗 모드 등 */
  }
}

export function openRsvp() {
  window.dispatchEvent(new Event(OPEN_RSVP_EVENT));
}

export default function RsvpModal({ autoOpen = true }: { autoOpen?: boolean }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"intro" | "form">("intro");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onOpen = () => {
      setStep("intro");
      setOpen(true);
    };
    window.addEventListener(OPEN_RSVP_EVENT, onOpen);

    // 첫 방문 시 잠시 후 자동 노출 (오늘 하루 보지 않기 / 이미 제출한 경우 제외, 예식 이후 제외)
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (autoOpen && Date.now() < new Date(wedding.date).getTime()) {
      timer = setTimeout(() => {
        if (safeGet(HIDE_KEY) === todayKst() || safeGet(DONE_KEY)) return;
        onOpen();
      }, 1500);
    }
    return () => {
      window.removeEventListener(OPEN_RSVP_EVENT, onOpen);
      clearTimeout(timer);
    };
  }, [autoOpen]);

  const close = () => {
    setOpen(false);
    setError(null);
  };

  const hideToday = () => {
    safeSet(HIDE_KEY, todayKst());
    close();
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = parseRsvp(Object.fromEntries(form));
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, website: form.get("website") }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "전송에 실패했습니다.");
      safeSet(DONE_KEY, "1");
      close();
      toast("참석 의사가 전달되었습니다. 감사합니다!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "전송에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  const d = toKstParts(wedding.date);

  return (
    <Modal
      open={open}
      onClose={close}
      title="참석 의사 전달"
      className="rsvp"
      footer={
        step === "intro" ? (
          <div className="rsvp__intro-actions">
            <button type="button" className="btn btn--text" onClick={hideToday}>
              오늘 하루 보지 않기
            </button>
            <button type="button" className="btn btn--outline btn--strong" onClick={() => setStep("form")}>
              참석의사 전달하기
            </button>
          </div>
        ) : null
      }
    >
      {step === "intro" ? (
        <div className="rsvp__intro">
          <GuestsIcon className="rsvp__icon" />
          <p className="rsvp__desc">
            특별한 날 축하의 마음으로 참석해주시는 모든 분들을 한 분 한 분 더욱 귀하게 모실 수 있도록, 아래 버튼으로 신랑 &amp; 신부에게 꼭 참석여부
            전달을 부탁드립니다.
          </p>
          <ul className="rsvp__summary">
            <li>
              <CalendarIcon />
              {d.year}.{pad(d.month)}.{pad(d.day)} ({weekdayKo(d.weekday)}) {formatKoTime(d.hour, d.minute).replace("낮", "오후")}
            </li>
            <li>
              <BuildingIcon />
              {wedding.venue.name} {wedding.venue.hall}
            </li>
            <li>
              <PinIcon />
              {wedding.venue.address}
            </li>
          </ul>
        </div>
      ) : (
        <form className="rsvp__form" onSubmit={onSubmit} noValidate>
          <fieldset className="seg">
            <legend>어느 분의 하객이신가요?</legend>
            <label>
              <input type="radio" name="side" value="groom" defaultChecked />
              <span>신랑측</span>
            </label>
            <label>
              <input type="radio" name="side" value="bride" />
              <span>신부측</span>
            </label>
          </fieldset>
          <fieldset className="seg">
            <legend>참석 여부</legend>
            <label>
              <input type="radio" name="attend" value="yes" defaultChecked />
              <span>참석할게요</span>
            </label>
            <label>
              <input type="radio" name="attend" value="no" />
              <span>마음만 전할게요</span>
            </label>
          </fieldset>
          <label className="field">
            <span>성함</span>
            <input name="name" type="text" maxLength={20} autoComplete="name" placeholder="성함을 입력해주세요" required />
          </label>
          <label className="field">
            <span>연락처 (선택)</span>
            <input name="phone" type="tel" maxLength={20} autoComplete="tel" inputMode="tel" placeholder="010-0000-0000" />
          </label>
          <label className="field">
            <span>본인 포함 참석 인원</span>
            <select name="count" defaultValue="1">
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}명
                </option>
              ))}
            </select>
          </label>
          <fieldset className="seg seg--3">
            <legend>식사 여부</legend>
            <label>
              <input type="radio" name="meal" value="yes" defaultChecked />
              <span>예정</span>
            </label>
            <label>
              <input type="radio" name="meal" value="no" />
              <span>안함</span>
            </label>
            <label>
              <input type="radio" name="meal" value="unknown" />
              <span>미정</span>
            </label>
          </fieldset>
          <label className="field">
            <span>전하실 말씀 (선택)</span>
            <textarea name="message" rows={3} maxLength={200} placeholder="축하 메시지를 남겨주세요" />
          </label>
          {/* 봇 방지용 허니팟 */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden />
          {error && (
            <p className="rsvp__error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn btn--solid" disabled={submitting}>
            {submitting ? "전송 중…" : "전달하기"}
          </button>
        </form>
      )}
    </Modal>
  );
}
