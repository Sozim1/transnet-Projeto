'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { BrandFormData, brandSchema } from '@/schemas/admin.schema';
import { Brand } from '@/types/catalog';

type BrandFormProps = {
  initial?: Brand | null;
  onSubmit: (data: BrandFormData) => Promise<void>;
  onCancel?: () => void;
};

export function BrandForm({ initial, onSubmit, onCancel }: BrandFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: initial?.name ?? '',
      slug: initial?.slug ?? '',
      description: initial?.description ?? '',
      logoUrl: initial?.logoUrl ?? '',
      isActive: initial?.isActive ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Nome" error={errors.name?.message} {...register('name')} />
        <Input label="Slug" error={errors.slug?.message} {...register('slug')} />
      </div>
      <Input label="URL do logo" error={errors.logoUrl?.message} {...register('logoUrl')} />
      <Textarea label="Descricao" error={errors.description?.message} {...register('description')} />
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" {...register('isActive')} />
        Ativa
      </label>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar marca'}</Button>
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
      </div>
    </form>
  );
}
