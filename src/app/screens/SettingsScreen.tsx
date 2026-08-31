import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootTabParamList} from '../navigation/types';
import {useTheme, themeClasses} from '../../shared/theme/ThemeProvider';
import {FilterChip} from '../../shared/components/FilterChip';
import {getNetworkStatus} from '../../core/api/client';

type Props = NativeStackScreenProps<RootTabParamList, 'Settings'>;

export function SettingsScreen(_props: Props) {
  const {isDark, mode, setMode} = useTheme();
  const online = getNetworkStatus();

  return (
    <View className={`flex-1 p-4 ${themeClasses.bg(isDark)}`}>
      <Text className={`text-2xl font-bold mb-6 ${themeClasses.text(isDark)}`}>Settings</Text>

      <Text className={`text-sm font-semibold mb-2 ${themeClasses.text(isDark)}`}>Theme</Text>
      <View className="flex-row flex-wrap mb-6">
        {(['light', 'dark', 'system'] as const).map(m => (
          <FilterChip key={m} label={m} selected={mode === m} onPress={() => setMode(m)} />
        ))}
      </View>

      <Text className={`text-sm font-semibold mb-2 ${themeClasses.text(isDark)}`}>Status</Text>
      <View className={`p-4 rounded-xl border ${themeClasses.card(isDark)}`}>
        <Text className={themeClasses.text(isDark)}>
          Network: {online ? '🟢 Online' : '🔴 Offline'}
        </Text>
        <Text className={`text-xs mt-2 ${themeClasses.textMuted(isDark)}`}>
          Cart & bookings sync automatically when back online.
        </Text>
      </View>
    </View>
  );
}
