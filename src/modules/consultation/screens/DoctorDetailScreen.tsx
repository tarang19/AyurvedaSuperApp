import React, {useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {format} from 'date-fns';
import {ConsultationStackParamList} from '../../../app/navigation/types';
import {useDoctor, useDoctorSlots} from '../hooks/useDoctors';
import {SlotPicker} from '../components/SlotPicker';
import {Button} from '../../../shared/components/Button';
import {LoadingSpinner} from '../../../shared/components/LoadingSpinner';
import {useTheme, themeClasses} from '../../../shared/theme/ThemeProvider';
import {TimeSlot, validateBooking} from '../../../data/generators/doctors';
import {useToast} from '../../../shared/components/ToastProvider';

type Props = NativeStackScreenProps<ConsultationStackParamList, 'DoctorDetail'>;

export function DoctorDetailScreen({route, navigation}: Props) {
  const {doctorId} = route.params;
  const {isDark} = useTheme();
  const {showToast} = useToast();
  const doctor = useDoctor(doctorId);
  const today = format(new Date(), 'yyyy-MM-dd');
  const {data: slots, isLoading} = useDoctorSlots(doctorId, today);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  if (!doctor) return <LoadingSpinner />;

  const handleBook = () => {
    if (!selectedSlot) {
      showToast('Please select a time slot', 'warning');
      return;
    }
    const validation = validateBooking(selectedSlot.id, selectedSlot.expiresAt);
    if (!validation.valid) {
      showToast(validation.reason!, 'error');
      return;
    }
    navigation.navigate('BookingConfirm', {
      doctorId,
      slotId: selectedSlot.id,
      date: selectedSlot.date,
      time: selectedSlot.time,
    });
  };

  return (
    <ScrollView className={`flex-1 ${themeClasses.bg(isDark)}`}>
      <View className="p-4">
        <View className="items-center mb-4">
          <View className="w-20 h-20 rounded-full bg-ayurveda-sage/20 items-center justify-center">
            <Text className="text-4xl">👨‍⚕️</Text>
          </View>
          <Text className={`text-xl font-bold mt-3 ${themeClasses.text(isDark)}`}>{doctor.name}</Text>
          <Text className={`text-sm ${themeClasses.textMuted(isDark)}`}>{doctor.specialty}</Text>
          <Text className="text-amber-500 mt-1">★ {doctor.rating} ({doctor.reviewCount} reviews)</Text>
        </View>

        <View className="flex-row justify-around mb-6">
          <View className="items-center">
            <Text className={`text-lg font-bold ${themeClasses.text(isDark)}`}>{doctor.experience}y</Text>
            <Text className={`text-xs ${themeClasses.textMuted(isDark)}`}>Experience</Text>
          </View>
          <View className="items-center">
            <Text className={`text-lg font-bold ${themeClasses.text(isDark)}`}>₹{doctor.fee}</Text>
            <Text className={`text-xs ${themeClasses.textMuted(isDark)}`}>Consultation</Text>
          </View>
          <View className="items-center">
            <Text className={`text-lg font-bold ${themeClasses.text(isDark)}`}>{doctor.location}</Text>
            <Text className={`text-xs ${themeClasses.textMuted(isDark)}`}>Location</Text>
          </View>
        </View>

        <Text className={`text-base font-semibold mb-3 ${themeClasses.text(isDark)}`}>
          Available Slots — Today
        </Text>
        {isLoading ? (
          <LoadingSpinner size="small" />
        ) : (
          <SlotPicker
            slots={slots ?? []}
            selectedSlotId={selectedSlot?.id ?? null}
            onSelect={setSelectedSlot}
          />
        )}

        <View className="mt-6">
          <Button title="Book Consultation" onPress={handleBook} disabled={!selectedSlot} />
        </View>
      </View>
    </ScrollView>
  );
}
