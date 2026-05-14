import { ProductCard } from '@/components/catalog/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { catalogService } from '@/services/catalog.service';

type BrandPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const products = await catalogService.getProducts({ brandSlug: slug, limit: 12 }).catch(() => ({
    items: [],
    meta: { total: 0, page: 1, limit: 12, pageCount: 0 },
  }));

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="text-sm font-bold uppercase text-brand-blue">Marca</span>
      <h1 className="mt-2 text-3xl font-black text-brand-navy">Produtos da marca</h1>
      <div className="mt-8">
        {products.items.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.items.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <EmptyState title="Nenhum produto encontrado para esta marca" actionHref="/marcas" actionLabel="Ver marcas" />
        )}
      </div>
    </section>
  );
}
