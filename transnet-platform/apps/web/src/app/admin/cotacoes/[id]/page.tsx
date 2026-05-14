'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { adminService } from '@/services/admin.service';
import { Quote } from '@/types/admin';

export default function AdminQuoteDetailPage() {
  const { token } = useAdminAuth();
  const params = useParams<{ id: string }>();
  const [quote, setQuote] = useState<Quote>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !params.id) return;
    adminService.quotes.detail(token, params.id).then(setQuote).finally(() => setLoading(false));
  }, [params.id, token]);

  if (loading) return <Loading label="Carregando cotacao" />;
  if (!quote) return <p>Cotacao nao encontrada.</p>;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-brand-navy">Cotacao de {quote.customerName}</h1>
          <p className="mt-2 text-brand-muted">{quote.email} - {quote.phone}</p>
        </div>
        <Button href="/admin/cotacoes" variant="outline">Voltar</Button>
      </div>
      <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
        <p><strong>Empresa:</strong> {quote.company ?? '-'}</p>
        <p><strong>Status:</strong> {quote.status}</p>
        <p className="md:col-span-2"><strong>Observacao:</strong> {quote.notes ?? '-'}</p>
      </section>
      <DataTable
        data={quote.items}
        columns={[
          { header: 'Produto', cell: (item) => item.product.name },
          { header: 'Categoria', cell: (item) => item.product.category?.name ?? '-' },
          { header: 'Marca', cell: (item) => item.product.brand?.name ?? '-' },
          { header: 'Quantidade', cell: (item) => item.quantity },
        ]}
      />
    </div>
  );
}
