import { ProductFilters } from '@/components/catalog/ProductFilters';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { catalogService } from '@/services/catalog.service';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ search?: string; brandSlug?: string; page?: string }>;
};

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const page = Number(query.page ?? 1);
  const [brands, products] = await Promise.all([
    catalogService.getBrands().catch(() => []),
    catalogService
      .getProducts({
        categorySlug: slug,
        search: query.search,
        brandSlug: query.brandSlug,
        page,
        limit: 12,
      })
      .catch(() => ({ items: [], meta: { total: 0, page: 1, limit: 12, pageCount: 0 } })),
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-sm font-bold uppercase text-brand-blue">Categoria</span>
        <h1 className="mt-2 text-3xl font-black text-brand-navy">Catalogo de produtos</h1>
        <p className="mt-2 max-w-2xl text-brand-muted">Filtre por nome e marca para encontrar os produtos mais adequados para sua cotacao.</p>
      </div>

      <ProductFilters brands={brands} categorySlug={slug} />

      <div className="mt-8">
        {products.items.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.items.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <EmptyState title="Nenhum produto encontrado" description="Tente ajustar a busca ou limpar os filtros." />
        )}
      </div>

      {products.meta.pageCount > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          {page > 1 && <Button href={`/categorias/${slug}?page=${page - 1}`} variant="outline">Anterior</Button>}
          <span className="text-sm font-semibold text-brand-muted">Pagina {page} de {products.meta.pageCount}</span>
          {page < products.meta.pageCount && <Button href={`/categorias/${slug}?page=${page + 1}`} variant="outline">Proxima</Button>}
        </div>
      )}
    </section>
  );
}
