import React, { useState } from 'react';
import { X, Pill, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { Medicine } from '../types';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMedicine: (med: Medicine) => void;
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({ isOpen, onClose, onAddMedicine }) => {
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<any>('Antibiotic (Rx)');
  const [shelfLocation, setShelfLocation] = useState('Rack B-01');
  const [batchNumber, setBatchNumber] = useState('#BATCH-9900');
  const [stock, setStock] = useState(50);
  const [unit, setUnit] = useState<any>('boxes');
  const [minStock, setMinStock] = useState(10);
  const [unitCost, setUnitCost] = useState(0.00);
  const [retailPrice, setRetailPrice] = useState(0.00);
  const [expiryDate, setExpiryDate] = useState('31 Dec 2026');
  const [loading, setLoading] = useState(false);
  const [cache] = useState<Record<string, any>>({});
  const [aiFilled, setAiFilled] = useState(false);

  if (!isOpen) return null;

  const applySuggestedData = (d: any) => {
    if (d.formula) setGenericName(d.formula);
    if (d.manufacturer) setManufacturer(d.manufacturer);
    if (d.sku) setSku(d.sku);
    if (d.category) setCategory(d.category);
    if (d.unit) setUnit(d.unit);
    if (d.shelfLocation) setShelfLocation(d.shelfLocation);
    if (d.unitCost !== undefined && d.unitCost !== null) {
      const costVal = typeof d.unitCost === 'number' ? d.unitCost : parseFloat(String(d.unitCost).replace(/[^0-9.]/g, ''));
      if (!isNaN(costVal)) setUnitCost(costVal);
    }
    if (d.price !== undefined && d.price !== null) {
      const priceVal = typeof d.price === 'number' ? d.price : parseFloat(String(d.price).replace(/[^0-9.]/g, ''));
      if (!isNaN(priceVal)) setRetailPrice(priceVal);
    }
    setAiFilled(true);
  };

  const handleAiSuggest = async () => {
    const term = name.trim().toLowerCase();
    if (!term) return;

    if (cache[term]) {
      applySuggestedData(cache[term]);
      return;
    }

    setLoading(true);
    setAiFilled(false);
    try {
      const response = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicineName: name })
      });
      
      const text = await response.text();
      console.log('AI Suggest Raw Response:', text);
      
      if (!response.ok) {
        let errMsg = 'Server error';
        try {
          const errObj = JSON.parse(text);
          errMsg = errObj.details || errObj.error || text;
        } catch (_) {
          errMsg = text;
        }
        throw new Error(errMsg);
      }

      const data = JSON.parse(text);
      applySuggestedData(data);
      cache[term] = data;
    } catch (error: any) {
      console.error('AI suggestion failed', error);
      alert(`AI Assistant: ${error?.message || 'Unable to fetch medicine details. Please enter manually.'}`);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMed: Medicine = {
      id: `med-${Date.now()}`,
      name,
      genericName: genericName || 'Standard Formula',
      manufacturer: manufacturer || 'Talha Pharma',
      sku: sku || 'SKU-NEW',
      category,
      shelfLocation,
      batchNumber,
      stock,
      unit,
      minStock,
      unitCost,
      retailPrice,
      expiryDate,
      status: stock <= minStock ? 'low' : 'optimal'
    };

    onAddMedicine(newMed);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        <div className="p-4 bg-teal-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5" />
            <h3 className="font-bold text-sm">Add New Medicine / Surgical SKU (F3 Shortcut)</h3>
          </div>
          <button onClick={onClose} className="text-teal-200 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="brand-name" className="block font-bold text-slate-700 mb-1">Brand Name *</label>
              <div className="flex gap-2">
                <input
                  id="brand-name"
                  type="text"
                  required
                  placeholder="e.g. Augmentin 625mg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
                />
                <button 
                  type="button"
                  onClick={() => handleAiSuggest()}
                  disabled={loading || !name.trim()}
                  title="Smart Fill with AI"
                  className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 disabled:bg-slate-300 transition-colors shadow-sm shrink-0 flex items-center gap-1 px-3"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span className="text-[10px] font-bold">AI FILL</span>
                </button>
              </div>
              {loading && (
                <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 animate-pulse bg-emerald-50 p-1.5 rounded border border-emerald-100">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>AI Assistant is analyzing Pakistani drug database...</span>
                </div>
              )}
              {aiFilled && !loading && (
                <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-teal-800 bg-teal-50 p-1.5 rounded border border-teal-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Auto-filled: Formula, Manufacturer, SKU, Category, Prices & Shelf!</span>
                </div>
              )}
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Generic Molecule / Formula</label>
              <input
                type="text"
                placeholder="e.g. Amoxicillin + Clavulanic Acid"
                value={genericName}
                onChange={(e) => setGenericName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>
          </div>
          {/* ... rest of the form ... */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Manufacturer</label>
              <input
                type="text"
                placeholder="e.g. GSK Pakistan"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">SKU Code</label>
              <input
                type="text"
                placeholder="e.g. AUG-625"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              >
                <option>Antibiotic (Rx)</option>
                <option>Analgesic (OTC)</option>
                <option>Cold Chain (Rx)</option>
                <option>Gastroenterology</option>
                <option>Surgical Consumable</option>
                <option>Surgical & Wound</option>
                <option>Antacid</option>
                <option>Protective</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Shelf / Bay Location</label>
              <input
                type="text"
                placeholder="e.g. Rack B-04"
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Batch / Lot Number</label>
              <input
                type="text"
                placeholder="e.g. #AUG-24089"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="e.g. 18 Nov 2026"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Initial Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Unit Type</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              >
                <option value="boxes">Boxes</option>
                <option value="strips">Strips</option>
                <option value="pcs">Pcs</option>
                <option value="bottles">Bottles</option>
                <option value="vials">Vials</option>
                <option value="rolls">Rolls</option>
                <option value="canisters">Canisters</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Unit Cost (Rs.)</label>
              <input
                type="number"
                step="0.01"
                value={unitCost}
                onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Retail Price (Rs.)</label>
              <input
                type="number"
                step="0.01"
                value={retailPrice}
                onChange={(e) => setRetailPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>
          </div>

          <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
            <span>New SKU will be indexed immediately in DRAP registry and barcode scanning terminal.</span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-teal-800 text-white font-semibold hover:bg-teal-900 transition-colors shadow-sm"
            >
              Save & Register Medicine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
