import Link from "next/link";
export default function NotFound() {
  return (
    <div className="px-6 py-24 text-center">
      <p className="eyebrow">404 — PAGE NOT FOUND</p>
      <h1 className="mt-6 font-serif text-3xl">ページが見つかりません</h1>
      <p className="mt-5 text-sm text-stone-600">
        会社・店舗の一覧からお探しください。
      </p>
      <Link
        href="/"
        className="mt-8 inline-block border-b border-stone-400 pb-2"
      >
        トップページへ戻る
      </Link>
    </div>
  );
}
