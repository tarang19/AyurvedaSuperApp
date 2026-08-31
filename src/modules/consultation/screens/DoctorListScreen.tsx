import React, {useCallback} from 'react';
import {Text, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ConsultationStackParamList} from '../../../app/navigation/types';
import {useDoctors} from '../hooks/useDoctors';
import {DoctorCard} from '../components/DoctorCard';
import {DoctorFiltersBar} from '../components/DoctorFilters';
import {SearchBar} from '../../../shared/components/SearchBar';
import {LoadingSpinner} from '../../../shared/components/LoadingSpinner';
import {EmptyState} from '../../../shared/components/EmptyState';
import {useTheme, themeClasses} from '../../../shared/theme/ThemeProvider';
import {Doctor} from '../../../data/generators/doctors';

type Props = NativeStackScreenProps<ConsultationStackParamList, 'DoctorList'>;

export function DoctorListScreen({navigation}: Props) {
  const {isDark} = useTheme();
  const {
    doctors,
    filteredCount,
    totalCount,
    isLoading,
    filters,
    updateFilter,
    specialties,
    locations,
  } = useDoctors();

  const renderItem = useCallback(
    ({item}: {item: Doctor}) => (
      <DoctorCard doctor={item} onPress={() => navigation.navigate('DoctorDetail', {doctorId: item.id})} />
    ),
    [navigation],
  );

  const keyExtractor = useCallback((item: Doctor) => item.id, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <View className={`flex-1 ${themeClasses.bg(isDark)}`}>
      <View className="px-4 pt-4 pb-2">
        <Text className={`text-2xl font-bold ${themeClasses.text(isDark)}`}>Find a Doctor</Text>
        <Text className={`text-sm ${themeClasses.textMuted(isDark)}`}>
          {filteredCount} of {totalCount} Ayurvedic specialists
        </Text>
        <View className="mt-3">
          <SearchBar
            value={filters.search}
            onChangeText={text => updateFilter('search', text)}
            placeholder="Search doctors, specialties..."
          />
        </View>
        <DoctorFiltersBar
          filters={filters}
          specialties={specialties}
          locations={locations}
          onUpdate={updateFilter}
        />
      </View>
      {doctors.length === 0 ? (
        <EmptyState title="No doctors found" subtitle="Try adjusting your filters" />
      ) : (
        <FlashList
          data={doctors}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 24}}
        />
      )}
    </View>
  );
}
