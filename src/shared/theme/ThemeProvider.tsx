import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {useColorScheme} from 'react-native';
import {storage, STORAGE_KEYS} from '../../core/storage/storage';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    storage.get<ThemeMode>(STORAGE_KEYS.THEME).then(saved => {
      if (saved) setModeState(saved);
    });
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    storage.set(STORAGE_KEYS.THEME, next);
  };

  const isDark = mode === 'dark' || (mode === 'system' && systemScheme === 'dark');

  const value = useMemo(() => ({mode, isDark, setMode}), [mode, isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export const themeClasses = {
  bg: (isDark: boolean) => (isDark ? 'bg-gray-950' : 'bg-ayurveda-cream'),
  card: (isDark: boolean) => (isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'),
  text: (isDark: boolean) => (isDark ? 'text-gray-100' : 'text-gray-900'),
  textMuted: (isDark: boolean) => (isDark ? 'text-gray-400' : 'text-gray-500'),
  border: (isDark: boolean) => (isDark ? 'border-gray-800' : 'border-gray-200'),
};
