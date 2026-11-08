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
  Settings as SettingsIcon, 
  ChevronDown,
  Building2,
  ShieldAlert,
  BookOpen,
  X,
  Store,
  Wallet
} from 'lucide-react';
import { TabType, ShiftInfo } from '../types';

interface SidebarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  shift: ShiftInfo;
  alertsCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  shift, 
  alertsCount,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const [storeName, setStoreName] = React.useState(() => localStorage.getItem('talha_store_name') || 'TALHA SURGICAL');
  const [storeLogo, setStoreLogo] = React.useState(() => localStorage.getItem('talha_store_logo') || '');

  React.useEffect(() => {
    const handleStorage = () => {
      setStoreName(localStorage.getItem('talha_store_name') || 'TALHA SURGICAL');
      setStoreLogo(localStorage.getItem('talha_store_logo') || '');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleTabClick = (tab: TabType) => {
    setCurrentTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 lg:z-0 h-screen w-64 bg-white border-r border-slate-200/90
        flex flex-col shrink-0 select-none transition-transform duration-300 ease-in-out shadow-xs
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Logo & Store Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-b from-slate-50/50 to-white">
          <button 
            onClick={() => handleTabClick('settings')}
            className="flex items-center gap-3 group relative cursor-pointer text-left w-full"
            title="Edit Store Profile & Branding"
          >
            <div className="relative shrink-0">
              {storeLogo ? (
                <img src={storeLogo} alt="Logo" className="w-10 h-10 rounded-full object-cover shadow-md shadow-teal-900/20 ring-2 ring-teal-700/30 transition-all group-hover:scale-105" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center text-white font-black text-sm shadow-md shadow-teal-900/20 ring-2 ring-teal-700/30 overflow-hidden transition-all group-hover:scale-105">
                  {storeName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-slate-900/70 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                <span className="text-[9px] font-bold uppercase tracking-wider">Edit</span>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" title="Store Online"></span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-slate-900 text-sm leading-tight tracking-tight group-hover:text-teal-800 transition-colors truncate">
                  {storeName}
                </h1>
              </div>
              <p className="text-[10px] text-teal-800 font-bold tracking-wider uppercase flex items-center gap-1 mt-0.5">
                <Store className="w-3 h-3 text-teal-700" />
                <span>Medicine Shop POS</span>
              </p>
            </div>
          </button>

          {/* Close button on mobile */}
          <button 
            onClick={onCloseMobile}
            className="lg:hidden text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Branch / Terminal Selector Widget */}
        <div className="px-3 pt-3">
          <div className="p-2.5 bg-slate-50/90 border border-slate-200/80 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-100/90 hover:border-slate-300/80 transition-all shadow-2xs group">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-teal-100/80 text-teal-800 flex items-center justify-center shrink-0">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">Main Branch</p>
                <p className="text-[10px] text-slate-500 font-mono">Terminal-01 Active</p>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs font-medium scrollbar-thin">
          {/* MAIN */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">Main Modules</p>
            <div className="space-y-1">
              <button
                onClick={() => handleTabClick('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'dashboard'
                    ? 'bg-teal-800 text-white font-bold shadow-md shadow-teal-900/15 border-l-4 border-emerald-400'
                    : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 ${currentTab === 'dashboard' ? 'text-emerald-300' : 'text-slate-400'}`} />
                <span>Dashboard</span>
                <span className={`ml-auto w-1.5 h-1.5 rounded-full ${currentTab === 'dashboard' ? 'bg-emerald-400' : 'bg-slate-300'}`}></span>
              </button>

              <button
                onClick={() => handleTabClick('pos')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'pos'
                    ? 'bg-teal-800 text-white font-bold shadow-md shadow-teal-900/15 border-l-4 border-emerald-400'
                    : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                }`}
              >
                <ShoppingCart className={`w-4 h-4 ${currentTab === 'pos' ? 'text-teal-200' : 'text-slate-400'}`} />
                <span>Point of Sale (POS)</span>
                <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                  currentTab === 'pos' ? 'bg-teal-950/70 text-teal-200' : 'bg-slate-100 text-slate-600'
                }`}>F2</span>
              </button>

              <button
                onClick={() => handleTabClick('medicines')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'medicines' || currentTab === 'inventory'
                    ? 'bg-teal-800 text-white font-bold shadow-md shadow-teal-900/15 border-l-4 border-emerald-400'
                    : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                }`}
              >
                <Pill className={`w-4 h-4 ${currentTab === 'medicines' || currentTab === 'inventory' ? 'text-teal-200' : 'text-slate-400'}`} />
                <span>Medicine Catalog</span>
                {alertsCount > 0 && (
                  <span className="ml-auto bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-md text-[10px] flex items-center gap-1 shadow-2xs">
                    <ShieldAlert className="w-3 h-3" />
                    {alertsCount}
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
                onClick={() => handleTabClick('sales')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'sales'
                    ? 'bg-teal-800 text-white font-bold shadow-md shadow-teal-900/15 border-l-4 border-emerald-400'
                    : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                }`}
              >
                <Receipt className={`w-4 h-4 ${currentTab === 'sales' ? 'text-teal-200' : 'text-slate-400'}`} />
                <span>Sales & Invoices</span>
              </button>

              <button
                onClick={() => handleTabClick('customers')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'customers'
                    ? 'bg-teal-800 text-white font-bold shadow-md shadow-teal-900/15 border-l-4 border-emerald-400'
                    : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                }`}
              >
                <BookOpen className={`w-4 h-4 ${currentTab === 'customers' ? 'text-emerald-300' : 'text-slate-400'}`} />
                <span>Khata / Udhar Ledger</span>
                <span className="ml-auto bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">
                  UDHAR
                </span>
              </button>

              <button
                onClick={() => handleTabClick('purchases')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'purchases'
                    ? 'bg-teal-800 text-white font-bold shadow-md shadow-teal-900/15 border-l-4 border-emerald-400'
                    : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className={`w-4 h-4 ${currentTab === 'purchases' ? 'text-teal-200' : 'text-slate-400'}`} />
                <span>Purchases</span>
              </button>

              <button
                onClick={() => handleTabClick('suppliers')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'suppliers'
                    ? 'bg-teal-800 text-white font-bold shadow-md shadow-teal-900/15 border-l-4 border-emerald-400'
                    : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                }`}
              >
                <Truck className={`w-4 h-4 ${currentTab === 'suppliers' ? 'text-teal-200' : 'text-slate-400'}`} />
                <span>Suppliers</span>
              </button>
            </div>
          </div>

          {/* INTELLIGENCE */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">Analytics & AI</p>
            <div className="space-y-1">
              <button
                onClick={() => handleTabClick('reports')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'reports'
                    ? 'bg-teal-800 text-white font-bold shadow-md shadow-teal-900/15 border-l-4 border-emerald-400'
                    : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                }`}
              >
                <BarChart3 className={`w-4 h-4 ${currentTab === 'reports' ? 'text-teal-200' : 'text-slate-400'}`} />
                <span>Reports & Analytics</span>
              </button>

              <button
                onClick={() => handleTabClick('ai-assistant')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'ai-assistant'
                    ? 'bg-teal-800 text-white font-bold shadow-md shadow-teal-900/15 border-l-4 border-emerald-400'
                    : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${currentTab === 'ai-assistant' ? 'text-emerald-300 animate-pulse' : 'text-slate-400'}`} />
                <span>AI Pharmacy Copilot</span>
                <span className="ml-auto bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
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
                onClick={() => handleTabClick('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'settings'
                    ? 'bg-teal-800 text-white font-bold shadow-md shadow-teal-900/15 border-l-4 border-emerald-400'
                    : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                }`}
              >
                <SettingsIcon className={`w-4 h-4 ${currentTab === 'settings' ? 'text-teal-200' : 'text-slate-400'}`} />
                <span>Store Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Shift & Drawer Card */}
        <div className="p-3 m-3 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Wallet className="w-3 h-3 text-teal-700" />
              <span>Active Shift</span>
            </span>
            <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-md">
              {shift.shiftId}
            </span>
          </div>

          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-7 h-7 rounded-xl bg-teal-800 text-white text-[11px] font-black flex items-center justify-center shrink-0 shadow-xs">
              {shift.pharmacistName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">{shift.pharmacistName}</p>
              <p className="text-[10px] text-slate-500 truncate">{shift.status}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Drawer Cash</span>
            <span className="font-mono font-extrabold text-teal-800">
              Rs. {shift.drawerCash.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

