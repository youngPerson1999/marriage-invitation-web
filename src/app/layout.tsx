import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Gowun_Dodum } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { wedding } from "@/config/wedding";
import "./globals.css";

// next/font: 빌드 시 폰트를 self-host → 외부 요청 없음, CLS 방지
const sans = Gowun_Dodum({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  preload: false, // 한글 글리프는 unicode-range 단위로 필요한 만큼만 로드
});
const serif = Cormorant_Garamond({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-en",
});

// Vercel 배포 시 자동 주입되는 도메인을 OG 이미지 절대경로 기준으로 사용
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: wedding.meta.title,
  description: wedding.meta.description,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: wedding.meta.title,
    description: wedding.meta.description,
    images: [{ url: wedding.meta.ogImage, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: wedding.meta.title, description: wedding.meta.description, images: [wedding.meta.ogImage] },
  // 개인정보 보호: 검색엔진 노출 차단
  robots: { index: false, follow: false },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f5f2",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${sans.variable} ${serif.variable}`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
