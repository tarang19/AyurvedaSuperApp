import React from 'react';
import {TextInput, View, Text} from 'react-native';
import {useTheme, themeClasses} from '../theme/ThemeProvider';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({value, onChangeText, placeholder = 'Search...'}: Props) {
  const {isDark} = useTheme();

  return (
    <View className="flex-row items-center">
      <Text className="text-lg mr-2">🔍</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
        className={`flex-1 py-3 px-4 rounded-xl border ${themeClasses.border(isDark)} ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}
        accessibilityRole="search"
        accessibilityLabel={placeholder}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
}
