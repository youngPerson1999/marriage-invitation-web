import Image from "next/image";
import { wedding } from "@/config/wedding";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";

function Card({ side, reverse }: { side: "groom" | "bride"; reverse?: boolean }) {
  const p = wedding[side];
  return (
    <div className={`profile__card ${reverse ? "profile__card--reverse" : ""}`}>
      <div className="profile__photo">
        <Image src={p.profileImage} alt={`${side === "groom" ? "신랑" : "신부"} ${p.name}`} fill sizes="160px" style={{ objectFit: "cover" }} />
      </div>
      <div className="profile__text">
        <p className="profile__name">
          <span className="profile__role">{side === "groom" ? "신랑" : "신부"}</span>
          {p.name}
        </p>
        <div className="profile__intro">
          {p.intro.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <Reveal className="section profile">
      <SectionTitle en="PROFILE" ko="두 사람을 소개합니다." />
      <Card side="groom" />
      <Card side="bride" reverse />
    </Reveal>
  );
}
