'use client';

import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminShell } from '@/components/admin/AdminShell';
import { AdminAuthProvider } from '@/hooks/useAdminAuth';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  return (
    <AdminAuthProvider>
      <AdminGuard>
        {isLogin ? children : <AdminShell>{children}</AdminShell>}
      </AdminGuard>
    </AdminAuthProvider>
  );
}
