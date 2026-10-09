import Image from "next/image";
import Link from "next/link";
import {
  memberPath,
  safeSocialUrl,
  type Member,
  type SocialPlatform,
} from "@/lib/members";

const platforms: { key: SocialPlatform; label: string }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "x", label: "X" },
];
function SocialIcon({ platform }: { platform: SocialPlatform }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      {platform === "instagram" ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
        </>
      ) : platform === "tiktok" ? (
        <path d="M14 3v12a5 5 0 1 1-4-4.9V14a2 2 0 1 0 1 1V3h3c.5 3 2 4 5 4v3c-2 0-4-1-5-2" />
      ) : (
        <path d="m4 3 16 18h-4L4 3h4l12 18M20 3 4 21" />
      )}
    </svg>
  );
}
export function SocialLinks({
  member,
  showLabels = false,
}: {
  member: Member;
  showLabels?: boolean;
}) {
  return (
    <div className="member-socials">
      {platforms.map(({ key, label }) => {
        const href = safeSocialUrl(key, member.socials[key]);
        return href ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name}の${label}（新しいタブで開く）`}
          >
            <SocialIcon platform={key} />
            {showLabels && <span>{label}</span>}
          </a>
        ) : null;
      })}
    </div>
  );
}
export function MemberPhoto({
  member,
  large = false,
}: {
  member: Member;
  large?: boolean;
}) {
  return member.photo ? (
    <Image
      src={member.photo}
      alt={`${member.name}のプロフィール写真`}
      width={720}
      height={900}
      sizes={
        large
          ? "(min-width: 768px) 45vw, 100vw"
          : "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
      }
      className="member-photo"
    />
  ) : (
    <div
      className="member-photo member-placeholder"
      role="img"
      aria-label={`${member.name}の写真は準備中`}
    >
      <svg
        viewBox="0 0 100 100"
        width="100"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="50" cy="32" r="16" />
        <path d="M20 85c0-35 60-35 60 0" />
      </svg>
      <span>PHOTO COMING SOON</span>
    </div>
  );
}
export function MemberCard({
  member,
  storeSlug,
}: {
  member: Member;
  storeSlug: string;
}) {
  const href = memberPath(storeSlug, member.slug);
  return (
    <article className="member-card">
      <Link href={href} aria-label={`${member.name}のプロフィールを見る`}>
        <MemberPhoto member={member} />
      </Link>
      <div className="member-card-body">
        <p className="member-role">{member.role}</p>
        <h2>
          <Link href={href}>{member.name}</Link>
        </h2>
        {member.nickname && <p className="member-muted">{member.nickname}</p>}
        <SocialLinks member={member} />
        <Link href={href} className="member-button">
          PROFILE <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
