import React, {memo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Product} from '../../../data/generators/products';
import {Card} from '../../../shared/components/Card';
import {useTheme, themeClasses} from '../../../shared/theme/ThemeProvider';
import {useWishlistStore} from '../store/wishlistStore';

type Props = {
  product: Product;
  onPress: () => void;
};

function ProductCardComponent({product, onPress}: Props) {
  const {isDark} = useTheme();
  const {toggle, isWishlisted} = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="flex-1 m-1.5">
      <Card className="p-3">
        <View className="h-28 bg-ayurveda-sage/10 rounded-xl items-center justify-center mb-2">
          <Text className="text-4xl">🌿</Text>
        </View>
        <TouchableOpacity
          className="absolute top-2 right-2 p-1"
          onPress={() => toggle(product)}
          accessibilityRole="button"
          accessibilityLabel={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
          <Text className="text-lg">{wishlisted ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        <Text className={`text-sm font-semibold ${themeClasses.text(isDark)}`} numberOfLines={2}>
          {product.name}
        </Text>
        <Text className={`text-xs ${themeClasses.textMuted(isDark)}`}>{product.brand}</Text>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-ayurveda-leaf font-bold">₹{product.price}</Text>
          <Text className="text-amber-500 text-xs">★ {product.rating}</Text>
        </View>
        {!product.inStock && (
          <Text className="text-red-500 text-xs mt-1">Out of stock</Text>
        )}
      </Card>
    </TouchableOpacity>
  );
}

export const ProductCard = memo(ProductCardComponent);
