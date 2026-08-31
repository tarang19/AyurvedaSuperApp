import React, {useCallback, useMemo} from 'react';
import {Alert, Text, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ConsultationStackParamList} from '../../../app/navigation/types';
import {useBookingStore, getUpcomingBookings} from '../store/bookingStore';
import {Button} from '../../../shared/components/Button';
import {Card} from '../../../shared/components/Card';
import {EmptyState} from '../../../shared/components/EmptyState';
import {useTheme, themeClasses} from '../../../shared/theme/ThemeProvider';
import {useToast} from '../../../shared/components/ToastProvider';
import {Booking} from '../../../data/generators/doctors';

type Props = NativeStackScreenProps<ConsultationStackParamList, 'Upcoming'>;

export function UpcomingScreen(_props: Props) {
  const {isDark} = useTheme();
  const {showToast} = useToast();
  const bookings = useBookingStore(s => s.bookings);
  const cancelBooking = useBookingStore(s => s.cancelBooking);

  const upcoming = useMemo(() => getUpcomingBookings(bookings), [bookings]);

  const handleCancel = useCallback(
    (booking: Booking) => {
      Alert.alert(
        'Cancel Booking',
        `Cancel consultation with ${booking.doctorName}?`,
        [
          {text: 'No', style: 'cancel'},
          {
            text: 'Yes, Cancel',
            style: 'destructive',
            onPress: async () => {
              await cancelBooking(booking.id);
              showToast('Booking cancelled', 'info');
            },
          },
        ],
      );
    },
    [cancelBooking, showToast],
  );

  const renderItem = useCallback(
    ({item}: {item: Booking}) => (
      <Card className="mb-3">
        <Text className={`text-base font-semibold ${themeClasses.text(isDark)}`}>{item.doctorName}</Text>
        <Text className={`text-sm ${themeClasses.textMuted(isDark)}`}>{item.specialty}</Text>
        <Text className={`text-sm mt-2 ${themeClasses.text(isDark)}`}>📅 {item.date} · 🕐 {item.time}</Text>
        {item.status === 'pending_sync' && (
          <Text className="text-amber-500 text-xs mt-1">⏳ Pending sync</Text>
        )}
        <View className="mt-3">
          <Button title="Cancel Booking" variant="danger" onPress={() => handleCancel(item)} />
        </View>
      </Card>
    ),
    [isDark, handleCancel],
  );

  return (
    <View className={`flex-1 ${themeClasses.bg(isDark)}`}>
      <View className="px-4 pt-4 pb-2">
        <Text className={`text-2xl font-bold ${themeClasses.text(isDark)}`}>Upcoming Consultations</Text>
      </View>
      {upcoming.length === 0 ? (
        <EmptyState title="No upcoming consultations" subtitle="Book a doctor to get started" icon="📅" />
      ) : (
        <FlashList
          data={upcoming}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 24}}
        />
      )}
    </View>
  );
}
