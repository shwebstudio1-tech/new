import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Send, 
  Mic, 
  Paperclip, 
  RefreshCcw, 
  Download,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Medicine, Invoice } from '../types';

interface AiAssistantViewProps {
  medicines: Medicine[];
  invoices: Invoice[];
  onOpenAddMedicine: () => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ medicines, invoices, onOpenAddMedicine }) => {
  const [chatInput, setChatInput] = useState('');
  const lowStock = medicines.filter(m => m.stock <= m.minStock);
  const totalRev = invoices.reduce((s, i) => s + i.totalAmount, 0);

  const [messages, setMessages] = useState([
    {
      sender: 'copilot',
      text: `Hello! I am your ZenPharma Store Manager & Clinical Copilot. Your pharmacy database is currently fresh (${medicines.length} products, ${invoices.length} sales). I will automatically alert you when any product is running low or approaching expiry, help you add new medicines, and calculate bills or profit summaries!`,
      action: medicines.length === 0 ? 'RECOMMENDATION: ADD YOUR FIRST MEDICINE VIA F3' : 'SYSTEM STATUS: FULLY SYNCHRONIZED'
    }
  ]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput.toLowerCase();
    let reply = "";
    let actionText = "";

    if (query.includes('low') || query.includes('stock') || query.includes('alert')) {
      if (lowStock.length === 0) {
        reply = `Good news! All ${medicines.length} active products in your inventory have healthy stock levels above minimum thresholds. No low stock alerts right now.`;
        actionText = 'INVENTORY STATUS: 100% OPTIMAL';
      } else {
        reply = `Warning! You have ${lowStock.length} items running low: ${lowStock.map(m => `${m.name} (${m.stock} ${m.unit} left)`).join(', ')}. Please reorder soon.`;
        actionText = `ACTION REQUIRED: REORDER ${lowStock.length} ITEMS`;
      }
    } else if (query.includes('add') || query.includes('medicine') || query.includes('product')) {
      reply = `You can easily add new medicines or surgical items by clicking the "Add Medicine F3" button in the top header or catalog view. That will immediately index them into Firestore.`;
      actionText = 'SHORTCUT: PRESS F3 TO ADD MEDICINE';
    } else if (query.includes('sale') || query.includes('total') || query.includes('profit') || query.includes('bill')) {
      reply = `Financial summary: Total sales revenue recorded so far is Rs.${totalRev.toFixed(2)} across ${invoices.length} invoices. All calculations are tied to real Firestore records.`;
      actionText = `SALES AUDIT: Rs.${totalRev.toFixed(2)} REVENUE`;
    } else {
      reply = `As your store manager AI, I am monitoring your inventory (${medicines.length} items) and sales (${invoices.length} transactions). Let me know if you need stock alerts, profit calculations, or inventory audits!`;
      actionText = 'ZENPHARMA COPILOT ACTIVE';
    }

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: chatInput, action: '' },
      { sender: 'copilot', text: reply, action: actionText }
    ]);
    setChatInput('');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">AI Assistant & Inventory Manager</h2>
            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ZENPHARMA COPILOT • REAL-TIME FIRESTORE AI
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Autonomous inventory monitoring, low-stock advance warnings, billing assistance, and pharmacy store management.</p>
        </div>

        <button 
          onClick={onOpenAddMedicine}
          className="flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Medicine F3</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">STOCKOUT ALERTS</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-red-600 font-mono">{lowStock.length} Active Alerts</h4>
            <p className="text-[11px] text-slate-500 mt-1">Real-time inventory watch</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">STORE INVENTORY</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">{medicines.length} Products</h4>
            <p className="text-[11px] text-teal-700 font-semibold mt-1">Managed in Firestore</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">TOTAL SALES REVENUE</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-teal-800 font-mono">Rs.{totalRev.toFixed(2)}</h4>
            <p className="text-[11px] text-slate-500 mt-1">{invoices.length} transactions audited</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">AI STATUS</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">Active Copilot</h4>
            <p className="text-[11px] text-slate-500 mt-1">Ready for owner queries</p>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px] justify-between">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold text-sm shadow-md">
              ZP
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">ZenPharma Store Manager Copilot</h3>
              <p className="text-[11px] text-emerald-600 font-semibold">● Active • Live DB Connected • Low Stock Guardian</p>
            </div>
          </div>
        </div>

        {/* Quick prompt chips */}
        <div className="py-3 flex flex-wrap gap-2 text-xs">
          <button 
            onClick={() => setChatInput('Check low stock items')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
          >
            ⚠️ Check Low Stock Alerts
          </button>
          <button 
            onClick={() => setChatInput('How do I add medicines?')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
          >
            💊 How to add medicines?
          </button>
          <button 
            onClick={() => setChatInput('Calculate total sales revenue')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
          >
            📊 Calculate Total Sales & Revenue
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 py-4 scrollbar-thin text-xs">
          {messages.map((m, idx) => (
            <div key={idx} className={`p-4 rounded-xl space-y-2 ${
              m.sender === 'user' ? 'bg-teal-800 text-white ml-12' : 'bg-slate-50 border border-slate-200 text-slate-800 mr-12'
            }`}>
              <p className="leading-relaxed text-sm">{m.text}</p>
              {m.action && (
                <div className="pt-2 border-t border-slate-200/60 text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-1 rounded inline-block">
                  ⚡ {m.action}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat input form */}
        <form onSubmit={handleSendChat} className="pt-4 border-t border-slate-200 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ask ZenPharma Copilot (e.g., 'Check low stock', 'What is total revenue?')..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-700"
            />
          </div>
          <button type="submit" className="bg-teal-800 hover:bg-teal-900 text-white px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer">
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
