'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Product, QuoteItem } from '@/types/catalog';

type QuoteContextValue = {
  items: QuoteItem[];
  totalItems: number;
  addItem: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);
const STORAGE_KEY = 'transnet_quote_items';

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) setItems(JSON.parse(stored) as QuoteItem[]);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<QuoteContextValue>(
    () => ({
      items,
      totalItems: items.reduce((total, item) => total + item.quantity, 0),
      addItem: (product) => {
        setItems((current) => {
          const found = current.find((item) => item.product.id === product.id);
          if (found) {
            return current.map((item) =>
              item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
            );
          }
          return [...current, { product, quantity: 1 }];
        });
      },
      updateQuantity: (productId, quantity) => {
        setItems((current) =>
          current.map((item) =>
            item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
          ),
        );
      },
      removeItem: (productId) => {
        setItems((current) => current.filter((item) => item.product.id !== productId));
      },
      clear: () => setItems([]),
    }),
    [items],
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) throw new Error('useQuote deve ser usado dentro de QuoteProvider');
  return context;
}
