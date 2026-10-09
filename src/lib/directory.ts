export type MenuItem = { name: string; description: string; price: string };
export type Company = {
  slug: string;
  name: string;
  englishName: string;
  description: string;
  address: string;
  established: string;
};
export type Store = {
  slug: string;
  companySlug: string;
  name: string;
  category: string;
  description: string;
  address: string;
  hours: string;
  closed: string;
  photo: string;
  menu: MenuItem[];
  officialInstagram?: string;
};

// デモ情報です。公開前に実際の会社・店舗情報へ差し替えてください。
export const companies: Company[] = [
  {
    slug: "aoyama-living",
    name: "青山リビング株式会社",
    englishName: "AOYAMA LIVING",
    description:
      "暮らしの中に、心がほどける時間を。食と空間を通じて、日々を豊かにする場所をつくっています。",
    address: "東京都港区青山（サンプル）",
    established: "2020年",
  },
  {
    slug: "tsumugi",
    name: "株式会社つむぎ",
    englishName: "TSUMUGI",
    description:
      "土地の恵みと、人の手しごとをつなぐ。地域に根ざしたお店から、長く愛される体験をお届けします。",
    address: "京都府京都市（サンプル）",
    established: "2018年",
  },
];
export const stores: Store[] = [
  {
    slug: "chill-chiba",
    companySlug: "",
    name: "Chill Chiba",
    category: "SHISHA",
    description: "Chill Chiba の店舗・スタッフ紹介。",
    address: "確認中",
    hours: "確認中",
    closed: "確認中",
    photo: "/images/chill-chiba.svg",
    menu: [],
    officialInstagram: "https://www.instagram.com/chillchiba__/",
  },
  {
    slug: "aoyama-coffee",
    companySlug: "aoyama-living",
    name: "青山珈琲",
    category: "CAFE",
    description:
      "一杯の珈琲からはじまる、穏やかな時間。丁寧に淹れた珈琲と季節のお菓子を、落ち着いた空間で。",
    address: "東京都港区青山（サンプル）",
    hours: "10:00–19:00",
    closed: "水曜日",
    photo: "/images/cafe.svg",
    menu: [
      {
        name: "ハンドドリップ珈琲",
        description: "香り豊かな、その日のおすすめの豆で。",
        price: "¥650",
      },
      {
        name: "季節のケーキ",
        description: "旬の素材を使った自家製ケーキ。",
        price: "¥780",
      },
    ],
  },
  {
    slug: "living-table",
    companySlug: "aoyama-living",
    name: "LIVING TABLE",
    category: "DINING",
    description:
      "旬を味わい、会話を楽しむ。季節の食材を大切にした料理で、いつもの一日を少し特別に。",
    address: "東京都渋谷区（サンプル）",
    hours: "11:30–21:00",
    closed: "月曜日",
    photo: "/images/dining.svg",
    menu: [
      {
        name: "季節のランチプレート",
        description: "野菜を中心とした、彩り豊かな一皿。",
        price: "¥1,800",
      },
    ],
  },
  {
    slug: "tsumugi-atelier",
    companySlug: "tsumugi",
    name: "つむぎのアトリエ",
    category: "LIFESTYLE",
    description:
      "手に取るたび、愛着が深まるもの。作り手の想いが宿る器や暮らしの道具をご紹介します。",
    address: "京都府京都市（サンプル）",
    hours: "11:00–18:00",
    closed: "火曜日・水曜日",
    photo: "/images/atelier.svg",
    menu: [],
  },
];
export const companyBySlug = (slug: string) =>
  companies.find((company) => company.slug === slug);
export const storeBySlug = (slug: string) =>
  stores.find((store) => store.slug === slug);
