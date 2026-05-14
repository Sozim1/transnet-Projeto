'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '@/services/auth.service';
import { tokenService } from '@/services/token.service';
import { AdminUser } from '@/types/admin';

type AdminAuthContextValue = {
  token: string | null;
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = tokenService.get();
    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);
    authService
      .me(storedToken)
      .then(setUser)
      .catch(() => {
        tokenService.clear();
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      token,
      user,
      loading,
      login: async (email, password) => {
        const response = await authService.login({ email, password });
        tokenService.set(response.accessToken);
        setToken(response.accessToken);
        setUser(response.user);
        router.push('/admin');
      },
      logout: () => {
        tokenService.clear();
        setToken(null);
        setUser(null);
        router.push('/admin/login');
      },
    }),
    [loading, router, token, user],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth deve ser usado dentro de AdminAuthProvider');
  return context;
}
