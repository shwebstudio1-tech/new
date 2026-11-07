import React, { useState, useEffect } from 'react';
import { X, Edit, CheckCircle2, Save, PackagePlus, AlertTriangle } from 'lucide-react';
import { Medicine } from '../types';

interface EditMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine | null;
  onUpdateMedicine: (updatedMed: Medicine) => Promise<void>;
}

export const EditMedicineModal: React.FC<EditMedicineModalProps> = ({
  isOpen,
  onClose,
  medicine,
  onUpdateMedicine
}) => {
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<any>('Antibiotic (Rx)');
  const [shelfLocation, setShelfLocation] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [stock, setStock] = useState(0);
  const [addStockQty, setAddStockQty] = useState<number>(0); // Quick Add Stock helper
  const [unit, setUnit] = useState<any>('boxes');
  const [minStock, setMinStock] = useState(10);
  const [unitCost, setUnitCost] = useState(0);
  const [retailPrice, setRetailPrice] = useState(0);
  const [expiryDate, setExpiryDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (medicine) {
      setName(medicine.name || '');
      setGenericName(medicine.genericName || '');
      setManufacturer(medicine.manufacturer || '');
      setSku(medicine.sku || '');
      setCategory(medicine.category || 'Antibiotic (Rx)');
      setShelfLocation(medicine.shelfLocation || '');
      setBatchNumber(medicine.batchNumber || '');
      setStock(medicine.stock || 0);
      setAddStockQty(0);
      setUnit(medicine.unit || 'boxes');
      setMinStock(medicine.minStock || 10);
      setUnitCost(medicine.unitCost || 0);
      setRetailPrice(medicine.retailPrice || 0);
      setExpiryDate(medicine.expiryDate || '');
    }
  }, [medicine]);

  if (!isOpen || !medicine) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalStock = Number(stock) + Number(addStockQty);

    const updatedMed: Medicine = {
      ...medicine,
      name,
      genericName,
      manufacturer,
      sku,
      category,
      shelfLocation,
      batchNumber,
      stock: finalStock,
      unit,
      minStock,
      unitCost,
      retailPrice,
      expiryDate,
      status: finalStock <= minStock ? 'low' : 'optimal'
    };

    try {
      await onUpdateMedicine(updatedMed);
      onClose();
    } catch (e) {
      console.error('Failed to update medicine', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-teal-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            <h3 className="font-bold text-sm sm:text-base">Edit Medicine Details & Update New Stock</h3>
          </div>
          <button onClick={onClose} className="text-teal-200 hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1 scrollbar-thin">
          {/* Quick Stock Addition Highlight Box */}
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <PackagePlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-950 text-xs">New Stock Arrival / Add Inventory</h4>
                <p className="text-[11px] text-emerald-700">Enter new quantity received to add directly to current stock ({stock} {unit}).</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-slate-700">Add Stock: +</span>
              <input
                type="number"
                min={0}
                placeholder="0"
                value={addStockQty || ''}
                onChange={(e) => setAddStockQty(parseInt(e.target.value) || 0)}
                className="w-24 bg-white border border-emerald-300 rounded-lg p-2 font-mono font-extrabold text-sm text-emerald-900 focus:outline-none focus:border-teal-700 text-center"
              />
              <span className="font-bold text-slate-600 font-mono text-[11px]">
                Total: {stock + Number(addStockQty)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Brand Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Generic Molecule / Formula</label>
              <input
                type="text"
                value={genericName}
                onChange={(e) => setGenericName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Manufacturer</label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">SKU Code</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
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
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Batch / Lot Number</label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-700 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Base Stock Qty</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-700 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Unit Type</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-700 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Retail Price (Rs.)</label>
              <input
                type="number"
                step="0.01"
                value={retailPrice}
                onChange={(e) => setRetailPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:outline-none focus:border-teal-700 font-mono"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-teal-800 text-white font-bold hover:bg-teal-900 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Updating...' : 'Save & Update Stock'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
