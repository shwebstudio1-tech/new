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
  setCurrentTab: (tab: TabType) => void;
  onSignOut?: () => void;
  expectedCredentials: { username: string; password: string };
  onUpdatePassword: (newPass: string) => Promise<boolean>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  onWipeDatabase, 
  setCurrentTab, 
  onSignOut,
  expectedCredentials,
  onUpdatePassword
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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
                <h3 className="text-sm font-bold text-slate-900">Security & Password Management</h3>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Store Account: <strong className="text-teal-800">{expectedCredentials.username}</strong></span>
            </div>

            <form onSubmit={handlePasswordChange} className="p-6 space-y-5">
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
              <h3 className="text-sm font-bold text-slate-900">Database Maintenance</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900">Master Database Wipe</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Permanently remove all transaction history, invoices, and medicine inventory from the Firestore cloud database. This action is irreversible and primarily intended for system handover or fresh production initialization.
                  </p>
                  <button
                    onClick={onWipeDatabase}
                    className="mt-2 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>EXECUTE MASTER WIPE</span>
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900">Force Global Re-Sync (Hard Reset)</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    If deleted items reappear, use this to force a full cloud re-sync. This clears the local browser cache and re-downloads the latest data from Firestore.
                  </p>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                    className="mt-2 flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>FORCE RE-SYNC & CLEAR CACHE</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
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
