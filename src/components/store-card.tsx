import Link from "next/link";
import Image from "next/image";
import type { Store } from "@/lib/directory";
export function StoreCard({ store }: { store: Store }) {
  return (
    <Link href={`/stores/${store.slug}`} className="group block">
      <div className="overflow-hidden bg-stone-200">
        <Image
          src={store.photo}
          alt={`${store.name}のイメージイラスト`}
          width={800}
          height={600}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="eyebrow">{store.category}</p>
        <span aria-hidden="true" className="text-[#8d7755]">
          ↗
        </span>
      </div>
      <h3 className="mt-3 font-serif text-2xl">{store.name}</h3>
      <p className="mt-3 text-sm leading-7 text-stone-600">
        {store.description}
      </p>
    </Link>
  );
}
