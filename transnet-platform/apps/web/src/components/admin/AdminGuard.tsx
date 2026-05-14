'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loading } from '@/components/ui/Loading';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !token && !isLogin) router.replace('/admin/login');
    if (!loading && token && isLogin) router.replace('/admin');
  }, [isLogin, loading, router, token]);

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20">
        <Loading label="Validando acesso" />
      </div>
    );
  }

  return <>{children}</>;
}
