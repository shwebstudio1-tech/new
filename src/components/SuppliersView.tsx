import React, { useState } from 'react';
import { Truck, Plus, Search, Phone, Building2, CheckCircle2, Clock, AlertTriangle, X } from 'lucide-react';
import { Supplier, TabType } from '../types';

interface SuppliersViewProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Omit<Supplier, 'id' | 'totalOrders' | 'totalPaid'>) => Promise<void>;
  setCurrentTab: (tab: TabType) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({ suppliers, onAddSupplier, setCurrentTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Supplier Form State
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<'DELIVERED' | 'PENDING' | 'IN_TRANSIT'>('DELIVERED');

  const handleAddSupplierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    await onAddSupplier({
      name,
      contactPerson,
      phone,
      company: company || name,
      address,
      deliveryStatus
    });

    setIsModalOpen(false);
    setName('');
    setContactPerson('');
    setPhone('');
    setCompany('');
    setAddress('');
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.includes(searchTerm)
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto select-none font-sans">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Suppliers & Pharmaceutical Distributors</h2>
            <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200">
              MANUFACTURER DIRECTORY
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Directory of pharmaceutical suppliers, pending delivery status, and contract records.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Supplier Record</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setCurrentTab('purchases')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500 transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view all supplier purchases"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-teal-800">ACTIVE SUPPLIERS</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-100">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">{suppliers.length} Vendors</h4>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-slate-500">Verified distributors</p>
              <span className="text-[10px] font-bold text-teal-700 group-hover:underline">Purchases →</span>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setCurrentTab('purchases')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-500 transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to review pending shipments in purchases"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-orange-700">PENDING SHIPMENTS</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-100">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-orange-600 font-mono">
              {suppliers.filter(s => s.deliveryStatus === 'PENDING').length} Pending
            </h4>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-slate-500">Awaiting delivery</p>
              <span className="text-[10px] font-bold text-orange-700 group-hover:underline">Orders →</span>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setCurrentTab('inventory')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view received stock in inventory"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-emerald-800">DELIVERED ORDERS</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-emerald-700 font-mono">
              {suppliers.filter(s => s.deliveryStatus === 'DELIVERED').length} Completed
            </h4>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-slate-500">Stock received in shop</p>
              <span className="text-[10px] font-bold text-emerald-700 group-hover:underline">Inventory →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search Supplier Name, Phone Number, Company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs focus:outline-none"
        />
      </div>

      {/* Suppliers Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Registered Supplier Directory</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-3.5 pl-4">SUPPLIER COMPANY</th>
                <th className="p-3.5">CONTACT PERSON</th>
                <th className="p-3.5">PHONE NUMBER</th>
                <th className="p-3.5">DELIVERY STATUS</th>
                <th className="p-3.5 font-mono">TOTAL ORDERS</th>
                <th className="p-3.5 font-mono">TOTAL PAID (RS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredSuppliers.map(s => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="p-3.5 pl-4">
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-400">{s.address || 'Local Distributor'}</div>
                  </td>
                  <td className="p-3.5 text-slate-700">{s.contactPerson}</td>
                  <td className="p-3.5 font-mono font-bold text-teal-800">{s.phone}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                      s.deliveryStatus === 'DELIVERED' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : 'bg-orange-50 text-orange-800 border-orange-200 animate-pulse'
                    }`}>
                      {s.deliveryStatus}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-900">{s.totalOrders} Orders</td>
                  <td className="p-3.5 font-mono font-bold text-teal-800">Rs. {s.totalPaid.toLocaleString('en-PK')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-4 bg-teal-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New Supplier Record</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-teal-200 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddSupplierSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Supplier Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Abbott Laboratories"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  placeholder="Manager / Sales Rep Name"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="0300-1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-teal-700 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Delivery Status</label>
                <select
                  value={deliveryStatus}
                  onChange={(e: any) => setDeliveryStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none"
                >
                  <option value="DELIVERED">DELIVERED (Received)</option>
                  <option value="PENDING">PENDING (Awaiting Shipments)</option>
                </select>
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
                  Add Supplier Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
