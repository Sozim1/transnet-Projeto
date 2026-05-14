'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { StatusMessage } from '@/components/admin/StatusMessage';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { CategoryForm } from '@/features/admin/CategoryForm';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { CategoryFormData } from '@/schemas/admin.schema';
import { adminService } from '@/services/admin.service';
import { Category } from '@/types/catalog';

export default function AdminCategoriesPage() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();

  async function load() {
    if (!token) return;
    setLoading(true);
    const data = await adminService.categories.list(token);
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { void load(); }, [token]);

  async function save(data: CategoryFormData) {
    if (!token) return;
    setError(undefined);
    try {
      if (editing) await adminService.categories.update(token, editing.id, data);
      else await adminService.categories.create(token, data);
      setMessage('Categoria salva com sucesso.');
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    }
  }

  async function remove(id: string) {
    if (!token) return;
    await adminService.categories.remove(token, id);
    await load();
  }

  if (loading) return <Loading label="Carregando categorias" />;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-brand-navy">Categorias</h1>
          <p className="mt-2 text-brand-muted">Gerencie a estrutura do catalogo.</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>Nova categoria</Button>
      </div>
      <StatusMessage type="success" message={message} />
      <StatusMessage type="error" message={error} />
      {showForm && <CategoryForm initial={editing} onSubmit={save} onCancel={() => setShowForm(false)} />}
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
