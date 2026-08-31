import {useCallback, useMemo, useState} from 'react';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {apiRequest} from '../../../core/api/client';
import {ENV} from '../../../core/config/env';
import {
  Product,
  ProductFilters,
  filterProducts,
  getProducts,
  paginate,
} from '../../../data/generators/products';

const defaultFilters: ProductFilters = {
  categories: [],
  brands: [],
  inStockOnly: false,
  search: '',
  sort: 'rating',
};

export function useProducts() {
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);

  const {data: allProducts, isLoading} = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const result = await apiRequest('products', () => getProducts());
      if (!result.success) throw result.error;
      return result.data;
    },
    staleTime: ENV.CACHE_TTL_MS,
  });

  const filteredProducts = useMemo(
    () => (allProducts ? filterProducts(allProducts, filters) : []),
    [allProducts, filters],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products-paged', filters],
    queryFn: ({pageParam = 0}) =>
      paginate(filteredProducts, pageParam, ENV.PAGE_SIZE),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === ENV.PAGE_SIZE ? allPages.length : undefined,
    initialPageParam: 0,
    enabled: filteredProducts.length > 0,
  });

  const products = useMemo(
    () => data?.pages.flat() ?? [],
    [data],
  );

  const categories = useMemo(() => {
    if (!allProducts) return [];
    return [...new Set(allProducts.map((p: Product) => p.category))].sort();
  }, [allProducts]);

  const brands = useMemo(() => {
    if (!allProducts) return [];
    return [...new Set(allProducts.map((p: Product) => p.brand))].sort();
  }, [allProducts]);

  const updateFilter = useCallback(
    <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
      setFilters(prev => ({...prev, [key]: value}));
    },
    [],
  );

  const toggleCategory = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  }, []);

  const toggleBrand = useCallback((brand: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand],
    }));
  }, []);

  return {
    products,
    filteredCount: filteredProducts.length,
    isLoading,
    filters,
    updateFilter,
    toggleCategory,
    toggleBrand,
    categories,
    brands,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}

export function useProduct(id: string) {
  const {data} = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const result = await apiRequest('products', () => getProducts());
      if (!result.success) throw result.error;
      return result.data;
    },
  });

  return useMemo(() => data?.find((p: Product) => p.id === id), [data, id]);
}
