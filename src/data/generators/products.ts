import {ENV} from '../../core/config/env';

export type Product = {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  tags: string[];
  description: string;
  imageSeed: string;
};

const CATEGORIES = ['Herbs', 'Oils', 'Supplements', 'Teas', 'Skincare', 'Wellness Kits'];
const BRANDS = ['Himalaya', 'Dabur', 'Patanjali', 'Kerala Ayurveda', 'Baidyanath', 'Zandu'];
const HERBS = ['Ashwagandha', 'Triphala', 'Brahmi', 'Turmeric', 'Neem', 'Amla', 'Shatavari', 'Guduchi', 'Tulsi', 'Shilajit'];

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export function generateProducts(count = ENV.PRODUCT_COUNT): Product[] {
  const rand = seededRandom(123);
  const products: Product[] = [];

  for (let i = 0; i < count; i++) {
    const herb = HERBS[Math.floor(rand() * HERBS.length)];
    const category = CATEGORIES[Math.floor(rand() * CATEGORIES.length)];
    const price = Math.floor(rand() * 2000) + 99;
    products.push({
      id: `prod-${i + 1}`,
      name: `${herb} ${category === 'Oils' ? 'Oil' : category === 'Teas' ? 'Tea' : 'Capsules'} ${i % 100}`,
      category,
      brand: BRANDS[Math.floor(rand() * BRANDS.length)],
      price,
      originalPrice: Math.floor(price * (1 + rand() * 0.4)),
      rating: Math.round((3 + rand() * 2) * 10) / 10,
      reviewCount: Math.floor(rand() * 1000),
      inStock: rand() > 0.08,
      tags: [herb.toLowerCase(), category.toLowerCase()],
      description: `Premium Ayurvedic ${herb} product for holistic wellness.`,
      imageSeed: `product-${i}`,
    });
  }

  return products;
}

let cachedProducts: Product[] | null = null;

export function getProducts(): Product[] {
  if (!cachedProducts) cachedProducts = generateProducts();
  return cachedProducts;
}

export type SortOption = 'price_asc' | 'price_desc' | 'rating' | 'name';

export type ProductFilters = {
  categories: string[];
  brands: string[];
  inStockOnly: boolean;
  minPrice?: number;
  maxPrice?: number;
  search: string;
  sort: SortOption;
};

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  let result = products;

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }

  if (filters.categories.length) {
    result = result.filter(p => filters.categories.includes(p.category));
  }

  if (filters.brands.length) {
    result = result.filter(p => filters.brands.includes(p.brand));
  }

  if (filters.inStockOnly) {
    result = result.filter(p => p.inStock);
  }

  if (filters.minPrice != null) {
    result = result.filter(p => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice != null) {
    result = result.filter(p => p.price <= filters.maxPrice!);
  }

  switch (filters.sort) {
    case 'price_asc':
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result = [...result].sort((a, b) => b.rating - a.rating);
      break;
    case 'name':
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return result;
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = page * pageSize;
  return items.slice(start, start + pageSize);
}
