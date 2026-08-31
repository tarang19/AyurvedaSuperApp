import React, {useCallback} from 'react';
import {Text, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HealthStackParamList} from '../../../app/navigation/types';
import {useHealthRecords} from '../hooks/useHealthRecords';
import {RecordCard} from '../components/RecordCard';
import {SearchBar} from '../../../shared/components/SearchBar';
import {FilterChip} from '../../../shared/components/FilterChip';
import {LoadingSpinner} from '../../../shared/components/LoadingSpinner';
import {EmptyState} from '../../../shared/components/EmptyState';
import {useTheme, themeClasses} from '../../../shared/theme/ThemeProvider';
import {HealthRecord, RECORD_TYPE_LABELS, RecordType} from '../../../data/generators/healthRecords';

type Props = NativeStackScreenProps<HealthStackParamList, 'Timeline'>;

const RECORD_TYPES: RecordType[] = ['lab_report', 'prescription', 'consultation', 'vaccination', 'allergy'];

export function TimelineScreen({navigation}: Props) {
  const {isDark} = useTheme();
  const {
    groupedRecords,
    filteredCount,
    totalCount,
    isLoading,
    filters,
    updateFilter,
    toggleType,
    toggleTag,
    allTags,
  } = useHealthRecords();

  const flatData = groupedRecords.flatMap(group =>
    group.records.map(record => ({...record, groupLabel: group.label})),
  );

  const renderItem = useCallback(
    ({item, index}: {item: HealthRecord & {groupLabel: string}; index: number}) => {
      const prevGroup = index > 0 ? flatData[index - 1]?.groupLabel : null;
      const showHeader = item.groupLabel !== prevGroup;

      return (
        <View>
          {showHeader && filters.groupBy !== 'none' && (
            <Text className={`text-sm font-bold mb-2 mt-2 ${themeClasses.textMuted(isDark)}`}>
              {item.groupLabel}
            </Text>
          )}
          <RecordCard
            record={item}
            onPress={() => navigation.navigate('RecordDetail', {recordId: item.id})}
          />
        </View>
      );
    },
    [flatData, filters.groupBy, isDark, navigation],
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <View className={`flex-1 ${themeClasses.bg(isDark)}`}>
      <View className="px-4 pt-4 pb-2">
        <Text className={`text-2xl font-bold ${themeClasses.text(isDark)}`}>Health Records</Text>
        <Text className={`text-sm ${themeClasses.textMuted(isDark)}`}>
          {filteredCount} of {totalCount} records
        </Text>
        <View className="mt-3">
          <SearchBar
            value={filters.search}
            onChangeText={text => updateFilter('search', text)}
            placeholder="Search records..."
          />
        </View>
        <View className="flex-row flex-wrap mt-2">
          {RECORD_TYPES.map(type => (
            <FilterChip
              key={type}
              label={RECORD_TYPE_LABELS[type]}
              selected={filters.types.includes(type)}
              onPress={() => toggleType(type)}
            />
          ))}
        </View>
        <View className="flex-row flex-wrap mt-1">
          <FilterChip
            label="By Month"
            selected={filters.groupBy === 'month'}
            onPress={() => updateFilter('groupBy', 'month')}
          />
          <FilterChip
            label="By Year"
            selected={filters.groupBy === 'year'}
            onPress={() => updateFilter('groupBy', 'year')}
          />
          <FilterChip
            label="No Group"
            selected={filters.groupBy === 'none'}
            onPress={() => updateFilter('groupBy', 'none')}
          />
        </View>
        <View className="flex-row flex-wrap mt-1">
          {allTags.slice(0, 6).map(tag => (
            <FilterChip
              key={tag}
              label={`#${tag}`}
              selected={filters.tags.includes(tag)}
              onPress={() => toggleTag(tag)}
            />
          ))}
        </View>
      </View>
      {flatData.length === 0 ? (
        <EmptyState title="No records found" subtitle="Try adjusting filters" icon="📋" />
      ) : (
        <FlashList
          data={flatData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 24}}
        />
      )}
    </View>
  );
}
