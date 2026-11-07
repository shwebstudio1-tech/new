import { Medicine, Invoice, ShiftInfo } from './types';

export const initialShift: ShiftInfo = {
  shiftId: 'SH-0419',
  pharmacistName: 'Dr. Sarah Khan',
  status: 'Pharm.D (On Duty)',
  drawerCash: 142050.00, // PKR
  terminal: 'TERM-01'
};

export const mockMedicines: Medicine[] = [];
export const mockInvoices: Invoice[] = [];

export const velocityData = [
  { time: '08:00', velocity: 12, margin: 28 },
  { time: '09:00', velocity: 22, margin: 31 },
  { time: '10:00', velocity: 45, margin: 35 },
  { time: '11:00', velocity: 78, margin: 42 },
  { time: '12:00', velocity: 65, margin: 39 },
  { time: '13:00', velocity: 50, margin: 36 },
  { time: '14:00', velocity: 48, margin: 34 },
  { time: '15:00', velocity: 55, margin: 38 },
  { time: '16:00', velocity: 88, margin: 45 },
  { time: '17:00', velocity: 92, margin: 46 },
  { time: '18:00', velocity: 60, margin: 37 },
  { time: '19:00', velocity: 30, margin: 30 },
];

export const aiForecastData = [
  { day: 'Oct 28', actual: 35, projected: 36, surge: 40, lower: 30, upper: 42 },
  { day: 'Nov 04', actual: 42, projected: 45, surge: 52, lower: 38, upper: 55 },
  { day: 'Nov 11', actual: null, projected: 75, surge: 92, lower: 62, upper: 98 },
  { day: 'Nov 18', actual: null, projected: 85, surge: 110, lower: 70, upper: 115 },
  { day: 'Nov 25', actual: null, projected: 55, surge: 70, lower: 45, upper: 75 },
];
