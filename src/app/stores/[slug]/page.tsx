import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { stores, storeBySlug, companyBySlug } from "@/lib/directory";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return stores.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const store = storeBySlug((await params).slug);
  return { title: store?.name, description: store?.description };
}
export default async function StorePage({ params }: Props) {
  const store = storeBySlug((await params).slug);
  if (!store) notFound();
  const company = companyBySlug(store.companySlug);
  return (
    <article className="mx-auto max-w-6xl px-6 pt-10 md:px-12">
      <Link href="/#stores" className="text-xs text-stone-600">
        ← 店舗一覧へ
      </Link>
      <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="eyebrow">{store.category}</p>
          <h1 className="mt-5 font-serif text-4xl leading-relaxed">
            {store.name}
          </h1>
          <p className="mt-6 text-sm leading-8 text-stone-600">
            {store.description}
          </p>
        </div>
        <Image
          src={store.photo}
          alt={`${store.name}のイメージイラスト`}
          width={800}
          height={600}
          priority
          className="aspect-[4/3] w-full object-cover"
        />
      </div>
      <section className="mt-14">
        <h2 className="font-serif text-2xl">店舗情報</h2>
        <dl className="mt-6 divide-y divide-stone-200 border-y border-stone-200">
          {[
            ["所在地", store.address],
            ["営業時間", store.hours],
            ["定休日", store.closed],
          ].map(([label, value]) => (
            <div
              key={label}
              className="grid gap-3 py-5 text-sm sm:grid-cols-[160px_1fr]"
            >
              <dt className="text-stone-500">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
          {company && (
            <div className="grid gap-3 py-5 text-sm sm:grid-cols-[160px_1fr]">
              <dt className="text-stone-500">運営会社</dt>
              <dd>
                <Link href={`/companies/${company.slug}`} className="underline">
                  {company.name}
                </Link>
              </dd>
            </div>
          )}
        </dl>
      </section>
      {store.menu.length > 0 && (
        <section className="mt-16">
          <p className="eyebrow">MENU</p>
          <h2 className="mt-4 font-serif text-2xl">おすすめメニュー</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {store.menu.map((item) => (
              <div key={item.name} className="bg-[#efeee8] p-7">
                <div className="flex flex-wrap justify-between gap-4">
                  <h3 className="font-serif text-lg">{item.name}</h3>
                  <p>{item.price}</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-stone-500">
            表示価格は税込のサンプルです。
          </p>
        </section>
      )}
    </article>
  );
}
