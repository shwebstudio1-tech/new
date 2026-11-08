import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  ShieldAlert, 
  Database, 
  Trash2, 
  RefreshCw, 
  LogOut, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { TabType } from '../types';

interface SettingsViewProps {
  onWipeDatabase: () => void;
  onResetDailyData?: () => void;
  setCurrentTab: (tab: TabType) => void;
  onSignOut?: () => void;
  expectedCredentials: { username: string; password: string };
  onUpdatePassword: (newPass: string) => Promise<boolean>;
  storeAddress: string;
  onUpdateStoreAddress: (newAddress: string) => Promise<boolean>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  onWipeDatabase, 
  onResetDailyData,
  setCurrentTab, 
  onSignOut,
  expectedCredentials,
  onUpdatePassword,
  storeAddress,
  onUpdateStoreAddress
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState(storeAddress);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);

  // Extended Store Profile States
  const [storeName, setStoreName] = useState(() => localStorage.getItem('talha_store_name') || 'Talha Surgical & Medicine Shop');
  const [storePhone, setStorePhone] = useState(() => localStorage.getItem('talha_store_phone') || '0300-1234567');
  const [storeLicense, setStoreLicense] = useState(() => localStorage.getItem('talha_store_license') || 'DRAP-PK-99');
  const [storeLogoUrl, setStoreLogoUrl] = useState(() => localStorage.getItem('talha_store_logo') || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // In-App Data Clearing & Reset Modals State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isWipeModalOpen, setIsWipeModalOpen] = useState(false);
  const [isActionProcessing, setIsActionProcessing] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (currentPassword !== expectedCredentials.password) {
      setStatusMessage({ type: 'error', text: 'Current password does not match.' });
      return;
    }

    if (newPassword.length < 4) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 4 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setIsUpdating(true);
    try {
      const success = await onUpdatePassword(newPassword);
      if (success) {
        setStatusMessage({ type: 'success', text: 'Password successfully updated! Your new password is now active.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to update password. Please try again.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Error updating password.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto select-none space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">System Settings & Store Administration</h2>
            <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200">
              OWNER CONTROL
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Manage store security credentials, terminal parameters, and database maintenance protocols.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Security & Password Management Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">Security & Operator Profile Management</h3>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Store Account: <strong className="text-teal-800">{expectedCredentials.username}</strong></span>
            </div>

            <form onSubmit={handlePasswordChange} className="p-6 space-y-5">
              {/* Operator Profile Customization */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Operator Profile (Name & Display)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Operator Name</label>
                    <input
                      type="text"
                      defaultValue={localStorage.getItem('talha_operator_name') || 'Admin / Owner'}
                      onBlur={(e) => {
                        localStorage.setItem('talha_operator_name', e.target.value);
                        window.dispatchEvent(new Event('storage'));
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Operator Role / Title</label>
                    <input
                      type="text"
                      defaultValue={localStorage.getItem('talha_operator_role') || 'System Administrator'}
                      onBlur={(e) => {
                        localStorage.setItem('talha_operator_role', e.target.value);
                        window.dispatchEvent(new Event('storage'));
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Profile Photo Upload / URL</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            localStorage.setItem('talha_operator_avatar', reader.result as string);
                            window.dispatchEvent(new Event('storage'));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1 text-[11px] text-slate-700 file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-teal-50 file:text-teal-700 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Update the master authentication password used to unlock this terminal. Changes take effect immediately across all active sessions.
              </p>

              {statusMessage && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2.5 ${
                  statusMessage.type === 'success' 
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span className="font-medium">{statusMessage.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-3 pr-9 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-700 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      minLength={4}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 4 characters"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-3 pr-9 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-700 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-700 font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-2 bg-teal-800 hover:bg-teal-900 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-60"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isUpdating ? 'Saving...' : 'Update Store Password'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Database Maintenance Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-700" />
              <h3 className="text-sm font-bold text-slate-900">Database Maintenance & Revenue Reset</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Reset Today Revenue */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900">Reset Today's Revenue Register</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Clears today's sales slips and resets today's total revenue calculation on the Dashboard back to Rs. 0.00 for a fresh operative day.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsResetModalOpen(true)}
                    className="mt-2 flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>RESET TODAY'S REVENUE (Rs. 0.00)</span>
                  </button>
                </div>
              </div>

              {/* Master Database Wipe */}
              <div className="pt-6 border-t border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900">Master Database Wipe (Clear Everything)</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Permanently removes all medicine stock catalog, sales invoices, customer Khata registers, purchases, and suppliers from the live database.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsWipeModalOpen(true)}
                    className="mt-2 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>EXECUTE MASTER WIPE</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Confirmation Modal: Reset Today's Revenue */}
      {isResetModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 text-amber-700">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Reset Today's Revenue?</h3>
                <p className="text-[11px] text-amber-800 font-semibold">Store Register Maintenance</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This will clear today's sales slips from Firestore and reset your daily revenue total on the Dashboard back to <strong>Rs. 0.00</strong>.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                disabled={isActionProcessing}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setIsActionProcessing(true);
                  if (onResetDailyData) {
                    await onResetDailyData();
                  }
                  setIsActionProcessing(false);
                  setIsResetModalOpen(false);
                }}
                disabled={isActionProcessing}
                className="px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm cursor-pointer disabled:opacity-60"
              >
                {isActionProcessing ? 'Resetting Register...' : 'Yes, Reset Today\'s Revenue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Master Database Wipe */}
      {isWipeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Permanent Master Database Clear</h3>
                <p className="text-[11px] text-red-700 font-semibold">Wipe All Collections</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete <strong>ALL Medicines, Invoices, Customer Khata Records, Purchase Orders, and Suppliers</strong> from your live database?
            </p>

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] font-bold text-red-800">
              ⚠️ Warning: This action is permanent and cannot be undone. All dashboard metrics will revert to 0.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsWipeModalOpen(false)}
                disabled={isActionProcessing}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setIsActionProcessing(true);
                  await onWipeDatabase();
                  setIsActionProcessing(false);
                  setIsWipeModalOpen(false);
                }}
                disabled={isActionProcessing}
                className="px-4.5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm cursor-pointer disabled:opacity-60"
              >
                {isActionProcessing ? 'Clearing All Database Data...' : 'Yes, Permanently Clear Everything'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
          {/* Store Profile Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Store Profile, Branding & Customization</h3>
            
            {/* Circular Store Logo Preview */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              {storeLogoUrl ? (
                <img src={storeLogoUrl} alt="Store Logo" className="w-12 h-12 rounded-full object-cover shadow-md ring-2 ring-teal-700/20" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-teal-800 text-white font-black text-base flex items-center justify-center shadow-md ring-2 ring-teal-700/20">
                  {storeName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'TS'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-slate-900 truncate">{storeName}</p>
                <p className="text-[10px] text-teal-800 font-semibold">Custom Branding Enabled</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Store Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Store Address (Visible on Slips)</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-teal-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono font-medium text-slate-800 focus:outline-none focus:border-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">DRAP License #</label>
                  <input
                    type="text"
                    value={storeLicense}
                    onChange={(e) => setStoreLicense(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono font-medium text-slate-800 focus:outline-none focus:border-teal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Store Logo Upload or Image URL</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setStoreLogoUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                  />
                  <input
                    type="url"
                    placeholder="Or paste image URL (https://...)"
                    value={storeLogoUrl}
                    onChange={(e) => setStoreLogoUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-xs text-slate-800 focus:outline-none focus:border-teal-700"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={isUpdatingProfile}
                  onClick={async () => {
                    setIsUpdatingProfile(true);
                    localStorage.setItem('talha_store_name', storeName);
                    localStorage.setItem('talha_store_phone', storePhone);
                    localStorage.setItem('talha_store_license', storeLicense);
                    localStorage.setItem('talha_store_logo', storeLogoUrl);
                    await onUpdateStoreAddress(address);
                    setIsUpdatingProfile(false);
                    setStatusMessage({ type: 'success', text: 'Store profile, branding, and address successfully updated!' });
                  }}
                  className="bg-teal-800 hover:bg-teal-900 text-white px-4 py-2 rounded-lg font-bold text-xs cursor-pointer shadow-sm disabled:opacity-60"
                >
                  {isUpdatingProfile ? 'Saving Profile...' : 'Save All Branding Changes'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Terminal Metadata</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Branch Name</label>
                <input readOnly value="Main Branch - Term-01" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium text-slate-800 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cloud ID</label>
                <input readOnly value="FIRESTORE-PK-TALHA-01" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-medium text-slate-800 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Currency</label>
                <input readOnly value="PKR (Rs.)" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium text-slate-800 focus:outline-none" />
              </div>

              {onSignOut && (
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={onSignOut}
                    className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 hover:border-red-200 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Lock Terminal / Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
