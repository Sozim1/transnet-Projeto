'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Brand } from '@/types/catalog';

type ProductFiltersProps = {
  brands: Brand[];
  categorySlug?: string;
};

export function ProductFilters({ brands, categorySlug }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [brandSlug, setBrandSlug] = useState(searchParams.get('brandSlug') ?? '');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (brandSlug) params.set('brandSlug', brandSlug);
    router.push(`/categorias/${categorySlug ?? 'redes'}?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_auto]">
      <Input label="Buscar por nome" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ex.: conversor, keystone, cabo" />
      <Select label="Marca" value={brandSlug} onChange={(event) => setBrandSlug(event.target.value)}>
        <option value="">Todas as marcas</option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.slug}>
            {brand.name}
          </option>
        ))}
      </Select>
      <div className="flex items-end">
        <Button type="submit" className="w-full">Filtrar</Button>
      </div>
    </form>
  );
}
