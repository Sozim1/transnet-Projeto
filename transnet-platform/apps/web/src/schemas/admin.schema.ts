import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Informe um e-mail valido'),
  password: z.string().min(8, 'A senha precisa ter ao menos 8 caracteres'),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Informe o nome'),
  slug: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export const brandSchema = z.object({
  name: z.string().min(2, 'Informe o nome'),
  slug: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().url('Informe uma URL valida').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

const productImageSchema = z.object({
  url: z.string().url('Informe uma URL valida'),
  alt: z.string().optional(),
  isMain: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Informe o nome'),
  slug: z.string().optional(),
  sku: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  brandId: z.string().optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  imageUrl: z.string().url('Informe uma URL valida').optional().or(z.literal('')),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type BrandFormData = z.infer<typeof brandSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type ProductImageFormData = z.infer<typeof productImageSchema>;
