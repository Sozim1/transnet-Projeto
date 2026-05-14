import { QuoteForm } from '@/components/forms/QuoteForm';

export default function QuotePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-sm font-bold uppercase text-brand-blue">Cotacao</span>
        <h1 className="mt-2 text-3xl font-black text-brand-navy">Minha cotacao</h1>
        <p className="mt-2 max-w-2xl text-brand-muted">Revise os produtos adicionados, informe seus dados e envie a solicitacao para o time comercial.</p>
      </div>
      <QuoteForm />
    </section>
  );
}
