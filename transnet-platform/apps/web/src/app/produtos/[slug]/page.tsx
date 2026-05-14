import Image from 'next/image';
import { QuoteButton } from '@/components/catalog/QuoteButton';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { catalogService } from '@/services/catalog.service';
import { getProductAlt, getProductImage } from '@/utils/product';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await catalogService.getProduct(slug).catch(() => null);

  if (!product) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState title="Produto nao encontrado" actionHref="/categorias/redes" actionLabel="Voltar ao catalogo" />
      </section>
    );
  }

  const mainImage = getProductImage(product);
  const specs = product.technicalSpecs ? Object.entries(product.technicalSpecs) : [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="relative flex aspect-square items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm">
            {mainImage ? (
              <Image src={mainImage} alt={getProductAlt(product)} fill className="object-contain p-8" unoptimized />
            ) : (
              <span className="text-brand-muted">Imagem em breve</span>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((image) => (
                <div key={image.id} className="relative aspect-square rounded-md border border-slate-200 bg-white">
                  <Image src={image.url} alt={image.alt ?? product.name} fill className="object-contain p-2" unoptimized />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-sm font-bold uppercase text-brand-blue">{product.category?.name ?? 'Produto'}</span>
          <h1 className="mt-3 text-3xl font-black text-brand-navy sm:text-4xl">{product.name}</h1>
          {product.brand?.name && <p className="mt-3 text-brand-muted">Marca: <strong>{product.brand.name}</strong></p>}
          {product.shortDescription && <p className="mt-5 text-lg leading-8 text-brand-muted">{product.shortDescription}</p>}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <QuoteButton product={product} />
            <Button href="/cotacao" variant="outline">Ver minha cotacao</Button>
          </div>

          <div className="mt-10 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-brand-navy">Descricao</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-brand-muted">
              {product.description ?? 'Descricao tecnica sera cadastrada pela equipe administrativa.'}
            </p>
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-brand-navy">Especificacoes tecnicas</h2>
            {specs.length ? (
              <dl className="mt-4 grid gap-3">
                {specs.map(([key, value]) => (
                  <div key={key} className="grid gap-1 border-b border-slate-100 pb-3 sm:grid-cols-[180px_1fr]">
                    <dt className="text-sm font-semibold text-brand-ink">{key}</dt>
                    <dd className="text-sm text-brand-muted">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-3 text-sm text-brand-muted">Especificacoes em cadastramento.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
