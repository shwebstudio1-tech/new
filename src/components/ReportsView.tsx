import React from 'react';
import { BarChart3, TrendingUp, DollarSign, CreditCard, BookOpen, MessageSquare, ShieldCheck, Printer } from 'lucide-react';
import { Invoice, Customer, Medicine, TabType } from '../types';

interface ReportsViewProps {
  invoices: Invoice[];
  customers: Customer[];
  medicines: Medicine[];
  setCurrentTab: (tab: TabType) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ invoices, customers, medicines, setCurrentTab }) => {
  const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const todaysInvoices = invoices.filter(i => i.date === todayStr);

  const totalBillsToday = todaysInvoices.length;
  const totalRevenueToday = todaysInvoices.reduce((s, i) => s + i.totalAmount, 0);

  const cashSalesToday = todaysInvoices.filter(i => i.paymentMethod === 'CASH').reduce((s, i) => s + i.totalAmount, 0);
  const cardSalesToday = todaysInvoices.filter(i => i.paymentMethod === 'VISA CARD' || i.paymentMethod === 'MOBILE PAY').reduce((s, i) => s + i.totalAmount, 0);

  const totalUdharRemaining = customers.reduce((s, c) => s + Math.max(0, c.totalDebt), 0);
  const debtorsList = customers.filter(c => c.totalDebt > 0);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto select-none font-sans">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Executive Financial Analytics & Audit Reports</h2>
            <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200">
              DRAP COMPLIANT AUDIT
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive daily revenue totals, cash vs online breakdown, pending customer Udhar remaining, and automated WhatsApp reminders.</p>
        </div>

        <button 
          onClick={() => window.print()}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-black text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Financial Audit Summary</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setCurrentTab('sales')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500 transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view all sales invoices"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-teal-800">TODAY'S TOTAL BILLS</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-100">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-extrabold text-slate-900 font-mono">{totalBillsToday} Bills</h4>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-slate-500">Today's Total Price: Rs. {totalRevenueToday.toLocaleString('en-PK')}</p>
              <span className="text-[10px] font-bold text-teal-700 group-hover:underline">View Sales →</span>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setCurrentTab('sales')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view cash sales ledger"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-emerald-800">CASH COLLECTED TODAY</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-extrabold text-emerald-700 font-mono">Rs. {cashSalesToday.toLocaleString('en-PK')}</h4>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-slate-500">Physical drawer cash</p>
              <span className="text-[10px] font-bold text-emerald-700 group-hover:underline">Audit Cash →</span>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setCurrentTab('sales')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500 transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view digital payments ledger"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-teal-800">ONLINE / CARD PAYMENTS</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-100">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-extrabold text-teal-800 font-mono">Rs. {cardSalesToday.toLocaleString('en-PK')}</h4>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-slate-500">Bank card / POS terminal</p>
              <span className="text-[10px] font-bold text-teal-700 group-hover:underline">View Bank →</span>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setCurrentTab('customers')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-500 transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view pending Udhar receivables"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-orange-700">TOTAL REMAINING (UDHAR)</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-100">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-extrabold text-orange-600 font-mono">Rs. {totalUdharRemaining.toLocaleString('en-PK')}</h4>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-slate-500">{debtorsList.length} Debtors pending cash</p>
              <span className="text-[10px] font-bold text-orange-700 group-hover:underline">View Khata →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Udhar Customer Reminders Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Pending Customer Udhar Balances & WhatsApp Reminders</h3>
            <p className="text-xs text-slate-500">Send instant automated WhatsApp payment reminder messages to customers.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {debtorsList.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              All customer Khata accounts are clear! No pending Udhar cash remaining.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-3.5 pl-4">CUSTOMER NAME</th>
                  <th className="p-3.5">PHONE NUMBER</th>
                  <th className="p-3.5">LAST ACTIVITY</th>
                  <th className="p-3.5 font-mono">REMAINING UDHAR BALANCE</th>
                  <th className="p-3.5 text-right pr-4">WHATSAPP REMINDER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {debtorsList.map(cust => (
                  <tr key={cust.id} className="hover:bg-slate-50">
                    <td className="p-3.5 pl-4 font-bold text-slate-900">{cust.name}</td>
                    <td className="p-3.5 font-mono text-slate-600">{cust.phone}</td>
                    <td className="p-3.5 text-slate-500">{cust.lastTransactionDate || 'Recent'}</td>
                    <td className="p-3.5 font-mono font-extrabold text-red-600">Rs. {cust.totalDebt.toFixed(2)}</td>
                    <td className="p-3.5 text-right pr-4">
                      <a
                        href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalam-o-Alaikum ${cust.name}, Talha Surgical & Medicine Shop say aap ka total pending balance Rs. ${cust.totalDebt.toFixed(2)} hai. Baraye karam jald az jald payment clear farmae. Shukriya!`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send WhatsApp Reminder</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
