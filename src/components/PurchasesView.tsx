import React, { useState } from 'react';
import { ShoppingBag, Plus, Search, Calendar, DollarSign, CheckCircle2, Clock, FileText, Truck, X } from 'lucide-react';
import { PurchaseOrder, Medicine, TabType } from '../types';

interface PurchasesViewProps {
  purchases: PurchaseOrder[];
  onAddPurchase: (po: Omit<PurchaseOrder, 'id'>) => Promise<void>;
  medicines: Medicine[];
  onOpenAddMedicine: () => void;
  setCurrentTab: (tab: TabType) => void;
}

export const PurchasesView: React.FC<PurchasesViewProps> = ({ 
  purchases, 
  onAddPurchase,
  medicines, 
  onOpenAddMedicine,
  setCurrentTab
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierName, setSupplierName] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [qtyReceived, setQtyReceived] = useState<number>(10);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<'PAID' | 'CREDIT_PENDING'>('PAID');

  const handleAddPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName || !medicineName || qtyReceived <= 0) return;

    const poNumber = `PO-${Math.floor(1000 + Math.random() * 9000)}`;

    await onAddPurchase({
      poNumber,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      supplierName,
      medicineName,
      qtyReceived,
      totalCost,
      paymentStatus
    });

    setIsModalOpen(false);
    setSupplierName('');
    setMedicineName('');
    setQtyReceived(10);
    setTotalCost(0);
  };

  const totalPurchaseMoney = purchases.reduce((sum, p) => sum + p.totalCost, 0);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto select-none font-sans">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Shop Purchase Orders & Goods Received</h2>
            <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200">
              SUPPLIER INVOICES
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Track stock arrivals, distributor bills, purchase date & time, and total invoice amounts.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Shop Purchase Bill</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setCurrentTab('inventory')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500 transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view all items in medicine catalog"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-teal-800">TOTAL PURCHASE INVOICES</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-100">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">{purchases.length} Orders</h4>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-slate-500">Logged shop bills</p>
              <span className="text-[10px] font-bold text-teal-700 group-hover:underline">Catalog →</span>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setCurrentTab('reports')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500 transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view financial audit reports"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-teal-800">TOTAL PURCHASE MONEY (BILLS)</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-100">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-teal-800 font-mono">Rs. {totalPurchaseMoney.toLocaleString('en-PK')}</h4>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-slate-500">Supplier bill total</p>
              <span className="text-[10px] font-bold text-teal-700 group-hover:underline">Audit →</span>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setCurrentTab('suppliers')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view supplier directory"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-emerald-800">SUPPLIER BILL STATUS</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-emerald-700 font-mono">VERIFIED</h4>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-slate-500">Audited with inventory stock</p>
              <span className="text-[10px] font-bold text-emerald-700 group-hover:underline">Suppliers →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Purchase Bills History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-3.5 pl-4">PO / BILL #</th>
                <th className="p-3.5">DATE & TIME</th>
                <th className="p-3.5">SUPPLIER DISTRIBUTOR</th>
                <th className="p-3.5">MEDICINE BATCH ITEM</th>
                <th className="p-3.5">QTY RECEIVED</th>
                <th className="p-3.5 font-mono">BILL AMOUNT (RS)</th>
                <th className="p-3.5">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {purchases.map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-3.5 pl-4 font-mono font-bold text-teal-800">{p.poNumber}</td>
                  <td className="p-3.5 text-slate-500">{p.date} • {p.time}</td>
                  <td className="p-3.5 font-bold text-slate-900">{p.supplierName}</td>
                  <td className="p-3.5 text-slate-800">{p.medicineName}</td>
                  <td className="p-3.5 font-mono font-bold text-slate-900">{p.qtyReceived} Units</td>
                  <td className="p-3.5 font-mono font-extrabold text-teal-800">Rs. {p.totalCost.toLocaleString('en-PK')}</td>
                  <td className="p-3.5">
                    <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold text-[10px] border border-emerald-200">
                      {p.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Purchase Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-4 bg-teal-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Record New Shop Purchase Bill</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-teal-200 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddPurchase} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Supplier / Distributor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GlaxoSmithKline / Getz Pharma"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Medicine Name / Batch *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Panadol Extra 500mg"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-teal-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantity Received</label>
                  <input
                    type="number"
                    min="1"
                    value={qtyReceived}
                    onChange={(e) => setQtyReceived(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:outline-none focus:border-teal-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Bill Amount (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    value={totalCost || ''}
                    onChange={(e) => setTotalCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:outline-none focus:border-teal-700"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-800 text-white font-bold hover:bg-teal-900 shadow-sm"
                >
                  Save Purchase Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
