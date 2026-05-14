'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { adminService } from '@/services/admin.service';
import { Quote } from '@/types/admin';

export default function AdminQuotesPage() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    adminService.quotes.list(token).then(setItems).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <Loading label="Carregando cotacoes" />;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-black text-brand-navy">Cotacoes recebidas</h1>
        <p className="mt-2 text-brand-muted">Solicitacoes enviadas pelo site publico.</p>
      </div>
      <DataTable
        data={items}
        columns={[
          { header: 'Cliente', cell: (item) => item.customerName },
          { header: 'Empresa', cell: (item) => item.company ?? '-' },
          { header: 'E-mail', cell: (item) => item.email },
          { header: 'Itens', cell: (item) => item.items.length },
          { header: 'Data', cell: (item) => new Date(item.createdAt).toLocaleDateString('pt-BR') },
          {
            header: 'Acoes',
            cell: (item) => (
              <Button href={`/admin/cotacoes/${item.id}`} variant="outline">Detalhes</Button>
            ),
          },
        ]}
      />
    </div>
  );
}
