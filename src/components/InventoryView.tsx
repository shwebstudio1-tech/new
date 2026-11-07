import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { Medicine } from '../types';

interface InventoryViewProps {
  medicines: Medicine[];
  onOpenAddMedicine: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ medicines, onOpenAddMedicine }) => {
  const [selectedMed, setSelectedMed] = useState<Medicine>(medicines[0]);
  const [filterPreset, setFilterPreset] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

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
          <button className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer">
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
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">3,428 <span className="text-xs font-normal text-slate-500">SKUs ACTIVE</span></h4>
            <p className="text-[11px] text-slate-500 mt-1">Branded: 2,810 &nbsp;|&nbsp; Generic: 618 &nbsp;|&nbsp; Surgical: 142</p>
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
            <h4 className="text-lg font-extrabold text-slate-900 font-mono">$74,820.00 / <span className="text-teal-700">$108,450.00</span></h4>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-semibold mt-1">
              <span>Gross Markup: +44.9% Margin</span>
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
            <h4 className="text-xl font-extrabold text-red-600 font-mono">18 <span className="text-xs font-normal text-slate-500">SKUs CRITICAL</span></h4>
            <p className="text-[11px] text-red-600 font-semibold mt-1">Below Reorder Threshold &nbsp;|&nbsp; Requires PO</p>
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
            <h4 className="text-xl font-extrabold text-orange-600 font-mono">14 <span className="text-xs font-normal text-slate-500">BATCH LOTS</span></h4>
            <p className="text-[11px] text-orange-600 font-semibold mt-1">Inventory at Risk: $1,240.00 At Risk</p>
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
              <option>All Status (3,428)</option>
              <option>Optimal</option>
              <option>Low Stock</option>
              <option>Expiring</option>
            </select>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none">
              <option>All Shelves / Bays</option>
              <option>Rack A</option>
              <option>Rack B</option>
              <option>Fridge F-01</option>
            </select>
          </div>
        </div>

        {/* Presets Row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="font-bold text-slate-400 text-[10px] uppercase">FILTER PRESETS:</span>
            <button 
              onClick={() => setFilterPreset(filterPreset === 'expiring' ? 'all' : 'expiring')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                filterPreset === 'expiring' ? 'bg-red-100 text-red-800 font-bold border border-red-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🔴 Expiring &lt;30 Days
            </button>
            <button 
              onClick={() => setFilterPreset(filterPreset === 'cold' ? 'all' : 'cold')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                filterPreset === 'cold' ? 'bg-sky-100 text-sky-800 font-bold border border-sky-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ❄️ Cold Chain Only
            </button>
            <button 
              onClick={() => setFilterPreset(filterPreset === 'controlled' ? 'all' : 'controlled')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                filterPreset === 'controlled' ? 'bg-amber-100 text-amber-800 font-bold border border-amber-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🔒 Controlled (Rx)
            </button>
            <button 
              onClick={() => setFilterPreset(filterPreset === 'surgical' ? 'all' : 'surgical')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                filterPreset === 'surgical' ? 'bg-purple-100 text-purple-800 font-bold border border-purple-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🩺 Surgical Items
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-slate-500 font-medium">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Barcode Scanner Ready</span>
            <span>•</span>
            <span>Auto-Sync: 30s ago</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Data Table (Left 2 cols) & Batch Dossier (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Medicine Data Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
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
                  <th className="p-3.5 pr-4 text-right">RETAIL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredMedicines.map((med) => {
                  const isSelected = selectedMed.id === med.id;
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
                          <span className="bg-slate-100 text-slate-600 px-1 py-0.5 rounded text-[10px] font-semibold">{med.manufacturer.split(' ')[0]}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">{med.genericName} • SKU: {med.sku}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          med.category.includes('Rx') ? 'bg-red-50 text-red-700 border border-red-200' :
                          med.category.includes('OTC') ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                          'bg-teal-50 text-teal-800 border border-teal-200'
                        }`}>
                          {med.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-800">
                        <div>{med.batchNumber}</div>
                        <div className="text-[10px] text-slate-400">8901030928124</div>
                      </td>
                      <td className="p-3.5 text-slate-600">{med.shelfLocation}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            med.stock < 5 ? 'bg-red-500 animate-ping' : 'bg-emerald-500'
                          }`}></span>
                          <span className="font-bold text-slate-900 font-mono">{med.stock} {med.unit.toUpperCase()}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">Min: {med.minStock}</div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">${med.unitCost.toFixed(2)}</td>
                      <td className="p-3.5 pr-4 text-right font-mono font-bold text-teal-800">
                        ${med.retailPrice.toFixed(2)}
                        <div className="text-[10px] text-emerald-600 font-normal">34.2%</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
            <div>
              <span>Showing 1-{filteredMedicines.length} of 3,428 medicines</span>
              <span className="ml-3 bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">1 item selected</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Show:</span>
              <select className="bg-white border border-slate-200 rounded px-2 py-1 text-xs">
                <option>All Scanned (7)</option>
                <option>25</option>
                <option>50</option>
              </select>
              <div className="flex items-center gap-1 ml-4 font-bold">
                <button className="px-2 py-1 rounded bg-teal-800 text-white">1</button>
                <button className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100">2</button>
                <button className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100">3</button>
                <span>...</span>
                <button className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100">490</button>
              </div>
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

          {/* Selected Medicine Title */}
          <div>
            <div className="flex items-start justify-between">
              <h4 className="text-base font-extrabold text-slate-900">{selectedMed.name}</h4>
              <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">
                {selectedMed.category}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{selectedMed.genericName}</p>
          </div>

          {/* Stock & Min Level */}
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

          {/* All Active Batches */}
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2">ALL ACTIVE BATCHES IN STORE (2 Batches on Hand)</p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-red-900">#AUG-24089</span>
                  <p className="text-[10px] text-red-700">Exp: 18 Nov 2024 (25 Shelf: Rack B-04)</p>
                </div>
                <span className="font-bold font-mono text-red-900">Qty: 8 Boxes</span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-slate-800">#AUG-25012</span>
                  <p className="text-[10px] text-slate-500">Exp: 15 Apr 2025 Reserve Vault 2</p>
                </div>
                <span className="font-bold font-mono text-slate-800">Qty: 30 Boxes</span>
              </div>
            </div>
          </div>

          {/* Supplier Telemetry & Logistics */}
          <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
            <p className="font-bold text-slate-700">SUPPLIER TELEMETRY & LOGISTICS</p>
            <div className="grid grid-cols-2 gap-2 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 block">Authorized Supplier:</span>
                <span className="font-semibold text-slate-800">GSK Pakistan / National Medical</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Supplier Lead Time:</span>
                <span className="font-semibold text-slate-800">2 Business Days</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Last Purchase Price:</span>
                <span className="font-semibold text-slate-800 font-mono">${selectedMed.unitCost.toFixed(2)} / Box</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Recommended Order Qty:</span>
                <span className="font-semibold text-teal-800 font-mono">50 Boxes</span>
              </div>
            </div>
          </div>

          {/* Generate PO Action Button */}
          <div className="space-y-2 pt-2">
            <button className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-2.5 rounded-lg text-xs shadow-sm transition-all cursor-pointer">
              Generate PO-2024-118
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-xs transition-colors">
                Stock Adjust
              </button>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-xs transition-colors">
                Print 10 Barcodes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
