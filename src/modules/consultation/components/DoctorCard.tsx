import React, {memo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Doctor} from '../../../data/generators/doctors';
import {Card} from '../../../shared/components/Card';
import {Badge} from '../../../shared/components/Badge';
import {useTheme, themeClasses} from '../../../shared/theme/ThemeProvider';

type Props = {
  doctor: Doctor;
  onPress: () => void;
};

function DoctorCardComponent({doctor, onPress}: Props) {
  const {isDark} = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} accessibilityRole="button">
      <Card className="mb-3 flex-row">
        <View className="w-14 h-14 rounded-full bg-ayurveda-sage/20 items-center justify-center mr-3">
          <Text className="text-2xl">👨‍⚕️</Text>
        </View>
        <View className="flex-1">
          <Text className={`text-base font-semibold ${themeClasses.text(isDark)}`}>{doctor.name}</Text>
          <Text className={`text-sm ${themeClasses.textMuted(isDark)}`}>{doctor.specialty}</Text>
          <View className="flex-row items-center mt-1.5 flex-wrap gap-1">
            <Text className="text-amber-500 text-sm">★ {doctor.rating}</Text>
            <Text className={`text-xs ${themeClasses.textMuted(isDark)}`}>
              ({doctor.reviewCount}) · {doctor.experience}y exp
            </Text>
            {doctor.availableToday && <Badge label="Available Today" variant="success" />}
          </View>
          <View className="flex-row justify-between items-center mt-2">
            <Text className={`text-xs ${themeClasses.textMuted(isDark)}`}>📍 {doctor.location}</Text>
            <Text className="text-ayurveda-leaf font-bold">₹{doctor.fee}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export const DoctorCard = memo(DoctorCardComponent);
