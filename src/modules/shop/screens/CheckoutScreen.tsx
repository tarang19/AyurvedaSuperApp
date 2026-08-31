import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ShopStackParamList} from '../../../app/navigation/types';
import {useCartStore} from '../store/cartStore';
import {Button} from '../../../shared/components/Button';
import {Card} from '../../../shared/components/Card';
import {useTheme, themeClasses} from '../../../shared/theme/ThemeProvider';
import {useToast} from '../../../shared/components/ToastProvider';

type Props = NativeStackScreenProps<ShopStackParamList, 'Checkout'>;

export function CheckoutScreen({navigation}: Props) {
  const {isDark} = useTheme();
  const {showToast} = useToast();
  const {items, getTotal, clearCart} = useCartStore();
  const subtotal = getTotal();
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    clearCart();
    showToast('Order placed successfully!', 'success');
    navigation.navigate('ProductList');
  };

  return (
    <ScrollView className={`flex-1 p-4 ${themeClasses.bg(isDark)}`}>
      <Text className={`text-2xl font-bold mb-4 ${themeClasses.text(isDark)}`}>Checkout Summary</Text>
      {items.map(item => (
        <Card key={item.product.id} className="mb-2 flex-row justify-between">
          <Text className={`flex-1 text-sm ${themeClasses.text(isDark)}`} numberOfLines={1}>
            {item.product.name} × {item.quantity}
          </Text>
          <Text className="text-ayurveda-leaf font-semibold">₹{item.product.price * item.quantity}</Text>
        </Card>
      ))}
      <Card className="mt-4">
        <View className="flex-row justify-between mb-2">
          <Text className={themeClasses.textMuted(isDark)}>Subtotal</Text>
          <Text className={themeClasses.text(isDark)}>₹{subtotal}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className={themeClasses.textMuted(isDark)}>Shipping</Text>
          <Text className={themeClasses.text(isDark)}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</Text>
        </View>
        <View className="flex-row justify-between border-t border-gray-100 pt-2 mt-2">
          <Text className={`font-bold ${themeClasses.text(isDark)}`}>Total</Text>
          <Text className="text-xl font-bold text-ayurveda-leaf">₹{total}</Text>
        </View>
      </Card>
      <View className="mt-6">
        <Button title="Place Order" onPress={handlePlaceOrder} />
      </View>
    </ScrollView>
  );
}
