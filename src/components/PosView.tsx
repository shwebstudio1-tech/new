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
import { Medicine, CartItem, ShiftInfo, Customer } from '../types';

interface PosViewProps {
  medicines: Medicine[];
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onCompleteSale: (shouldPrint: boolean, saleDetails?: {
    customerName?: string;
    customerPhone?: string;
    customerCnic?: string;
    paymentMethod?: 'CASH' | 'CREDIT / A/R' | 'VISA CARD';
    discountAmount?: number;
    taxRate?: number;
    netTotal?: number;
  }) => void;
  onOpenAddMedicine: () => void;
  shift: ShiftInfo;
  categories?: string[];
  onAddCategory?: (category: string) => Promise<void> | void;
  customers?: Customer[];
}

export const PosView: React.FC<PosViewProps> = ({ 
  medicines, 
  cart, 
  setCart, 
  onCompleteSale, 
  onOpenAddMedicine,
  shift,
  categories,
  onAddCategory,
  customers = []
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [barcodeInput, setBarcodeInput] = useState<string>('');
  const [cashTendered, setCashTendered] = useState<number>(1000.00);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CREDIT / A/R' | 'VISA CARD'>('CASH');
  
  // Direct Add Category State
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);
  const [newCategoryInput, setNewCategoryInput] = useState<string>('');

  // Customer & Bill Settings State
  const [customerName, setCustomerName] = useState<string>('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerCnic, setCustomerCnic] = useState<string>('');
  const [taxRate, setTaxRate] = useState<number>(0); // 0% default tax
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const posCategories = React.useMemo(() => {
    const defaults = ['ANTIBIOTIC', 'ANALGESIC', 'COLD CHAIN', 'SURGICAL', 'GASTROENTEROLOGY', 'ANTACID', 'SYRUP', 'INJECTION'];
    const base = categories && categories.length > 0 ? categories : defaults;
    const fromMeds = medicines.map(m => (m.category || '').toUpperCase().trim()).filter(Boolean);
    return Array.from(new Set([...base, ...fromMeds]));
  }, [categories, medicines]);

  const handleCreateCategory = async () => {
    const clean = newCategoryInput.trim().toUpperCase();
    if (!clean) return;
    if (onAddCategory) {
      await onAddCategory(clean);
    }
    setSelectedCategory(clean);
    setNewCategoryInput('');
    setIsAddingCategory(false);
  };

  const handleCustomerNameChange = (val: string) => {
    setCustomerName(val);
    const matched = customers.find(c => c.name.toLowerCase() === val.toLowerCase().trim());
    if (matched) {
      if (matched.phone) setCustomerPhone(matched.phone);
      if (matched.cnic) setCustomerCnic(matched.cnic);
    }
  };

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

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    const query = barcodeInput.trim().toLowerCase();
    const found = medicines.find(m => 
      m.sku.toLowerCase() === query || 
      m.batchNumber.toLowerCase() === query || 
      m.name.toLowerCase().includes(query)
    );

    if (found) {
      addToCart(found);
      setBarcodeInput('');
    } else {
      alert(`No product SKU or barcode matched: "${barcodeInput}"`);
    }
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
  const tax = (subtotal - discountAmount) * (taxRate / 100);
  const netTotal = Math.max(0, subtotal - discountAmount + tax);

  const filteredMedicines = selectedCategory === 'ALL' 
    ? medicines 
    : medicines.filter(m => (m.category || '').toUpperCase().includes(selectedCategory.toUpperCase()));

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto select-none space-y-4 font-sans">

      {/* Main Layout: Left Product Catalog, Right Bill & Cart Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Barcode Scanner & Category Pills + Medicine Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            {/* Barcode Scan Input */}
            <form onSubmit={handleBarcodeSubmit} className="flex items-center gap-3">
              <Scan className="w-5 h-5 text-teal-700 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Scan Barcode / Type SKU or Medicine Name (Press Enter)..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:border-teal-700 transition-all shadow-inner"
              />
              <button 
                type="submit"
                className="bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg shrink-0 cursor-pointer"
              >
                Scan SKU
              </button>
            </form>

            {/* Category Filter Pills (Responsive Wrap) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedCategory === 'ALL'
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ALL
              </button>
              {posCategories.map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedCategory.toUpperCase() === cat.toUpperCase()
                      ? 'bg-teal-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}

              {/* Direct Add Category Button & Inline Form */}
              {isAddingCategory ? (
                <div className="flex items-center gap-1 bg-teal-50 border-2 border-teal-700 rounded-lg p-0.5 shadow-sm animate-in fade-in zoom-in-95 duration-100">
                  <input
                    type="text"
                    autoFocus
                    placeholder="New category..."
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateCategory();
                      } else if (e.key === 'Escape') {
                        setIsAddingCategory(false);
                        setNewCategoryInput('');
                      }
                    }}
                    className="px-2.5 py-1 text-xs font-bold text-slate-900 bg-white border border-teal-300 rounded focus:outline-none w-36 uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="bg-teal-800 hover:bg-teal-900 text-white px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCategory(false);
                      setNewCategoryInput('');
                    }}
                    className="text-slate-400 hover:text-slate-700 px-1.5 text-xs font-bold cursor-pointer"
                    title="Cancel"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 hover:border-emerald-400 transition-all cursor-pointer shadow-2xs"
                  title="Direct Add New Category"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-700" />
                  <span>+ Add Category</span>
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredMedicines.length === 0 ? (
              <div className="col-span-full bg-white p-10 rounded-xl border border-slate-200 text-center text-xs space-y-3">
                <p className="text-slate-500 font-medium">No medicines registered under category <strong>"{selectedCategory}"</strong> yet.</p>
                <button
                  type="button"
                  onClick={onOpenAddMedicine}
                  className="inline-flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white px-4 py-2 rounded-lg font-bold text-xs cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Medicine to {selectedCategory} (F3)</span>
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

        {/* Right 1 Col: Cart, Customer Details & Unified Save & Print Checkout */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden min-h-[600px]">
          {/* Cart Header */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Patient Invoice Cart</h3>
            <span className="text-xs font-mono font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
              {cart.reduce((a, b) => a + b.quantity, 0)} Items
            </span>
          </div>

          {/* Customer Info Box (Name + Contact + CNIC/ID) */}
          <div className="p-3 bg-slate-50/70 border-b border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">CUSTOMER & BILL SETTINGS</p>
              {customers.some(c => c.name.toLowerCase() === customerName.toLowerCase().trim()) && (
                <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                  Khata Linked
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="relative">
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Customer Name</label>
                <input
                  type="text"
                  list="pos-customer-datalist"
                  placeholder="Customer Name (e.g. Walk-in Customer)"
                  value={customerName}
                  onChange={(e) => handleCustomerNameChange(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs focus:outline-none focus:border-teal-700 font-medium"
                />
                <datalist id="pos-customer-datalist">
                  <option value="Walk-in Customer">Default Walk-in Retail Customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.phone ? `${c.phone} — Udhar: Rs. ${(c.totalDebt || 0).toLocaleString('en-PK')}` : ''}
                    </option>
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Customer Phone</label>
                <input
                  type="text"
                  placeholder="0300-1234567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs focus:outline-none focus:border-teal-700 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Customer CNIC / ID</label>
                <input
                  type="text"
                  placeholder="35202-xxxxxxx-x"
                  value={customerCnic}
                  onChange={(e) => setCustomerCnic(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs focus:outline-none focus:border-teal-700 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="p-3.5 flex-1 overflow-y-auto divide-y divide-slate-100 space-y-2">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
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

          {/* Calculation Summary with Editable Tax % & Discount */}
          <div className="p-3.5 border-t border-slate-200 bg-slate-50 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Gross Subtotal:</span>
              <span className="font-mono font-bold text-slate-900">Rs.{subtotal.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-500">Discount (Rs.)</label>
                <input
                  type="number"
                  min="0"
                  value={discountAmount || ''}
                  onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded p-1 text-xs font-mono"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500">Tax Rate (%)</label>
                <select
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded p-1 text-xs font-mono"
                >
                  <option value={0}>0% (Exempt)</option>
                  <option value={2.5}>2.5% Standard</option>
                  <option value={5}>5.0%</option>
                  <option value={10}>10.0%</option>
                </select>
              </div>
            </div>
          </div>

          {/* Net Payable Amount */}
          <div className="p-4 bg-teal-900 text-white flex items-center justify-between">
            <div>
              <p className="text-[10px] text-teal-300 uppercase font-bold">NET PAYABLE AMOUNT</p>
              <p className="text-[10px] text-teal-200/80">INCLUDES DISCOUNT & TAX</p>
            </div>
            <h3 className="text-2xl font-extrabold font-mono text-white">Rs.{netTotal.toFixed(2)}</h3>
          </div>

          {/* POS ACTION BUTTONS: SAVE & PRINT */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 rounded-b-xl grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onCompleteSale(false, {
                customerName,
                customerPhone,
                customerCnic,
                paymentMethod,
                discountAmount,
                taxRate,
                netTotal
              })}
              disabled={cart.length === 0}
              className={`font-bold py-3 px-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs border ${
                cart.length === 0
                  ? 'bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs cursor-pointer'
              }`}
            >
              <Save className="w-4 h-4 text-teal-700" />
              <span>Save</span>
            </button>
            <button
              type="button"
              onClick={() => onCompleteSale(true, {
                customerName,
                customerPhone,
                customerCnic,
                paymentMethod,
                discountAmount,
                taxRate,
                netTotal
              })}
              disabled={cart.length === 0}
              className={`font-bold py-3 px-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-md ${
                cart.length === 0 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-teal-800 hover:bg-teal-900 text-white cursor-pointer'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
