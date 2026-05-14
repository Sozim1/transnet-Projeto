'use client';

import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { newsletterService } from '@/services/newsletter.service';

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string>();

  async function handleNewsletter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Enviando...');
    try {
      await newsletterService.subscribe({ email });
      setEmail('');
      setStatus('Cadastro recebido.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Nao foi possivel cadastrar.');
    }
  }

  return (
    <footer className="mt-20 bg-brand-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:px-8">
        <section>
          <h2 className="text-xl font-black">Transnet</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
            Catalogo institucional para distribuicao tecnica, atendimento consultivo e solicitacao de cotacoes.
          </p>
          <form onSubmit={handleNewsletter} className="mt-6 space-y-3">
            <Input
              label="Newsletter"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              required
            />
            <Button type="submit" variant="primary">
              Receber novidades
            </Button>
            {status && <p className="text-xs text-slate-300">{status}</p>}
          </form>
        </section>

        <section>
          <h3 className="font-bold">Fale conosco</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p className="flex gap-2"><Phone className="h-4 w-4" /> Sao Paulo (11) 2603-7070</p>
            <p className="flex gap-2"><Phone className="h-4 w-4" /> Campinas (19) 3500-2760</p>
            <p className="flex gap-2"><Mail className="h-4 w-4" /> info@transnetdistribuidora.com.br</p>
          </div>
        </section>

        <section>
          <h3 className="font-bold">Unidades</h3>
          <div className="mt-4 space-y-4 text-sm text-slate-300">
            <p className="flex gap-2"><MapPin className="h-4 w-4" /> Venda: Sao Paulo/SP e Campinas/SP</p>
            <p className="flex gap-2"><MapPin className="h-4 w-4" /> Logistica: Serra/ES e Itajai/SC</p>
          </div>
        </section>

        <section>
          <h3 className="font-bold">Institucional</h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-300">
            <Link href="/institucional">Sobre a empresa</Link>
            <Link href="/contato">Contato</Link>
            <Link href="/cotacao">Minha cotacao</Link>
            <Link href="/politica-de-privacidade">Politica de Privacidade</Link>
          </div>
          <div className="mt-6 flex gap-3">
            <a href="https://www.linkedin.com" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
            <a href="https://www.facebook.com" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
            <a href="https://www.instagram.com" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
          </div>
        </section>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        Site novo desenvolvido como catalogo institucional. Assets definitivos devem ser autorizados pelo cliente.
      </div>
    </footer>
  );
}
