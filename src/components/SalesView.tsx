import React, { useState } from 'react';
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
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>(invoices[0]);
  const [triageTab, setTriageTab] = useState<'today' | 'rx' | 'returns' | 'hospital' | 'high'>('today');

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
          {/* Time filters */}
          <div className="bg-slate-100 p-1 rounded-lg flex items-center text-xs font-medium">
            <button className="px-3 py-1.5 bg-white text-slate-900 font-bold rounded-md shadow-sm">Today</button>
            <button className="px-3 py-1.5 text-slate-600 hover:text-slate-900">Yesterday</button>
            <button className="px-3 py-1.5 text-slate-600 hover:text-slate-900">Last 7 Days</button>
            <button className="px-3 py-1.5 text-slate-600 hover:text-slate-900">This Month</button>
            <button className="px-3 py-1.5 text-slate-600 hover:text-slate-900">Custom 📅</button>
          </div>

          <button className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer">
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export</span>
          </button>
          <button className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer">
            <FileText className="w-3.5 h-3.5 text-teal-700" />
            <span>Daily Z-Report</span>
          </button>
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
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">$4,892.40 <span className="text-xs font-normal text-emerald-600 font-semibold">+14.2%</span></h4>
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-100">
              <span>148 Trx Total</span>
              <span className="font-semibold text-teal-700">98.6% Settled</span>
            </div>
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
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">$33.05</h4>
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-100">
              <span>Basket Intensity: 3.4 Items / Slip</span>
              <span>Avg Customer Cycle: 8.2 mins</span>
            </div>
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
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">34 <span className="text-xs font-normal text-slate-500">Rx Slips</span></h4>
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-100">
              <span>Doctor Verification: 100% Validated</span>
              <span className="text-red-600 font-semibold">2 Audit Logs</span>
            </div>
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
            <h4 className="text-xl font-extrabold text-orange-600 font-mono">$42.50</h4>
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-100">
              <span>Return Incidents: 2 Transactions</span>
              <span className="text-emerald-600 font-semibold">0.8% Loss</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Invoice # (#INV-98421), Customer, Doctor..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-700"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700">
              <option>Paid / Completed</option>
              <option>Pending</option>
              <option>Refunded</option>
            </select>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700">
              <option>All Methods (Cash, Card, Mobile)</option>
              <option>Cash</option>
              <option>Visa Card</option>
              <option>Mobile Pay</option>
            </select>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700">
              <option>Dr. Sarah Khan (Pharm.D)</option>
              <option>M. Bilal</option>
            </select>
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg">
              <RefreshCw className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Triage Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs overflow-x-auto pb-1">
          <span className="font-bold text-slate-400 text-[10px] uppercase">TRIAGE:</span>
          <button 
            onClick={() => setTriageTab('today')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${triageTab === 'today' ? 'bg-teal-800 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Today's Slips (148)
          </button>
          <button 
            onClick={() => setTriageTab('rx')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${triageTab === 'rx' ? 'bg-teal-800 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Rx Controlled Drugs (6)
          </button>
          <button 
            onClick={() => setTriageTab('returns')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${triageTab === 'returns' ? 'bg-teal-800 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Returns / Claims (2)
          </button>
          <button 
            onClick={() => setTriageTab('hospital')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${triageTab === 'hospital' ? 'bg-teal-800 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Hospital / Credit A/R (11)
          </button>
          <button 
            onClick={() => setTriageTab('high')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${triageTab === 'high' ? 'bg-teal-800 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            High Value (&gt;$100)
          </button>
        </div>
      </div>

      {/* Main Grid: Ledger Table (Left 2 Cols) & Inspection Preview Receipt (Right 1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Invoice Ledger Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Invoice Ledger</h3>
                <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  Live Real-time Sync
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3.5 pl-4">INVOICE #</th>
                    <th className="p-3.5">TIME / DATE</th>
                    <th className="p-3.5">CUSTOMER PROFILE</th>
                    <th className="p-3.5">PRESCRIBER / REG</th>
                    <th className="p-3.5">LINE ITEMS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {invoices.map((inv) => {
                    const isSelected = selectedInvoice.id === inv.id;
                    return (
                      <tr 
                        key={inv.id}
                        onClick={() => setSelectedInvoice(inv)}
                        className={`hover:bg-teal-50/50 transition-colors cursor-pointer ${
                          isSelected ? 'bg-teal-50/80 font-semibold' : ''
                        }`}
                      >
                        <td className="p-3.5 pl-4 font-mono font-bold text-teal-800">{inv.invoiceNumber}</td>
                        <td className="p-3.5 text-slate-500">
                          <div>{inv.time}</div>
                          <div className="text-[10px] text-slate-400">{inv.date}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{inv.customerName}</div>
                          <div className="text-[10px] text-slate-500">{inv.customerType}</div>
                        </td>
                        <td className="p-3.5 text-slate-600">{inv.doctor}</td>
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-800">{inv.items.length} Skus • {inv.totalAmount.toFixed(2)} USD</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                            {inv.items.map(i => i.name).join(', ')}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Showing 1 - 7 of 148 invoices</span>
            <div className="flex items-center gap-2">
              <span>Rows:</span>
              <select className="bg-white border border-slate-200 rounded px-2 py-1 text-xs">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <div className="flex items-center gap-1 ml-4 font-bold">
                <button className="px-2 py-1 rounded bg-teal-800 text-white">1</button>
                <button className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700">2</button>
                <button className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700">3</button>
                <span>...</span>
                <button className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700">15</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Inspection Preview Receipt */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 h-fit sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Inspection Preview</h3>
              <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200">
                {selectedInvoice.invoiceNumber}
              </span>
            </div>
          </div>

          {/* Thermal Slip Simulator Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 font-mono text-[11px] text-slate-800 space-y-3 shadow-inner">
            <div className="text-center space-y-0.5 pb-3 border-b border-dashed border-slate-300">
              <h4 className="font-extrabold text-sm tracking-widest text-slate-900">TALHA SURGICAL</h4>
              <p className="text-[10px] text-slate-600 font-sans font-semibold">& MEDICINE SHOP</p>
              <p className="text-[9px] text-slate-500 pt-1">Govt Drug License # 284-DL/LHR • NTN: 9481203-1 Main Medical Center Plaza, Jail Road, Lahore</p>
              <p className="text-[9px] text-slate-500">Dispenser Helplines: +92 42 35889100 / 0300-8491200</p>
            </div>

            <div className="space-y-1 text-[10px] pb-3 border-b border-dashed border-slate-300 font-sans">
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice Ref:</span>
                <span className="font-bold text-slate-900 font-mono">{selectedInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-semibold text-slate-800">24-Oct-2024 • {selectedInvoice.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dispensing Pharmacist:</span>
                <span className="font-semibold text-slate-800">{selectedInvoice.cashier} (Pharm.D)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-semibold text-slate-800">{selectedInvoice.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Prescribing Physician:</span>
                <span className="font-semibold text-slate-800">{selectedInvoice.doctor}</span>
              </div>
            </div>

            {/* Line items table */}
            <div className="space-y-2 pb-3 border-b border-dashed border-slate-300 text-[10px]">
              <div className="grid grid-cols-12 text-slate-400 font-bold uppercase text-[9px]">
                <div className="col-span-7">ITEM / STRENGTH / BATCH</div>
                <div className="col-span-2 text-center">QTY</div>
                <div className="col-span-3 text-right">AMOUNT</div>
              </div>
              {selectedInvoice.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 font-sans">
                  <div className="col-span-7 font-bold text-slate-900 truncate">{item.name}</div>
                  <div className="col-span-2 text-center text-slate-600">{item.qty} x ${item.price.toFixed(2)}</div>
                  <div className="col-span-3 text-right font-mono font-bold text-slate-900">${(item.qty * item.price).toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-1 text-[10px] pb-3 border-b border-dashed border-slate-300 font-sans">
              <div className="flex justify-between text-slate-600">
                <span>Gross Subtotal ({selectedInvoice.items.length} items):</span>
                <span className="font-mono font-bold">${selectedInvoice.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Pharmacy Privilege Discount:</span>
                <span className="font-mono font-bold">-$0.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Sales Tax / GST (Essential Exemption):</span>
                <span className="font-mono font-bold">$0.00</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-teal-900 text-white p-2 rounded font-sans">
              <span className="text-xs font-bold">NET AMOUNT DUE:</span>
              <span className="text-base font-extrabold font-mono">${selectedInvoice.totalAmount.toFixed(2)}</span>
            </div>

            <div className="space-y-0.5 text-[10px] font-sans">
              <div className="flex justify-between">
                <span className="text-slate-500">Tender Mode:</span>
                <span className="font-bold text-slate-800">{selectedInvoice.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Tendered:</span>
                <span className="font-mono font-bold text-slate-800">${(selectedInvoice.amountTendered || selectedInvoice.totalAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Change Returned:</span>
                <span className="font-mono font-bold text-emerald-700">${(selectedInvoice.changeReturned || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Barcode graphic */}
            <div className="pt-2 text-center space-y-1">
              <div className="font-mono font-extrabold tracking-tighter text-slate-900 text-sm">
                |||||| | ||||||| |||| |||||
              </div>
              <p className="text-[9px] text-slate-400 font-mono">*{selectedInvoice.invoiceNumber}-20241024*</p>
            </div>

            <div className="bg-teal-50 border border-teal-200 p-2 rounded text-[9px] text-teal-900 font-sans text-center">
              ✅ FBR Digital Invoicing Pos ID: <span className="font-bold">PK-LHR-9941</span>
            </div>

            <p className="text-[8px] text-slate-400 text-center font-sans leading-tight">
              Medicines once sold are non-refundable after 3 days without original intact receipt and uncompromised cold-chain seals. Store medicines below 25°C in dry place.
            </p>
          </div>

          {/* Inspection action buttons */}
          <div className="space-y-2">
            <button className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-2.5 rounded-lg text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Printer className="w-4 h-4" />
              <span>Print Thermal Slip (80mm)</span>
              <span className="bg-teal-950 px-1.5 py-0.5 rounded text-[10px] font-mono">Ctrl+P</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-700" />
                <span>A4 Clinical PDF</span>
              </button>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-teal-700" />
                <span>WhatsApp / SMS</span>
              </button>
            </div>
            <button className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-2 rounded-lg text-xs transition-colors border border-red-200">
              Process Return / Restock for {selectedInvoice.invoiceNumber}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
