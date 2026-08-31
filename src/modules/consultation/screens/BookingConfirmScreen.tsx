import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ConsultationStackParamList} from '../../../app/navigation/types';
import {useDoctor} from '../hooks/useDoctors';
import {useBookingStore} from '../store/bookingStore';
import {Button} from '../../../shared/components/Button';
import {Card} from '../../../shared/components/Card';
import {LoadingSpinner} from '../../../shared/components/LoadingSpinner';
import {useTheme, themeClasses} from '../../../shared/theme/ThemeProvider';
import {useToast} from '../../../shared/components/ToastProvider';
import {bookSlot} from '../../../data/generators/doctors';

type Props = NativeStackScreenProps<ConsultationStackParamList, 'BookingConfirm'>;

export function BookingConfirmScreen({route, navigation}: Props) {
  const {doctorId, slotId, date, time} = route.params;
  const {isDark} = useTheme();
  const {showToast} = useToast();
  const doctor = useDoctor(doctorId);
  const addBooking = useBookingStore(s => s.addBooking);
  const [loading, setLoading] = useState(false);

  if (!doctor) return <LoadingSpinner />;

  const handleConfirm = async () => {
    setLoading(true);
    bookSlot(slotId);
    const result = await addBooking({
      doctorId,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date,
      time,
      slotId,
    });
    setLoading(false);

    if (result.success) {
      showToast('Consultation booked successfully!', 'success');
      navigation.navigate('Upcoming');
    } else {
      showToast(result.error ?? 'Booking failed', 'error');
    }
  };

  return (
    <View className={`flex-1 p-4 ${themeClasses.bg(isDark)}`}>
      <Text className={`text-2xl font-bold mb-4 ${themeClasses.text(isDark)}`}>Confirm Booking</Text>
      <Card>
        <Text className={`text-lg font-semibold ${themeClasses.text(isDark)}`}>{doctor.name}</Text>
        <Text className={`text-sm ${themeClasses.textMuted(isDark)}`}>{doctor.specialty}</Text>
        <View className="mt-4 border-t border-gray-100 pt-3">
          <Text className={`text-sm ${themeClasses.text(isDark)}`}>📅 {date}</Text>
          <Text className={`text-sm mt-1 ${themeClasses.text(isDark)}`}>🕐 {time}</Text>
          <Text className="text-ayurveda-leaf font-bold text-lg mt-2">₹{doctor.fee}</Text>
        </View>
      </Card>
      <View className="mt-auto gap-3">
        <Button title="Confirm Booking" onPress={handleConfirm} loading={loading} />
        <Button title="Cancel" variant="outline" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}
