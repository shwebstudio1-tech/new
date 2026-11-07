import React, { useState } from 'react';
import { 
  TrendingUp, 
  Receipt, 
  Boxes, 
  AlertTriangle, 
  Clock, 
  Percent, 
  ArrowUpRight, 
  Printer, 
  FileText, 
  CheckCircle2, 
  Scan, 
  ShieldCheck,
  ChevronRight,
  Filter,
  Sparkles,
  Plus,
  Trash2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Medicine, Invoice, TabType } from '../types';

interface DashboardViewProps {
  medicines: Medicine[];
  invoices: Invoice[];
  setCurrentTab: (tab: TabType) => void;
  onOpenQuickSale: () => void;
  onOpenAddMedicine: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  medicines, 
  invoices, 
  setCurrentTab,
  onOpenQuickSale,
  onOpenAddMedicine
}) => {
  const [timeRange, setTimeRange] = useState<'today' | 'yesterday' | '7days' | 'month' | 'custom'>('today');
  const [chartMode, setChartMode] = useState<'hourly' | 'weekly'>('hourly');

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const todaysInvoices = invoices.filter(inv => inv.date === today);
  
  const totalRevenue = todaysInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalTxns = todaysInvoices.length;
  const totalInventoryValue = medicines.reduce((sum, med) => sum + (med.stock * med.retailPrice), 0);
  const lowStockItems = medicines.filter(m => m.stock <= m.minStock);

  if (medicines.length === 0 && invoices.length === 0) {
    return (
      <div className="p-6 h-[85vh] flex flex-col items-center justify-center text-center space-y-8 max-w-2xl mx-auto">
        <div className="w-24 h-24 rounded-3xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-sm border border-teal-100 animate-in fade-in zoom-in duration-500">
          <ShieldCheck className="w-12 h-12" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Talha Surgical & Medicine</h1>
          <p className="text-slate-500 font-medium text-lg">Your production database is now empty and ready for a fresh start.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <button 
            onClick={onOpenAddMedicine}
            className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-dashed border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-teal-100 group-commit group-hover:text-teal-600 transition-colors">
              <Plus className="w-7 h-7" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-slate-900 tracking-tight">Add First Medicine</p>
              <p className="text-xs text-slate-500 mt-1">Press <kbd className="font-sans font-bold bg-slate-100 px-1 rounded">F3</kbd> to initialize inventory</p>
            </div>
          </button>

          <button 
            onClick={() => setCurrentTab('pos')}
            className="group flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <Scan className="w-7 h-7" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-slate-900 tracking-tight">Open POS Terminal</p>
              <p className="text-xs text-slate-500 mt-1">Press <kbd className="font-sans font-bold bg-slate-100 px-1 rounded">F2</kbd> to start billing</p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pt-4">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          System Initialized • Ready for Entry
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Banner Notice (Only shown when there are items) */}
      {lowStockItems.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-red-900">
                Stock Attention Requisite: {lowStockItems.length} items are below safety threshold.
              </h3>
              <p className="text-[11px] text-red-700 mt-0.5">
                URGENT REORDERING REQUIRED
              </p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentTab('inventory')}
            className="bg-red-700 hover:bg-red-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Review Inventory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Sub Header / Time Range Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            <span>Dispensary Operations Active</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Executive Operations Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">Store Database &nbsp;•&nbsp; Terminal-01</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={onOpenQuickSale}
            className="flex items-center gap-2 bg-teal-800 hover:bg-teal-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>New Sale F2</span>
          </button>

          <button 
            onClick={onOpenAddMedicine}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-teal-700" />
            <span>Add Medicine F3</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
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

        {/* Total Invoices */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
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

        {/* Active Inventory */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">ACTIVE INVENTORY</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">{medicines.length} SKUs</h4>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Added by owner</p>
          </div>
        </div>

        {/* Reorder Warnings */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
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

        {/* Approaching Expiry */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">APPROACHING EXPIRY</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-orange-600 font-mono">0 Batches</h4>
            <p className="text-[11px] text-slate-500 mt-1">Monitored</p>
          </div>
        </div>

        {/* Gross Profit Margin */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">GROSS PROFIT</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-teal-800 font-mono">0.0%</h4>
            <p className="text-[11px] text-slate-500 mt-1">Starts on first sale</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue & Velocity Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Revenue & Prescription Velocity</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Peak dispensary load tracking across operative business hours</p>
              </div>
            </div>

            {invoices.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs space-y-2">
                <p>No sales recorded yet. Complete your first checkout in POS to generate telemetry graphs.</p>
                <button
                  onClick={onOpenQuickSale}
                  className="bg-teal-800 text-white px-4 py-2 rounded-lg font-semibold text-xs mt-2"
                >
                  Open POS Terminal F2
                </button>
              </div>
            ) : (
              <div className="h-72 w-full flex items-center justify-center text-xs text-slate-500">
                Live Sales Recorded ({invoices.length} invoices)
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Urgent Stock Watchlist */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Urgent Stock Watchlist</h3>
                <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  {lowStockItems.length} Actionable
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mb-4">Items requiring inventory reallocation or distributor reordering</p>

            {lowStockItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                All inventory levels are optimal. No low stock warnings.
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockItems.map((med) => (
                  <div key={med.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{med.name}</h4>
                        <p className="text-[10px] text-slate-500">Stock: {med.stock} {med.unit} (Min: {med.minStock})</p>
                      </div>
                      <span className="bg-red-100 text-red-700 font-bold text-[10px] px-2 py-0.5 rounded">
                        LOW STOCK
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Dispensary Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Dispensary Transactions & Register Activity</h3>
        </div>

        {invoices.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No dispensary transactions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-3.5 pl-4">INVOICE #</th>
                  <th className="p-3.5">TIME / DATE</th>
                  <th className="p-3.5">CUSTOMER / PATIENT</th>
                  <th className="p-3.5">DISPENSED ITEMS</th>
                  <th className="p-3.5">AMOUNT</th>
                  <th className="p-3.5">METHOD</th>
                  <th className="p-3.5">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 pl-4 font-mono font-bold text-teal-800">{inv.invoiceNumber}</td>
                    <td className="p-3.5 text-slate-500">{inv.time} • {inv.date}</td>
                    <td className="p-3.5 font-bold text-slate-900">{inv.customerName}</td>
                    <td className="p-3.5">{inv.items.length} Items</td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">Rs.{inv.totalAmount.toFixed(2)}</td>
                    <td className="p-3.5 font-semibold">{inv.paymentMethod}</td>
                    <td className="p-3.5"><span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-bold text-[10px]">COMPLETED</span></td>
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
