import { ArrowRight, Headphones, MapPinned, UserRoundCheck } from 'lucide-react';
import { BrandList } from '@/components/catalog/BrandList';
import { CategoryCard } from '@/components/catalog/CategoryCard';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { catalogService } from '@/services/catalog.service';

export default async function HomePage() {
  const [categories, brands, featuredProducts] = await Promise.all([
    catalogService.getCategories().catch(() => []),
    catalogService.getBrands().catch(() => []),
    catalogService.getFeaturedProducts().catch(() => []),
  ]);

  return (
    <>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <span className="text-sm font-bold uppercase tracking-wide text-brand-blue">Catalogo institucional e cotacao</span>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-brand-navy sm:text-5xl">
              Distribuicao tecnica com atendimento consultivo para todo o Brasil
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-brand-muted">
              Encontre produtos de redes, seguranca eletronica, ferramentas e eletrica. Monte sua cotacao e fale com uma equipe especializada.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/categorias/redes" className="gap-2">
                Ver catalogo <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/cotacao" variant="outline">
                Ver minha cotacao
              </Button>
            </div>
          </div>
          <div className="rounded-lg bg-brand-navy p-8 text-white shadow-soft">
            <div className="grid h-full min-h-80 content-between rounded-md border border-white/15 p-6">
              <div>
                <p className="text-sm font-semibold text-brand-cyan">Banner principal</p>
                <h2 className="mt-4 text-3xl font-black">Solucoes para infraestrutura, seguranca e conectividade.</h2>
              </div>
              <div className="mt-10 grid gap-3 text-sm text-slate-200">
                <p>Atendimento comercial em Sao Paulo e Campinas.</p>
                <p>Suporte especializado para projetos tecnicos.</p>
                <p>Logistica preparada para atendimento nacional.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'Atendimento personalizado', text: 'Resolva tudo com uma equipe preparada para orientar sua compra.', icon: UserRoundCheck },
            { title: 'Suporte especializado', text: 'Apoio tecnico para produtos e aplicacoes do catalogo.', icon: Headphones },
            { title: 'Atende todo o Brasil', text: 'Operacao com unidades comerciais e logisticas estrategicas.', icon: MapPinned },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <item.icon className="h-8 w-8 text-brand-blue" />
              <h3 className="mt-4 text-lg font-bold text-brand-navy">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-brand-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-brand-navy">Categorias principais</h2>
            <p className="mt-2 text-brand-muted">Navegue pelos segmentos do catalogo.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => <CategoryCard key={category.id} category={category} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-brand-navy">Produtos em destaque</h2>
            <p className="mt-2 text-brand-muted">Itens iniciais para validar a experiencia do catalogo.</p>
          </div>
          <Button href="/categorias/redes" variant="outline">Ver todos</Button>
        </div>
        {featuredProducts.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <EmptyState title="Nenhum produto em destaque" description="Cadastre produtos no painel administrativo para preencher esta area." />
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-brand-navy">Marcas parceiras</h2>
        <p className="mt-2 text-brand-muted">Estrutura preparada para marcas cadastradas no backend.</p>
        <div className="mt-6">
          <BrandList brands={brands} />
        </div>
      </section>
    </>
  );
}
