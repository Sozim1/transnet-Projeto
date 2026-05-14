import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  company: z.string().optional(),
  email: z.string().email('Informe um e-mail valido'),
  phone: z.string().min(8, 'Informe um telefone valido').optional().or(z.literal('')),
  subject: z.string().optional(),
  message: z.string().min(10, 'Descreva sua necessidade'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
