'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StatusMessage } from '@/components/admin/StatusMessage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { LoginFormData, loginSchema } from '@/schemas/admin.schema';

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const [error, setError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginFormData) {
    setError(undefined);
    try {
      await login(data.email, data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel entrar');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-navy px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-lg bg-white p-8 shadow-soft">
        <div className="mb-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-blue text-xl font-black text-white">T</span>
          <h1 className="mt-5 text-2xl font-black text-brand-navy">Painel Transnet</h1>
          <p className="mt-2 text-sm text-brand-muted">Acesse com seu usuario administrativo.</p>
        </div>
        <div className="grid gap-4">
          <Input label="E-mail" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Senha" type="password" error={errors.password?.message} {...register('password')} />
          <StatusMessage type="error" message={error} />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
