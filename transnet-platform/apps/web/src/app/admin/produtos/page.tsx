'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { StatusMessage } from '@/components/admin/StatusMessage';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { ProductForm } from '@/features/admin/ProductForm';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { ProductFormData } from '@/schemas/admin.schema';
import { adminService } from '@/services/admin.service';
import { Brand, Category, Product } from '@/types/catalog';

export default function AdminProductsPage() {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [editing, setEditing] = useState<Product | null>();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();

  async function load() {
    if (!token) return;
    setLoading(true);
    const [productData, categoryData, brandData] = await Promise.all([
      adminService.products.list(token, { limit: 100 }),
      adminService.categories.list(token),
      adminService.brands.list(token),
    ]);
    setProducts(productData.items);
    setCategories(categoryData);
    setBrands(brandData);
    setLoading(false);
  }

  useEffect(() => { void load(); }, [token]);

  async function save(data: ProductFormData) {
    if (!token) return;
    setError(undefined);
    try {
      const payload = {
        name: data.name,
        slug: data.slug || undefined,
        sku: data.sku || undefined,
        shortDescription: data.shortDescription || undefined,
        description: data.description || undefined,
        categoryId: data.categoryId,
        brandId: data.brandId || (editing ? null : undefined),
        isFeatured: data.isFeatured,
        status: data.status,
        images: data.imageUrl ? [{ url: data.imageUrl, alt: data.name, isMain: true, sortOrder: 0 }] : undefined,
      };
      if (editing) await adminService.products.update(token, editing.id, payload);
      else await adminService.products.create(token, payload);
      setMessage('Produto salvo com sucesso.');
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    }
  }

  async function remove(id: string) {
    if (!token) return;
    await adminService.products.remove(token, id);
    await load();
  }

  if (loading) return <Loading label="Carregando produtos" />;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-brand-navy">Produtos</h1>
          <p className="mt-2 text-brand-muted">Gerencie o catalogo publico.</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>Novo produto</Button>
      </div>
      <StatusMessage type="success" message={message} />
      <StatusMessage type="error" message={error} />
      {showForm && <ProductForm initial={editing} categories={categories} brands={brands} onSubmit={save} onCancel={() => setShowForm(false)} />}
      <DataTable
        data={products}
        columns={[
          { header: 'Produto', cell: (item) => <span className="font-semibold">{item.name}</span> },
          { header: 'Categoria', cell: (item) => item.category?.name ?? '-' },
          { header: 'Marca', cell: (item) => item.brand?.name ?? '-' },
          { header: 'Status', cell: (item) => item.status },
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
