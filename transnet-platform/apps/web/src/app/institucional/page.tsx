import { Headphones, MapPinned, ShieldCheck } from 'lucide-react';

export default function InstitutionalPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <span className="text-sm font-bold uppercase text-brand-blue">Institucional</span>
        <h1 className="mt-2 text-3xl font-black text-brand-navy">Sobre a Transnet</h1>
        <p className="mt-5 text-lg leading-8 text-brand-muted">
          Empresa distribuidora com foco em catalogo tecnico, atendimento especializado e suporte para projetos de infraestrutura, redes, seguranca eletronica, ferramentas e eletrica.
        </p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          { title: 'Atendimento personalizado', icon: ShieldCheck, text: 'Acompanhamento comercial orientado por necessidade e segmento.' },
          { title: 'Suporte especializado', icon: Headphones, text: 'Equipe preparada para apoiar escolhas tecnicas do catalogo.' },
          { title: 'Atendimento nacional', icon: MapPinned, text: 'Estrutura comercial e logistica para projetos em diferentes regioes.' },
        ].map((item) => (
          <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <item.icon className="h-8 w-8 text-brand-blue" />
            <h2 className="mt-4 text-lg font-bold text-brand-navy">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-brand-muted">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
