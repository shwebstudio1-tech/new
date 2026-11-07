import React, { useState } from 'react';
import { 
  Scan, 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  Share2, 
  DollarSign, 
  CreditCard, 
  QrCode, 
  FileText, 
  CheckCircle2,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { Medicine, CartItem } from '../types';

interface PosViewProps {
  medicines: Medicine[];
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onCompleteSale: () => void;
  onOpenAddMedicine: () => void;
}

export const PosView: React.FC<PosViewProps> = ({ medicines, cart, setCart, onCompleteSale, onOpenAddMedicine }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [cashTendered, setCashTendered] = useState<number>(1000.00);
  const [customer, setCustomer] = useState({ name: 'Walk-in Patient', id: '#CUST-001', loyalty: '0 Pts' });

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
    <div className="p-6 max-w-[1600px] mx-auto select-none space-y-4">
      {/* Top Live Dispensing Bar */}
      <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-medium shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-bold text-teal-400">⚡ LIVE DISPENSING / COUNTER SALES</span>
          <span className="text-slate-400">|</span>
          <span>TERM-01</span>
          <span className="text-slate-400">|</span>
          <span>SHIFT: #SH-0419</span>
          <span className="text-slate-400">|</span>
          <span className="font-mono text-emerald-400">DRAWER: Rs. 0.00</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenAddMedicine}
            className="bg-teal-700 hover:bg-teal-800 text-white px-3 py-1 rounded font-bold text-[11px] cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add Medicine F3</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Left Catalog Grid, Right Cart Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Medicine Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Scan className="w-5 h-5 text-teal-700 shrink-0" />
              <input
                type="text"
                placeholder="Scan Barcode / NDC or Type Brand, Generic Name..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[11px] bg-teal-50 text-teal-800 px-2.5 py-1 rounded font-bold border border-teal-200">
                {medicines.length} Items in Store
              </span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
            {['ALL', 'ANTIBIOTIC', 'ANALGESIC', 'SURGICAL', 'COLD CHAIN'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-teal-800 text-white shadow-sm' 
                    : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                }`}
              >
                {cat === 'ALL' ? `ALL STOCK (${medicines.length})` : cat}
              </button>
            ))}
          </div>

          {/* Medicine Card Grid */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
            {medicines.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
                  <Scan className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">No Medicines in Store Inventory</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your store database is fresh. Add medicines using F3 to populate the POS catalog and start selling.
                </p>
                <button
                  onClick={onOpenAddMedicine}
                  className="mt-2 bg-teal-800 hover:bg-teal-900 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Medicine F3</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredMedicines.map((med) => (
                  <div 
                    key={med.id}
                    onClick={() => addToCart(med)}
                    className="bg-white p-4 rounded-xl border border-slate-200 hover:border-teal-700 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                          {med.category}
                        </span>
                        <span className="text-sm font-extrabold text-slate-900 font-mono">Rs.{med.retailPrice.toFixed(2)}</span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{med.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">{med.genericName}</p>

                      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px] text-slate-600">
                        <div>
                          <span className="text-slate-400 block">RACK/LOC:</span>
                          <span className="font-semibold text-slate-800">{med.shelfLocation}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">BATCH:</span>
                          <span className="font-mono font-semibold text-slate-800">{med.batchNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        med.stock <= med.minStock ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {med.stock} {med.unit.toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-teal-700 group-hover:translate-x-1 transition-transform">
                        + Add
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Cart & Checkout Panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-fit sticky top-20">
          <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">{customer.name}</span>
                <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">{customer.id}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Loyalty: 0 Pts • AR Balance: Rs.0.00</p>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="p-4 space-y-3 max-h-72 overflow-y-auto scrollbar-thin">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Cart is empty. Click medicines on the left to add items and compute billing.
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.medicine.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{item.medicine.name}</h5>
                      <p className="text-[10px] text-slate-500">
                        {item.medicine.batchNumber} • Rs.{item.medicine.retailPrice.toFixed(2)} each
                      </p>
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-900">
                      Rs.{(item.medicine.retailPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.medicine.id, -1)}
                        className="w-6 h-6 rounded bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold font-mono w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.medicine.id, 1)}
                        className="w-6 h-6 rounded bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeItem(item.medicine.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Calculation Summary */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Gross Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items):</span>
              <span className="font-mono font-bold text-slate-900">Rs.{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Sales Tax / VAT (2.5%):</span>
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

          {/* Fast Cash Tender */}
          <div className="p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>CASH TENDERED:</span>
              <span className="text-emerald-600 font-mono">CHANGE DUE: Rs.{changeDue.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs font-mono font-bold">
              {[500, 1000, 2000, 5000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setCashTendered(amt)}
                  className={`py-2 rounded-lg border transition-all ${
                    cashTendered === amt 
                      ? 'bg-teal-50 border-teal-700 text-teal-900 shadow-sm' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Rs.{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Action Button */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-xl space-y-2">
            <button
              onClick={onCompleteSale}
              disabled={cart.length === 0}
              className={`w-full font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm ${
                cart.length === 0 ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-teal-800 hover:bg-teal-900 text-white'
              }`}
            >
              <span>DISPENSE & SAVE TO FIRESTORE</span>
              <span className="bg-teal-950 px-2 py-0.5 rounded text-[10px] font-mono">F12</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
