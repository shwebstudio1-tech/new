export type TabType = 
  | 'dashboard'
  | 'pos'
  | 'medicines'
  | 'inventory'
  | 'sales'
  | 'purchases'
  | 'customers'
  | 'suppliers'
  | 'reports'
  | 'ai-assistant'
  | 'staff'
  | 'settings';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  sku: string;
  category: 'Antibiotic (Rx)' | 'Analgesic (OTC)' | 'Cold Chain (Rx)' | 'Gastroenterology' | 'Surgical Consumable' | 'Surgical & Wound' | 'Antacid' | 'Protective';
  shelfLocation: string;
  batchNumber: string;
  stock: number;
  unit: 'boxes' | 'strips' | 'canisters' | 'pcs' | 'bottles' | 'rolls' | 'vials' | 'packs' | 'bags' | 'tubes';
  minStock: number;
  unitCost: number;
  retailPrice: number;
  expiryDate: string;
  confidence?: string;
  status: 'optimal' | 'low' | 'critical' | 'expiring';
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
  dosage?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  time: string;
  date: string;
  customerName: string;
  customerType: string;
  doctor: string;
  items: { name: string; strength: string; qty: number; price: number }[];
  totalAmount: number;
  paymentMethod: 'CASH' | 'VISA CARD' | 'MOBILE PAY' | 'CREDIT / A/R';
  cashier: string;
  status: 'COMPLETED' | 'REFUNDED' | 'PENDING';
  amountTendered?: number;
  changeReturned?: number;
}

export interface ShiftInfo {
  shiftId: string;
  pharmacistName: string;
  status: string;
  drawerCash: number;
  terminal: string;
}
