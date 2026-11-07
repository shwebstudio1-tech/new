import React, { useState } from 'react';
import { 
  Scan, 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  Save, 
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { Medicine, CartItem, ShiftInfo } from '../types';

interface PosViewProps {
  medicines: Medicine[];
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onCompleteSale: (shouldPrint: boolean) => void;
  onOpenAddMedicine: () => void;
  shift: ShiftInfo;
}

export const PosView: React.FC<PosViewProps> = ({ medicines, cart, setCart, onCompleteSale, onOpenAddMedicine, shift }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [cashTendered, setCashTendered] = useState<number>(1000.00);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CREDIT / A/R' | 'VISA CARD'>('CASH');

  const addToCart = (med: Medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.medicine.id === med.id);
      if (existing) {
        return prev.map(item => 
          item.medicine.id === med.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { medicine: med, quantity: 1, dosage: '1 tab twice daily after meal' }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.medicine.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.medicine.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.medicine.retailPrice * item.quantity), 0);
  const discount = 0;
  const tax = subtotal * 0.025; // 2.5% tax
  const netTotal = Math.max(0, subtotal - discount + tax);
  const changeDue = Math.max(0, cashTendered - netTotal);

  const filteredMedicines = selectedCategory === 'ALL' 
    ? medicines 
    : medicines.filter(m => m.category.toUpperCase().includes(selectedCategory));

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto select-none space-y-4">
      {/* Top Live Dispensing Bar */}
      <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-medium shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-teal-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE DISPENSING / COUNTER SALES
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="hidden sm:inline">TERM-01</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span>SHIFT: {shift.shiftId}</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="font-mono text-emerald-400">DRAWER CASH: Rs. {shift.drawerCash.toLocaleString('en-PK')}</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenAddMedicine}
            className="bg-teal-700 hover:bg-teal-800 text-white px-3 py-1 rounded-lg font-bold text-[11px] cursor-pointer flex items-center gap-1 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Medicine F3</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Left Catalog Grid, Right Cart Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Medicine Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Scan className="w-5 h-5 text-teal-700 shrink-0" />
              <input
                type="text"
                placeholder="Scan Barcode or Type Medicine Name..."
                className="w-full sm:w-80 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium focus:outline-none focus:border-teal-700"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {['ALL', 'ANTIBIOTIC', 'ANALGESIC', 'COLD CHAIN', 'SURGICAL'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-teal-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredMedicines.length === 0 ? (
              <div className="col-span-full bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400 text-xs space-y-2">
                <p>No active medicines match this category filter.</p>
                <button 
                  onClick={onOpenAddMedicine}
                  className="bg-teal-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  Add Medicine F3
                </button>
              </div>
            ) : (
              filteredMedicines.map(med => (
                <div 
                  key={med.id}
                  onClick={() => addToCart(med)}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-700 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-800 transition-colors line-clamp-1">{med.name}</h4>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        med.stock <= med.minStock ? 'bg-red-100 text-red-700' : 'bg-teal-50 text-teal-800'
                      }`}>
                        {med.stock} {med.unit}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{med.genericName}</p>
                    <p className="text-[10px] text-slate-400">Shelf: {med.shelfLocation}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-mono font-extrabold text-teal-800">Rs.{med.retailPrice.toFixed(2)}</span>
                    <span className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-bold group-hover:bg-teal-800 group-hover:text-white transition-colors">
                      + ADD
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Cart & Checkout Panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
          {/* Cart Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Current Dispensing Cart</h3>
            <span className="text-xs font-mono font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
              {cart.reduce((a, b) => a + b.quantity, 0)} Items
            </span>
          </div>

          {/* Cart Items List */}
          <div className="p-4 flex-1 overflow-y-auto max-h-[350px] divide-y divide-slate-100 space-y-2">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                Cart is empty. Click any medicine on the left to start billing.
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.medicine.id} className="pt-2 flex items-center justify-between gap-2 text-xs">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{item.medicine.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Rs.{item.medicine.retailPrice.toFixed(2)} × {item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => updateQuantity(item.medicine.id, -1)}
                      className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="font-bold font-mono px-1">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.medicine.id, 1)}
                      className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold"
                    >
                      +
                    </button>

                    <button 
                      onClick={() => removeItem(item.medicine.id)}
                      className="text-red-500 hover:text-red-700 p-1 ml-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Calculation Summary */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Gross Subtotal:</span>
              <span className="font-mono font-bold text-slate-900">Rs.{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (2.5%):</span>
              <span className="font-mono font-bold text-slate-900">Rs.{tax.toFixed(2)}</span>
            </div>
          </div>

          {/* Net Payable Amount */}
          <div className="p-4 bg-teal-900 text-white flex items-center justify-between">
            <div>
              <p className="text-[10px] text-teal-300 uppercase font-bold">NET PAYABLE AMOUNT</p>
              <p className="text-[10px] text-teal-200/80">INCLUDES ALL CALCULATED TAXES</p>
            </div>
            <h3 className="text-2xl font-extrabold font-mono text-white">Rs.{netTotal.toFixed(2)}</h3>
          </div>

          {/* Fast Cash Tender & Change */}
          <div className="p-4 space-y-3 bg-white border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>CASH TENDERED:</span>
              <span className="text-emerald-600 font-mono">CHANGE DUE: Rs.{changeDue.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs font-mono font-bold">
              {[500, 1000, 2000, 5000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setCashTendered(amt)}
                  className={`py-1.5 rounded-lg border transition-all ${
                    cashTendered === amt 
                      ? 'bg-teal-50 border-teal-700 text-teal-900 shadow-xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Rs.{amt}
                </button>
              ))}
            </div>
          </div>

          {/* TWO CHECKOUT BUTTONS: Save Only vs Save & Print */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-xl space-y-2">
            <button
              onClick={() => onCompleteSale(false)}
              disabled={cart.length === 0}
              className={`w-full font-bold py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer text-xs ${
                cart.length === 0 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>SAVE TO FIRESTORE ONLY (NO PRINT)</span>
            </button>

            <button
              onClick={() => onCompleteSale(true)}
              disabled={cart.length === 0}
              className={`w-full font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs ${
                cart.length === 0 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-teal-800 hover:bg-teal-900 text-white'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>SAVE & PRINT THERMAL RECEIPT</span>
              <span className="bg-teal-950 px-1.5 py-0.5 rounded text-[10px] font-mono">F12</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
