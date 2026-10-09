import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { stores, storeBySlug } from "@/lib/directory";
import { publishedMembers, memberTheme } from "@/lib/members";
import { MemberCard } from "@/components/members";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return stores.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const store = storeBySlug((await params).slug);
  if (!store) notFound();
  return {
    title: `OUR MEMBERS — ${store.name}`,
    description: `${store.name}のスタッフをご紹介します。プロフィールと個人SNSはこちら。`,
  };
}
export default async function MembersPage({ params }: Props) {
  const { slug } = await params;
  const store = storeBySlug(slug);
  if (!store) notFound();
  const members = publishedMembers(slug);
  return (
    <article className={`members-shell ${memberTheme(slug)}`}>
      <div className="members-container">
        <Link href={`/stores/${slug}`} className="member-back">
          ← {store.name}へ戻る
        </Link>
        <header className="members-heading">
          <p className="member-role">{store.name}</p>
          <h1>OUR MEMBERS</h1>
          <p className="member-muted">この場所をつくる、一人ひとり。</p>
        </header>
        {members.length ? (
          <div className="members-grid">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} storeSlug={slug} />
            ))}
          </div>
        ) : (
          <div className="members-empty">
            <p>スタッフ紹介は準備中です。</p>
            <p className="member-muted">
              公開の準備が整い次第、こちらでご紹介します。
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
