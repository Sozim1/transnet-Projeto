import type { Metadata } from 'next';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { QuoteProvider } from '@/hooks/useQuote';
import './globals.css';

export const metadata: Metadata = {
  title: 'Transnet | Catalogo e cotacao',
  description: 'Catalogo institucional para distribuicao de produtos de redes, seguranca, ferramentas e eletrica.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-brand-surface text-brand-ink antialiased">
        <QuoteProvider>
          <SiteChrome>{children}</SiteChrome>
        </QuoteProvider>
      </body>
    </html>
  );
}
