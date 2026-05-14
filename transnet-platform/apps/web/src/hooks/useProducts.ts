'use client';

import { useEffect, useState } from 'react';
import { catalogService } from '@/services/catalog.service';
import { PaginatedResponse, Product, ProductQuery } from '@/types/catalog';

type ProductsState = {
  data?: PaginatedResponse<Product>;
  loading: boolean;
  error?: string;
};

export function useProducts(query: ProductQuery = {}) {
  const [state, setState] = useState<ProductsState>({ loading: true });

  useEffect(() => {
    let active = true;
    setState({ loading: true });

    catalogService
      .getProducts(query)
      .then((data) => active && setState({ data, loading: false }))
      .catch((error: Error) => active && setState({ error: error.message, loading: false }));

    return () => {
      active = false;
    };
  }, [query.search, query.categorySlug, query.brandSlug, query.page, query.limit]);

  return state;
}
