import { Brand, Category, PaginatedResponse, Product, ProductQuery } from '@/types/catalog';
import { apiRequest } from './api';

export const catalogService = {
  getCategories: () => apiRequest<Category[]>('/categories/tree'),
  getBrands: () => apiRequest<Brand[]>('/brands'),
  getProducts: (query: ProductQuery = {}) =>
    apiRequest<PaginatedResponse<Product>>('/products', { query }),
  getFeaturedProducts: () => apiRequest<Product[]>('/products/featured'),
  getProduct: (slug: string) => apiRequest<Product>(`/products/${slug}`),
};
