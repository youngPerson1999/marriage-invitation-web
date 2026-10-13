"use client";

import { copyText } from "./Toast";
import { CopyIcon } from "./icons";

export default function CopyButton({ text, label = "복사", message }: { text: string; label?: string; message?: string }) {
  return (
    <button type="button" className="copy-btn" onClick={() => copyText(text, message)} aria-label={label}>
      <CopyIcon width={14} height={14} />
      <span>{label}</span>
    </button>
  );
}
