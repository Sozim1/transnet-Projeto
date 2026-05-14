'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Loading } from '@/components/ui/Loading';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { adminService } from '@/services/admin.service';
import { NewsletterSubscriber } from '@/types/admin';

export default function AdminNewsletterPage() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    adminService.newsletter.list(token).then(setItems).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <Loading label="Carregando newsletter" />;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-black text-brand-navy">Newsletter</h1>
        <p className="mt-2 text-brand-muted">Inscritos cadastrados pelo site publico.</p>
      </div>
      <DataTable
        data={items}
        columns={[
          { header: 'E-mail', cell: (item) => item.email },
          { header: 'Nome', cell: (item) => item.name ?? '-' },
          { header: 'Status', cell: (item) => item.isActive ? 'Ativo' : 'Inativo' },
          { header: 'Data', cell: (item) => new Date(item.createdAt).toLocaleDateString('pt-BR') },
        ]}
      />
    </div>
  );
}
