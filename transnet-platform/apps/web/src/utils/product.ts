import { Product } from '@/types/catalog';

export function getProductImage(product: Product) {
  return product.images?.find((image) => image.isMain)?.url ?? product.images?.[0]?.url ?? null;
}

export function getProductAlt(product: Product) {
  return product.images?.find((image) => image.isMain)?.alt ?? product.name;
}
