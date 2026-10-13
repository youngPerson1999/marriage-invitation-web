"use client";

import { openRsvp } from "./RsvpModal";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";

export default function RsvpSection() {
  return (
    <Reveal className="section rsvp-section">
      <SectionTitle en="R.S.V.P." ko="참석 의사 전달" />
      <p className="rsvp-section__desc">
        신랑, 신부에게 참석 의사를
        <br />
        미리 전달해 주시면 감사하겠습니다.
      </p>
      <button type="button" className="btn btn--outline" onClick={openRsvp}>
        참석 의사 전달하기
      </button>
    </Reveal>
  );
}
