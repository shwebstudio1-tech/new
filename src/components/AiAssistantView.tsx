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
  ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { aiForecastData } from '../mockData';

export const AiAssistantView: React.FC = () => {
  const [forecastHorizon, setForecastHorizon] = useState<'14days' | '30days' | '90days'>('14days');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'copilot',
      text: 'Based on regional epidemiological reporting from Dr. Farhan Ali’s Pulmonary Clinic and acute respiratory infections (+38% YoY), coupled with an Air Quality Index peak (AQI 320 smog wave), pediatric & adult amoxicillin/clavulanic acid prescriptions will peak between Nov 8–18. Current stock (14 boxes) creates critical runout risk in 72 hours. Recommended safety stock: 150 boxes before supplier order deadline on Thursday 3:00 PM.',
      action: 'ACTIONABLE RECOMMENDATION: GSK PO PO-GSK-9921'
    }
  ]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: chatInput, action: '' },
      { 
        sender: 'copilot', 
        text: `Analysis complete for "${chatInput}". Autonomous telemetry confirms stock reserves are sufficient for normal demand, but reorder triggers are active for cold chain items.`,
        action: 'RECOMMENDED ACTION: REVIEW AUTO-REORDER'
      }
    ]);
    setChatInput('');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">AI Assistant & Demand Forecasting</h2>
            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              MODEL: ZENPHARMA-PREDICT V3.2 • REAL-TIME TELEMETRY ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Autonomous predictive inventory reordering, seasonal disease surge analytics, and conversational pharmacy copilot for clinical dispatch precision.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-lg flex items-center text-xs font-medium">
            <button 
              onClick={() => setForecastHorizon('14days')}
              className={`px-3 py-1.5 rounded-md transition-all ${forecastHorizon === '14days' ? 'bg-teal-800 text-white font-bold shadow-sm' : 'text-slate-600'}`}
            >
              Next 14 Days
            </button>
            <button 
              onClick={() => setForecastHorizon('30days')}
              className={`px-3 py-1.5 rounded-md transition-all ${forecastHorizon === '30days' ? 'bg-teal-800 text-white font-bold shadow-sm' : 'text-slate-600'}`}
            >
              Next 30 Days
            </button>
            <button 
              onClick={() => setForecastHorizon('90days')}
              className={`px-3 py-1.5 rounded-md transition-all ${forecastHorizon === '90days' ? 'bg-teal-800 text-white font-bold shadow-sm' : 'text-slate-600'}`}
            >
              Next 90 Days
            </button>
          </div>

          <button className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer">
            <RefreshCcw className="w-3.5 h-3.5 text-teal-700" />
            <span>Recalculate Projections</span>
          </button>
          <button className="flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export AI Audit Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">STOCKOUT RISK AVERTED</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">99.4% <span className="text-xs font-normal text-emerald-600 font-semibold">+2.3% QTD</span></h4>
            <p className="text-[11px] text-slate-500 mt-1">Predicted 14 potential stockouts in next 14 days</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">RECOMMENDED PO CAPITAL</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">$14,850.00</h4>
            <p className="text-[11px] text-teal-700 font-semibold mt-1">Optimal replenishment across 24 critical SKUs</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">SEASONAL SURGE FORECAST</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-red-600 font-mono">+38.5% <span className="text-xs font-normal text-slate-600">Resp & Flu</span></h4>
            <p className="text-[11px] text-slate-500 mt-1">Winter flu vector detected via regional telemetry</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">FORECAST ACCURACY (MPE)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">96.2% <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold ml-1">High Sig</span></h4>
            <p className="text-[11px] text-slate-500 mt-1">Trained on 24mo POS logs, weather & clinic scripts</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Chart & Right Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Predictive Demand Curves Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Predictive Demand Curves & Disease Pattern Forecasting</h3>
                <p className="text-xs text-slate-500 mt-0.5">Epidemiological time-series extrapolation mapped to real store dispensations</p>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="px-2.5 py-1 bg-slate-100 rounded text-slate-700">Aggressive (Surge)</span>
                <span className="px-2.5 py-1 bg-teal-800 text-white rounded">Expected (Baseline)</span>
                <span className="px-2.5 py-1 bg-slate-100 rounded text-slate-700">Conservative</span>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={aiForecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSurge" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F766E" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0F766E" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                  />
                  <Area type="monotone" dataKey="surge" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorSurge)" name="Surge Vector Boundary" />
                  <Area type="monotone" dataKey="projected" stroke="#0F766E" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProjected)" name="AI Projected Trajectory" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Sub chart info banner */}
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                <span className="font-bold text-red-900">SMOG / ALLERGY PEAK:</span>
                <span className="text-red-700 font-medium">+52% Anti-Histamines &nbsp;|&nbsp; VIRAL FLU INFLUX (WIK 3): +45% Amox/Clav</span>
              </div>
            </div>

            {/* Bottom 3 metrics */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100 text-xs">
              <div>
                <p className="text-slate-400 font-medium">PEAK SALES DAY</p>
                <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">Nov 12 ($7,240 est)</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">STOCK RUNOUT BUFFER</p>
                <p className="text-sm font-bold text-teal-800 font-mono mt-0.5">4.2 Days Avg</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">MARGIN IMPACT</p>
                <p className="text-sm font-bold text-emerald-600 font-mono mt-0.5">+$2,140 Saved</p>
              </div>
            </div>
          </div>

          {/* Autonomous Replenishment Engine & Triggers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Autonomous Replenishment Engine</h4>
                  <p className="text-[10px] text-slate-500">Recommended purchase quantities dynamically calculated from current burn rates</p>
                </div>
                <span className="bg-red-100 text-red-700 font-bold text-[10px] px-2 py-0.5 rounded">
                  18 Actionable Orders
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">Augmentin 625mg Tab</span>
                    <p className="text-[10px] text-red-600 font-semibold">14 boxes remaining (Runs out in 3 days)</p>
                  </div>
                  <span className="font-mono font-bold text-teal-800">150 boxes ($1,260)</span>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">Panadol Extra 500mg</span>
                    <p className="text-[10px] text-orange-600 font-semibold">22 strips remaining (Runs out in 5 days)</p>
                  </div>
                  <span className="font-mono font-bold text-teal-800">250 strips ($275)</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Telemetry Optimization Directives</h4>
                  <p className="text-[10px] text-slate-500">Automated clinical substitutes and capital recovery</p>
                </div>
                <span className="bg-teal-50 text-teal-800 font-bold text-[10px] px-2 py-0.5 rounded border border-teal-200">
                  2 ACTIVE TRIGGERS
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-red-50/80 border border-red-200 rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-900">⚠️ Near-Expiry Bundle Suggestion</span>
                    <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded">Exp: 42 Days</span>
                  </div>
                  <p className="text-[10px] text-slate-600">14 boxes of Ciprofloxacin 500mg expire in 42 days. AI recommends 15% surgical discount to recover $95.20 margin.</p>
                  <button className="bg-red-700 text-white px-2.5 py-1 rounded text-[10px] font-semibold hover:bg-red-800 transition-colors">
                    Deploy Ward Discount
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: ZenPharma Clinical Copilot Chat */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-fit sticky top-20">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-xs">
                  ZP
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">ZenPharma Clinical Copilot</h3>
                  <p className="text-[10px] text-emerald-600 font-semibold">● Active • Dr. Sarah Khan Context Loaded</p>
                </div>
              </div>
            </div>

            {/* Quick prompt chips */}
            <div className="py-3 flex flex-wrap gap-1.5 text-[11px]">
              <button 
                onClick={() => setChatInput('Explain Flu Surge')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-medium transition-colors"
              >
                💡 Explain Flu Surge
              </button>
              <button 
                onClick={() => setChatInput('Draft Top 3 POs')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-medium transition-colors"
              >
                📋 Draft Top 3 POs
              </button>
              <button 
                onClick={() => setChatInput('Audit Expiry Risk')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-medium transition-colors"
              >
                ⚠️ Audit Expiry Risk
              </button>
            </div>

            {/* Chat messages */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1 py-2 scrollbar-thin text-xs">
              {messages.map((m, idx) => (
                <div key={idx} className={`p-3 rounded-xl space-y-2 ${
                  m.sender === 'user' ? 'bg-teal-800 text-white ml-6' : 'bg-slate-50 border border-slate-200 text-slate-800 mr-6'
                }`}>
                  <p className="leading-relaxed">{m.text}</p>
                  {m.action && (
                    <div className="pt-2 border-t border-slate-200/60 text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-1 rounded">
                      ⚡ {m.action}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat input form */}
          <form onSubmit={handleSendChat} className="mt-4 pt-3 border-t border-slate-200 space-y-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask ZenPharma about stock, pricing, disease surges..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-20 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-700"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
                <Mic className="w-4 h-4 hover:text-slate-600 cursor-pointer" />
                <Paperclip className="w-4 h-4 hover:text-slate-600 cursor-pointer" />
                <button type="submit" className="w-6 h-6 rounded bg-teal-800 text-white flex items-center justify-center hover:bg-teal-900 cursor-pointer">
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
