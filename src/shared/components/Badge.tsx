import React from 'react';
import {Text, View} from 'react-native';

type Props = {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
};

const variants = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
};

export function Badge({label, variant = 'default'}: Props) {
  return (
    <View className={`px-2.5 py-1 rounded-full self-start ${variants[variant].split(' ')[0]}`}>
      <Text className={`text-xs font-medium ${variants[variant].split(' ')[1]}`}>{label}</Text>
    </View>
  );
}
