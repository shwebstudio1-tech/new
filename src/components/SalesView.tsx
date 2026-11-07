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
  onPrintInvoice: (inv: Invoice) => void;
}

export const SalesView: React.FC<SalesViewProps> = ({ invoices, onOpenQuickSale, onPrintInvoice }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(invoices[0] || null);
  const [activeTab, setActiveTab] = useState<'ledger' | 'audit'>('ledger');
  const [selectedAuditDate, setSelectedAuditDate] = useState<string>('today');

  useEffect(() => {
    if (invoices.length > 0 && (!selectedInvoice || !invoices.some(i => i.id === selectedInvoice.id))) {
      setSelectedInvoice(invoices[0]);
    } else if (invoices.length === 0) {
      setSelectedInvoice(null);
    }
  }, [invoices]);

  const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const todaysInvoices = invoices.filter(inv => inv.date === todayStr);
  const totalRevenueToday = todaysInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const cashSalesToday = todaysInvoices.filter(i => i.paymentMethod === 'CASH').reduce((sum, i) => sum + i.totalAmount, 0);
  const creditSalesToday = todaysInvoices.filter(i => i.paymentMethod === 'CREDIT / A/R').reduce((sum, i) => sum + i.totalAmount, 0);
  const totalRevenueAllTime = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  // Group invoices by date for audit log history
  const auditDatesMap = invoices.reduce((acc, inv) => {
    acc[inv.date] = acc[inv.date] || [];
    acc[inv.date].push(inv);
    return acc;
  }, {} as Record<string, Invoice[]>);

  const auditDatesList = Object.keys(auditDatesMap);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto select-none font-sans">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Sales, Invoices & Daily Audit Register</h2>
            <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200">
              AUDIT & POS LEDGER
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Audit daily register sales, view previous audit logs, and reprint customer sales receipts.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub Tab Switcher: Ledger vs Daily Audit */}
          <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'ledger' ? 'bg-teal-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Invoice Ledger
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'audit' ? 'bg-teal-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily Audit Log
            </button>
          </div>

          <button 
            onClick={onOpenQuickSale}
            className="flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>New Sale F2</span>
          </button>
        </div>
      </div>

      {activeTab === 'ledger' ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">TODAY'S VOLUME</span>
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-slate-900 font-mono">Rs.{totalRevenueToday.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</h4>
                <p className="text-[11px] text-slate-500 mt-1">{todaysInvoices.length} Bills today</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">ALL-TIME REVENUE</span>
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-slate-900 font-mono">Rs.{totalRevenueAllTime.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</h4>
                <p className="text-[11px] text-slate-500 mt-1">{invoices.length} Total records</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">CASH COLLECTED TODAY</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-emerald-700 font-mono">Rs.{cashSalesToday.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</h4>
                <p className="text-[11px] text-slate-500 mt-1">In drawer</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">TODAY'S UDHAR CREDIT</span>
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-orange-600 font-mono">Rs.{creditSalesToday.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</h4>
                <p className="text-[11px] text-slate-500 mt-1">Pending customer payment</p>
              </div>
            </div>
          </div>

          {/* Main Grid: Ledger Table & Inspection Preview Receipt */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Invoice Ledger Table */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Interactive Sales Invoice Ledger</h3>
                  <span className="text-xs text-slate-500 font-medium">Click any row to view & reprint</span>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                  {invoices.length === 0 ? (
                    <div className="text-center py-16 px-4 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
                        <Receipt className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">No Sales Invoices Generated Yet</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Complete your first checkout in POS terminal to inspect transaction history here.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                          <th className="p-3.5 pl-4">INVOICE #</th>
                          <th className="p-3.5">DATE & TIME</th>
                          <th className="p-3.5">CUSTOMER</th>
                          <th className="p-3.5">TOTAL BILL</th>
                          <th className="p-3.5 text-right pr-4">ACTION</th>
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
                                isSelected ? 'bg-teal-50/90 font-semibold' : ''
                              }`}
                            >
                              <td className="p-3.5 pl-4 font-mono font-bold text-teal-800">{inv.invoiceNumber}</td>
                              <td className="p-3.5 text-slate-500">{inv.time} • {inv.date}</td>
                              <td className="p-3.5 font-bold text-slate-900">{inv.customerName}</td>
                              <td className="p-3.5 font-mono font-extrabold text-slate-900">Rs.{inv.totalAmount.toFixed(2)}</td>
                              <td className="p-3.5 pr-4 text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedInvoice(inv);
                                    onPrintInvoice(inv);
                                  }}
                                  className="inline-flex items-center gap-1 bg-teal-800 hover:bg-teal-900 text-white px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer"
                                >
                                  <Printer className="w-3 h-3" />
                                  <span>Print</span>
                                </button>
                              </td>
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
                <h3 className="text-sm font-bold text-slate-900">Receipt Slip Inspection</h3>
                {selectedInvoice && (
                  <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                    {selectedInvoice.invoiceNumber}
                  </span>
                )}
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
                    <p className="text-[9px] text-slate-500">Date: {selectedInvoice.date} {selectedInvoice.time}</p>
                    <p className="text-[9px] text-slate-500">Customer: {selectedInvoice.customerName}</p>
                  </div>

                  <div className="space-y-1.5 text-[10px]">
                    <p className="font-bold font-sans text-slate-700">DISPENSED ITEMS ({selectedInvoice.items.length}):</p>
                    {selectedInvoice.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-slate-200/60 pb-1">
                        <span>{item.name} × {item.qty}</span>
                        <span className="font-bold">Rs.{(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center bg-teal-900 text-white p-2.5 rounded font-sans">
                    <span className="text-xs font-bold">TOTAL AMOUNT:</span>
                    <span className="text-lg font-extrabold font-mono">Rs.{selectedInvoice.totalAmount.toFixed(2)}</span>
                  </div>

                  <button 
                    onClick={() => onPrintInvoice(selectedInvoice)}
                    className="w-full flex items-center justify-center gap-2 bg-teal-800 hover:bg-teal-900 text-white py-3 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>PRINT THERMAL RECEIPT</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* DAILY AUDIT & PREVIOUS AUDIT TAB */
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">Daily Sales Audit & Shift Reconciliation</h3>
              <p className="text-xs text-slate-500">Audit today's performance vs historical register audit records.</p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-700">Select Audit Date:</span>
              <select
                value={selectedAuditDate}
                onChange={(e) => setSelectedAuditDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none"
              >
                <option value="today">Today ({todayStr})</option>
                {auditDatesList.filter(d => d !== todayStr).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Audit Metrics Breakdown */}
          {(() => {
            const targetDate = selectedAuditDate === 'today' ? todayStr : selectedAuditDate;
            const targetInvoices = invoices.filter(inv => inv.date === targetDate);
            const totalRev = targetInvoices.reduce((s, i) => s + i.totalAmount, 0);
            const cashRev = targetInvoices.filter(i => i.paymentMethod === 'CASH').reduce((s, i) => s + i.totalAmount, 0);
            const creditRev = targetInvoices.filter(i => i.paymentMethod === 'CREDIT / A/R').reduce((s, i) => s + i.totalAmount, 0);

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">AUDIT DATE</span>
                    <h4 className="text-lg font-extrabold text-slate-900 mt-1">{targetDate}</h4>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">TOTAL AUDITED SALES</span>
                    <h4 className="text-lg font-extrabold text-teal-800 font-mono mt-1">Rs. {totalRev.toFixed(2)}</h4>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">CASH COLLECTED</span>
                    <h4 className="text-lg font-extrabold text-emerald-700 font-mono mt-1">Rs. {cashRev.toFixed(2)}</h4>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">CREDIT (UDHAR)</span>
                    <h4 className="text-lg font-extrabold text-orange-600 font-mono mt-1">Rs. {creditRev.toFixed(2)}</h4>
                  </div>
                </div>

                {/* Audit Bills List */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="p-3 bg-slate-100 font-bold text-xs text-slate-700">
                    Audit Breakdown of Bills for {targetDate} ({targetInvoices.length} Bills)
                  </div>
                  {targetInvoices.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">No invoices logged for this audit date.</div>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                          <th className="p-3">INVOICE #</th>
                          <th className="p-3">TIME</th>
                          <th className="p-3">PATIENT</th>
                          <th className="p-3">PAYMENT MODE</th>
                          <th className="p-3 text-right">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {targetInvoices.map(inv => (
                          <tr key={inv.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-teal-800">{inv.invoiceNumber}</td>
                            <td className="p-3 text-slate-500">{inv.time}</td>
                            <td className="p-3 font-bold text-slate-900">{inv.customerName}</td>
                            <td className="p-3">{inv.paymentMethod}</td>
                            <td className="p-3 text-right font-mono font-bold">Rs. {inv.totalAmount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
