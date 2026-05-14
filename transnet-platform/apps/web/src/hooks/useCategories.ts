'use client';

import { useEffect, useState } from 'react';
import { catalogService } from '@/services/catalog.service';
import { Brand, Category } from '@/types/catalog';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;
    Promise.all([catalogService.getCategories(), catalogService.getBrands()])
      .then(([categoryData, brandData]) => {
        if (!active) return;
        setCategories(categoryData);
        setBrands(brandData);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { categories, brands, loading, error };
}
