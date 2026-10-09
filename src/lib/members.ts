import { stores } from "./directory";

export type SocialPlatform = "instagram" | "tiktok" | "x";
export type Member = {
  id: string; // 管理画面・CMSでも維持する不変ID
  slug: string;
  name: string;
  nickname?: string;
  role: "OWNER" | "MANAGER" | "STAFF" | "GUEST";
  photo?: string; // public/ 内の画像パス。未登録時はプレースホルダー
  introduction: string;
  favoriteFlavors: string[];
  recommendedMix: string;
  socials: Partial<Record<SocialPlatform, string>>;
  publication: { consent: boolean; status: "draft" | "published" };
  order: number;
};

// 掲載許可済み情報のみ登録してください。未確認の個人情報・SNSは含めません。
export const membersByStore: Record<string, Member[]> = {
  "chill-chiba": [],
  "aoyama-coffee": [],
  "living-table": [],
  "tsumugi-atelier": [],
};
export const memberTheme = (storeSlug: string) =>
  storeSlug === "chill-chiba" ? "members-theme-chill" : "members-theme-default";
export const memberPath = (storeSlug: string, memberSlug: string) =>
  `/stores/${encodeURIComponent(storeSlug)}/members/${encodeURIComponent(memberSlug)}`;
export function publishedMembers(storeSlug: string): Member[] {
  if (!stores.some((store) => store.slug === storeSlug)) return [];
  return (membersByStore[storeSlug] ?? [])
    .filter(
      (member) =>
        member.publication.consent && member.publication.status === "published",
    )
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}
export const publishedMember = (storeSlug: string, memberSlug: string) =>
  publishedMembers(storeSlug).find((member) => member.slug === memberSlug);

// HTTPSと公式ホストを限定し、空欄・誤登録・危険なURLをリンクにしません。
export function safeSocialUrl(
  platform: SocialPlatform,
  value?: string,
): string | undefined {
  if (!value) return;
  try {
    const url = new URL(value);
    const hosts = {
      instagram: ["instagram.com", "www.instagram.com"],
      tiktok: ["tiktok.com", "www.tiktok.com"],
      x: ["x.com", "www.x.com", "twitter.com", "www.twitter.com"],
    };
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.port ||
      !hosts[platform].includes(url.hostname) ||
      url.pathname === "/"
    )
      return;
    return url.href;
  } catch {
    return;
  }
}
