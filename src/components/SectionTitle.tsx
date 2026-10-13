export default function SectionTitle({ en, ko }: { en: string; ko?: string }) {
  return (
    <div className="section-title">
      <p className="section-title__en en">{en}</p>
      {ko && <h2 className="section-title__ko">{ko}</h2>}
    </div>
  );
}
