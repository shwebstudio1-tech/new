import React from 'react';
import { BarChart3, TrendingUp, DollarSign, CreditCard, BookOpen, MessageSquare, ShieldCheck, Printer, RefreshCw, X, CheckCircle2, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Invoice, Customer, Medicine, TabType } from '../types';

interface ReportsViewProps {
  invoices: Invoice[];
  customers: Customer[];
  medicines: Medicine[];
  setCurrentTab: (tab: TabType) => void;
  setToast?: (toast: { type: 'success' | 'error' | 'info'; message: string } | null) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ invoices, customers, medicines, setCurrentTab, setToast }) => {
  const [isPrinting, setIsPrinting] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);

  const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const todaysInvoices = invoices.filter(i => i.date === todayStr);

  const totalBillsToday = todaysInvoices.length;
  const totalRevenueToday = todaysInvoices.reduce((s, i) => s + i.totalAmount, 0);

  const cashSalesToday = todaysInvoices.filter(i => i.paymentMethod === 'CASH').reduce((s, i) => s + i.totalAmount, 0);
  const cardSalesToday = todaysInvoices.filter(i => i.paymentMethod === 'VISA CARD' || i.paymentMethod === 'MOBILE PAY').reduce((s, i) => s + i.totalAmount, 0);

  const totalUdharRemaining = customers.reduce((s, c) => s + Math.max(0, c.totalDebt), 0);
  const debtorsList = customers.filter(c => c.totalDebt > 0);

  const handleOpenPreview = () => {
    setShowPreview(true);
    if (setToast) {
      setToast({ 
        type: 'info', 
        message: 'Report Preview opened! Printing will start automatically in 2 seconds.' 
      });
    }
  };

  const handleManualPrint = () => {
    if (isPrinting) return;
    setIsPrinting(true);
    
    if (setToast) {
      setToast({ 
        type: 'info', 
        message: 'Printing report... Agar print na hu tu check krain printer connect hai ya nahi.' 
      });
    }

    window.print();
    
    setTimeout(() => {
      setIsPrinting(false);
    }, 3000);
  };

  const handleSaveAsPdf = async () => {
    const element = document.getElementById('printable-report-content');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        // Fix for stylesheets containing 'oklch'
        const styleTags = clonedDoc.querySelectorAll('style');
        styleTags.forEach(tag => {
          tag.innerHTML = tag.innerHTML.replace(/oklch\([^)]+\)/g, 'black');
        });

        // Fix for inline styles
        const originalElements = document.querySelectorAll('*');
        const clonedElements = clonedDoc.querySelectorAll('*');
        
        for (let i = 0; i < Math.min(originalElements.length, clonedElements.length); i++) {
          const original = originalElements[i] as HTMLElement;
          const cloned = clonedElements[i] as HTMLElement;
          
          const computedStyle = window.getComputedStyle(original);
          const colorProps = ['color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'fill', 'stroke'];
          
          colorProps.forEach(prop => {
            const val = computedStyle.getPropertyValue(prop);
            if (val && val.includes('oklch')) {
              // Force fallback
              cloned.style.setProperty(prop, prop === 'backgroundColor' ? 'transparent' : 'black');
            } else {
              cloned.style.setProperty(prop, val);
            }
          });
        }
      }
    });
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`AuditReport_${todayStr}.pdf`);
  };

  // Auto-print effect when preview opens
  React.useEffect(() => {
    if (showPreview) {
      const timer = setTimeout(() => {
        window.print();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showPreview]);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto select-none font-sans">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
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
          onClick={handleOpenPreview}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-black text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Financial Audit Summary</span>
        </button>
      </div>

      <div className="space-y-6 print:hidden">
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
              <p className="text-xs text-slate-500 mt-0.5">Send instant automated WhatsApp payment reminder messages to customers.</p>
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

      {/* Report Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-start overflow-y-auto p-4 sm:p-6 print:!block print:!static print:!bg-white print:!overflow-visible">
          {/* Action Header Bar (Screen Only) */}
          <div className="w-full max-w-4xl mb-4 bg-slate-900 text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700/80 flex items-center justify-between gap-2 print:hidden animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wide">Audit Report Print Preview</h3>
                <p className="text-[10px] font-mono text-teal-400">DAILY FINANCIAL SUMMARY</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSaveAsPdf}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                title="Save report as PDF file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save as PDF</span>
              </button>
              <button
                type="button"
                onClick={handleManualPrint}
                disabled={isPrinting}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95 ${
                  isPrinting 
                    ? 'bg-slate-700 text-teal-400 cursor-not-allowed opacity-80' 
                    : 'bg-teal-600 hover:bg-teal-500 text-white'
                }`}
              >
                {isPrinting ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 animate-pulse" />
                    <span>Printing...</span>
                  </>
                ) : (
                  <>
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Now</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div 
            id="printable-report-content" 
            className="w-full max-w-4xl bg-white p-12 border border-slate-300 shadow-2xl min-h-[11in] font-serif text-slate-900"
          >
            {/* Report Header */}
            <div className="text-center border-b-2 border-teal-800 pb-6 mb-8">
              <div className="text-4xl text-teal-800 mb-2 font-sans font-black">✚</div>
              <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 font-sans">
                Talha Surgical & Medicine Shop
              </h1>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1 font-sans">
                Financial Audit Report Summary
              </p>
              <div className="flex justify-center gap-6 mt-4 text-[11px] font-bold text-slate-600 font-sans uppercase">
                <span>Date: {todayStr}</span>
                <span>Type: Daily Sales Audit</span>
                <span>Status: DRAP Compliant</span>
              </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="border-l-4 border-teal-700 pl-4 py-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase font-sans">Total Daily Revenue</p>
                <p className="text-3xl font-black text-teal-800 font-mono">Rs. {totalRevenueToday.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-slate-500 mt-1 italic">Total volume across {totalBillsToday} generated invoices.</p>
              </div>
              <div className="border-l-4 border-emerald-600 pl-4 py-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase font-sans">Physical Cash Collected</p>
                <p className="text-3xl font-black text-emerald-700 font-mono">Rs. {cashSalesToday.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-slate-500 mt-1 italic">Actual cash in drawer from retail sales.</p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4 py-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase font-sans">Card / Online Payments</p>
                <p className="text-3xl font-black text-blue-800 font-mono">Rs. {cardSalesToday.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-slate-500 mt-1 italic">Digital transactions processed via POS.</p>
              </div>
              <div className="border-l-4 border-orange-600 pl-4 py-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase font-sans">Total Udhar Remaining</p>
                <p className="text-3xl font-black text-orange-700 font-mono">Rs. {totalUdharRemaining.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-slate-500 mt-1 italic">Receivables from {debtorsList.length} linked Khata accounts.</p>
              </div>
            </div>

            {/* Detailed Ledger Summary */}
            <div className="mb-10">
              <h3 className="text-sm font-black uppercase text-teal-900 border-b border-teal-100 mb-4 pb-1 font-sans">
                Audit Log: Invoice Details
              </h3>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-black font-sans uppercase">
                    <th className="py-2 border-b border-slate-300">Invoice #</th>
                    <th className="py-2 border-b border-slate-300">Time</th>
                    <th className="py-2 border-b border-slate-300">Customer</th>
                    <th className="py-2 border-b border-slate-300">Method</th>
                    <th className="py-2 border-b border-slate-300 text-right">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {todaysInvoices.length > 0 ? todaysInvoices.map(inv => (
                    <tr key={inv.id}>
                      <td className="py-2 font-mono font-bold text-teal-800">{inv.invoiceNumber}</td>
                      <td className="py-2 text-slate-500">{inv.time}</td>
                      <td className="py-2 font-bold">{inv.customerName}</td>
                      <td className="py-2 text-[10px] font-bold">{inv.paymentMethod}</td>
                      <td className="py-2 text-right font-mono font-black">Rs. {inv.totalAmount.toFixed(2)}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 italic">No transactions recorded for this period.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer / Certification */}
            <div className="mt-auto pt-8 border-t border-slate-200 grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="h-10 border-b border-slate-400 mb-2"></div>
                <p className="text-[10px] font-bold text-slate-500 uppercase font-sans">Pharmacist Signature</p>
              </div>
              <div className="text-center">
                <div className="h-10 border-b border-slate-400 mb-2"></div>
                <p className="text-[10px] font-bold text-slate-500 uppercase font-sans">Verified By (Manager)</p>
              </div>
              <div className="text-center">
                <div className="h-10 border-b border-slate-400 mb-2"></div>
                <p className="text-[10px] font-bold text-slate-500 uppercase font-sans">Stamp / Date</p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-[10px] text-slate-400 italic font-sans">
                Computer Generated Audit Document - Talha Surgical & Medicine ERP System
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
