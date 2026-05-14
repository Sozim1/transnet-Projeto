'use client';

import Link from 'next/link';
import { Mail, Menu, Phone, ShieldQuestion, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useQuote } from '@/hooks/useQuote';

const categories = [
  { label: 'Redes', href: '/categorias/redes' },
  { label: 'Seguranca eletronica', href: '/categorias/seguranca-eletronica' },
  { label: 'Ferramentas', href: '/categorias/ferramentas' },
  { label: 'Eletrica', href: '/categorias/eletrica' },
  { label: 'Marcas', href: '/marcas' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useQuote();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="bg-brand-navy text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="tel:+551126037070" className="inline-flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" /> Sao Paulo (11) 2603-7070
            </a>
            <a href="tel:+551935002760" className="inline-flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" /> Campinas (19) 3500-2760
            </a>
            <a href="mailto:info@transnetdistribuidora.com.br" className="inline-flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" /> info@transnetdistribuidora.com.br
            </a>
          </div>
          <a href="/contato" className="inline-flex items-center gap-2 font-semibold">
            <ShieldQuestion className="h-3.5 w-3.5" /> Canal de suporte
          </a>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-blue text-lg font-black text-white">
            T
          </span>
          <span>
            <span className="block text-xl font-black tracking-tight text-brand-navy">Transnet</span>
            <span className="block text-xs font-semibold uppercase text-brand-muted">Distribuidora</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {categories.map((category) => (
            <Link key={category.href} href={category.href} className="text-sm font-semibold text-brand-ink hover:text-brand-blue">
              {category.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button href="/cotacao" variant="secondary" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Ver minha cotacao
            {totalItems > 0 && <span className="rounded-full bg-white px-2 py-0.5 text-xs text-brand-navy">{totalItems}</span>}
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Abrir menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="rounded-md px-3 py-3 text-sm font-semibold hover:bg-brand-surface"
                onClick={() => setOpen(false)}
              >
                {category.label}
              </Link>
            ))}
            <Button href="/cotacao" className="mt-2 gap-2">
              <ShoppingCart className="h-4 w-4" /> Ver minha cotacao
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
