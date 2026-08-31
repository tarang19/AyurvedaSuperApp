import React, {memo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {TimeSlot, isSlotExpired, isSlotBooked} from '../../../data/generators/doctors';

type Props = {
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSelect: (slot: TimeSlot) => void;
};

function SlotPickerComponent({slots, selectedSlotId, onSelect}: Props) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {slots.map(slot => {
        const expired = isSlotExpired(slot.expiresAt);
        const booked = isSlotBooked(slot.id);
        const unavailable = !slot.available || expired || booked;
        const selected = selectedSlotId === slot.id;

        return (
          <TouchableOpacity
            key={slot.id}
            disabled={unavailable}
            onPress={() => onSelect(slot)}
            className={`px-4 py-2.5 rounded-xl border ${
              selected
                ? 'bg-ayurveda-leaf border-ayurveda-leaf'
                : unavailable
                  ? 'bg-gray-100 border-gray-200 opacity-50'
                  : 'bg-white border-gray-200'
            }`}
            accessibilityRole="button"
            accessibilityState={{selected, disabled: unavailable}}
            accessibilityLabel={`Slot ${slot.time}${unavailable ? ', unavailable' : ''}`}>
            <Text
              className={`text-sm font-medium ${
                selected ? 'text-white' : unavailable ? 'text-gray-400' : 'text-gray-800'
              }`}>
              {slot.time}
            </Text>
            {booked && !expired && (
              <Text className="text-xs text-red-400">Booked</Text>
            )}
            {expired && <Text className="text-xs text-gray-400">Expired</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export const SlotPicker = memo(SlotPickerComponent);
