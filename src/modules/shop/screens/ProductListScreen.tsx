import React, {useCallback} from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ShopStackParamList} from '../../../app/navigation/types';
import {useProducts} from '../hooks/useProducts';
import {ProductCard} from '../components/ProductCard';
import {SearchBar} from '../../../shared/components/SearchBar';
import {FilterChip} from '../../../shared/components/FilterChip';
import {LoadingSpinner} from '../../../shared/components/LoadingSpinner';
import {EmptyState} from '../../../shared/components/EmptyState';
import {useTheme, themeClasses} from '../../../shared/theme/ThemeProvider';
import {Product, SortOption} from '../../../data/generators/products';

type Props = NativeStackScreenProps<ShopStackParamList, 'ProductList'>;

const SORT_OPTIONS: {label: string; value: SortOption}[] = [
  {label: 'Top Rated', value: 'rating'},
  {label: 'Price ↑', value: 'price_asc'},
  {label: 'Price ↓', value: 'price_desc'},
  {label: 'A-Z', value: 'name'},
];

export function ProductListScreen({navigation}: Props) {
  const {isDark} = useTheme();
  const {
    products,
    filteredCount,
    isLoading,
    filters,
    updateFilter,
    toggleCategory,
    categories,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProducts();

  const renderItem = useCallback(
    ({item}: {item: Product}) => (
      <ProductCard
        product={item}
        onPress={() => navigation.navigate('ProductDetail', {productId: item.id})}
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <View className={`flex-1 ${themeClasses.bg(isDark)}`}>
      <View className="px-4 pt-4 pb-2">
        <Text className={`text-2xl font-bold ${themeClasses.text(isDark)}`}>Ayurveda Shop</Text>
        <Text className={`text-sm ${themeClasses.textMuted(isDark)}`}>{filteredCount} products</Text>
        <View className="mt-3">
          <SearchBar
            value={filters.search}
            onChangeText={text => updateFilter('search', text)}
            placeholder="Search products..."
          />
        </View>
        <View className="flex-row flex-wrap mt-2">
          {SORT_OPTIONS.map(opt => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              selected={filters.sort === opt.value}
              onPress={() => updateFilter('sort', opt.value)}
            />
          ))}
          <FilterChip
            label="In Stock"
            selected={filters.inStockOnly}
            onPress={() => updateFilter('inStockOnly', !filters.inStockOnly)}
          />
        </View>
        <View className="flex-row flex-wrap mt-1">
          {categories.slice(0, 5).map(cat => (
            <FilterChip
              key={cat}
              label={cat}
              selected={filters.categories.includes(cat)}
              onPress={() => toggleCategory(cat)}
            />
          ))}
        </View>
      </View>
      {products.length === 0 ? (
        <EmptyState title="No products found" subtitle="Try different filters" />
      ) : (
        <FlashList
          data={products}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator className="py-4" color="#2D6A4F" /> : null
          }
          contentContainerStyle={{paddingHorizontal: 8, paddingBottom: 24}}
        />
      )}
    </View>
  );
}
