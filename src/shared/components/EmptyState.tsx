import React from 'react';
import {Text, View} from 'react-native';
import {useTheme, themeClasses} from '../theme/ThemeProvider';

type Props = {
  title: string;
  subtitle?: string;
  icon?: string;
};

export function EmptyState({title, subtitle, icon = '🌿'}: Props) {
  const {isDark} = useTheme();

  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-5xl mb-4">{icon}</Text>
      <Text className={`text-lg font-semibold text-center ${themeClasses.text(isDark)}`}>{title}</Text>
      {subtitle && (
        <Text className={`text-sm text-center mt-2 ${themeClasses.textMuted(isDark)}`}>{subtitle}</Text>
      )}
    </View>
  );
}
