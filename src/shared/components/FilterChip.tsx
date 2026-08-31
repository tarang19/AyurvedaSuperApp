import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function FilterChip({label, selected, onPress}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-3.5 py-2 rounded-full mr-2 mb-2 ${selected ? 'bg-ayurveda-leaf' : 'bg-gray-100'}`}
      accessibilityRole="button"
      accessibilityState={{selected}}
      accessibilityLabel={`Filter: ${label}`}>
      <Text className={`text-sm font-medium ${selected ? 'text-white' : 'text-gray-700'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
