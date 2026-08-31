import React from 'react';
import {View, ViewProps} from 'react-native';
import {useTheme, themeClasses} from '../theme/ThemeProvider';

type Props = ViewProps & {className?: string};

export function Card({children, className = '', ...props}: Props) {
  const {isDark} = useTheme();
  return (
    <View
      {...props}
      className={`rounded-2xl border p-4 shadow-sm ${themeClasses.card(isDark)} ${className}`}>
      {children}
    </View>
  );
}
