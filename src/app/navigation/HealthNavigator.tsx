import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HealthStackParamList} from './types';
import {TimelineScreen} from '../../modules/health-records/screens/TimelineScreen';
import {RecordDetailScreen} from '../../modules/health-records/screens/RecordDetailScreen';
import {useTheme} from '../../shared/theme/ThemeProvider';

const Stack = createNativeStackNavigator<HealthStackParamList>();

export function HealthNavigator() {
  const {isDark} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: isDark ? '#030712' : '#F8F6F0'},
        headerTintColor: isDark ? '#f3f4f6' : '#2D6A4F',
        headerTitleStyle: {fontWeight: '600'},
        contentStyle: {backgroundColor: isDark ? '#030712' : '#F8F6F0'},
      }}>
      <Stack.Screen name="Timeline" component={TimelineScreen} options={{headerShown: false}} />
      <Stack.Screen name="RecordDetail" component={RecordDetailScreen} options={{title: 'Record Detail'}} />
    </Stack.Navigator>
  );
}
