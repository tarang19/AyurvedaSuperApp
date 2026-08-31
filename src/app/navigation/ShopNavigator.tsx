import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ShopStackParamList} from './types';
import {ProductListScreen} from '../../modules/shop/screens/ProductListScreen';
import {ProductDetailScreen} from '../../modules/shop/screens/ProductDetailScreen';
import {CartScreen} from '../../modules/shop/screens/CartScreen';
import {CheckoutScreen} from '../../modules/shop/screens/CheckoutScreen';
import {useTheme} from '../../shared/theme/ThemeProvider';

const Stack = createNativeStackNavigator<ShopStackParamList>();

export function ShopNavigator() {
  const {isDark} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: isDark ? '#030712' : '#F8F6F0'},
        headerTintColor: isDark ? '#f3f4f6' : '#2D6A4F',
        headerTitleStyle: {fontWeight: '600'},
        contentStyle: {backgroundColor: isDark ? '#030712' : '#F8F6F0'},
      }}>
      <Stack.Screen name="ProductList" component={ProductListScreen} options={{headerShown: false}} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{title: 'Product'}} />
      <Stack.Screen name="Cart" component={CartScreen} options={{title: 'Cart'}} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{title: 'Checkout'}} />
    </Stack.Navigator>
  );
}
