import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { stores, storeBySlug } from "@/lib/directory";
import {
  publishedMembers,
  publishedMember,
  memberTheme,
  memberPath,
} from "@/lib/members";
import { MemberPhoto, SocialLinks } from "@/components/members";
type Props = { params: Promise<{ slug: string; memberSlug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return stores.flatMap(({ slug }) =>
    publishedMembers(slug).map((member) => ({ slug, memberSlug: member.slug })),
  );
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, memberSlug } = await params;
  const member = publishedMember(slug, memberSlug);
  const store = storeBySlug(slug);
  if (!member || !store) notFound();
  const title = `${member.name} — ${store.name}`;
  const description =
    `${member.role} ${member.name}のプロフィール。${member.introduction}`.slice(
      0,
      160,
    );
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const url = siteUrl
    ? new URL(memberPath(slug, memberSlug), siteUrl).href
    : undefined;
  return {
    title,
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      title,
      description,
      type: "profile",
      locale: "ja_JP",
      ...(url ? { url } : {}),
      ...(siteUrl && member.photo
        ? {
            images: [
              {
                url: new URL(member.photo, siteUrl).href,
                alt: `${member.name}のプロフィール写真`,
              },
            ],
          }
        : {}),
    },
    twitter: { card: "summary", title, description },
  };
}
export default async function MemberPage({ params }: Props) {
  const { slug, memberSlug } = await params;
  const member = publishedMember(slug, memberSlug);
  const store = storeBySlug(slug);
  if (!member || !store) notFound();
  return (
    <article className={`members-shell ${memberTheme(slug)}`}>
      <div className="members-container">
        <Link href={`/stores/${slug}/members`} className="member-back">
          ← OUR MEMBERS
        </Link>
        <div className="member-profile">
          <MemberPhoto member={member} large />
          <div>
            <p className="member-role">{member.role}</p>
            <h1>{member.name}</h1>
            {member.nickname && (
              <p className="member-muted">{member.nickname}</p>
            )}
            <p className="member-introduction">{member.introduction}</p>
            <dl className="member-details">
              <div>
                <dt>好きなシーシャフレーバー</dt>
                <dd>{member.favoriteFlavors.join(" / ") || "準備中"}</dd>
              </div>
              <div>
                <dt>おすすめのシーシャミックス</dt>
                <dd>{member.recommendedMix || "準備中"}</dd>
              </div>
            </dl>
            <SocialLinks member={member} showLabels />
            <Link href={`/stores/${slug}`} className="member-button">
              {store.name}へ戻る
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
