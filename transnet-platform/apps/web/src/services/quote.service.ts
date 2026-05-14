import { QuoteFormData } from '@/schemas/quote.schema';
import { QuoteItem } from '@/types/catalog';
import { apiRequest } from './api';

export const quoteService = {
  create: (data: QuoteFormData, items: QuoteItem[]) =>
    apiRequest('/quotes', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      }),
    }),
};
