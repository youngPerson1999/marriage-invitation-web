/**
 * 청첩장에 들어가는 모든 정보는 이 파일 하나에서 수정합니다.
 * 사진은 public/images 폴더의 파일을 교체하면 됩니다.
 */

export type Person = {
  name: string;
  /** 고인인 경우 이름 앞에 국화 아이콘 표시 */
  deceased?: boolean;
  phone?: string;
};

export type Account = {
  bank: string;
  number: string;
  holder: string;
  /** 카카오페이 송금 링크 (선택) */
  kakaoPay?: string;
};

export const wedding = {
  /** 예식 일시 (한국 시간, ISO 8601) */
  date: "2027-10-23T12:30:00+09:00",
  /** 처음 만난 날 ("함께 보낸 소중한 날" 계산용) */
  firstMetDate: "2022-01-11T00:00:00+09:00",
  /** 달력에 빨간 날로 표시할 공휴일 (YYYY-MM-DD) */
  holidays: ["2027-10-03", "2027-10-04", "2027-10-09", "2027-10-11"],

  groom: {
    name: "김진호",
    shortName: "진호",
    phone: "010-0000-0000",
    relation: "아들",
    father: { name: "김건호", deceased: true, phone: "010-0000-0000" } as Person,
    mother: { name: "이미자", phone: "010-0000-0000" } as Person,
    profileImage: "/images/groom.jpg",
    intro: [
      "느리지만 확실한 사람",
      "한 번 마음먹으면 끝까지 가고",
      "필요한 순간에 늘 먼저 서 있는",
      "사람과 평생을 함께하려 합니다.",
    ],
  },
  bride: {
    name: "이나은",
    shortName: "나은",
    phone: "010-0000-0000",
    relation: "딸",
    father: { name: "이주명", deceased: true, phone: "010-0000-0000" } as Person,
    mother: { name: "유수지", phone: "010-0000-0000" } as Person,
    profileImage: "/images/bride.jpg",
    intro: [
      "웃음이 먼저인 사람",
      "지나가는 하루도 이야기로 만들고",
      "사소한 것에 기뻐할 줄 아는",
      "사람과 평생을 함께하려 합니다.",
    ],
  },

  venue: {
    name: "더채플앳청담",
    hall: "커티지홀, 3층",
    address: "서울 강남구 선릉로 757",
    tel: "02-0000-0000",
    /** 지도 앱 딥링크/검색에 사용되는 좌표 */
    lat: 37.5226,
    lng: 127.0418,
    transport: [
      {
        title: "지하철",
        lines: ["7호선 강남구청역 3-1번 출구 도보 10분", "수인분당선 압구정로데오역 4번 출구 도보 7분"],
      },
      {
        title: "버스",
        lines: ["간선 301, 342, 472 · 지선 3011, 4412", "‘강남구청’ 정류장 하차"],
      },
      {
        title: "주차",
        lines: ["건물 내 지하 주차장 이용 (2시간 무료)"],
      },
    ],
  },

  invitation: {
    title: "소중한 분들을 초대합니다",
    message: [
      "우연처럼 다가온 인연이",
      "매일을 특별하게 만들었습니다.",
      "서로의 이야기를 들으며 웃고,",
      "함께의 내일을 꿈꾸게 되었습니다.",
      "",
      "하루하루 마음이 깊어진 끝에",
      "우리라는 한 편의 이야기가 시작됩니다.",
      "두 사람의 설레는 시작에",
      "소중한 분의 따뜻한 축복을 기다립니다.",
    ],
  },

  coverImage: "/images/cover.jpg",
  gallery: [
    "/images/gallery-01.jpg",
    "/images/gallery-02.jpg",
    "/images/gallery-03.jpg",
    "/images/gallery-04.jpg",
    "/images/gallery-05.jpg",
    "/images/gallery-06.jpg",
    "/images/gallery-07.jpg",
    "/images/gallery-08.jpg",
    "/images/gallery-09.jpg",
  ],

  accounts: {
    groom: [
      { bank: "신한은행", number: "110-000-000000", holder: "김진호" },
      { bank: "국민은행", number: "000000-00-000000", holder: "김건호" },
      { bank: "우리은행", number: "1002-000-000000", holder: "이미자" },
    ] as Account[],
    bride: [
      { bank: "하나은행", number: "000-000000-00000", holder: "이나은" },
      { bank: "농협", number: "000-0000-0000-00", holder: "유수지" },
    ] as Account[],
  },

  /** 배경음악 (public/music/bgm.mp3 파일을 넣으면 재생 버튼이 동작합니다) */
  bgm: "/music/bgm.mp3",

  /** 공유/검색 미리보기 */
  meta: {
    title: "김진호 ♥ 이나은 결혼합니다",
    description: "2027년 10월 23일 토요일 낮 12시 30분, 더채플앳청담 커티지홀",
    ogImage: "/images/og.jpg",
  },
} as const;

export type Wedding = typeof wedding;
