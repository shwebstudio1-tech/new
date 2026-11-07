import React from 'react';
import { Search, ShoppingCart, Plus, Bell } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  setCurrentTab: (tab: TabType) => void;
  onOpenQuickSale: () => void;
  onOpenAddMedicine: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  setCurrentTab, 
  onOpenQuickSale, 
  onOpenAddMedicine,
  searchTerm,
  setSearchTerm
}) => {
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
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-lg text-xs font-medium text-teal-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>System Online • Term-01</span>
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
        {/* Notification bell */}
        <div className="relative">
          <button className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors relative cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              7
            </span>
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200"></div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-teal-800 text-white font-bold text-xs flex items-center justify-center shadow-sm ring-2 ring-teal-700/20">
            SK
          </div>
          <div className="text-left hidden sm:block">
            <h4 className="text-xs font-bold text-slate-900 leading-tight">Dr. Sarah Khan</h4>
            <p className="text-[10px] text-teal-800 font-semibold uppercase tracking-wider">Chief Pharmacist / Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};
