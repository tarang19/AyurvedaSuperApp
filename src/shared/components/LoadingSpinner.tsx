import React from 'react';
import {ActivityIndicator, View} from 'react-native';

type Props = {size?: 'small' | 'large'; className?: string};

export function LoadingSpinner({size = 'large', className = ''}: Props) {
  return (
    <View className={`items-center justify-center p-8 ${className}`}>
      <ActivityIndicator size={size} color="#2D6A4F" accessibilityLabel="Loading" />
    </View>
  );
}
