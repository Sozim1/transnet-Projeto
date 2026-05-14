'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Loading } from '@/components/ui/Loading';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { adminService } from '@/services/admin.service';
import { ContactMessage, NewsletterSubscriber, Quote } from '@/types/admin';
import { PaginatedResponse, Product } from '@/types/catalog';

export default function AdminDashboardPage() {
  const { token } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    products?: PaginatedResponse<Product>;
    quotes?: Quote[];
    contacts?: ContactMessage[];
    newsletter?: NewsletterSubscriber[];
  }>({});

  useEffect(() => {
    if (!token) return;
    Promise.all([
      adminService.products.list(token, { limit: 5 }),
      adminService.quotes.list(token),
      adminService.contacts.list(token),
      adminService.newsletter.list(token),
    ])
      .then(([products, quotes, contacts, newsletter]) => setData({ products, quotes, contacts, newsletter }))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <Loading label="Carregando dashboard" />;

  const cards = [
    { label: 'Produtos', value: data.products?.meta.total ?? 0 },
    { label: 'Cotacoes', value: data.quotes?.length ?? 0 },
    { label: 'Contatos', value: data.contacts?.length ?? 0 },
    { label: 'Newsletter', value: data.newsletter?.length ?? 0 },
  ];

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-black text-brand-navy">Dashboard</h1>
        <p className="mt-2 text-brand-muted">Resumo operacional do catalogo e leads recebidos.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-brand-muted">{card.label}</p>
            <p className="mt-3 text-3xl font-black text-brand-navy">{card.value}</p>
          </article>
        ))}
      </div>
      <section>
        <h2 className="mb-4 text-xl font-bold text-brand-navy">Ultimas cotacoes</h2>
        <DataTable
          data={(data.quotes ?? []).slice(0, 5)}
          columns={[
            { header: 'Cliente', cell: (quote) => quote.customerName },
            { header: 'E-mail', cell: (quote) => quote.email },
            { header: 'Itens', cell: (quote) => quote.items.length },
            { header: 'Status', cell: (quote) => quote.status },
          ]}
        />
      </section>
    </div>
  );
}
