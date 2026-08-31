import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ShopStackParamList} from '../../../app/navigation/types';
import {useProduct} from '../hooks/useProducts';
import {useCartStore} from '../store/cartStore';
import {useWishlistStore} from '../store/wishlistStore';
import {Button} from '../../../shared/components/Button';
import {LoadingSpinner} from '../../../shared/components/LoadingSpinner';
import {useTheme, themeClasses} from '../../../shared/theme/ThemeProvider';
import {useToast} from '../../../shared/components/ToastProvider';

type Props = NativeStackScreenProps<ShopStackParamList, 'ProductDetail'>;

export function ProductDetailScreen({route, navigation}: Props) {
  const {productId} = route.params;
  const {isDark} = useTheme();
  const {showToast} = useToast();
  const product = useProduct(productId);
  const addItem = useCartStore(s => s.addItem);
  const {toggle, isWishlisted} = useWishlistStore();

  if (!product) return <LoadingSpinner />;

  const wishlisted = isWishlisted(product.id);

  return (
    <ScrollView className={`flex-1 ${themeClasses.bg(isDark)}`}>
      <View className="p-4">
        <View className="h-56 bg-ayurveda-sage/10 rounded-2xl items-center justify-center mb-4">
          <Text className="text-6xl">🌿</Text>
        </View>
        <Text className={`text-xl font-bold ${themeClasses.text(isDark)}`}>{product.name}</Text>
        <Text className={`text-sm ${themeClasses.textMuted(isDark)}`}>{product.brand} · {product.category}</Text>
        <View className="flex-row items-center mt-2 gap-3">
          <Text className="text-2xl font-bold text-ayurveda-leaf">₹{product.price}</Text>
          {product.originalPrice > product.price && (
            <Text className={`text-sm line-through ${themeClasses.textMuted(isDark)}`}>
              ₹{product.originalPrice}
            </Text>
          )}
          <Text className="text-amber-500">★ {product.rating}</Text>
        </View>
        <Text className={`text-sm mt-4 leading-5 ${themeClasses.text(isDark)}`}>{product.description}</Text>
        <View className="flex-row flex-wrap mt-3 gap-2">
          {product.tags.map(tag => (
            <Text key={tag} className="text-xs text-ayurveda-sage bg-ayurveda-sage/10 px-2 py-1 rounded-full">
              #{tag}
            </Text>
          ))}
        </View>
        <View className="mt-6 gap-3">
          <Button
            title={product.inStock ? 'Add to Cart' : 'Out of Stock'}
            disabled={!product.inStock}
            onPress={() => {
              addItem(product);
              showToast('Added to cart', 'success');
            }}
          />
          <Button
            title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            variant="outline"
            onPress={() => {
              toggle(product);
              showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info');
            }}
          />
          <Button title="View Cart" variant="secondary" onPress={() => navigation.navigate('Cart')} />
        </View>
      </View>
    </ScrollView>
  );
}
