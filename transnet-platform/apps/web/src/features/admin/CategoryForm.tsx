'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { CategoryFormData, categorySchema } from '@/schemas/admin.schema';
import { Category } from '@/types/catalog';

type CategoryFormProps = {
  initial?: Category | null;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel?: () => void;
};

export function CategoryForm({ initial, onSubmit, onCancel }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initial?.name ?? '',
      slug: initial?.slug ?? '',
      description: initial?.description ?? '',
      isActive: initial?.isActive ?? true,
      sortOrder: initial?.sortOrder ?? 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Nome" error={errors.name?.message} {...register('name')} />
        <Input label="Slug" error={errors.slug?.message} {...register('slug')} />
      </div>
      <Textarea label="Descricao" error={errors.description?.message} {...register('description')} />
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Ordem" type="number" error={errors.sortOrder?.message} {...register('sortOrder')} />
        <label className="flex items-center gap-2 pt-8 text-sm font-semibold">
          <input type="checkbox" {...register('isActive')} />
          Ativa
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar categoria'}</Button>
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
      </div>
    </form>
  );
}
