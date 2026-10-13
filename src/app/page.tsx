import Accounts from "@/components/Accounts";
import Cover from "@/components/Cover";
import FloatingButtons from "@/components/FloatingButtons";
import Gallery from "@/components/Gallery";
import Invitation from "@/components/Invitation";
import Location from "@/components/Location";
import MusicToggle from "@/components/MusicToggle";
import Profile from "@/components/Profile";
import RsvpModal from "@/components/RsvpModal";
import RsvpSection from "@/components/RsvpSection";
import Share from "@/components/Share";
import Toaster from "@/components/Toast";
import WeddingCalendar from "@/components/WeddingCalendar";

// 완전 정적 페이지로 빌드 → Vercel CDN 엣지에서 즉시 응답
export const dynamic = "force-static";

export default function Home() {
  return (
    <main className="page">
      <MusicToggle />
      <Cover />
      <Invitation />
      <Profile />
      <WeddingCalendar />
      <Gallery />
      <Location />
      <RsvpSection />
      <Accounts />
      <Share />
      <FloatingButtons />
      <RsvpModal />
      <Toaster />
    </main>
  );
}
