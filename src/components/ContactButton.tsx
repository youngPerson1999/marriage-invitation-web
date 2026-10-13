"use client";

import { useState } from "react";
import { wedding, type Person } from "@/config/wedding";
import Modal from "./Modal";
import { PhoneIcon, SmsIcon } from "./icons";

type Row = { label: string; person: Person };

function ContactList({ title, rows }: { title: string; rows: Row[] }) {
  const items = rows.filter((r) => r.person.phone && !r.person.deceased);
  return (
    <div className="contact__group">
      <p className="contact__group-title">{title}</p>
      <ul>
        {items.map(({ label, person }) => {
          const tel = person.phone!.replace(/[^0-9+]/g, "");
          return (
            <li key={label} className="contact__row">
              <span className="contact__label">{label}</span>
              <span className="contact__name">{person.name}</span>
              <a href={`tel:${tel}`} aria-label={`${person.name}에게 전화하기`} className="icon-btn">
                <PhoneIcon width={18} height={18} />
              </a>
              <a href={`sms:${tel}`} aria-label={`${person.name}에게 문자하기`} className="icon-btn">
                <SmsIcon width={18} height={18} />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function ContactButton() {
  const [open, setOpen] = useState(false);
  const { groom, bride } = wedding;
  return (
    <>
      <button type="button" className="btn btn--outline contact__open" onClick={() => setOpen(true)}>
        <PhoneIcon width={16} height={16} />
        연락하기
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="연락하기">
        <div className="contact">
          <ContactList
            title="신랑측"
            rows={[
              { label: "신랑", person: { name: groom.name, phone: groom.phone } },
              { label: "아버지", person: groom.father },
              { label: "어머니", person: groom.mother },
            ]}
          />
          <ContactList
            title="신부측"
            rows={[
              { label: "신부", person: { name: bride.name, phone: bride.phone } },
              { label: "아버지", person: bride.father },
              { label: "어머니", person: bride.mother },
            ]}
          />
        </div>
      </Modal>
    </>
  );
}
