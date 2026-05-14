'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Loading } from '@/components/ui/Loading';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { adminService } from '@/services/admin.service';
import { ContactMessage } from '@/types/admin';

export default function AdminContactsPage() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    adminService.contacts.list(token).then(setItems).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <Loading label="Carregando contatos" />;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-black text-brand-navy">Contatos recebidos</h1>
        <p className="mt-2 text-brand-muted">Mensagens enviadas pelo formulario publico.</p>
      </div>
      <DataTable
        data={items}
        columns={[
          { header: 'Nome', cell: (item) => item.name },
          { header: 'Empresa', cell: (item) => item.company ?? '-' },
          { header: 'E-mail', cell: (item) => item.email },
          { header: 'Telefone', cell: (item) => item.phone ?? '-' },
          { header: 'Assunto', cell: (item) => item.subject ?? '-' },
          { header: 'Mensagem', cell: (item) => <span className="line-clamp-2">{item.message}</span> },
        ]}
      />
    </div>
  );
}
