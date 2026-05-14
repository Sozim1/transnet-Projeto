import { ContactMessage, NewsletterSubscriber, Quote } from '@/types/admin';
import { Brand, Category, PaginatedResponse, Product, ProductQuery } from '@/types/catalog';
import { authenticatedApiRequest } from './api';

export const adminService = {
  categories: {
    list: (token: string) => authenticatedApiRequest<Category[]>('/categories', token),
    create: (token: string, data: unknown) =>
      authenticatedApiRequest<Category>('/categories', token, { method: 'POST', body: JSON.stringify(data) }),
    update: (token: string, id: string, data: unknown) =>
      authenticatedApiRequest<Category>(`/categories/${id}`, token, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (token: string, id: string) =>
      authenticatedApiRequest<Category>(`/categories/${id}`, token, { method: 'DELETE' }),
  },
  brands: {
    list: (token: string) => authenticatedApiRequest<Brand[]>('/brands', token),
    create: (token: string, data: unknown) =>
      authenticatedApiRequest<Brand>('/brands', token, { method: 'POST', body: JSON.stringify(data) }),
    update: (token: string, id: string, data: unknown) =>
      authenticatedApiRequest<Brand>(`/brands/${id}`, token, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (token: string, id: string) =>
      authenticatedApiRequest<Brand>(`/brands/${id}`, token, { method: 'DELETE' }),
  },
  products: {
    list: (token: string, query: ProductQuery = {}) =>
      authenticatedApiRequest<PaginatedResponse<Product>>('/products', token, { query }),
    create: (token: string, data: unknown) =>
      authenticatedApiRequest<Product>('/products', token, { method: 'POST', body: JSON.stringify(data) }),
    update: (token: string, id: string, data: unknown) =>
      authenticatedApiRequest<Product>(`/products/${id}`, token, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (token: string, id: string) =>
      authenticatedApiRequest<Product>(`/products/${id}`, token, { method: 'DELETE' }),
  },
  quotes: {
    list: (token: string) => authenticatedApiRequest<Quote[]>('/quotes', token),
    detail: (token: string, id: string) => authenticatedApiRequest<Quote>(`/quotes/${id}`, token),
  },
  contacts: {
    list: (token: string) => authenticatedApiRequest<ContactMessage[]>('/contacts', token),
  },
  newsletter: {
    list: (token: string) => authenticatedApiRequest<NewsletterSubscriber[]>('/newsletter', token),
  },
};
