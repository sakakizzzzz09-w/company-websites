import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { companies, companyBySlug, stores } from "@/lib/directory";
import { StoreCard } from "@/components/store-card";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return companies.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const company = companyBySlug((await params).slug);
  return { title: company?.name, description: company?.description };
}
export default async function CompanyPage({ params }: Props) {
  const company = companyBySlug((await params).slug);
  if (!company) notFound();
  const ownedStores = stores.filter(
    (store) => store.companySlug === company.slug,
  );
  return (
    <article className="mx-auto max-w-6xl px-6 pt-10 md:px-12">
      <Link href="/#companies" className="text-xs text-stone-600">
        ← 会社一覧へ
      </Link>
      <p className="eyebrow mt-14">{company.englishName}</p>
      <h1 className="mt-5 font-serif text-3xl leading-relaxed sm:text-5xl">
        {company.name}
      </h1>
      <p className="mt-8 max-w-2xl leading-8 text-stone-600">
        {company.description}
      </p>
      <section className="mt-14">
        <h2 className="font-serif text-2xl">会社情報</h2>
        <dl className="mt-6 divide-y divide-stone-200 border-y border-stone-200">
          {[
            ["会社名", company.name],
            ["所在地", company.address],
            ["設立", company.established],
          ].map(([label, value]) => (
            <div
              key={label}
              className="grid gap-3 py-5 text-sm sm:grid-cols-[160px_1fr]"
            >
              <dt className="text-stone-500">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="mt-16">
        <p className="eyebrow">OUR STORES</p>
        <h2 className="mt-4 font-serif text-2xl">運営店舗</h2>
        <div className="mt-8 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {ownedStores.map((store) => (
            <StoreCard key={store.slug} store={store} />
          ))}
        </div>
      </section>
    </article>
  );
}
