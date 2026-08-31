import {ENV} from '../../core/config/env';

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviewCount: number;
  fee: number;
  languages: string[];
  availableToday: boolean;
  imageSeed: string;
  location: string;
};

const SPECIALTIES = [
  'Panchakarma',
  'Ayurvedic Medicine',
  'Yoga Therapy',
  'Naturopathy',
  'Herbal Medicine',
  'Pulse Diagnosis',
  'Diet & Nutrition',
  'Marma Therapy',
];

const LOCATIONS = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Chennai',
  'Kerala',
  'Jaipur',
  'Pune',
  'Hyderabad',
];

const FIRST_NAMES = [
  'Ananya', 'Priya', 'Rajesh', 'Vikram', 'Meera', 'Arjun', 'Kavya', 'Rohan',
  'Deepa', 'Sanjay', 'Lakshmi', 'Naveen', 'Pooja', 'Amit', 'Shreya', 'Ravi',
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Iyer', 'Nair', 'Gupta', 'Reddy', 'Menon', 'Joshi',
  'Desai', 'Pillai', 'Rao', 'Singh', 'Kumar', 'Verma', 'Malhotra',
];

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export function generateDoctors(count = ENV.DOCTOR_COUNT): Doctor[] {
  const rand = seededRandom(42);
  const doctors: Doctor[] = [];

  for (let i = 0; i < count; i++) {
    const first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    doctors.push({
      id: `doc-${i + 1}`,
      name: `Dr. ${first} ${last}`,
      specialty: SPECIALTIES[Math.floor(rand() * SPECIALTIES.length)],
      experience: Math.floor(rand() * 30) + 2,
      rating: Math.round((3.5 + rand() * 1.5) * 10) / 10,
      reviewCount: Math.floor(rand() * 500),
      fee: Math.floor(rand() * 1500) + 300,
      languages: rand() > 0.5 ? ['English', 'Hindi'] : ['English', 'Hindi', 'Sanskrit'],
      availableToday: rand() > 0.3,
      imageSeed: `doctor-${i}`,
      location: LOCATIONS[Math.floor(rand() * LOCATIONS.length)],
    });
  }

  return doctors;
}

let cachedDoctors: Doctor[] | null = null;

export function getDoctors(): Doctor[] {
  if (!cachedDoctors) cachedDoctors = generateDoctors();
  return cachedDoctors;
}

export type TimeSlot = {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  available: boolean;
  expiresAt: string;
};

export function generateSlots(doctorId: string, date: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
  const now = Date.now();

  times.forEach((time, i) => {
    const expiresAt = new Date(now + (i + 1) * 3600000).toISOString();
    slots.push({
      id: `${doctorId}-${date}-${time}`,
      doctorId,
      date,
      time,
      available: Math.random() > 0.25,
      expiresAt,
    });
  });

  return slots;
}

export type Booking = {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  slotId: string;
  status: 'confirmed' | 'cancelled' | 'pending_sync';
  createdAt: string;
};

const bookedSlots = new Set<string>();

export function isSlotBooked(slotId: string): boolean {
  return bookedSlots.has(slotId);
}

export function bookSlot(slotId: string): void {
  bookedSlots.add(slotId);
}

export function releaseSlot(slotId: string): void {
  bookedSlots.delete(slotId);
}

export function isSlotExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

export function validateBooking(
  slotId: string,
  expiresAt: string,
): {valid: boolean; reason?: string} {
  if (isSlotExpired(expiresAt)) {
    return {valid: false, reason: 'This slot has expired. Please select another.'};
  }
  if (isSlotBooked(slotId)) {
    return {valid: false, reason: 'This slot was just booked. Please choose another.'};
  }
  return {valid: true};
}
