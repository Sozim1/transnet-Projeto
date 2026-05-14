import { BrandList } from '@/components/catalog/BrandList';
import { catalogService } from '@/services/catalog.service';

export default async function BrandsPage() {
  const brands = await catalogService.getBrands().catch(() => []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="text-sm font-bold uppercase text-brand-blue">Marcas</span>
      <h1 className="mt-2 text-3xl font-black text-brand-navy">Marcas parceiras</h1>
      <p className="mt-3 max-w-2xl text-brand-muted">Navegue pelas marcas cadastradas no catalogo.</p>
      <div className="mt-8">
        <BrandList brands={brands} />
      </div>
    </section>
  );
}
