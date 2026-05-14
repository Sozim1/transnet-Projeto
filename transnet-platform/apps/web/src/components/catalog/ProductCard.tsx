import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types/catalog';
import { getProductAlt, getProductImage } from '@/utils/product';

export function ProductCard({ product }: { product: Product }) {
  const image = getProductImage(product);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <Link href={`/produtos/${product.slug}`} className="relative flex aspect-[4/3] items-center justify-center bg-slate-100">
        {image ? (
          <Image src={image} alt={getProductAlt(product)} fill className="object-contain p-6" unoptimized />
        ) : (
          <span className="text-sm font-semibold text-brand-muted">Imagem em breve</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-bold uppercase tracking-wide text-brand-blue">
          {product.category?.name ?? 'Catalogo'}
        </span>
        <h3 className="mt-2 line-clamp-3 min-h-16 text-base font-semibold text-brand-ink">{product.name}</h3>
        {product.brand?.name && <p className="mt-2 text-sm text-brand-muted">Marca: {product.brand.name}</p>}
        <Button href={`/produtos/${product.slug}`} variant="outline" className="mt-auto gap-2">
          Ver detalhes
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}
