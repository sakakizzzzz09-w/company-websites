import Link from "next/link";
import Image from "next/image";
import { companies, stores } from "@/lib/directory";
import { StoreCard } from "@/components/store-card";
export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-8 md:grid-cols-2 md:px-12 md:pb-24 md:pt-12">
        <div>
          <p className="eyebrow">A COLLECTION OF MEANINGFUL PLACES</p>
          <h1 className="mt-8 font-serif text-4xl leading-[1.65] tracking-wider sm:text-5xl">
            暮らしを彩る、
            <br />
            場所と出会い。
          </h1>
          <p className="mt-7 max-w-md text-sm leading-8 text-stone-600">
            一杯の珈琲。心を満たす食事。長く使いたい道具。
            <br className="hidden sm:block" />
            私たちが大切にする会社とお店をご紹介します。
          </p>
          <Link
            href="#stores"
            className="mt-9 inline-flex gap-12 border-b border-[#9b825a] pb-3 text-xs tracking-widest"
          >
            お店を見つける <span aria-hidden="true">↓</span>
          </Link>
        </div>
        <div className="relative">
          <Image
            src="/images/cafe.svg"
            alt="穏やかな光が差し込むカフェのイメージイラスト"
            width={800}
            height={600}
            priority
            className="aspect-[4/3] w-full object-cover"
          />
          <p className="mt-3 text-right text-[10px] tracking-widest text-stone-500">
            日常に、小さな余白を。
          </p>
        </div>
      </section>
      <section
        id="stores"
        className="border-t border-stone-200 bg-[#efeee8] px-6 py-16 md:px-12 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow">OUR STORES</p>
              <h2 className="mt-4 font-serif text-3xl">店舗をめぐる</h2>
            </div>
            <p className="text-xs text-stone-500">
              {String(stores.length).padStart(2, "0")} PLACES
            </p>
          </div>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <StoreCard key={store.slug} store={store} />
            ))}
          </div>
        </div>
      </section>
      <section
        id="companies"
        className="mx-auto max-w-6xl px-6 pt-16 md:px-12 md:pt-24"
      >
        <p className="eyebrow">OUR COMPANIES</p>
        <h2 className="mt-4 font-serif text-3xl">場所をつくる、私たち。</h2>
        <div className="mt-10 border-t border-stone-300">
          {companies.map((company, i) => (
            <Link
              key={company.slug}
              href={`/companies/${company.slug}`}
              className="grid gap-5 border-b border-stone-300 py-8 md:grid-cols-[40px_1fr_1fr_24px]"
            >
              <span className="text-xs text-[#8d7755]">0{i + 1}</span>
              <div>
                <p className="eyebrow">{company.englishName}</p>
                <h3 className="mt-2 font-serif text-xl">{company.name}</h3>
              </div>
              <p className="text-sm leading-7 text-stone-600">
                {company.description}
              </p>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
