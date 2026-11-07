import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  Plus, 
  Download, 
  ShieldAlert, 
  Clock, 
  Search, 
  FileText, 
  Printer, 
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Trash2,
  Edit
} from 'lucide-react';
import { Medicine } from '../types';

interface InventoryViewProps {
  medicines: Medicine[];
  onOpenAddMedicine: () => void;
  onDeleteMedicine: (id: string) => void;
  onOpenEditMedicine?: (med: Medicine) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ medicines, onOpenAddMedicine, onDeleteMedicine, onOpenEditMedicine }) => {
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(medicines[0] || null);
  const [filterPreset, setFilterPreset] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (medicines.length === 0) {
      setSelectedMed(null);
    } else if (selectedMed && !medicines.some(m => m.id === selectedMed.id)) {
      setSelectedMed(null);
    } else if (!selectedMed && medicines.length > 0) {
      setSelectedMed(medicines[0]);
    }
    setDeleteConfirmId(null);
    setIsDeleting(false);
  }, [medicines, selectedMed?.id]);

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterPreset === 'expiring') return matchesSearch && m.status === 'expiring';
    if (filterPreset === 'cold') return matchesSearch && m.category.includes('Cold Chain');
    if (filterPreset === 'controlled') return matchesSearch && m.category.includes('Rx');
    if (filterPreset === 'surgical') return matchesSearch && m.category.includes('Surgical');
    return matchesSearch;
  });

  const totalValuationCost = medicines.reduce((acc, m) => acc + (m.unitCost * m.stock), 0);
  const totalValuationRetail = medicines.reduce((acc, m) => acc + (m.retailPrice * m.stock), 0);
  const lowStockCount = medicines.filter(m => m.stock <= m.minStock).length;

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Medicine Catalog & Inventory Management</h2>
            <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200">
              V4.8 TEL-RX
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive batch-level tracking, dosage forms, generic mappings, stock reorder thresholds, and shelf locations.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => window.location.reload()}
            className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-all cursor-pointer"
            title="Force Reload"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenAddMedicine}
            className="flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Medicine F3</span>
          </button>
          <button className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer">
            <Boxes className="w-3.5 h-3.5 text-teal-700" />
            <span>Stock In / Receive Purchase</span>
          </button>
          <button className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer">
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">TOTAL CATALOG ITEMS</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">{medicines.length} <span className="text-xs font-normal text-slate-500">SKUs ACTIVE</span></h4>
            <p className="text-[11px] text-slate-500 mt-1">Ready for owner inventory entry</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">TOTAL VALUATION (COST/RETAIL)</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-extrabold text-slate-900 font-mono">Rs.{totalValuationCost.toLocaleString('en-PK')} / <span className="text-teal-700">Rs.{totalValuationRetail.toLocaleString('en-PK')}</span></h4>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-semibold mt-1">
              <span>Live Inventory Valuation</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">LOW STOCK ALERTS</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-red-600 font-mono">{lowStockCount} <span className="text-xs font-normal text-slate-500">SKUs CRITICAL</span></h4>
            <p className="text-[11px] text-red-600 font-semibold mt-1">Below Reorder Threshold</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">EXPIRING SOON (&lt;60 DAYS)</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-orange-600 font-mono">0 <span className="text-xs font-normal text-slate-500">BATCH LOTS</span></h4>
            <p className="text-[11px] text-orange-600 font-semibold mt-1">Fresh inventory monitored</p>
          </div>
        </div>
      </div>

      {/* Filter Bar & Presets */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Brand Name, Generic Molecule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-700"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none">
              <option>All Categories</option>
              <option>Antibiotics (Rx)</option>
              <option>Analgesic (OTC)</option>
              <option>Surgical Consumable</option>
            </select>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none">
              <option>All Status ({medicines.length})</option>
              <option>Optimal</option>
              <option>Low Stock</option>
            </select>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none">
              <option>All Shelves / Bays</option>
              <option>Rack A</option>
              <option>Rack B</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Data Table (Left 2 cols) & Batch Dossier (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Medicine Data Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto min-h-[300px]">
            {medicines.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
                  <Boxes className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">No Medicine Records Found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Start by adding your first product SKU. All inventory records are securely synced to the Firestore cloud database.
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
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3.5 pl-4 w-10">
                      <input type="checkbox" className="rounded border-slate-300 text-teal-700 focus:ring-teal-700" />
                    </th>
                    <th className="p-3.5">PRODUCT & MOLECULE DETAILS</th>
                    <th className="p-3.5">CATEGORY</th>
                    <th className="p-3.5">BATCH / LOT #</th>
                    <th className="p-3.5">SHELF LOCATION</th>
                    <th className="p-3.5">CURRENT STOCK</th>
                    <th className="p-3.5">UNIT COST</th>
                    <th className="p-3.5">RETAIL</th>
                    <th className="p-3.5 pr-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredMedicines.map((med) => {
                    const isSelected = selectedMed?.id === med.id;
                    return (
                      <tr 
                        key={med.id}
                        onClick={() => setSelectedMed(med)}
                        className={`hover:bg-teal-50/50 transition-colors cursor-pointer ${
                          isSelected ? 'bg-teal-50/80 font-semibold' : ''
                        }`}
                      >
                        <td className="p-3.5 pl-4" onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => setSelectedMed(med)}
                            className="rounded border-slate-300 text-teal-700 focus:ring-teal-700" 
                          />
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {med.name}
                            <span className="bg-slate-100 text-slate-600 px-1 py-0.5 rounded text-[10px] font-semibold">{med.manufacturer}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">{med.genericName} • SKU: {med.sku}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                            {med.category}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-800">
                          <div>{med.batchNumber}</div>
                        </td>
                        <td className="p-3.5 text-slate-600">{med.shelfLocation}</td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              med.stock <= med.minStock ? 'bg-red-500 animate-ping' : 'bg-emerald-500'
                            }`}></span>
                            <span className="font-bold text-slate-900 font-mono">{med.stock} {med.unit.toUpperCase()}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">Min: {med.minStock}</div>
                        </td>
                        <td className="p-3.5 font-mono text-slate-600">Rs.{med.unitCost.toFixed(2)}</td>
                        <td className="p-3.5 font-mono font-bold text-teal-800">
                          Rs.{med.retailPrice.toFixed(2)}
                        </td>
                        <td className="p-3.5 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onOpenEditMedicine?.(med)}
                            className="inline-flex items-center gap-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                            title="Edit Medicine / Add New Stock Arrival"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit / Stock</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
            <div>
              <span>Total Catalog Items: {medicines.length}</span>
              {selectedMed && <span className="ml-3 bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">Selected: {selectedMed.name}</span>}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Batch Dossier & Drill-down Panel */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5 h-fit sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Batch Dossier & Drill-down</h3>
              <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE SYNC
              </span>
            </div>
          </div>

          {!selectedMed ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select a medicine from the table to view batch details and supplier logistics.
            </div>
          ) : (
            <>
              <div>
                <div className="flex items-start justify-between">
                  <h4 className="text-base font-extrabold text-slate-900">{selectedMed.name}</h4>
                  <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200">
                    {selectedMed.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{selectedMed.genericName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">CURRENT STOCK</span>
                  <span className="text-lg font-extrabold text-teal-800 font-mono">{selectedMed.stock} {selectedMed.unit.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">MIN REORDER LEV</span>
                  <span className="text-lg font-extrabold text-slate-900 font-mono">{selectedMed.minStock} {selectedMed.unit.toUpperCase()}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-700 mb-2">ACTIVE BATCH ON HAND</p>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-900">{selectedMed.batchNumber}</span>
                    <p className="text-[10px] text-slate-500">Shelf: {selectedMed.shelfLocation}</p>
                  </div>
                  <span className="font-bold font-mono text-slate-800">Qty: {selectedMed.stock} {selectedMed.unit}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
                <p className="font-bold text-slate-700">SUPPLIER TELEMETRY & LOGISTICS</p>
                <div className="grid grid-cols-2 gap-2 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Manufacturer:</span>
                    <span className="font-semibold text-slate-800">{selectedMed.manufacturer}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Last Purchase Price:</span>
                    <span className="font-semibold text-slate-800 font-mono">Rs.{selectedMed.unitCost.toFixed(2)}</span>
                  </div>
                </div>
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => onOpenEditMedicine?.(selectedMed)}
                    className="w-full flex items-center justify-center gap-2 bg-teal-800 hover:bg-teal-900 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>EDIT DETAILS / ADD NEW STOCK</span>
                  </button>

                  {deleteConfirmId === selectedMed.id ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                      <p className="text-red-800 font-bold leading-tight text-center">
                        CONFIRM PERMANENT DELETE?
                      </p>
                      <div className="flex gap-2">
                        <button
                          disabled={isDeleting}
                          onClick={async () => {
                            console.log('UI: YES DELETE clicked for ID:', selectedMed.id);
                            setIsDeleting(true);
                            await onDeleteMedicine(selectedMed.id);
                          }}
                          className={`flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold shadow-sm cursor-pointer transition-colors flex items-center justify-center gap-2 ${isDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          {isDeleting ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>DELETING...</span>
                            </>
                          ) : (
                            <span>YES</span>
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="flex-1 bg-white border border-slate-200 text-slate-600 py-2 rounded-lg font-bold hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          NO
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(selectedMed.id)}
                      className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>DELETE FROM DATABASE</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
