import React, { useState } from 'react';
import { Search, ShoppingCart, Plus, Bell, X, ShieldCheck, AlertTriangle, LogOut, ChevronDown, Menu, BookOpen, Trash2, Check, RefreshCw } from 'lucide-react';
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
  onToggleMobileSidebar?: () => void;
  onResetDailyData?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  setCurrentTab, 
  onOpenQuickSale, 
  onOpenAddMedicine,
  searchTerm,
  setSearchTerm,
  medicines,
  userProfile,
  onSignOut,
  onToggleMobileSidebar,
  onResetDailyData
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isNotificationsCleared, setIsNotificationsCleared] = useState(false);
  const [doNotShowAgain, setDoNotShowAgain] = useState(() => {
    return localStorage.getItem('talha_disable_stock_alerts') === 'true';
  });

  const lowStock = medicines.filter(m => m.stock <= m.minStock);
  const hasActiveBadge = !isNotificationsCleared && !doNotShowAgain && lowStock.length > 0;

  const handleToggleDoNotShowAgain = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setDoNotShowAgain(checked);
    localStorage.setItem('talha_disable_stock_alerts', checked ? 'true' : 'false');
  };

  const handleClearNotifications = () => {
    setIsNotificationsCleared(true);
  };

  const searchResults = searchTerm.trim().length > 0
    ? medicines.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.sku.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Mobile Menu Toggle & Brand Logo/Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md relative">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Search Bar with Live Results Dropdown */}
        <div className="hidden sm:block relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Scan Barcode or Search Medicine, SKU, Generic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-700 focus:bg-white transition-all shadow-inner"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Search Dropdown Panel */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in duration-150">
              <div className="p-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>Matching Medicines ({searchResults.length})</span>
                <span className="text-[10px] text-teal-700">Click item to view in catalog</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {searchResults.map(med => (
                  <div
                    key={med.id}
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentTab('inventory');
                    }}
                    className="p-2.5 hover:bg-teal-50 transition-colors cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="font-bold text-xs text-slate-900">{med.name}</p>
                      <p className="text-[10px] text-slate-500">{med.genericName} • SKU: {med.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-teal-800 text-xs">Rs. {med.retailPrice.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400">Stock: {med.stock} {med.unit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Search Toggle Button */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="sm:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Center Status / Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Terminal Online badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
          <span>Terminal-01</span>
        </div>

        {/* Khata Quick Access */}
        <button
          onClick={() => setCurrentTab('customers')}
          className="hidden md:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Khata / Udhar</span>
        </button>

        {/* Quick Sale F2 */}
        <button
          onClick={() => {
            setCurrentTab('pos');
            onOpenQuickSale();
          }}
          className="flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white px-3 sm:px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quick Sale</span>
          <span className="bg-teal-950/60 text-teal-200 px-1.5 py-0.5 rounded text-[10px] font-mono">F2</span>
        </button>

        {/* Add Medicine F3 */}
        <button
          onClick={onOpenAddMedicine}
          className="hidden sm:flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-teal-700" />
          <span>Add Medicine</span>
          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-mono">F3</span>
        </button>
      </div>

      {/* Right User Profile & Notifications */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification bell & dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {hasActiveBadge && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                {lowStock.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-88 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in duration-150">
              <div className="p-3 bg-teal-800 text-white flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Store Notifications & Alerts</span>
                </div>
                <div className="flex items-center gap-1">
                  {!isNotificationsCleared && lowStock.length > 0 && (
                    <button
                      onClick={handleClearNotifications}
                      className="text-[10px] font-bold bg-teal-900 hover:bg-teal-950 text-teal-100 px-2 py-0.5 rounded border border-teal-700 cursor-pointer"
                      title="Clear notification alerts"
                    >
                      Clear All
                    </button>
                  )}
                  <button onClick={() => setShowNotifications(false)} className="text-teal-200 hover:text-white p-1 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3 space-y-2.5 max-h-72 overflow-y-auto text-xs">
                {(!isNotificationsCleared && !doNotShowAgain && lowStock.length > 0) ? (
                  lowStock.map(med => (
                    <div key={med.id} className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-red-900">Low Stock: {med.name}</p>
                          <p className="text-[10px] text-red-700">Stock is at {med.stock} {med.unit} (Min: {med.minStock})</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          setCurrentTab('inventory');
                        }}
                        className="text-[10px] font-bold text-red-700 hover:underline shrink-0"
                      >
                        Update Stock →
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">Notifications Cleared / Optimal</p>
                      <p className="text-[10px] text-emerald-700">No active stock alerts pending attention.</p>
                    </div>
                  </div>
                )}

                {/* Do Not Show Again Toggle Checkbox */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer font-medium select-none">
                    <input
                      type="checkbox"
                      checked={doNotShowAgain}
                      onChange={handleToggleDoNotShowAgain}
                      className="rounded border-slate-300 text-teal-700 focus:ring-teal-700"
                    />
                    <span>Do not show low stock popups again</span>
                  </label>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                <button 
                  onClick={onOpenAddMedicine}
                  className="text-[11px] font-bold text-teal-800 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-teal-700" />
                  <span>Add New Medicine</span>
                </button>
                <button 
                  onClick={() => {
                    setShowNotifications(false);
                    setCurrentTab('inventory');
                  }}
                  className="text-[11px] font-bold text-slate-600 hover:underline cursor-pointer"
                >
                  View Inventory →
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        {/* User Profile & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-teal-800 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-teal-700/20">
              {(userProfile?.name || 'AD').split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="hidden md:block">
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

              {onResetDailyData && (
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onResetDailyData();
                  }}
                  className="w-full flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-teal-700" />
                  <span>Reset Today's Revenue Register</span>
                </button>
              )}

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

      {/* Mobile Expandable Search Bar */}
      {showMobileSearch && (
        <div className="absolute left-0 top-16 w-full bg-white border-b border-slate-200 p-3 shadow-md sm:hidden z-20 animate-in slide-in-from-top-2 duration-150">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search Medicine, SKU, Patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-700"
            />
            <button onClick={() => setShowMobileSearch(false)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
