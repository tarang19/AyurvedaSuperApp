import React from 'react';
import {Text, View} from 'react-native';

type Props = {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
};

const typeStyles = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-ayurveda-leaf',
  warning: 'bg-amber-500',
};

export function Toast({message, type}: Props) {
  return (
    <View
      className={`absolute bottom-24 left-4 right-4 ${typeStyles[type]} rounded-xl px-4 py-3 shadow-lg z-50`}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite">
      <Text className="text-white text-sm font-medium text-center">{message}</Text>
    </View>
  );
}
