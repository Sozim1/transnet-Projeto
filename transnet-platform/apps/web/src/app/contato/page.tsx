import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/forms/ContactForm';

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <span className="text-sm font-bold uppercase text-brand-blue">Contato</span>
          <h1 className="mt-2 text-3xl font-black text-brand-navy">Fale com a Transnet</h1>
          <p className="mt-4 text-brand-muted">Canais comerciais, unidades e formulario para contato institucional.</p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <Phone className="h-5 w-5 text-brand-blue" />
              <h2 className="mt-3 font-bold text-brand-navy">Telefones</h2>
              <p className="mt-2 text-sm text-brand-muted">Sao Paulo: (11) 2603-7070</p>
              <p className="text-sm text-brand-muted">Campinas: (19) 3500-2760</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <Mail className="h-5 w-5 text-brand-blue" />
              <h2 className="mt-3 font-bold text-brand-navy">E-mail</h2>
              <p className="mt-2 text-sm text-brand-muted">info@transnetdistribuidora.com.br</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <MapPin className="h-5 w-5 text-brand-blue" />
              <h2 className="mt-3 font-bold text-brand-navy">Unidades</h2>
              <p className="mt-2 text-sm text-brand-muted">Venda: Sao Paulo/SP e Campinas/SP</p>
              <p className="text-sm text-brand-muted">Logistica: Serra/ES e Itajai/SC</p>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
