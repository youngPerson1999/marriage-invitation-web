import type { MetadataRoute } from "next";

// 카카오톡·메신저 미리보기 봇이 OG 태그를 읽을 수 있도록 크롤링은 허용하고,
// 검색 노출은 layout의 noindex 메타 태그로 막습니다.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" } };
}
