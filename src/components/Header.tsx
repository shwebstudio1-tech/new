import React, { useState } from 'react';
import { Search, ShoppingCart, Plus, Bell, X, ShieldCheck, AlertTriangle, LogOut, ChevronDown } from 'lucide-react';
import { TabType, Medicine } from '../types';

interface HeaderProps {
  setCurrentTab: (tab: TabType) => void;
  onOpenQuickSale: () => void;
  onOpenAddMedicine: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  medicines: Medicine[];
  userProfile?: { name: string; email: string; role: string; photoURL?: string } | null;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  setCurrentTab, 
  onOpenQuickSale, 
  onOpenAddMedicine,
  searchTerm,
  setSearchTerm,
  medicines,
  userProfile,
  onSignOut
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const lowStock = medicines.filter(m => m.stock <= m.minStock);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Scan Barcode or Search Medicine, SKU, Patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-14 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-700 focus:bg-white transition-all shadow-inner"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">
            Ctrl+K
          </span>
        </div>
      </div>

      {/* Center Status / Quick Actions */}
      <div className="flex items-center gap-4">
        {/* System Online badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
          <span>Terminal-01</span>
        </div>

        {/* Quick Sale F2 */}
        <button
          onClick={() => {
            setCurrentTab('pos');
            onOpenQuickSale();
          }}
          className="flex items-center gap-2 bg-teal-800 hover:bg-teal-900 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Quick Sale</span>
          <span className="bg-teal-950/60 text-teal-200 px-1.5 py-0.5 rounded text-[10px] font-mono">F2</span>
        </button>

        {/* Add Medicine F3 */}
        <button
          onClick={onOpenAddMedicine}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-teal-700" />
          <span>Add Medicine</span>
          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-mono">F3</span>
        </button>
      </div>

      {/* User Profile & Notifications */}
      <div className="flex items-center gap-3">
        {/* Notification bell & dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {lowStock.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {lowStock.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in duration-150">
              <div className="p-3 bg-teal-800 text-white flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Store Notifications & Alerts</span>
                </div>
                <button onClick={() => setShowNotifications(false)} className="text-teal-200 hover:text-white p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 space-y-2.5 max-h-72 overflow-y-auto text-xs">
                {lowStock.length > 0 ? (
                  lowStock.map(med => (
                    <div key={med.id} className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-red-900">Low Stock: {med.name}</p>
                        <p className="text-[10px] text-red-700">Stock is at {med.stock} {med.unit} (Min: {med.minStock})</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">Inventory Optimal</p>
                      <p className="text-[10px] text-emerald-700">All active stock levels are above safety thresholds.</p>
                    </div>
                  </div>
                )}

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2.5 text-slate-800">
                  <div className="w-2 h-2 rounded-full bg-slate-400 shrink-0"></div>
                  <div>
                    <p className="font-bold text-slate-700">Database Connection</p>
                    <p className="text-[10px] text-slate-500">Active terminal session.</p>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-100 border-t border-slate-200 text-center">
                <button 
                  onClick={() => {
                    setShowNotifications(false);
                    setCurrentTab('inventory');
                  }}
                  className="text-xs font-bold text-teal-800 hover:underline cursor-pointer"
                >
                  View All Inventory Items →
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200"></div>

        {/* User Profile & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            {userProfile?.photoURL ? (
              <img 
                src={userProfile.photoURL} 
                alt={userProfile.name} 
                className="w-9 h-9 rounded-full object-cover shadow-sm ring-2 ring-teal-700/20"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-teal-800 text-white font-bold text-xs flex items-center justify-center shadow-sm ring-2 ring-teal-700/20">
                {(userProfile?.name || 'AD').split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            )}
            <div className="hidden sm:block">
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                {userProfile?.name || 'Admin / Owner'}
              </h4>
              <p className="text-[10px] text-teal-800 font-semibold uppercase tracking-wider">
                {userProfile?.role || 'System Administrator'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in duration-150 p-2 space-y-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs font-bold text-slate-900">{userProfile?.name || 'Admin / Owner'}</p>
                <p className="text-[11px] text-slate-500 truncate">{userProfile?.email || 'owner@talhasurgical.pk'}</p>
                <span className="mt-1.5 inline-block text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                  {userProfile?.role || 'System Administrator'}
                </span>
              </div>

              {onSignOut && (
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onSignOut();
                  }}
                  className="w-full flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Lock Terminal / Sign Out</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
