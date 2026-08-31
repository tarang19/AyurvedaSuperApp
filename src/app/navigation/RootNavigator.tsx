import React from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootTabParamList} from './types';
import {ConsultationNavigator} from './ConsultationNavigator';
import {ShopNavigator} from './ShopNavigator';
import {HealthNavigator} from './HealthNavigator';
import {SettingsScreen} from '../screens/SettingsScreen';
import {useTheme} from '../../shared/theme/ThemeProvider';
import {useCartStore} from '../../modules/shop/store/cartStore';

const Tab = createBottomTabNavigator<RootTabParamList>();

function TabIcon({label, focused}: {label: string; focused: boolean}) {
  const icons: Record<string, string> = {
    Consultation: '👨‍⚕️',
    Shop: '🛍️',
    Health: '📋',
    Settings: '⚙️',
  };
  return (
    <Text style={{fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.6}}>
      {icons[label]}
    </Text>
  );
}

export function RootNavigator() {
  const {isDark} = useTheme();
  const cartCount = useCartStore(s => s.getItemCount());

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused}) => <TabIcon label={route.name} focused={focused} />,
        tabBarActiveTintColor: '#2D6A4F',
        tabBarInactiveTintColor: isDark ? '#6b7280' : '#9ca3af',
        tabBarStyle: {
          backgroundColor: isDark ? '#111827' : '#ffffff',
          borderTopColor: isDark ? '#1f2937' : '#e5e7eb',
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {fontSize: 11, fontWeight: '600'},
      })}>
      <Tab.Screen
        name="Consultation"
        component={ConsultationNavigator}
        options={{
          tabBarLabel: 'Consult',
          tabBarAccessibilityLabel: 'Consultation module',
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopNavigator}
        options={{
          tabBarLabel: cartCount > 0 ? `Shop (${cartCount})` : 'Shop',
          tabBarAccessibilityLabel: 'Shop module',
        }}
      />
      <Tab.Screen
        name="Health"
        component={HealthNavigator}
        options={{
          tabBarLabel: 'Records',
          tabBarAccessibilityLabel: 'Health records module',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: isDark ? '#030712' : '#F8F6F0'},
          headerTintColor: isDark ? '#f3f4f6' : '#2D6A4F',
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}
