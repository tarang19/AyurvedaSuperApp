import {format, subDays, subMonths} from 'date-fns';
import {ENV} from '../../core/config/env';

export type RecordType =
  | 'lab_report'
  | 'prescription'
  | 'consultation'
  | 'vaccination'
  | 'allergy';

export type HealthRecord = {
  id: string;
  type: RecordType;
  title: string;
  description: string;
  date: string;
  tags: string[];
  provider: string;
  attachmentType?: 'image' | 'pdf';
  attachmentUrl?: string;
};

const RECORD_TITLES: Record<RecordType, string[]> = {
  lab_report: ['Complete Blood Count', 'Liver Function Test', 'Thyroid Panel', 'Vitamin D Test', 'Lipid Profile'],
  prescription: ['Ayurvedic Medicine Rx', 'Herbal Supplement Rx', 'Panchakarma Protocol', 'Diet Plan Rx'],
  consultation: ['General Consultation', 'Follow-up Visit', 'Pulse Diagnosis Session', 'Teleconsultation'],
  vaccination: ['Hepatitis B Booster', 'Flu Vaccine', 'COVID-19 Booster', 'Tetanus Shot'],
  allergy: ['Pollen Allergy', 'Food Allergy - Nuts', 'Dust Mite Sensitivity', 'Medication Allergy'],
};

const PROVIDERS = ['Apollo Ayurveda', 'Kerala Wellness Center', 'City Hospital', 'Dr. Sharma Clinic', 'HealthFirst Lab'];
const TAGS = ['routine', 'urgent', 'follow-up', 'chronic', 'preventive', 'ayurvedic'];

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export function generateHealthRecords(count = ENV.HEALTH_RECORD_COUNT): HealthRecord[] {
  const rand = seededRandom(789);
  const types: RecordType[] = ['lab_report', 'prescription', 'consultation', 'vaccination', 'allergy'];
  const records: HealthRecord[] = [];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(rand() * types.length)];
    const titles = RECORD_TITLES[type];
    const daysAgo = Math.floor(rand() * 730);
    const date = format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');
    const hasAttachment = type === 'lab_report' || type === 'prescription';

    records.push({
      id: `rec-${i + 1}`,
      type,
      title: titles[Math.floor(rand() * titles.length)],
      description: `Health record for ${type.replace('_', ' ')} on ${date}.`,
      date,
      tags: [TAGS[Math.floor(rand() * TAGS.length)], type],
      provider: PROVIDERS[Math.floor(rand() * PROVIDERS.length)],
      attachmentType: hasAttachment ? (rand() > 0.5 ? 'pdf' : 'image') : undefined,
      attachmentUrl: hasAttachment ? `https://picsum.photos/seed/${i}/200/280` : undefined,
    });
  }

  return records.sort((a, b) => b.date.localeCompare(a.date));
}

let cachedRecords: HealthRecord[] | null = null;

export function getHealthRecords(): HealthRecord[] {
  if (!cachedRecords) cachedRecords = generateHealthRecords();
  return cachedRecords;
}

export type RecordFilters = {
  types: RecordType[];
  tags: string[];
  search: string;
  groupBy: 'month' | 'year' | 'none';
};

export function filterRecords(records: HealthRecord[], filters: RecordFilters): HealthRecord[] {
  let result = records;

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      r =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.provider.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q)),
    );
  }

  if (filters.types.length) {
    result = result.filter(r => filters.types.includes(r.type));
  }

  if (filters.tags.length) {
    result = result.filter(r => r.tags.some(t => filters.tags.includes(t)));
  }

  return result;
}

export type RecordGroup = {
  key: string;
  label: string;
  records: HealthRecord[];
};

export function groupRecords(
  records: HealthRecord[],
  groupBy: 'month' | 'year' | 'none',
): RecordGroup[] {
  if (groupBy === 'none') {
    return [{key: 'all', label: 'All Records', records}];
  }

  const groups = new Map<string, HealthRecord[]>();

  records.forEach(record => {
    const date = new Date(record.date);
    const key =
      groupBy === 'year'
        ? format(date, 'yyyy')
        : format(date, 'yyyy-MM');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(record);
  });

  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, recs]) => ({
      key,
      label:
        groupBy === 'year'
          ? key
          : format(new Date(key + '-01'), 'MMMM yyyy'),
      records: recs,
    }));
}

export const RECORD_TYPE_LABELS: Record<RecordType, string> = {
  lab_report: 'Lab Report',
  prescription: 'Prescription',
  consultation: 'Consultation',
  vaccination: 'Vaccination',
  allergy: 'Allergy',
};

export const RECORD_TYPE_COLORS: Record<RecordType, string> = {
  lab_report: 'bg-blue-100 text-blue-700',
  prescription: 'bg-purple-100 text-purple-700',
  consultation: 'bg-green-100 text-green-700',
  vaccination: 'bg-amber-100 text-amber-700',
  allergy: 'bg-red-100 text-red-700',
};
