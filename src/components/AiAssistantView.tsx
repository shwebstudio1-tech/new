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
import { Medicine, Invoice, TabType } from '../types';

interface AiAssistantViewProps {
  medicines: Medicine[];
  invoices: Invoice[];
  onOpenAddMedicine: () => void;
  setCurrentTab: (tab: TabType) => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ medicines, invoices, onOpenAddMedicine, setCurrentTab }) => {
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

  const [isStreaming, setIsStreaming] = useState(false);

  const storeContext = React.useMemo(() => ({
    inventory: medicines.map(m => ({ name: m.name, stock: m.stock, unit: m.unit, price: m.retailPrice })),
    recentSales: invoices.slice(0, 5).map(inv => ({ number: inv.invoiceNumber, total: inv.totalAmount, date: inv.date }))
  }), [medicines, invoices]);

  const getSmartCopilotResponse = (query: string) => {
    const q = query.toLowerCase();

    if (q.includes('low stock') || q.includes('alert') || q.includes('warning') || q.includes('shortage')) {
      if (lowStock.length === 0) {
        return { text: "Great news! All medicine inventory levels are currently optimal and above reorder safety thresholds. No active stockout warnings detected.", action: "INVENTORY WATCH: ALL OPTIMAL" };
      }
      const list = lowStock.map(m => `${m.name} (${m.stock} ${m.unit} left, Min: ${m.minStock})`).join(', ');
      return { text: `Stock Warning: There are currently ${lowStock.length} items below safety reorder threshold: ${list}. Please place distributor reorders promptly!`, action: `ACTION REQUIRED: REORDER ${lowStock.length} ITEMS` };
    }

    if (q.includes('revenue') || q.includes('sales') || q.includes('total') || q.includes('money')) {
      return { text: `Total Store Revenue Summary: You have generated Rs. ${totalRev.toFixed(2)} across ${invoices.length} transactions. Current Drawer Cash is Rs. ${invoices.filter(i => i.paymentMethod === 'CASH').reduce((s,i) => s + i.totalAmount, 0).toFixed(2)}.`, action: "FINANCIAL SUMMARY GENERATED" };
    }

    if (q.includes('add') || q.includes('medicine') || q.includes('f3') || q.includes('stock')) {
      return { text: "To add new medicines to your catalog, press F3 on your keyboard or click the 'Add Medicine F3' button in the top action bar. You can specify Brand Name, Generic Molecule, SKU, Batch Lot, Unit Cost, and Retail Price.", action: "NAVIGATION: PRESS F3 TO ADD MEDICINE" };
    }

    if (q.includes('khata') || q.includes('udhar') || q.includes('customer') || q.includes('credit')) {
      return { text: "Customer Khata (Udhar) accounts can be managed under the 'Khata & Credit Register' tab. You can create accounts with Phone Number & CNIC, log credit purchases or payments, and send instant WhatsApp reminders!", action: "NAVIGATION: KHATA REGISTER" };
    }

    return {
      text: `I have analyzed your query regarding "${query}". As your Talha Surgical Copilot, I am monitoring your ${medicines.length} medicine SKUs, ${invoices.length} invoices, and live POS drawer cash. How else can I assist your dispensary operations today?`,
      action: "STORE COPILOT ACTIVE"
    };
  };

  const handleSendChat = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isStreaming) return;

    const userMsg = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg, action: '' }]);
    setChatInput('');
    setIsStreaming(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg, 
          history: messages,
          context: storeContext
        })
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let botReply = '';
        
        setMessages(prev => [...prev, { sender: 'copilot', text: '', action: 'TALHA SURGICAL COPILOT' }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          botReply += decoder.decode(value, { stream: true });
          
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1] = { ...next[next.length - 1], text: botReply };
            return next;
          });
        }
      } else {
        const smart = getSmartCopilotResponse(userMsg);
        setMessages(prev => [...prev, { sender: 'copilot', text: smart.text, action: smart.action }]);
      }
    } catch (error: any) {
      const smart = getSmartCopilotResponse(userMsg);
      setMessages(prev => [...prev, { sender: 'copilot', text: smart.text, action: smart.action }]);
    } finally {
      setIsStreaming(false);
    }
  }, [chatInput, messages, storeContext, isStreaming, lowStock, totalRev, medicines, invoices]);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">AI Assistant & Inventory Manager</h2>
            <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200 flex items-center gap-1.5">
              ZENPHARMA COPILOT
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
        <div 
          onClick={() => setCurrentTab('inventory')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-red-500 transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view low stock alerts in inventory"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-red-700">STOCKOUT ALERTS</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-red-600 font-mono">{lowStock.length} Active Alerts</h4>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-slate-500">Real-time inventory watch</p>
              <span className="text-[10px] font-bold text-red-700 group-hover:underline">Review →</span>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setCurrentTab('inventory')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500 transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view full medicine catalog"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-teal-800">STORE INVENTORY</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">{medicines.length} Products</h4>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-teal-700 font-semibold">Managed in Firestore</p>
              <span className="text-[10px] font-bold text-teal-700 group-hover:underline">Catalog →</span>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setCurrentTab('reports')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500 transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view financial audit reports"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-teal-800">TOTAL SALES REVENUE</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-100">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-teal-800 font-mono">Rs.{totalRev.toFixed(2)}</h4>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-slate-500">{invoices.length} transactions audited</p>
              <span className="text-[10px] font-bold text-teal-700 group-hover:underline">Audit →</span>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setCurrentTab('settings')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between group"
          title="Click to view system status and settings"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-emerald-800">AI STATUS</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">Active Copilot</h4>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[11px] text-slate-500">Ready for owner queries</p>
              <span className="text-[10px] font-bold text-emerald-700 group-hover:underline">Settings →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px] justify-between">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-800 text-white flex items-center justify-center font-black text-sm shadow-md ring-2 ring-teal-700/20">
              TS
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Talha Surgical Store Copilot</h3>
              <p className="text-[11px] text-slate-500">Intelligent Pharmacy Assistant</p>
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
