import React, { useState } from 'react';
import { X, ShoppingCart, CheckCircle2, Scan } from 'lucide-react';
import { Medicine, CartItem } from '../types';

interface QuickSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicines: Medicine[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setCurrentTab: (tab: any) => void;
}

export const QuickSaleModal: React.FC<QuickSaleModalProps> = ({ isOpen, onClose, medicines, setCart, setCurrentTab }) => {
  const [selectedMedId, setSelectedMedId] = useState(medicines[0]?.id || '');
  const [qty, setQty] = useState(1);

  if (!isOpen) return null;

  const handleAddAndGoToPos = () => {
    const med = medicines.find(m => m.id === selectedMedId);
    if (med) {
      setCart(prev => [...prev, { medicine: med, quantity: qty }]);
    }
    onClose();
    setCurrentTab('pos');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 bg-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h3 className="font-bold text-sm">Quick Sale Counter (F2 Shortcut)</h3>
          </div>
          <button onClick={onClose} className="text-teal-200 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Select Medicine / Scan Barcode</label>
            <select
              value={selectedMedId}
              onChange={(e) => setSelectedMedId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-700"
            >
              {medicines.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} — ${m.retailPrice.toFixed(2)} ({m.stock} {m.unit} available)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Dispensing Quantity</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-700"
            />
          </div>

          <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg flex items-center gap-2 text-teal-900">
            <Scan className="w-4 h-4 text-teal-700 shrink-0" />
            <span>Barcode scanner terminal TERM-01 is active and listening for NDC scans.</span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddAndGoToPos}
            className="px-4 py-2 rounded-lg bg-teal-800 text-white font-semibold hover:bg-teal-900 transition-colors shadow-sm"
          >
            Add to Cart & Open POS F2
          </button>
        </div>
      </div>
    </div>
  );
};
