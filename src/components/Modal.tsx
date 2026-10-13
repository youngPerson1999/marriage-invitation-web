"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "./icons";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

/** 네이티브 <dialog> 기반 모달: 포커스 트랩·ESC 닫기·접근성 기본 제공 */
export default function Modal({ open, onClose, title, children, footer, className }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add("scroll-lock");
    } else if (!open && dialog.open) {
      dialog.close();
    }
    if (!open) document.documentElement.classList.remove("scroll-lock");
  }, [open]);

  useEffect(() => () => document.documentElement.classList.remove("scroll-lock"), []);

  return (
    <dialog
      ref={ref}
      className={`modal ${className ?? ""}`}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // 바깥(backdrop) 클릭 시 닫기
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={title}
    >
      <div className="modal__panel">
        <button type="button" className="modal__close" onClick={onClose} aria-label="닫기">
          <CloseIcon width={22} height={22} />
        </button>
        {title && <h2 className="modal__title">{title}</h2>}
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </dialog>
  );
}
