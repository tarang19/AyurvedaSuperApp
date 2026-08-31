import React, {useCallback} from 'react';
import {Text, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ShopStackParamList} from '../../../app/navigation/types';
import {useCartStore, CartItem} from '../store/cartStore';
import {Button} from '../../../shared/components/Button';
import {Card} from '../../../shared/components/Card';
import {EmptyState} from '../../../shared/components/EmptyState';
import {useTheme, themeClasses} from '../../../shared/theme/ThemeProvider';

type Props = NativeStackScreenProps<ShopStackParamList, 'Cart'>;

export function CartScreen({navigation}: Props) {
  const {isDark} = useTheme();
  const {items, updateQuantity, removeItem, getTotal} = useCartStore();

  const renderItem = useCallback(
    ({item}: {item: CartItem}) => (
      <Card className="mb-3 flex-row items-center">
        <View className="w-12 h-12 bg-ayurveda-sage/10 rounded-lg items-center justify-center mr-3">
          <Text>🌿</Text>
        </View>
        <View className="flex-1">
          <Text className={`text-sm font-semibold ${themeClasses.text(isDark)}`} numberOfLines={1}>
            {item.product.name}
          </Text>
          <Text className="text-ayurveda-leaf font-bold">₹{item.product.price}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Button
            title="-"
            variant="outline"
            className="px-3 py-1"
            onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
          />
          <Text className={`font-semibold ${themeClasses.text(isDark)}`}>{item.quantity}</Text>
          <Button
            title="+"
            variant="outline"
            className="px-3 py-1"
            onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
          />
        </View>
      </Card>
    ),
    [isDark, updateQuantity],
  );

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        subtitle="Browse products and add items"
        icon="🛒"
      />
    );
  }

  return (
    <View className={`flex-1 ${themeClasses.bg(isDark)}`}>
      <FlashList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.product.id}
        contentContainerStyle={{padding: 16, paddingBottom: 120}}
      />
      <View className={`absolute bottom-0 left-0 right-0 p-4 border-t ${themeClasses.border(isDark)} ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <View className="flex-row justify-between mb-3">
          <Text className={`text-lg font-semibold ${themeClasses.text(isDark)}`}>Total</Text>
          <Text className="text-xl font-bold text-ayurveda-leaf">₹{getTotal()}</Text>
        </View>
        <Button title="Proceed to Checkout" onPress={() => navigation.navigate('Checkout')} />
      </View>
    </View>
  );
}
