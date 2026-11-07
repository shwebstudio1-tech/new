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

export interface KhataTransaction {
  id: string;
  date: string;
  time: string;
  type: 'CREDIT_PURCHASE' | 'PAYMENT_RECEIVED';
  description: string;
  amount: number;
  invoiceNumber?: string;
  remainingBalance: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  cnic?: string;
  address?: string;
  totalDebt: number; // Udhar balance in PKR
  creditLimit: number;
  lastTransactionDate?: string;
  transactions: KhataTransaction[];
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  company: string;
  address?: string;
  deliveryStatus: 'DELIVERED' | 'PENDING' | 'IN_TRANSIT';
  totalOrders: number;
  totalPaid: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  time: string;
  supplierName: string;
  medicineName: string;
  qtyReceived: number;
  totalCost: number;
  paymentStatus: 'PAID' | 'CREDIT_PENDING';
}

