import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "暮らしを彩る、場所と出会い | PLACES",
    template: "%s | PLACES",
  },
  description:
    "会社と店舗の魅力をひとつに。心地よい暮らしにつながる場所をご紹介します。",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <a href="#main" className="skip-link">
          本文へ移動
        </a>
        <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-7 md:px-12">
          <Link
            href="/"
            className="font-serif text-2xl tracking-[0.18em]"
            aria-label="PLACES トップページ"
          >
            PLACES<span className="text-[#9b825a]">.</span>
          </Link>
          <nav
            aria-label="メインナビゲーション"
            className="flex gap-6 text-xs tracking-widest sm:gap-10"
          >
            <Link href="/#companies">会社一覧</Link>
            <Link href="/#stores">店舗一覧</Link>
          </nav>
        </header>
        <main id="main">{children}</main>
        <footer className="mt-24 border-t border-stone-200 px-6 py-10 md:px-12">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-5 text-xs text-stone-500">
            <p>PLACES — 暮らしを彩る、場所と出会い。</p>
            <p>デモサイト · 掲載情報・イラストはサンプルです</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
