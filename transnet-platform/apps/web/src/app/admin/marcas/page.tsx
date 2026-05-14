'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { StatusMessage } from '@/components/admin/StatusMessage';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { BrandForm } from '@/features/admin/BrandForm';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { BrandFormData } from '@/schemas/admin.schema';
import { adminService } from '@/services/admin.service';
import { Brand } from '@/types/catalog';

export default function AdminBrandsPage() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<Brand[]>([]);
  const [editing, setEditing] = useState<Brand | null>();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();

  async function load() {
    if (!token) return;
    setLoading(true);
    setItems(await adminService.brands.list(token));
    setLoading(false);
  }

  useEffect(() => { void load(); }, [token]);

  async function save(data: BrandFormData) {
    if (!token) return;
    setError(undefined);
    try {
      const payload = { ...data, logoUrl: data.logoUrl || undefined };
      if (editing) await adminService.brands.update(token, editing.id, payload);
      else await adminService.brands.create(token, payload);
      setMessage('Marca salva com sucesso.');
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    }
  }

  async function remove(id: string) {
    if (!token) return;
    await adminService.brands.remove(token, id);
    await load();
  }

  if (loading) return <Loading label="Carregando marcas" />;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-brand-navy">Marcas</h1>
          <p className="mt-2 text-brand-muted">Gerencie marcas vinculadas aos produtos.</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>Nova marca</Button>
      </div>
      <StatusMessage type="success" message={message} />
      <StatusMessage type="error" message={error} />
      {showForm && <BrandForm initial={editing} onSubmit={save} onCancel={() => setShowForm(false)} />}
      <DataTable
        data={items}
        columns={[
          { header: 'Nome', cell: (item) => item.name },
          { header: 'Slug', cell: (item) => item.slug },
          { header: 'Status', cell: (item) => item.isActive ? 'Ativa' : 'Inativa' },
          {
            header: 'Acoes',
            cell: (item) => (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setEditing(item); setShowForm(true); }}>Editar</Button>
                <Button variant="ghost" onClick={() => remove(item.id)}>Excluir</Button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
