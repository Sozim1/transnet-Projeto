export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  isActive: boolean;
  sortOrder: number;
  children?: Category[];
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  isActive: boolean;
};

export type ProductImage = {
  id: string;
  url: string;
  alt?: string | null;
  sortOrder: number;
  isMain: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  technicalSpecs?: Record<string, unknown> | null;
  categoryId: string;
  brandId?: string | null;
  category?: Category;
  brand?: Brand | null;
  images?: ProductImage[];
  isFeatured: boolean;
  status: 'ACTIVE' | 'INACTIVE';
};

export type PaginatedResponse<T> = {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
};

export type ProductQuery = {
  search?: string;
  categorySlug?: string;
  brandSlug?: string;
  page?: number;
  limit?: number;
};

export type QuoteItem = {
  product: Product;
  quantity: number;
};
