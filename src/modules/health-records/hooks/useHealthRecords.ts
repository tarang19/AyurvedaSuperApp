import {useMemo, useState, useCallback} from 'react';
import {useQuery} from '@tanstack/react-query';
import {apiRequest} from '../../../core/api/client';
import {ENV} from '../../../core/config/env';
import {
  HealthRecord,
  RecordFilters,
  RecordType,
  filterRecords,
  getHealthRecords,
  groupRecords,
} from '../../../data/generators/healthRecords';

const defaultFilters: RecordFilters = {
  types: [],
  tags: [],
  search: '',
  groupBy: 'month',
};

export function useHealthRecords() {
  const [filters, setFilters] = useState<RecordFilters>(defaultFilters);

  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['health-records'],
    queryFn: async () => {
      const result = await apiRequest('health-records', () => getHealthRecords());
      if (!result.success) throw result.error;
      return result.data;
    },
    staleTime: ENV.CACHE_TTL_MS,
  });

  const filteredRecords = useMemo(
    () => (data ? filterRecords(data, filters) : []),
    [data, filters],
  );

  const groupedRecords = useMemo(
    () => groupRecords(filteredRecords, filters.groupBy),
    [filteredRecords, filters.groupBy],
  );

  const allTags = useMemo(() => {
    if (!data) return [];
    const tagSet = new Set<string>();
    data.forEach((r: HealthRecord) => r.tags.forEach(t => tagSet.add(t)));
    return [...tagSet].sort();
  }, [data]);

  const updateFilter = useCallback(
    <K extends keyof RecordFilters>(key: K, value: RecordFilters[K]) => {
      setFilters(prev => ({...prev, [key]: value}));
    },
    [],
  );

  const toggleType = useCallback((type: RecordType) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type],
    }));
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  }, []);

  return {
    records: filteredRecords,
    groupedRecords,
    totalCount: data?.length ?? 0,
    filteredCount: filteredRecords.length,
    isLoading,
    error,
    refetch,
    filters,
    updateFilter,
    toggleType,
    toggleTag,
    allTags,
  };
}

export function useHealthRecord(id: string) {
  const {data} = useQuery({
    queryKey: ['health-records'],
    queryFn: async () => {
      const result = await apiRequest('health-records', () => getHealthRecords());
      if (!result.success) throw result.error;
      return result.data;
    },
  });

  return useMemo(() => data?.find((r: HealthRecord) => r.id === id), [data, id]);
}
