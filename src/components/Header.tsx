import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Bell, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  LogOut, 
  ChevronDown, 
  Menu, 
  BookOpen, 
  RefreshCw,
  Sparkles,
  Command,
  ArrowRight,
  Pill,
  ExternalLink,
  SlidersHorizontal,
  Package
} from 'lucide-react';
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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationsCleared, setIsNotificationsCleared] = useState(false);
  const [doNotShowAgain, setDoNotShowAgain] = useState(() => {
    return localStorage.getItem('talha_disable_stock_alerts') === 'true';
  });

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for search focus (Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const desktopInput = document.getElementById('header-desktop-search');
        if (desktopInput) desktopInput.focus();
        else setShowMobileSearch(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  // Comprehensive search logic
  const trimmedTerm = searchTerm.trim().toLowerCase();
  
  const searchResults = trimmedTerm.length > 0
    ? medicines.filter(m => 
        m.name.toLowerCase().includes(trimmedTerm) || 
        m.genericName.toLowerCase().includes(trimmedTerm) ||
        m.sku.toLowerCase().includes(trimmedTerm) ||
        m.manufacturer.toLowerCase().includes(trimmedTerm) ||
        m.category.toLowerCase().includes(trimmedTerm)
      ).slice(0, 8)
    : [];

  const navigationShortcuts: { name: string; tab: TabType; icon: React.ReactNode; desc: string }[] = [
    { name: 'Point of Sale (POS)', tab: 'pos' as TabType, icon: <ShoppingCart className="w-4 h-4 text-teal-700" />, desc: 'Dispensary F2 counter billing' },
    { name: 'Medicines Inventory', tab: 'inventory' as TabType, icon: <Pill className="w-4 h-4 text-teal-700" />, desc: 'Stock quantities & pricing' },
    { name: 'Khata & Credit Register', tab: 'customers' as TabType, icon: <BookOpen className="w-4 h-4 text-emerald-600" />, desc: 'Patient Udhar receivables' },
    { name: 'Sales & Invoices', tab: 'sales' as TabType, icon: <Package className="w-4 h-4 text-teal-700" />, desc: 'Completed invoice slips' },
    { name: 'Reports & Analytics', tab: 'reports' as TabType, icon: <SlidersHorizontal className="w-4 h-4 text-teal-700" />, desc: 'Daily revenue & audits' },
    { name: 'Settings & Admin', tab: 'settings' as TabType, icon: <Sparkles className="w-4 h-4 text-teal-700" />, desc: 'Store profile & credentials' }
  ].filter(s => trimmedTerm.length > 0 && (s.name.toLowerCase().includes(trimmedTerm) || s.desc.toLowerCase().includes(trimmedTerm)));

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none shadow-xs">
      {/* Left: Mobile Sidebar Trigger + Desktop Search Container */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 active:bg-slate-200 transition-colors cursor-pointer shrink-0"
          title="Toggle Navigation Menu"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Search Component */}
        <div ref={searchContainerRef} className="hidden sm:block relative w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="header-desktop-search"
              type="text"
              placeholder="Search Medicine, SKU, Generic, Formula, or Page..."
              value={searchTerm}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsSearchFocused(true);
              }}
              className="w-full bg-slate-50/90 border border-slate-200/90 rounded-xl pl-9 pr-20 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-700 focus:bg-white focus:ring-2 focus:ring-teal-700/10 transition-all shadow-inner font-medium"
            />

            {searchTerm ? (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded pointer-events-none hidden md:inline-block">
                Ctrl K
              </span>
            )}
          </div>

          {/* Desktop Search Live Results Dropdown */}
          {isSearchFocused && trimmedTerm.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in duration-150">
              {/* Header Bar */}
              <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-teal-700" />
                  <span>Search Matches</span>
                </span>
                <span className="text-[10px] text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {searchResults.length + navigationShortcuts.length} Results
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto text-xs">
                {/* Navigation Shortcuts */}
                {navigationShortcuts.length > 0 && (
                  <div className="p-2 bg-slate-50/50">
                    <p className="px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">System Modules</p>
                    {navigationShortcuts.map((nav, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSearchTerm('');
                          setIsSearchFocused(false);
                          setCurrentTab(nav.tab);
                        }}
                        className="p-2 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          {nav.icon}
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{nav.name}</p>
                            <p className="text-[10px] text-slate-500">{nav.desc}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Medicines Results */}
                {searchResults.length > 0 ? (
                  searchResults.map(med => (
                    <div
                      key={med.id}
                      className="p-3 hover:bg-teal-50/80 transition-colors flex items-center justify-between gap-3 group"
                    >
                      <div 
                        onClick={() => {
                          setSearchTerm('');
                          setIsSearchFocused(false);
                          setCurrentTab('inventory');
                        }}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-xs text-slate-900 group-hover:text-teal-900">{med.name}</p>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                            {med.sku}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {med.genericName} • <strong className="text-slate-700">{med.manufacturer}</strong> ({med.category})
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <p className="font-mono font-bold text-teal-800 text-xs">Rs. {med.retailPrice.toFixed(2)}</p>
                          <p className={`text-[10px] font-medium ${med.stock <= med.minStock ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
                            Stock: {med.stock} {med.unit}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setIsSearchFocused(false);
                            setCurrentTab('pos');
                            onOpenQuickSale();
                          }}
                          className="bg-teal-800 hover:bg-teal-900 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1"
                          title="Sell directly on POS counter"
                        >
                          <span>POS</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  navigationShortcuts.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs space-y-1">
                      <p>No matching medicine, SKU, or module found.</p>
                      <button 
                        onClick={onOpenAddMedicine} 
                        className="text-teal-800 font-bold hover:underline text-xs cursor-pointer"
                      >
                        + Add "{searchTerm}" as new medicine
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Search Icon Button */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="sm:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
          title="Search Medicine"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Center & Right Quick Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Terminal Online Badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Terminal-01</span>
        </div>

        {/* Khata Quick Access */}
        <button
          onClick={() => setCurrentTab('customers')}
          className="hidden md:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100/90 text-emerald-800 border border-emerald-200/90 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
          title="Open Khata & Credit Register"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
          <span>Khata / Udhar</span>
        </button>

        {/* Quick Sale F2 */}
        <button
          onClick={() => {
            setCurrentTab('pos');
            onOpenQuickSale();
          }}
          className="flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          title="Open POS Counter Sale (F2)"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-teal-200" />
          <span className="hidden sm:inline">Quick Sale</span>
          <span className="bg-teal-950/70 text-teal-200 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">F2</span>
        </button>

        {/* Add Medicine F3 */}
        <button
          onClick={onOpenAddMedicine}
          className="hidden sm:flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300/80 text-slate-700 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
          title="Add New Medicine to Stock (F3)"
        >
          <Plus className="w-3.5 h-3.5 text-teal-700" />
          <span>Add Medicine</span>
          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">F3</span>
        </button>

        <div className="h-7 w-px bg-slate-200 mx-0.5 hidden sm:block"></div>

        {/* Notifications Bell & Dropdown */}
        <div ref={notificationsRef} className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors relative cursor-pointer shadow-2xs"
            title="Store Notifications & Alerts"
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
            <div className="absolute right-0 mt-2 w-72 sm:w-92 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in duration-150">
              <div className="p-3.5 bg-teal-800 text-white flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span>Store Stock Alerts ({lowStock.length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {!isNotificationsCleared && lowStock.length > 0 && (
                    <button
                      onClick={handleClearNotifications}
                      className="text-[10px] font-bold bg-teal-900 hover:bg-teal-950 text-teal-100 px-2 py-0.5 rounded border border-teal-700/80 cursor-pointer"
                      title="Clear notification alerts"
                    >
                      Clear All
                    </button>
                  )}
                  <button onClick={() => setShowNotifications(false)} className="text-teal-200 hover:text-white p-0.5 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3 space-y-2.5 max-h-72 overflow-y-auto text-xs">
                {(!isNotificationsCleared && !doNotShowAgain && lowStock.length > 0) ? (
                  lowStock.map(med => (
                    <div key={med.id} className="p-2.5 bg-red-50 border border-red-200/80 rounded-xl flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-red-900">{med.name}</p>
                          <p className="text-[10px] text-red-700">Current Stock: <strong>{med.stock} {med.unit}</strong> (Min Threshold: {med.minStock})</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          setCurrentTab('inventory');
                        }}
                        className="text-[10px] font-bold text-red-700 hover:underline shrink-0 bg-white px-2 py-1 rounded border border-red-200 cursor-pointer"
                      >
                        Restock →
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-xs">Inventory Status Optimal</p>
                      <p className="text-[10px] text-emerald-700">All medicines have adequate stock levels.</p>
                    </div>
                  </div>
                )}

                {/* Do Not Show Again Checkbox */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer font-medium select-none">
                    <input
                      type="checkbox"
                      checked={doNotShowAgain}
                      onChange={handleToggleDoNotShowAgain}
                      className="rounded border-slate-300 text-teal-700 focus:ring-teal-700"
                    />
                    <span>Do not show low stock popups</span>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                <button 
                  onClick={() => {
                    setShowNotifications(false);
                    onOpenAddMedicine();
                  }}
                  className="text-[11px] font-bold text-teal-800 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-teal-700" />
                  <span>Add New Medicine</span>
                </button>
                <button 
                  onClick={() => {
                    setShowNotifications(false);
                    setCurrentTab('inventory');
                  }}
                  className="text-[11px] font-bold text-slate-600 hover:underline cursor-pointer"
                >
                  View Inventory Catalog →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100/80 transition-colors cursor-pointer text-left"
            title="User Profile & Account Menu"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-teal-800 text-white font-black text-xs flex items-center justify-center shadow-xs ring-2 ring-teal-700/20 shrink-0 overflow-hidden">
              {userProfile?.photoURL ? (
                <img src={userProfile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{(userProfile?.name || 'AD').split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
              )}
            </div>
            <div className="hidden lg:block">
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                {userProfile?.name || 'Admin / Owner'}
              </h4>
              <p className="text-[10px] text-teal-800 font-semibold uppercase tracking-wider">
                {userProfile?.role || 'System Admin'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in duration-150 p-2 space-y-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
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
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
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
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Lock Terminal / Sign Out</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay Panel */}
      {showMobileSearch && (
        <div className="absolute left-0 top-16 w-full bg-white border-b border-slate-200 p-3 shadow-2xl sm:hidden z-40 animate-in slide-in-from-top-2 duration-150 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search Medicine, SKU, Generic, or Page..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-9 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-700 font-medium"
            />
            <button 
              onClick={() => {
                setShowMobileSearch(false);
                setSearchTerm('');
              }} 
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Live Search Results */}
          {trimmedTerm.length > 0 && (
            <div className="bg-slate-50 rounded-xl border border-slate-200 max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
              {searchResults.length > 0 ? (
                searchResults.map(med => (
                  <div
                    key={med.id}
                    onClick={() => {
                      setSearchTerm('');
                      setShowMobileSearch(false);
                      setCurrentTab('inventory');
                    }}
                    className="p-2.5 hover:bg-teal-50 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{med.name}</p>
                      <p className="text-[10px] text-slate-500">{med.genericName} • SKU: {med.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-teal-800 text-xs">Rs. {med.retailPrice.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400">Stock: {med.stock}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-slate-400 text-xs">
                  No matching medicine found.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

