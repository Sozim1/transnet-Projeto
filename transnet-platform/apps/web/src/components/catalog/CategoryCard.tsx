import Link from 'next/link';
import { Cable, ShieldCheck, Wrench, Zap, Tags } from 'lucide-react';
import { Category } from '@/types/catalog';

const iconMap: Record<string, React.ElementType> = {
  redes: Cable,
  'seguranca-eletronica': ShieldCheck,
  ferramentas: Wrench,
  eletrica: Zap,
  marcas: Tags,
};

export function CategoryCard({ category }: { category: Category }) {
  const Icon = iconMap[category.slug] ?? Tags;

  return (
    <Link
      href={category.slug === 'marcas' ? '/marcas' : `/categorias/${category.slug}`}
      className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-blue hover:shadow-soft"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-blue/10 text-brand-blue transition group-hover:bg-brand-blue group-hover:text-white">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-brand-ink">{category.name}</h3>
      <p className="mt-2 text-sm leading-6 text-brand-muted">
        Explore solucoes, produtos e marcas para projetos tecnicos.
      </p>
    </Link>
  );
}
