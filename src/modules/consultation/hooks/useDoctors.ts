import {useMemo, useState, useCallback} from 'react';
import {useQuery} from '@tanstack/react-query';
import {apiRequest} from '../../../core/api/client';
import {Doctor, generateSlots, getDoctors} from '../../../data/generators/doctors';
import {ENV} from '../../../core/config/env';

export type DoctorFilters = {
  specialty: string | null;
  location: string | null;
  availableToday: boolean;
  minRating: number;
  search: string;
};

const defaultFilters: DoctorFilters = {
  specialty: null,
  location: null,
  availableToday: false,
  minRating: 0,
  search: '',
};

export function useDoctors() {
  const [filters, setFilters] = useState<DoctorFilters>(defaultFilters);

  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const result = await apiRequest('doctors', () => getDoctors());
      if (!result.success) throw result.error;
      return result.data;
    },
    staleTime: ENV.CACHE_TTL_MS,
  });

  const filteredDoctors = useMemo(() => {
    if (!data) return [];
    return data.filter((doc: Doctor) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !doc.name.toLowerCase().includes(q) &&
          !doc.specialty.toLowerCase().includes(q) &&
          !doc.location.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (filters.specialty && doc.specialty !== filters.specialty) return false;
      if (filters.location && doc.location !== filters.location) return false;
      if (filters.availableToday && !doc.availableToday) return false;
      if (filters.minRating > 0 && doc.rating < filters.minRating) return false;
      return true;
    });
  }, [data, filters]);

  const specialties = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map((d: Doctor) => d.specialty))].sort();
  }, [data]);

  const locations = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map((d: Doctor) => d.location))].sort();
  }, [data]);

  const updateFilter = useCallback(
    <K extends keyof DoctorFilters>(key: K, value: DoctorFilters[K]) => {
      setFilters(prev => ({...prev, [key]: value}));
    },
    [],
  );

  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  return {
    doctors: filteredDoctors,
    totalCount: data?.length ?? 0,
    filteredCount: filteredDoctors.length,
    isLoading,
    error,
    refetch,
    filters,
    updateFilter,
    resetFilters,
    specialties,
    locations,
  };
}

export function useDoctor(id: string) {
  const {data} = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const result = await apiRequest('doctors', () => getDoctors());
      if (!result.success) throw result.error;
      return result.data;
    },
  });

  return useMemo(() => data?.find((d: Doctor) => d.id === id), [data, id]);
}

export function useDoctorSlots(doctorId: string, date: string) {
  return useQuery({
    queryKey: ['slots', doctorId, date],
    queryFn: async () => {
      const result = await apiRequest(`slots-${doctorId}-${date}`, () =>
        generateSlots(doctorId, date),
      );
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!doctorId && !!date,
  });
}
