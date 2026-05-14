import Link from 'next/link';
import { Brand } from '@/types/catalog';

export function BrandList({ brands }: { brands: Brand[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {brands.map((brand) => (
        <Link
          key={brand.id}
          href={`/marcas/${brand.slug}`}
          className="flex min-h-20 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-center text-sm font-semibold text-brand-ink shadow-sm transition hover:border-brand-blue hover:text-brand-blue"
        >
          {brand.name}
        </Link>
      ))}
    </div>
  );
}
