"use client";

import { openRsvp } from "./RsvpModal";
import { shareInvitation } from "./Share";
import { LetterIcon, ShareIcon } from "./icons";

export default function FloatingButtons() {
  return (
    <div className="fab">
      <button type="button" className="fab__btn" onClick={openRsvp} aria-label="참석 의사 전달">
        <LetterIcon />
      </button>
      <button type="button" className="fab__btn" onClick={shareInvitation} aria-label="청첩장 공유">
        <ShareIcon />
      </button>
    </div>
  );
}
