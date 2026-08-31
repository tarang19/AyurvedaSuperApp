import React, {memo} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {FilterChip} from '../../../shared/components/FilterChip';
import {DoctorFilters} from '../hooks/useDoctors';

type Props = {
  filters: DoctorFilters;
  specialties: string[];
  locations: string[];
  onUpdate: <K extends keyof DoctorFilters>(key: K, value: DoctorFilters[K]) => void;
};

function DoctorFiltersComponent({filters, specialties, locations, onUpdate}: Props) {
  return (
    <View className="mb-3">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <FilterChip
          label="Available Today"
          selected={filters.availableToday}
          onPress={() => onUpdate('availableToday', !filters.availableToday)}
        />
        <FilterChip
          label="4+ Rating"
          selected={filters.minRating >= 4}
          onPress={() => onUpdate('minRating', filters.minRating >= 4 ? 0 : 4)}
        />
        {specialties.slice(0, 6).map(s => (
          <FilterChip
            key={s}
            label={s}
            selected={filters.specialty === s}
            onPress={() => onUpdate('specialty', filters.specialty === s ? null : s)}
          />
        ))}
        {locations.slice(0, 4).map(l => (
          <FilterChip
            key={l}
            label={l}
            selected={filters.location === l}
            onPress={() => onUpdate('location', filters.location === l ? null : l)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export const DoctorFiltersBar = memo(DoctorFiltersComponent);
