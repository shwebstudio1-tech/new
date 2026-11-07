import React from 'react';
import { Settings as SettingsIcon, ShieldAlert, Database, Save, Trash2, RefreshCw } from 'lucide-react';
import { TabType } from '../types';

interface SettingsViewProps {
  onWipeDatabase: () => void;
  setCurrentTab: (tab: TabType) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onWipeDatabase, setCurrentTab }) => {
  return (
    <div className="p-6 max-w-[1600px] mx-auto select-none space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">System Settings & Data Management</h2>
            <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200">
              ADMIN CONTROL
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Configure terminal parameters, branch identifiers, and database maintenance protocols.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
