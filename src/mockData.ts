import { Medicine, Invoice, ShiftInfo } from './types';

export const initialShift: ShiftInfo = {
  shiftId: 'SH-0000',
  pharmacistName: 'Admin / Owner',
  status: 'System Administrator',
  drawerCash: 0.00,
  terminal: 'TERM-01'
};

export const mockMedicines: Medicine[] = [];
export const mockInvoices: Invoice[] = [];

export const velocityData: any[] = [];
export const aiForecastData: any[] = [];
