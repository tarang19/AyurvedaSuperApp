import React from 'react';
import {TextInput, TextInputProps, View, Text} from 'react-native';
import {useTheme, themeClasses} from '../theme/ThemeProvider';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  containerClassName?: string;
};

export function Input({label, error, containerClassName = '', ...props}: Props) {
  const {isDark} = useTheme();

  return (
    <View className={`mb-3 ${containerClassName}`}>
      {label && (
        <Text className={`text-sm font-medium mb-1.5 ${themeClasses.text(isDark)}`}>{label}</Text>
      )}
      <TextInput
        {...props}
        placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
        className={`px-4 py-3 rounded-xl border ${themeClasses.border(isDark)} ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}
        accessibilityLabel={props.accessibilityLabel ?? label}
      />
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
