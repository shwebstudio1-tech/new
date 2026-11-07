import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  TrendingUp, 
  FileText, 
  Printer, 
  Share2, 
  Search, 
  Calendar, 
  Download, 
  CheckCircle2,
  Barcode,
  RotateCcw,
  RefreshCw
} from 'lucide-react';
import { Invoice } from '../types';

interface SalesViewProps {
  invoices: Invoice[];
  onOpenQuickSale: () => void;
}

export const SalesView: React.FC<SalesViewProps> = ({ invoices, onOpenQuickSale }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(invoices[0] || null);
  const [triageTab, setTriageTab] = useState<'today' | 'rx' | 'returns' | 'hospital' | 'high'>('today');

  useEffect(() => {
    if (invoices.length > 0 && (!selectedInvoice || !invoices.some(i => i.id === selectedInvoice.id))) {
      setSelectedInvoice(invoices[0]);
    } else if (invoices.length === 0) {
      setSelectedInvoice(null);
    }
  }, [invoices]);

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Sales & Invoice Management</h2>
            <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200">
              AUDIT & POS LEDGER
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Search, audit, refund, and reprint customer sales receipts, digital tax slips, and prescription billing records.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={onOpenQuickSale}
            className="flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>New Sale F2</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">GROSS DAILY VOLUME</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">Rs.{totalRevenue.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</h4>
            <p className="text-[11px] text-slate-500 mt-1">{invoices.length} Transactions recorded</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">AVERAGE ORDER (AOV)</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">
              Rs.{invoices.length > 0 ? (totalRevenue / invoices.length).toFixed(2) : '0.00'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">Average basket total</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">PRESCRIPTIONS BILLED</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">0 <span className="text-xs font-normal text-slate-500">Rx Slips</span></h4>
            <p className="text-[11px] text-slate-500 mt-1">Verified dispensary slips</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">RETURNS & RESTOCK</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-orange-600 font-mono">Rs.0.00</h4>
            <p className="text-[11px] text-slate-500 mt-1">0 Return incidents</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Ledger Table (Left 2 Cols) & Inspection Preview Receipt (Right 1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Invoice Ledger Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Invoice Ledger</h3>
            </div>

            <div className="overflow-x-auto min-h-[300px]">
              {invoices.length === 0 ? (
                <div className="text-center py-16 px-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">No Sales Invoices Generated Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Complete your first checkout in the Point of Sale (POS) terminal to record transactions here.
                  </p>
                  <button
                    onClick={onOpenQuickSale}
                    className="mt-2 bg-teal-800 hover:bg-teal-900 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Open POS Terminal F2</span>
                  </button>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="p-3.5 pl-4">INVOICE #</th>
                      <th className="p-3.5">TIME / DATE</th>
                      <th className="p-3.5">CUSTOMER PROFILE</th>
                      <th className="p-3.5">LINE ITEMS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {invoices.map((inv) => {
                      const isSelected = selectedInvoice?.id === inv.id;
                      return (
                        <tr 
                          key={inv.id}
                          onClick={() => setSelectedInvoice(inv)}
                          className={`hover:bg-teal-50/50 transition-colors cursor-pointer ${
                            isSelected ? 'bg-teal-50/80 font-semibold' : ''
                          }`}
                        >
                          <td className="p-3.5 pl-4 font-mono font-bold text-teal-800">{inv.invoiceNumber}</td>
                          <td className="p-3.5 text-slate-500">{inv.time} • {inv.date}</td>
                          <td className="p-3.5 font-bold text-slate-900">{inv.customerName}</td>
                          <td className="p-3.5">{inv.items.length} Items • Rs.{inv.totalAmount.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Inspection Preview Receipt */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 h-fit sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Inspection Preview</h3>
          </div>

          {!selectedInvoice ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select an invoice from the ledger to view receipt slip preview.
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 font-mono text-[11px] text-slate-800 space-y-3 shadow-inner">
              <div className="text-center space-y-0.5 pb-3 border-b border-dashed border-slate-300">
                <h4 className="font-extrabold text-sm tracking-widest text-slate-900">TALHA SURGICAL</h4>
                <p className="text-[10px] text-slate-600 font-sans font-semibold">& MEDICINE SHOP</p>
                <p className="text-[9px] text-slate-500">Invoice Ref: {selectedInvoice.invoiceNumber}</p>
              </div>

              <div className="flex justify-between items-center bg-teal-900 text-white p-2 rounded font-sans">
                <span className="text-xs font-bold">NET AMOUNT DUE:</span>
                <span className="text-base font-extrabold font-mono">Rs.{selectedInvoice.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
