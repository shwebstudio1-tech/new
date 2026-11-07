import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Pill, 
  Boxes, 
  Receipt, 
  ShoppingBag, 
  Users, 
  Truck, 
  BarChart3, 
  Sparkles, 
  UserCheck, 
  Settings as SettingsIcon, 
  ChevronDown,
  Building2,
  ShieldAlert
} from 'lucide-react';
import { TabType, ShiftInfo } from '../types';

interface SidebarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  shift: ShiftInfo;
  alertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, shift, alertsCount }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Logo Area */}
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-teal-800 flex items-center justify-center text-white font-bold shadow-md shadow-teal-900/20">
          TS
        </div>
        <div>
          <h1 className="font-bold text-slate-900 text-sm leading-tight tracking-tight">TALHA SURGICAL</h1>
          <p className="text-[10px] text-teal-800 font-semibold tracking-wider uppercase">Medicine Shop</p>
        </div>
      </div>

      {/* Branch Selector */}
      <div className="p-3 mx-3 mt-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-teal-700" />
          <span className="text-xs font-medium text-slate-800">Main Branch - Term-01</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6 text-xs font-medium scrollbar-thin">
        {/* MAIN */}
        <div>
          <p className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">Main</p>
          <div className="space-y-1">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'dashboard'
                  ? 'bg-teal-800 text-white font-semibold shadow-sm shadow-teal-800/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
              <span className={`ml-auto w-1.5 h-1.5 rounded-full ${currentTab === 'dashboard' ? 'bg-emerald-400' : 'bg-teal-600'}`}></span>
            </button>

            <button
              onClick={() => setCurrentTab('pos')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'pos'
                  ? 'bg-teal-800 text-white font-semibold shadow-sm shadow-teal-800/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Point of Sale (POS)</span>
              <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-bold ${
                currentTab === 'pos' ? 'bg-teal-900 text-teal-200' : 'bg-slate-100 text-slate-600'
              }`}>F2</span>
            </button>

            <button
              onClick={() => setCurrentTab('medicines')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'medicines'
                  ? 'bg-teal-800 text-white font-semibold shadow-sm shadow-teal-800/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Pill className="w-4 h-4" />
              <span>Medicines</span>
            </button>

            <button
              onClick={() => setCurrentTab('inventory')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'inventory'
                  ? 'bg-teal-800 text-white font-semibold shadow-sm shadow-teal-800/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span>Inventory</span>
              {alertsCount > 0 && (
                <span className="ml-auto bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5">
                  <ShieldAlert className="w-3 h-3" />
                  {alertsCount} Alerts
                </span>
              )}
            </button>
          </div>
        </div>

        {/* OPERATIONS */}
        <div>
          <p className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">Operations</p>
          <div className="space-y-1">
            <button
              onClick={() => setCurrentTab('sales')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'sales'
                  ? 'bg-teal-800 text-white font-semibold shadow-sm shadow-teal-800/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Sales & Invoices</span>
            </button>

            <button
              onClick={() => setCurrentTab('purchases')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'purchases'
                  ? 'bg-teal-800 text-white font-semibold shadow-sm shadow-teal-800/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Purchases</span>
            </button>

            <button
              onClick={() => setCurrentTab('customers')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'customers'
                  ? 'bg-teal-800 text-white font-semibold shadow-sm shadow-teal-800/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customers CRM</span>
            </button>

            <button
              onClick={() => setCurrentTab('suppliers')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'suppliers'
                  ? 'bg-teal-800 text-white font-semibold shadow-sm shadow-teal-800/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Suppliers</span>
            </button>
          </div>
        </div>

        {/* INTELLIGENCE */}
        <div>
          <p className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">Intelligence</p>
          <div className="space-y-1">
            <button
              onClick={() => setCurrentTab('reports')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'reports'
                  ? 'bg-teal-800 text-white font-semibold shadow-sm shadow-teal-800/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Reports & Analytics</span>
            </button>

            <button
              onClick={() => setCurrentTab('ai-assistant')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'ai-assistant'
                  ? 'bg-teal-800 text-white font-semibold shadow-sm shadow-teal-800/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI Assistant</span>
              <span className="ml-auto bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                SMART
              </span>
            </button>
          </div>
        </div>

        {/* SYSTEM */}
        <div>
          <p className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">System</p>
          <div className="space-y-1">
            <button
              onClick={() => setCurrentTab('staff')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'staff'
                  ? 'bg-teal-800 text-white font-semibold shadow-sm shadow-teal-800/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Staff Management</span>
            </button>

            <button
              onClick={() => setCurrentTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'settings'
                  ? 'bg-teal-800 text-white font-semibold shadow-sm shadow-teal-800/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Shift Widget */}
      <div className="p-3 m-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Shift</span>
          <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">{shift.shiftId}</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-teal-800 text-white text-[10px] font-bold flex items-center justify-center">
            {shift.pharmacistName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">{shift.pharmacistName}</p>
            <p className="text-[10px] text-slate-500">{shift.status}</p>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Drawer Cash</span>
          <span className="font-mono font-bold text-slate-800">Rs. {shift.drawerCash.toLocaleString('en-PK', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

    </aside>
  );
};
