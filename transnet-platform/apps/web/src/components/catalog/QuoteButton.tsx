'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useQuote } from '@/hooks/useQuote';
import { Product } from '@/types/catalog';

export function QuoteButton({ product }: { product: Product }) {
  const { addItem } = useQuote();

  return (
    <Button type="button" onClick={() => addItem(product)} className="gap-2">
      <ShoppingCart className="h-4 w-4" />
      Adicionar a cotacao
    </Button>
  );
}
