import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  Phone, 
  FileText, 
  Printer, 
  UserCheck, 
  AlertTriangle,
  CreditCard,
  History,
  CheckCircle2,
  Calendar,
  X,
  BookOpen,
  UserPlus,
  TrendingUp,
  Receipt,
  ShieldCheck
} from 'lucide-react';
import { Customer, KhataTransaction } from '../types';

interface CustomersKhataViewProps {
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, 'id' | 'transactions' | 'totalDebt'> & { initialDebt?: number }) => Promise<void>;
  onAddKhataTransaction: (customerId: string, transaction: Omit<KhataTransaction, 'id' | 'remainingBalance'>) => Promise<void>;
}

export const CustomersKhataView: React.FC<CustomersKhataViewProps> = ({ 
  customers, 
  onAddCustomer,
  onAddKhataTransaction
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'WITH_DEBT' | 'CLEAR'>('ALL');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(customers[0]?.id || null);

  // Modals
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isAddTxnModalOpen, setIsAddTxnModalOpen] = useState(false);
  const [txnModalType, setTxnModalType] = useState<'CREDIT_PURCHASE' | 'PAYMENT_RECEIVED'>('CREDIT_PURCHASE');

  // New Customer Form
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustCnic, setNewCustCnic] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustLimit, setNewCustLimit] = useState<number>(20000);
  const [newCustInitialDebt, setNewCustInitialDebt] = useState<number>(0);

  // Transaction Form
  const [txnAmount, setTxnAmount] = useState<number>(0);
  const [txnDescription, setTxnDescription] = useState('');
  const [txnInvoiceRef, setTxnInvoiceRef] = useState('');

  // Selected customer object
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0] || null;

  // Filtered customer list
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.cnic && c.cnic.includes(searchTerm));
    
    if (filterType === 'WITH_DEBT') return matchesSearch && c.totalDebt > 0;
    if (filterType === 'CLEAR') return matchesSearch && c.totalDebt <= 0;
    return matchesSearch;
  });

  const totalOutstandingDebt = customers.reduce((sum, c) => sum + Math.max(0, c.totalDebt), 0);
  const debtorsCount = customers.filter(c => c.totalDebt > 0).length;

  const handleCreateCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) return;

    await onAddCustomer({
      name: newCustName,
      phone: newCustPhone,
      cnic: newCustCnic,
      address: newCustAddress,
      creditLimit: newCustLimit || 20000,
      initialDebt: newCustInitialDebt || 0
    });

    setNewCustName('');
    setNewCustPhone('');
    setNewCustCnic('');
    setNewCustAddress('');
    setNewCustInitialDebt(0);
    setIsNewCustomerModalOpen(false);
  };

  const handleAddTxnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || txnAmount <= 0) return;

    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    await onAddKhataTransaction(selectedCustomer.id, {
      date: todayStr,
      time: timeStr,
      type: txnModalType,
      description: txnDescription || (txnModalType === 'CREDIT_PURCHASE' ? 'Medicine Purchase on Credit' : 'Cash Received / Khata Payment'),
      amount: Number(txnAmount),
      invoiceNumber: txnInvoiceRef || undefined
    });

    setTxnAmount(0);
    setTxnDescription('');
    setTxnInvoiceRef('');
    setIsAddTxnModalOpen(false);
  };

  const handlePrintStatement = () => {
    if (!selectedCustomer) return;
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Page Header */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-700" />
              <span>Patient Khata & Credit Ledger (Udhar Register)</span>
            </h2>
            <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-teal-200 shrink-0">
              AR LEDGER
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Manage patient credit accounts, record medicine credit purchases (Udhar), and track repayments.</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsNewCustomerModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-teal-800 hover:bg-teal-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Khata Account</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">TOTAL OUTSTANDING UDHAR</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-extrabold text-red-600 font-mono">
              Rs. {totalOutstandingDebt.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">Total pending patient receivables</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">ACTIVE KHATA CUSTOMERS</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-extrabold text-slate-900 font-mono">{customers.length} Accounts</h4>
            <p className="text-[11px] text-teal-700 font-medium mt-1">{debtorsCount} with active balance</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">CLEAR ACCOUNTS</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-extrabold text-emerald-600 font-mono">{customers.length - debtorsCount} Accounts</h4>
            <p className="text-[11px] text-slate-500 mt-1">Zero balance / Fully paid</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">CREDIT COMPLIANCE</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-extrabold text-teal-800 font-mono">DRAP Standard</h4>
            <p className="text-[11px] text-slate-500 mt-1">Encrypted patient credit log</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Customer Directory List (Left) & Active Khata Ledger Statement (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Directory (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
          {/* Search & Filter Header */}
          <div className="p-4 border-b border-slate-200 space-y-3 bg-slate-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient name, phone #, CNIC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-700"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-lg text-[11px] font-bold text-slate-600">
              <button
                onClick={() => setFilterType('ALL')}
                className={`flex-1 py-1 rounded transition-all cursor-pointer ${filterType === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
              >
                All ({customers.length})
              </button>
              <button
                onClick={() => setFilterType('WITH_DEBT')}
                className={`flex-1 py-1 rounded transition-all cursor-pointer ${filterType === 'WITH_DEBT' ? 'bg-red-600 text-white shadow-xs' : 'hover:text-slate-900'}`}
              >
                Udhar ({debtorsCount})
              </button>
              <button
                onClick={() => setFilterType('CLEAR')}
                className={`flex-1 py-1 rounded transition-all cursor-pointer ${filterType === 'CLEAR' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-slate-900'}`}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Customer List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredCustomers.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                <Users className="w-8 h-8 mx-auto text-slate-300" />
                <p>No customer accounts found.</p>
                <button
                  onClick={() => setIsNewCustomerModalOpen(true)}
                  className="text-teal-800 font-bold hover:underline text-xs"
                >
                  Create first Khata account
                </button>
              </div>
            ) : (
              filteredCustomers.map(cust => {
                const isSelected = selectedCustomer?.id === cust.id;
                return (
                  <div
                    key={cust.id}
                    onClick={() => setSelectedCustomerId(cust.id)}
                    className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-teal-50/80 border-l-4 border-teal-800' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{cust.name}</h4>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {cust.phone}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className={`text-xs font-extrabold font-mono ${cust.totalDebt > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          Rs. {cust.totalDebt.toLocaleString('en-PK')}
                        </p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          cust.totalDebt > 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {cust.totalDebt > 0 ? 'UDHAR DUE' : 'CLEAR'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Ledger & Transactions (8 cols on lg) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[700px]">
          {!selectedCustomer ? (
            <div className="p-16 text-center text-slate-400 text-xs my-auto">
              Select a customer from the left list to view their Khata ledger.
            </div>
          ) : (
            <div className="flex flex-col flex-1">
              {/* Selected Customer Header Banner */}
              <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{selectedCustomer.name}</h3>
                    <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      {selectedCustomer.id}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-teal-700" />
                      {selectedCustomer.phone}
                    </span>
                    {selectedCustomer.cnic && (
                      <span>• CNIC: {selectedCustomer.cnic}</span>
                    )}
                    {selectedCustomer.address && (
                      <span>• {selectedCustomer.address}</span>
                    )}
                  </div>
                </div>

                {/* Balance & Action Buttons */}
                <div className="flex items-center gap-3">
                  <div className="text-right bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CURRENT UDHAR BALANCE</span>
                    <span className={`text-xl font-extrabold font-mono ${selectedCustomer.totalDebt > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      Rs. {selectedCustomer.totalDebt.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => {
                        setTxnModalType('CREDIT_PURCHASE');
                        setIsAddTxnModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Udhar Entry</span>
                    </button>
                    <button
                      onClick={() => {
                        setTxnModalType('PAYMENT_RECEIVED');
                        setIsAddTxnModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>+ Receive Payment</span>
                    </button>
                    {selectedCustomer.totalDebt > 0 && (
                      <a
                        href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalam-o-Alaikum ${selectedCustomer.name}, Talha Surgical & Medicine Shop say aap ka total pending Udhar balance Rs. ${selectedCustomer.totalDebt.toFixed(2)} hai. Baraye karam jald az jald ada farmae. Shukriya!`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-xs text-center"
                      >
                        <span>WhatsApp Reminder</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Transactions Ledger Table */}
              <div className="flex-1 overflow-x-auto p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-4 h-4 text-teal-700" />
                    <span>Transaction History & Ledger Activity</span>
                  </h4>
                  <button
                    onClick={handlePrintStatement}
                    className="flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>Print Khata Slip</span>
                  </button>
                </div>

                {(!selectedCustomer.transactions || selectedCustomer.transactions.length === 0) ? (
                  <div className="text-center py-16 text-slate-400 text-xs space-y-2">
                    <p>No transaction history recorded for this customer yet.</p>
                    <p className="text-[11px] text-slate-400">Click "+ Udhar Entry" to record a credit medicine purchase or "+ Receive Payment" for cash received.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                          <th className="p-3 pl-4">DATE & TIME</th>
                          <th className="p-3">TYPE</th>
                          <th className="p-3">DESCRIPTION / INVOICE</th>
                          <th className="p-3 text-right">UDHAR (+)</th>
                          <th className="p-3 text-right">RECEIVED (-)</th>
                          <th className="p-3 text-right pr-4">BALANCE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {selectedCustomer.transactions.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 pl-4 text-slate-500 font-mono">{t.date} • {t.time}</td>
                            <td className="p-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[10px] ${
                                t.type === 'CREDIT_PURCHASE' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              }`}>
                                {t.type === 'CREDIT_PURCHASE' ? <ArrowUpRight className="w-3 h-3 text-red-600" /> : <ArrowDownLeft className="w-3 h-3 text-emerald-600" />}
                                {t.type === 'CREDIT_PURCHASE' ? 'UDHAR SALE' : 'CASH PAYMENT'}
                              </span>
                            </td>
                            <td className="p-3">
                              <p className="font-bold text-slate-900">{t.description}</p>
                              {t.invoiceNumber && (
                                <p className="text-[10px] font-mono text-teal-800">Ref: {t.invoiceNumber}</p>
                              )}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-red-600">
                              {t.type === 'CREDIT_PURCHASE' ? `Rs. ${t.amount.toFixed(2)}` : '-'}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-emerald-600">
                              {t.type === 'PAYMENT_RECEIVED' ? `Rs. ${t.amount.toFixed(2)}` : '-'}
                            </td>
                            <td className="p-3 text-right pr-4 font-mono font-extrabold text-slate-900">
                              Rs. {t.remainingBalance.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: New Customer Khata Account */}
      {isNewCustomerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 bg-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold">
                <UserPlus className="w-4 h-4" />
                <span>Create New Khata Account</span>
              </div>
              <button onClick={() => setIsNewCustomerModalOpen(false)} className="text-teal-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomerSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Patient / Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Ali"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-700 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Mobile Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0300-1234567"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-700 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">CNIC / ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="35202-xxxxxxx-x"
                    value={newCustCnic}
                    onChange={(e) => setNewCustCnic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-700 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Credit Limit (Rs.)</label>
                  <input
                    type="number"
                    value={newCustLimit}
                    onChange={(e) => setNewCustLimit(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-700 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Address / Location</label>
                <input
                  type="text"
                  placeholder="Street / House address"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-700"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Initial Udhar Balance (Optional)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={newCustInitialDebt || ''}
                  onChange={(e) => setNewCustInitialDebt(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-700 font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCustomerModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-2 rounded-lg text-xs font-bold cursor-pointer shadow-xs"
                >
                  Save Khata Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Khata Transaction (Udhar vs Payment) */}
      {isAddTxnModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className={`p-4 text-white flex items-center justify-between ${
              txnModalType === 'CREDIT_PURCHASE' ? 'bg-red-700' : 'bg-emerald-700'
            }`}>
              <div className="flex items-center gap-2 text-sm font-bold">
                {txnModalType === 'CREDIT_PURCHASE' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                <span>{txnModalType === 'CREDIT_PURCHASE' ? 'Add Udhar Medicine Sale' : 'Receive Khata Payment (Jama)'}</span>
              </div>
              <button onClick={() => setIsAddTxnModalOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTxnSubmit} className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">{selectedCustomer.name}</span>
                <span className="font-mono text-slate-500">Current Balance: <strong className="text-slate-900">Rs. {selectedCustomer.totalDebt.toFixed(2)}</strong></span>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  {txnModalType === 'CREDIT_PURCHASE' ? 'Udhar Amount (Rs.) *' : 'Payment Amount Received (Rs.) *'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  step="any"
                  autoFocus
                  placeholder="0.00"
                  value={txnAmount || ''}
                  onChange={(e) => setTxnAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-base font-extrabold text-slate-900 focus:outline-none focus:border-teal-700 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Description / Details</label>
                <input
                  type="text"
                  placeholder={txnModalType === 'CREDIT_PURCHASE' ? 'e.g. Panadol Extra 2 boxes + Surgical Bandage' : 'e.g. Cash received by store owner'}
                  value={txnDescription}
                  onChange={(e) => setTxnDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-700"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Invoice Ref # (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. #INV-92841"
                  value={txnInvoiceRef}
                  onChange={(e) => setTxnInvoiceRef(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-700 font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTxnModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-lg text-xs font-bold text-white cursor-pointer shadow-xs ${
                    txnModalType === 'CREDIT_PURCHASE' ? 'bg-red-700 hover:bg-red-800' : 'bg-emerald-700 hover:bg-emerald-800'
                  }`}
                >
                  {txnModalType === 'CREDIT_PURCHASE' ? 'Record Udhar Sale' : 'Save Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
