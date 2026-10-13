import { wedding } from "@/config/wedding";
import CopyButton from "./CopyButton";
import DirectionsButtons from "./DirectionsButtons";
import NaverMap from "./NaverMap";
import Reveal from "./Reveal";
import SectionTitle from "./SectionTitle";

export default function Location() {
  const { venue } = wedding;
  const q = encodeURIComponent(venue.name);
  const links = [
    { label: "네이버 지도", href: `https://map.naver.com/p/search/${q}` },
    { label: "카카오맵", href: `https://map.kakao.com/link/to/${q},${venue.lat},${venue.lng}` },
    { label: "티맵", href: `tmap://route?goalname=${q}&goalx=${venue.lng}&goaly=${venue.lat}` },
  ];

  return (
    <Reveal className="section location">
      <SectionTitle en="LOCATION" ko="오시는 길" />
      <div className="location__head">
        <p className="location__name">
          {venue.name} <span>{venue.hall}</span>
        </p>
        <p className="location__addr">
          {venue.address}
          <CopyButton text={venue.address} label="주소 복사" message="주소가 복사되었습니다." />
        </p>
        {venue.tel && (
          <a className="location__tel" href={`tel:${venue.tel.replace(/[^0-9]/g, "")}`}>
            Tel. {venue.tel}
          </a>
        )}
      </div>
      <div className="location__map">
        <NaverMap lat={venue.lat} lng={venue.lng} name={venue.name} />
      </div>
      <DirectionsButtons />
      <div className="location__apps">
        {links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
            {l.label}
          </a>
        ))}
      </div>
      <dl className="location__transport">
        {venue.transport.map((t) => (
          <div key={t.title}>
            <dt>{t.title}</dt>
            {t.lines.map((line) => (
              <dd key={line}>{line}</dd>
            ))}
          </div>
        ))}
      </dl>
    </Reveal>
  );
}
