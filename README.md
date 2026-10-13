# 모바일 청첩장

Next.js 16 (App Router) 기반 모바일 청첩장입니다. Vercel 배포에 맞춰 최적화되어 있습니다.

## 구성

| 섹션 | 내용 |
| --- | --- |
| 커버 | 날짜 · 메인 사진 · 이름 · 일시/장소, 배경음악 토글 |
| 초대글 | 인사말, 혼주 (고인은 국화 표시), 연락하기(전화/문자) 모달 |
| 프로필 | 신랑 · 신부 소개 |
| 달력 | 예식 월 달력(공휴일 표시), 실시간 카운트다운, 함께한 날 |
| 갤러리 | 3열 그리드 + 더보기, 스와이프/키보드 지원 라이트박스 |
| 오시는 길 | 지도, 주소 복사, 네이버/카카오/티맵 길찾기, 교통편 |
| 참석 의사 | 첫 방문 시 팝업(오늘 하루 보지 않기) + 응답 폼 → `/api/rsvp` |
| 마음 전하실 곳 | 신랑측/신부측 계좌 아코디언 + 복사 |
| 공유 | 카카오톡 공유(선택), Web Share API, 링크 복사 |

## 내용 수정

- **모든 텍스트/날짜/계좌/연락처**: `src/config/wedding.ts` 한 파일만 수정하면 됩니다.
- **사진**: `public/images/` 의 파일을 같은 이름으로 교체하세요. (현재는 회색 플레이스홀더)
  - `cover.jpg` 메인(3:4), `groom.jpg`/`bride.jpg` 프로필(3:4), `gallery-XX.jpg` 갤러리, `og.jpg` 공유 미리보기(1200×630)
  - 원본을 크게 넣어도 Vercel Image Optimization이 기기별 AVIF/WebP로 자동 변환합니다.
- **배경음악**: `public/music/bgm.mp3` 를 넣으면 우측 상단 버튼으로 재생됩니다. 파일이 없으면 버튼이 숨겨집니다.

## 로컬 실행

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 프로덕션 빌드 확인
```

## Vercel 배포

1. 이 저장소를 Vercel에 Import (Framework: Next.js 자동 인식, 설정 변경 불필요)
2. (선택) **Storage → Upstash for Redis** 를 프로젝트에 연결 → RSVP 응답이 저장됩니다.
   연결하지 않으면 응답은 Vercel 로그(Functions → Logs)에만 남습니다.
3. (선택) **Settings → Environment Variables** 에 `.env.example` 항목 설정
   - `RSVP_ADMIN_KEY`: 응답 조회 `https://도메인/api/rsvp?key=키` · CSV 다운로드 `&format=csv`
   - `NEXT_PUBLIC_KAKAO_JS_KEY`: 카카오톡 공유 버튼 활성화
4. (선택) **Analytics / Speed Insights** 탭에서 활성화하면 방문 통계·성능 지표가 수집됩니다.

## 성능 · 최적화 포인트

- 페이지 전체가 **정적 프리렌더링**(`force-static`) → Vercel CDN 엣지에서 바로 응답
- `next/image` + AVIF/WebP, 커버 사진만 `priority` 로 LCP 최적화, 나머지는 lazy load
- `next/font` 로 폰트를 self-host (외부 폰트 요청·레이아웃 이동 없음)
- 카운트다운은 `useSyncExternalStore` 로 하이드레이션 불일치 없이 클라이언트에서만 계산
- 지도 iframe·카카오 SDK·배경음악은 지연 로딩 (`loading="lazy"`, `lazyOnload`, `preload="none"`)
- 개인정보 보호를 위해 검색엔진 `noindex` (메신저 미리보기는 정상 동작)
