import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ConsultationStackParamList} from './types';
import {DoctorListScreen} from '../../modules/consultation/screens/DoctorListScreen';
import {DoctorDetailScreen} from '../../modules/consultation/screens/DoctorDetailScreen';
import {BookingConfirmScreen} from '../../modules/consultation/screens/BookingConfirmScreen';
import {UpcomingScreen} from '../../modules/consultation/screens/UpcomingScreen';
import {useTheme, themeClasses} from '../../shared/theme/ThemeProvider';

const Stack = createNativeStackNavigator<ConsultationStackParamList>();

export function ConsultationNavigator() {
  const {isDark} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: isDark ? '#030712' : '#F8F6F0'},
        headerTintColor: isDark ? '#f3f4f6' : '#2D6A4F',
        headerTitleStyle: {fontWeight: '600'},
        contentStyle: {backgroundColor: isDark ? '#030712' : '#F8F6F0'},
      }}>
      <Stack.Screen name="DoctorList" component={DoctorListScreen} options={{headerShown: false}} />
      <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} options={{title: 'Doctor Profile'}} />
      <Stack.Screen name="BookingConfirm" component={BookingConfirmScreen} options={{title: 'Confirm'}} />
      <Stack.Screen name="Upcoming" component={UpcomingScreen} options={{title: 'My Bookings'}} />
    </Stack.Navigator>
  );
}
