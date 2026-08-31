import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';

type Props = {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  disabled?: boolean;
  className?: string;
  accessibilityLabel?: string;
};

const variants = {
  primary: 'bg-ayurveda-leaf',
  secondary: 'bg-ayurveda-sage',
  outline: 'bg-transparent border border-ayurveda-leaf',
  danger: 'bg-red-500',
};

const textVariants = {
  primary: 'text-white',
  secondary: 'text-white',
  outline: 'text-ayurveda-leaf',
  danger: 'text-white',
};

export function Button({
  title,
  onPress,
  loading,
  variant = 'primary',
  disabled,
  className = '',
  accessibilityLabel,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`py-3.5 px-5 rounded-xl items-center justify-center ${variants[variant]} ${isDisabled ? 'opacity-50' : ''} ${className}`}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{disabled: isDisabled}}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#2D6A4F' : '#fff'} />
      ) : (
        <Text className={`font-semibold text-base ${textVariants[variant]}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
