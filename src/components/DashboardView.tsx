import React, { useState } from 'react';
import { 
  TrendingUp, 
  Receipt, 
  Boxes, 
  AlertTriangle, 
  Clock, 
  Percent, 
  ShieldCheck,
  ChevronRight,
  Filter,
  Plus,
  Search,
  Calendar,
  X,
  CreditCard,
  FileText,
  Edit,
  PackagePlus
} from 'lucide-react';
import { Medicine, Invoice, TabType } from '../types';

interface DashboardViewProps {
  medicines: Medicine[];
  invoices: Invoice[];
  setCurrentTab: (tab: TabType) => void;
  onOpenQuickSale: () => void;
  onOpenAddMedicine: () => void;
  onOpenEditMedicine?: (med: Medicine) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  medicines, 
  invoices, 
  setCurrentTab,
  onOpenQuickSale,
  onOpenAddMedicine,
  onOpenEditMedicine
}) => {
  // Invoice Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'today' | 'yesterday' | '7days' | 'month' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'evening' | 'night'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'CASH' | 'CREDIT / A/R' | 'VISA CARD'>('all');

  const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const todaysInvoices = invoices.filter(inv => inv.date === todayStr);
  
  const totalRevenue = todaysInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalTxns = todaysInvoices.length;
  const lowStockItems = medicines.filter(m => m.stock <= m.minStock);

  // Filtered invoices based on search & date/time filters
  const filteredInvoices = invoices.filter(inv => {
    // Search query
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch = !searchLower || 
      inv.invoiceNumber.toLowerCase().includes(searchLower) ||
      inv.customerName.toLowerCase().includes(searchLower) ||
      inv.doctor.toLowerCase().includes(searchLower) ||
      inv.items.some(i => i.name.toLowerCase().includes(searchLower));

    if (!matchesSearch) return false;

    // Payment Method filter
    if (paymentFilter !== 'all' && inv.paymentMethod !== paymentFilter) {
      return false;
    }

    // Date filter logic
    if (dateRangeFilter === 'today') {
      if (inv.date !== todayStr) return false;
    } else if (dateRangeFilter === 'yesterday') {
      const yest = new Date();
      yest.setDate(yest.getDate() - 1);
      const yestStr = yest.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      if (inv.date !== yestStr) return false;
    } else if (dateRangeFilter === 'custom' && (customStartDate || customEndDate)) {
      if (customStartDate && inv.date < customStartDate) return false;
      if (customEndDate && inv.date > customEndDate) return false;
    }

    // Time filter logic (morning: 06-14, evening: 14-22, night: 22-06)
    if (timeFilter !== 'all' && inv.time) {
      const hour = parseInt(inv.time.split(':')[0] || '0', 10);
      const isPM = inv.time.toLowerCase().includes('pm');
      const standardHour = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);

      if (timeFilter === 'morning' && (standardHour < 6 || standardHour >= 14)) return false;
      if (timeFilter === 'evening' && (standardHour < 14 || standardHour >= 22)) return false;
      if (timeFilter === 'night' && (standardHour >= 6 && standardHour < 22)) return false;
    }

    return true;
  });

  if (medicines.length === 0 && invoices.length === 0) {
    return (
      <div className="p-4 sm:p-6 min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8 max-w-2xl mx-auto">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-teal-50 flex items-center justify-center text-teal-700 shadow-sm border border-teal-100 animate-in fade-in zoom-in duration-500">
          <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter">Talha Surgical & Medicine</h1>
          <p className="text-slate-500 font-medium text-sm sm:text-lg">Your production database is initialized and ready for entry.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
          <button 
            onClick={onOpenAddMedicine}
            className="group flex flex-col items-center gap-4 p-6 sm:p-8 rounded-2xl border-2 border-dashed border-slate-200 hover:border-teal-700 hover:bg-teal-50 transition-all cursor-pointer shadow-xs hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Add First Medicine</p>
              <p className="text-xs text-slate-500 mt-1">Press <kbd className="font-sans font-bold bg-slate-100 px-1.5 py-0.5 rounded">F3</kbd> to initialize stock</p>
            </div>
          </button>

          <button 
            onClick={() => setCurrentTab('pos')}
            className="group flex flex-col items-center gap-4 p-6 sm:p-8 rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer shadow-xs hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <Receipt className="w-6 h-6 text-slate-700" />
            </div>
            <div className="text-center">
              <p className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Open POS Terminal</p>
              <p className="text-xs text-slate-500 mt-1">Press <kbd className="font-sans font-bold bg-slate-100 px-1.5 py-0.5 rounded">F2</kbd> to start billing</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Stock Warning Banner with Direct Add & Edit Buttons */}
      {lowStockItems.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-red-900">
                Stock Attention: {lowStockItems.length} items are below safety reorder threshold!
              </h3>
              <p className="text-[11px] text-red-700 mt-0.5">
                URGENT REORDERING & STOCK REPLENISHMENT RECOMMENDED
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={onOpenAddMedicine}
              className="flex-1 sm:flex-initial bg-red-700 hover:bg-red-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Medicine (F3)</span>
            </button>
            <button 
              onClick={() => setCurrentTab('inventory')}
              className="flex-1 sm:flex-initial bg-white border border-red-300 text-red-800 hover:bg-red-50 text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Review Inventory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Sub Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-0.5 uppercase tracking-wider">
            <span>Dispensary Operations Active</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Executive Operations & Sales Overview</h2>
          <p className="text-xs text-slate-500">Store Database &nbsp;•&nbsp; Terminal-01</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={onOpenQuickSale}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-teal-800 hover:bg-teal-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>New Sale (F2)</span>
          </button>

          <button 
            onClick={onOpenAddMedicine}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-teal-700" />
            <span>Add Medicine (F3)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">TODAY'S REVENUE</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">Rs.{totalRevenue.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</h4>
            <p className="text-[11px] text-slate-500 mt-1">Today's total volume</p>
          </div>
        </div>

        {/* Invoices */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">TODAY'S INVOICES</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">{totalTxns} Txns</h4>
            <p className="text-[11px] text-slate-500 mt-1">Completed slips</p>
          </div>
        </div>

        {/* Inventory SKUs */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">ACTIVE INVENTORY</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">{medicines.length} SKUs</h4>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Active items</p>
          </div>
        </div>

        {/* Reorder Warnings */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">REORDER WARNINGS</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-red-600 font-mono">{lowStockItems.length} Items</h4>
            <p className="text-[11px] text-red-600 font-semibold mt-1">● Below Safety Stock</p>
          </div>
        </div>

        {/* Expiry */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">TOTAL RECORDED</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">{invoices.length} Bills</h4>
            <p className="text-[11px] text-slate-500 mt-1">All time records</p>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">DISPENSARY STATUS</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-teal-800 font-mono">ONLINE</h4>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Synced with Cloud</p>
          </div>
        </div>
      </div>

      {/* FILTER & OLD BILL SEARCH PANEL */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-900">Search Old Bills & Filter Invoices</h3>
          </div>
          <div className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{filteredInvoices.length}</strong> of {invoices.length} total bills
          </div>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-700">Search Bill / Customer / Doctor</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Invoice #, Customer, Medicine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-teal-700 focus:outline-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-700">Date Filter</label>
            <select
              value={dateRangeFilter}
              onChange={(e: any) => setDateRangeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-teal-700 focus:outline-none font-medium"
            >
              <option value="all">All Dates</option>
              <option value="today">Today Only</option>
              <option value="yesterday">Yesterday</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-700">Time / Shift Filter</label>
            <select
              value={timeFilter}
              onChange={(e: any) => setTimeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-teal-700 focus:outline-none font-medium"
            >
              <option value="all">All Hours</option>
              <option value="morning">Morning Shift (6 AM - 2 PM)</option>
              <option value="evening">Evening Shift (2 PM - 10 PM)</option>
              <option value="night">Night Shift (10 PM - 6 AM)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-700">Payment Method</label>
            <select
              value={paymentFilter}
              onChange={(e: any) => setPaymentFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-teal-700 focus:outline-none font-medium"
            >
              <option value="all">All Payment Types</option>
              <option value="CASH">Cash Payment</option>
              <option value="CREDIT / A/R">Udhar / Khata Credit</option>
              <option value="VISA CARD">Card Payment</option>
            </select>
          </div>
        </div>

        {dateRangeFilter === 'custom' && (
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600">Start Date:</span>
              <input
                type="text"
                placeholder="e.g. 07 Nov 2026"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded p-1.5 text-xs text-slate-800 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600">End Date:</span>
              <input
                type="text"
                placeholder="e.g. 07 Nov 2026"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded p-1.5 text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900">Dispensary Transactions & Old Bills</h3>
          {searchTerm && (
            <span className="text-xs text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Filtering by "{searchTerm}"
            </span>
          )}
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs space-y-2">
            <p>No sales or bills matched your search parameters.</p>
            {(searchTerm || dateRangeFilter !== 'all' || paymentFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setDateRangeFilter('all');
                  setPaymentFilter('all');
                  setTimeFilter('all');
                }}
                className="text-teal-800 font-bold hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto min-w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-3.5 pl-4">INVOICE #</th>
                  <th className="p-3.5">TIME & DATE</th>
                  <th className="p-3.5">CUSTOMER / PATIENT</th>
                  <th className="p-3.5">ITEMS DISPENSED</th>
                  <th className="p-3.5">TOTAL AMOUNT</th>
                  <th className="p-3.5">PAYMENT METHOD</th>
                  <th className="p-3.5">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 pl-4 font-mono font-bold text-teal-800">{inv.invoiceNumber}</td>
                    <td className="p-3.5 text-slate-500">{inv.time} • {inv.date}</td>
                    <td className="p-3.5 font-bold text-slate-900">{inv.customerName}</td>
                    <td className="p-3.5">
                      <span className="font-bold">{inv.items.length} Items</span>
                      <p className="text-[10px] text-slate-500 truncate max-w-xs">
                        {inv.items.map(i => i.name).join(', ')}
                      </p>
                    </td>
                    <td className="p-3.5 font-mono font-extrabold text-slate-900">
                      Rs. {inv.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        inv.paymentMethod === 'CREDIT / A/R' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {inv.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-bold text-[10px]">COMPLETED</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
