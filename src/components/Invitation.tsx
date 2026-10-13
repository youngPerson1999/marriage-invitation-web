import { wedding, type Person } from "@/config/wedding";
import { ChrysanthemumIcon } from "./icons";
import ContactButton from "./ContactButton";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";

function Parent({ person }: { person: Person }) {
  return (
    <span className="parent">
      {person.deceased && (
        <>
          <ChrysanthemumIcon className="parent__flower" />
          <span className="sr-only">고(故) </span>
        </>
      )}
      {person.name}
    </span>
  );
}

function FamilyRow({ side }: { side: "groom" | "bride" }) {
  const p = wedding[side];
  return (
    <p className="family__row">
      <Parent person={p.father} />
      <span className="family__sep">·</span>
      <Parent person={p.mother} />
      <span className="family__rel">
        의 <span className="family__relword">{p.relation}</span>
      </span>
      <strong className="family__child">{p.name}</strong>
    </p>
  );
}

export default function Invitation() {
  return (
    <Reveal className="section invitation">
      <SectionTitle en="INVITATION" ko={wedding.invitation.title} />
      <div className="invitation__message">
        {wedding.invitation.message.map((line, i) => (line ? <p key={i}>{line}</p> : <br key={i} />))}
      </div>
      <hr className="divider" />
      <div className="family">
        <FamilyRow side="groom" />
        <FamilyRow side="bride" />
      </div>
      <ContactButton />
    </Reveal>
  );
}
