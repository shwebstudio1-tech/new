import React from 'react';
import { Building2, CheckCircle2, ShieldCheck, Sparkles, Plus } from 'lucide-react';
import { TabType } from '../types';

interface PlaceholderViewProps {
  title: string;
  description: string;
  tabType: TabType;
  setCurrentTab: (tab: TabType) => void;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title, description, tabType, setCurrentTab }) => {
  return (
    <div className="p-6 max-w-[1600px] mx-auto select-none space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
            <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200">
              ACTIVE MODULE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        </div>

        <button className="flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Add New Record</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto shadow-inner">
          <Building2 className="w-8 h-8" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-base font-bold text-slate-900">{title} Module Initialized</h3>
          <p className="text-xs text-slate-500">
            All records, supplier integration pipelines, DRAP compliance checks, and secure ledger logs are synchronized in real-time across Main Branch - Term-01.
          </p>
        </div>
        <div className="pt-4 flex justify-center gap-3">
          <button 
            onClick={() => setCurrentTab('dashboard')}
            className="bg-teal-800 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-teal-900 transition-colors"
          >
            Return to Dashboard
          </button>
          <button 
            onClick={() => setCurrentTab('pos')}
            className="bg-slate-100 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Open POS Terminal F2
          </button>
        </div>
      </div>
    </div>
  );
};
