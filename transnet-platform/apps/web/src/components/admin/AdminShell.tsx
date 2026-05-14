'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Boxes, Building2, Contact, Inbox, LayoutDashboard, LogOut, Mail, Tags } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { cn } from '@/utils/cn';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produtos', label: 'Produtos', icon: Boxes },
  { href: '/admin/categorias', label: 'Categorias', icon: Tags },
  { href: '/admin/marcas', label: 'Marcas', icon: Building2 },
  { href: '/admin/cotacoes', label: 'Cotacoes', icon: Inbox },
  { href: '/admin/contatos', label: 'Contatos', icon: Contact },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAdminAuth();

  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-r border-slate-200 bg-brand-navy text-white">
        <div className="flex items-center gap-3 px-6 py-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-cyan font-black">T</span>
          <div>
            <p className="font-black">Transnet Admin</p>
            <p className="text-xs text-slate-300">{user?.email}</p>
          </div>
        </div>
        <nav className="grid gap-1 px-3 pb-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white',
                pathname === item.href && 'bg-white text-brand-navy hover:bg-white hover:text-brand-navy',
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 pb-6">
          <Button type="button" variant="ghost" onClick={logout} className="w-full gap-2 bg-white/5 text-white hover:bg-white/10">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>
      <section className="min-w-0">
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-brand-navy">
            <BarChart3 className="h-5 w-5" />
            <span className="font-bold">Painel administrativo</span>
          </div>
        </header>
        <div className="px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </section>
    </div>
  );
}
