import { z } from 'zod';

export const quoteSchema = z.object({
  customerName: z.string().min(2, 'Informe seu nome'),
  company: z.string().optional(),
  email: z.string().email('Informe um e-mail valido'),
  phone: z.string().min(8, 'Informe um telefone ou WhatsApp'),
  notes: z.string().optional(),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;
