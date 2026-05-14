'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ContactFormData, contactSchema } from '@/schemas/contact.schema';
import { contactService } from '@/services/contact.service';

export function ContactForm() {
  const [status, setStatus] = useState<string>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactFormData) {
    setStatus(undefined);
    await contactService.create(data);
    reset();
    setStatus('Mensagem enviada. Nossa equipe retornara em breve.');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Nome" error={errors.name?.message} {...register('name')} />
        <Input label="Empresa" error={errors.company?.message} {...register('company')} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="E-mail" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="Telefone/WhatsApp" error={errors.phone?.message} {...register('phone')} />
      </div>
      <Input label="Assunto" error={errors.subject?.message} {...register('subject')} />
      <Textarea label="Mensagem" error={errors.message?.message} {...register('message')} />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar contato'}
      </Button>
      {status && <p className="text-sm font-semibold text-brand-blue">{status}</p>}
    </form>
  );
}
