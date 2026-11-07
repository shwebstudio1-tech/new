import React, { useState } from 'react';
import { X, Pill, CheckCircle2 } from 'lucide-react';
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
  const [unitCost, setUnitCost] = useState(5.00);
  const [retailPrice, setRetailPrice] = useState(8.50);
  const [expiryDate, setExpiryDate] = useState('31 Dec 2026');

  if (!isOpen) return null;

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
      confidence: '95% High',
      status: 'optimal'
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
              <label className="block font-bold text-slate-700 mb-1">Brand Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Augmentin 625mg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              />
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
              <label className="block font-bold text-slate-700 mb-1">Unit Cost ($)</label>
              <input
                type="number"
                step="0.01"
                value={unitCost}
                onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Retail Price ($)</label>
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
