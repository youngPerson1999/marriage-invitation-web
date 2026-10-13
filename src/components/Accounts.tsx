"use client";

import { useState } from "react";
import { wedding, type Account } from "@/config/wedding";
import { ChevronIcon } from "./icons";
import CopyButton from "./CopyButton";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";

function Group({ title, accounts }: { title: string; accounts: readonly Account[] }) {
  const [open, setOpen] = useState(false);
  const id = `accounts-${title}`;
  return (
    <div className={`accounts__group ${open ? "is-open" : ""}`}>
      <button type="button" className="accounts__toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>
        {title}
        <ChevronIcon width={18} height={18} />
      </button>
      <ul id={id} className="accounts__list" hidden={!open}>
        {accounts.map((a) => (
          <li key={a.number}>
            <div>
              <p className="accounts__holder">{a.holder}</p>
              <p className="accounts__number">
                {a.bank} {a.number}
              </p>
            </div>
            <div className="accounts__actions">
              <CopyButton text={`${a.bank} ${a.number}`} message="계좌번호가 복사되었습니다." />
              {a.kakaoPay && (
                <a className="copy-btn copy-btn--pay" href={a.kakaoPay} target="_blank" rel="noopener noreferrer">
                  pay
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Accounts() {
  return (
    <Reveal className="section accounts">
      <SectionTitle en="ACCOUNT" ko="마음 전하실 곳" />
      <p className="accounts__desc">
        참석이 어려우신 분들을 위해 기재했습니다.
        <br />
        너그러운 마음으로 양해 부탁드립니다.
      </p>
      <Group title="신랑측 계좌번호" accounts={wedding.accounts.groom} />
      <Group title="신부측 계좌번호" accounts={wedding.accounts.bride} />
    </Reveal>
  );
}
