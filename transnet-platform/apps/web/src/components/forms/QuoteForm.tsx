'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useQuote } from '@/hooks/useQuote';
import { QuoteFormData, quoteSchema } from '@/schemas/quote.schema';
import { quoteService } from '@/services/quote.service';

export function QuoteForm() {
  const { items, updateQuantity, removeItem, clear } = useQuote();
  const [status, setStatus] = useState<string>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormData>({ resolver: zodResolver(quoteSchema) });

  async function onSubmit(data: QuoteFormData) {
    if (!items.length) {
      setStatus('Adicione ao menos um produto antes de enviar.');
      return;
    }
    await quoteService.create(data, items);
    clear();
    reset();
    setStatus('Cotacao enviada. Nossa equipe comercial retornara em breve.');
  }

  if (!items.length) {
    return <EmptyState title="Sua cotacao esta vazia" description="Adicione produtos pelo catalogo para montar sua solicitacao." actionHref="/categorias/redes" actionLabel="Ver catalogo" />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-brand-navy">Produtos adicionados</h2>
        <div className="mt-5 divide-y divide-slate-200">
          {items.map((item) => (
            <div key={item.product.id} className="grid gap-4 py-4 sm:grid-cols-[1fr_110px_auto] sm:items-center">
              <div>
                <p className="font-semibold text-brand-ink">{item.product.name}</p>
                <p className="mt-1 text-sm text-brand-muted">{item.product.category?.name} {item.product.brand?.name ? `- ${item.product.brand.name}` : ''}</p>
              </div>
              <Input
                aria-label="Quantidade"
                type="number"
                min={1}
                value={item.quantity}
                onChange={(event) => updateQuantity(item.product.id, Number(event.target.value))}
              />
              <button
                type="button"
                onClick={() => removeItem(item.product.id)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-red-600 hover:bg-red-50"
                aria-label="Remover produto"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-brand-navy">Dados do cliente</h2>
        <Input label="Nome" error={errors.customerName?.message} {...register('customerName')} />
        <Input label="Empresa" error={errors.company?.message} {...register('company')} />
        <Input label="E-mail" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="Telefone/WhatsApp" error={errors.phone?.message} {...register('phone')} />
        <Textarea label="Observacao" error={errors.notes?.message} {...register('notes')} />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar solicitacao'}
        </Button>
        {status && <p className="text-sm font-semibold text-brand-blue">{status}</p>}
      </form>
    </div>
  );
}
