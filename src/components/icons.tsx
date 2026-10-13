import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export const PhoneIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);
export const SmsIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.4A8 8 0 1 1 21 12z" />
  </svg>
);
export const CloseIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const CalendarIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);
export const BuildingIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 21h18M5 21V10l7-5 7 5v11M10 21v-5h4v5" />
  </svg>
);
export const PinIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const ShareIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="18" cy="5" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="19" r="2.5" />
    <path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" />
  </svg>
);
export const LetterIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3.5 6.5l8.5 6 8.5-6" />
  </svg>
);
export const CopyIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </svg>
);
export const ChevronIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);
export const ArrowIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);
export const LinkIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </svg>
);

/** 고인 표시용 국화 */
export const ChrysanthemumIcon = (p: P) => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden {...p}>
    <g fill="#8a8a8a">
      {Array.from({ length: 16 }).map((_, i) => (
        <ellipse key={i} cx="12" cy="5.2" rx="1.6" ry="4.6" transform={`rotate(${i * 22.5} 12 12)`} opacity={i % 2 ? 0.65 : 0.9} />
      ))}
    </g>
    <circle cx="12" cy="12" r="2.4" fill="#5e5e5e" />
  </svg>
);

/** 참석의사 아이콘 (두 사람 + 체크) */
export const GuestsIcon = (p: P) => (
  <svg width="48" height="28" viewBox="0 0 48 28" aria-hidden {...p}>
    <circle cx="14" cy="8" r="5" fill="#c9c9c9" />
    <path d="M4 26c0-6 4.5-10 10-10s10 4 10 10z" fill="#c9c9c9" />
    <circle cx="28" cy="8" r="5" fill="#6b6b6b" />
    <path d="M18 26c0-6 4.5-10 10-10s10 4 10 10z" fill="#6b6b6b" />
    <path d="M37 9l3 3 5-6" stroke="#6b6b6b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </svg>
);

export const MusicOnIcon = (p: P) => (
  <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden {...p}>
    {[2, 6, 10, 14].map((x, i) => (
      <rect key={x} x={x} y="2" width="2" height="10" rx="1" fill="currentColor" className={`eq eq-${i}`} />
    ))}
  </svg>
);
export const MusicOffIcon = (p: P) => (
  <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden {...p}>
    {[2, 6, 10, 14].map((x) => (
      <circle key={x} cx={x + 1} cy="7" r="1.3" fill="currentColor" />
    ))}
  </svg>
);
