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
}

export const PosView: React.FC<PosViewProps> = ({ medicines, cart, setCart, onCompleteSale }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [cashTendered, setCashTendered] = useState<number>(40.00);
  const [customer, setCustomer] = useState({ name: 'Tariq Mahmood', id: '#CUST-1044', loyalty: '240 Pts' });

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
  const discount = subtotal * 0.05; // 5% senior discount
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
          <span className="font-mono text-emerald-400">DRAWER: $1,420.50</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-slate-800 px-2 py-1 rounded text-[11px] font-mono text-slate-300">F1 Cust</span>
          <span className="bg-slate-800 px-2 py-1 rounded text-[11px] font-mono text-slate-300">F2 Scanner</span>
          <span className="bg-slate-800 px-2 py-1 rounded text-[11px] font-mono text-slate-300">F8 Disc</span>
          <span className="bg-slate-800 px-2 py-1 rounded text-[11px] font-mono text-teal-300 font-bold">F12 Cash Pay</span>
          <span className="bg-teal-800 text-white px-2.5 py-1 rounded font-bold text-[11px]">3 HELD ORDERS</span>
        </div>
      </div>

      {/* Main Layout: Left Catalog Grid, Right Cart Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Barcode Scanner & Medicine Grid */}
        <div className="lg:col-span-2 space-y-4">
          {/* Barcode Search bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Scan className="w-5 h-5 text-teal-700 shrink-0" />
              <input
                type="text"
                placeholder="Scan Barcode / NDC or Type Brand, Generic Name..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-medium text-slate-800 focus:outline-none focus:border-teal-700"
                defaultValue="8901030421"
              />
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono font-bold">AUTO-ADD</span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200 rounded-lg text-xs font-semibold text-teal-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>HONEYWELL 1900G READY</span>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
            {['ALL', 'POPULAR OTC', 'ANTIBIOTIC', 'PAIN & FEVER', 'SURGICAL', 'COLD CHAIN'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-teal-800 text-white shadow-sm' 
                    : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                }`}
              >
                {cat === 'ALL' ? 'ALL STOCK (1,840)' : cat}
              </button>
            ))}
          </div>

          {/* Medicine Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredMedicines.map((med) => (
              <div 
                key={med.id}
                onClick={() => addToCart(med)}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-teal-700 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      med.category.includes('Rx') ? 'bg-red-50 text-red-700 border border-red-200' :
                      med.category.includes('OTC') ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                      'bg-teal-50 text-teal-800 border border-teal-200'
                    }`}>
                      {med.category}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 font-mono">Rs.{med.retailPrice.toFixed(2)}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{med.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">{med.genericName}</p>

                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px] text-slate-600">
                    <div>
                      <span className="text-slate-400 block">RACK/LOC:</span>
                      <span className="font-semibold text-slate-800">{med.shelfLocation.split('(')[0]}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">BATCH:</span>
                      <span className="font-mono font-semibold text-slate-800">{med.batchNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    med.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-800'
                  }`}>
                    {med.stock} {med.unit.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold text-teal-700 group-hover:translate-x-1 transition-transform">
                    + Add to Cart
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom jurisdiction notice */}
          <div className="bg-teal-50 border border-teal-200/80 rounded-xl p-3 flex items-center justify-between text-xs text-teal-900">
            <span className="font-semibold">DRAP REGISTRATION ACTIVE: #TSMS-9810</span>
            <span className="text-[11px] text-teal-700">BARCODE SPEED: 42ms / SCAN TAX JURISDICTION: EXEMPT RX / 2.5% CONSUMABLES</span>
          </div>
        </div>

        {/* Right 1 Col: Cart & Checkout Panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-fit sticky top-20">
          {/* Customer Bar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">{customer.name}</span>
                <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">{customer.id}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Loyalty: 240 Pts • AR Balance: Rs.0.00</p>
            </div>
            <button className="text-xs font-bold text-teal-700 hover:underline">CHANGE [F1]</button>
          </div>

          {/* Doctor Verified Banner */}
          <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-800 font-medium">
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dr. Farhan Ali (Cardiologist, Lic: #PMC...)</span>
            </div>
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">VERIFIED</span>
          </div>

          {/* Cart Items List */}
          <div className="p-4 space-y-3 max-h-72 overflow-y-auto scrollbar-thin">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Cart is empty. Click medicines on the left or scan barcode to add items.
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.medicine.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{item.medicine.name}</h5>
                      <p className="text-[10px] text-slate-500">
                        {item.medicine.batchNumber} • EXP: {item.medicine.expiryDate}
                      </p>
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-900">
                      Rs.{(item.medicine.retailPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {item.dosage && (
                    <p className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-medium">
                      ⏱ {item.dosage}
                    </p>
                  )}

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
              <span className="font-mono font-bold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Customer Discount (Senior Citizen - 5%):</span>
              <span className="font-mono font-bold">SENIOR5 (-${discount.toFixed(2)})</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Sales Tax / VAT (Rx 0% Exempt / Consumables 2.5%):</span>
              <span className="font-mono font-bold text-slate-900">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Cash Rounding Adjustment:</span>
              <span className="font-mono">-$0.09</span>
            </div>
          </div>

          {/* Net Payable Amount */}
          <div className="p-4 bg-teal-900 text-white flex items-center justify-between">
            <div>
              <p className="text-[10px] text-teal-300 uppercase font-bold">NET PAYABLE AMOUNT</p>
              <p className="text-[10px] text-teal-200/80">INCLUDES ALL APPLICABLE PHARMACY TAXES</p>
            </div>
            <h3 className="text-2xl font-extrabold font-mono text-white">${netTotal.toFixed(2)}</h3>
          </div>

          {/* Fast Cash Tender */}
          <div className="p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>FAST CASH TENDER:</span>
              <span className="text-emerald-600 font-mono">CHANGE DUE: ${changeDue.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs font-mono font-bold">
              {[35, 40, 50, 100].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setCashTendered(amt)}
                  className={`py-2 rounded-lg border transition-all ${
                    cashTendered === amt 
                      ? 'bg-teal-50 border-teal-700 text-teal-900 shadow-sm' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  ${amt} {amt === 50 ? '✓' : ''}
                </button>
              ))}
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              <button className="flex flex-col items-center justify-center p-2 rounded-lg bg-teal-800 text-white text-[10px] font-bold">
                <DollarSign className="w-4 h-4 mb-0.5" />
                <span>CASH (F12)</span>
              </button>
              <button className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold">
                <CreditCard className="w-4 h-4 mb-0.5" />
                <span>CARD / POS</span>
              </button>
              <button className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold">
                <QrCode className="w-4 h-4 mb-0.5" />
                <span>DIGITAL QR</span>
              </button>
              <button className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold">
                <FileText className="w-4 h-4 mb-0.5" />
                <span>CREDIT / A/R</span>
              </button>
            </div>
          </div>

          {/* Bottom Action Button */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-xl space-y-2">
            <button
              onClick={onCompleteSale}
              className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>DISPENSE & PRINT INVOICE</span>
              <span className="bg-teal-950 px-2 py-0.5 rounded text-[10px] font-mono">F12</span>
            </button>

            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-semibold text-slate-700">
              <button className="bg-white border border-slate-200 hover:bg-slate-100 py-1.5 rounded-lg flex items-center justify-center gap-1">
                <Printer className="w-3.5 h-3.5 text-teal-700" />
                <span>Print Rx Slip</span>
              </button>
              <button className="bg-white border border-slate-200 hover:bg-slate-100 py-1.5 rounded-lg flex items-center justify-center gap-1">
                <Share2 className="w-3.5 h-3.5 text-teal-700" />
                <span>Split Tender</span>
              </button>
              <button className="bg-white border border-slate-200 hover:bg-slate-100 py-1.5 rounded-lg flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>Drawer Kick</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
