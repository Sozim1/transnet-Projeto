'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { ProductFormData, productSchema } from '@/schemas/admin.schema';
import { Brand, Category, Product } from '@/types/catalog';

type ProductFormProps = {
  initial?: Product | null;
  categories: Category[];
  brands: Brand[];
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel?: () => void;
};

export function ProductForm({ initial, categories, brands, onSubmit, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initial?.name ?? '',
      slug: initial?.slug ?? '',
      sku: initial?.sku ?? '',
      shortDescription: initial?.shortDescription ?? '',
      description: initial?.description ?? '',
      categoryId: initial?.categoryId ?? '',
      brandId: initial?.brandId ?? '',
      isFeatured: initial?.isFeatured ?? false,
      status: initial?.status ?? 'ACTIVE',
      imageUrl: initial?.images?.[0]?.url ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Nome" error={errors.name?.message} {...register('name')} />
        <Input label="Slug" error={errors.slug?.message} {...register('slug')} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Input label="SKU" error={errors.sku?.message} {...register('sku')} />
        <Select label="Categoria" error={errors.categoryId?.message} {...register('categoryId')}>
          <option value="">Selecione</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </Select>
        <Select label="Marca" error={errors.brandId?.message} {...register('brandId')}>
          <option value="">Sem marca</option>
          {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
        </Select>
      </div>
      <Input label="Imagem principal por URL" error={errors.imageUrl?.message} {...register('imageUrl')} />
      <Textarea label="Descricao curta" error={errors.shortDescription?.message} {...register('shortDescription')} />
      <Textarea label="Descricao completa" error={errors.description?.message} {...register('description')} />
      <div className="grid gap-4 md:grid-cols-3">
        <Select label="Status" error={errors.status?.message} {...register('status')}>
          <option value="ACTIVE">Ativo</option>
          <option value="INACTIVE">Inativo</option>
        </Select>
        <label className="flex items-center gap-2 pt-8 text-sm font-semibold">
          <input type="checkbox" {...register('isFeatured')} />
          Produto em destaque
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar produto'}</Button>
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
      </div>
    </form>
  );
}
