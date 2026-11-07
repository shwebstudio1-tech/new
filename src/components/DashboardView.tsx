import React, { useState } from 'react';
import { 
  TrendingUp, 
  Receipt, 
  Boxes, 
  AlertTriangle, 
  Clock, 
  Percent, 
  ArrowUpRight, 
  Printer, 
  FileText, 
  CheckCircle2, 
  Scan, 
  ShieldCheck,
  ChevronRight,
  Filter,
  Sparkles
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Medicine, Invoice, TabType } from '../types';
import { velocityData } from '../mockData';

interface DashboardViewProps {
  medicines: Medicine[];
  invoices: Invoice[];
  setCurrentTab: (tab: TabType) => void;
  onOpenQuickSale: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  medicines, 
  invoices, 
  setCurrentTab,
  onOpenQuickSale 
}) => {
  const [timeRange, setTimeRange] = useState<'today' | 'yesterday' | '7days' | 'month' | 'custom'>('today');
  const [chartMode, setChartMode] = useState<'hourly' | 'weekly'>('hourly');
  const [barcodeInput, setBarcodeInput] = useState('8901030421');
  const [scanVerified, setScanVerified] = useState(true);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-red-900">
              Stock Attention Requisite: 8 vital items are below safety threshold and 3 active batches reach expiry in ≤15 days.
            </h3>
            <p className="text-[11px] text-red-700 mt-0.5">
              8 LOW STOCK &nbsp;|&nbsp; 3 BATCHES &lt; 15D
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentTab('inventory')}
            className="bg-red-700 hover:bg-red-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Review & Auto-Reorder</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sub Header / Time Range Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>DISPENSARY OPERATIONS ACTIVE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Telemetry Sync</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Executive Operations Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">Wednesday, Oct 24, 2024 &nbsp;•&nbsp; Shift #0419 (Morning Dispensary) &nbsp;•&nbsp; TERMINAL-01</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time pills */}
          <div className="bg-slate-100 p-1 rounded-lg flex items-center text-xs font-medium">
            <button 
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1.5 rounded-md transition-all ${timeRange === 'today' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              TODAY
            </button>
            <button 
              onClick={() => setTimeRange('yesterday')}
              className={`px-3 py-1.5 rounded-md transition-all ${timeRange === 'yesterday' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              YESTERDAY
            </button>
            <button 
              onClick={() => setTimeRange('7days')}
              className={`px-3 py-1.5 rounded-md transition-all ${timeRange === '7days' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              7 DAYS
            </button>
            <button 
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 rounded-md transition-all ${timeRange === 'month' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              THIS MONTH
            </button>
            <button 
              onClick={() => setTimeRange('custom')}
              className={`px-3 py-1.5 rounded-md transition-all ${timeRange === 'custom' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Custom 📅
            </button>
          </div>

          <button 
            onClick={onOpenQuickSale}
            className="flex items-center gap-1.5 bg-teal-800 hover:bg-teal-900 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>New Sale F2</span>
          </button>

          <button 
            onClick={() => setCurrentTab('inventory')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Boxes className="w-3.5 h-3.5 text-teal-700" />
            <span>Receive Stock F4</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Today's Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">TODAY'S REVENUE</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">Rs.4,892.40</h4>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.2% vs yesterday</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>CASH: Rs.2,840</span>
            <span>CARD: Rs.1,750</span>
            <span>DIGITAL: Rs.302</span>
          </div>
        </div>

        {/* Today's Invoices */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">TODAY'S INVOICES</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">148 Txns</h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-1">
              <span className="bg-slate-100 px-1.5 py-0.5 rounded font-medium">12 Prescriptions</span>
              <span className="text-teal-700 font-semibold">Rx verified</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>AVG TICKET</span>
            <span className="font-mono font-bold text-slate-800">Rs.33.05</span>
          </div>
        </div>

        {/* Active Inventory */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">ACTIVE INVENTORY</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 font-mono">3,428 SKUs</h4>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">98.4% Available in-shelf</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>SURGICAL: 42 Lines</span>
            <span>CONSUMABLES</span>
          </div>
        </div>

        {/* Reorder Warnings */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">REORDER WARNINGS</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-red-600 font-mono">8 Items</h4>
            <p className="text-[11px] text-red-600 font-semibold mt-1">● Below Safety Stock</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600 font-medium">
            <span>URGENT POS</span>
            <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">3 Required</span>
          </div>
        </div>

        {/* Approaching Expiry */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">APPROACHING EXPIRY</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-orange-600 font-mono">6 Batches</h4>
            <p className="text-[11px] text-slate-600 mt-1">&lt; 30 Days Left action flag</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>RISK VALUE</span>
            <span className="font-mono font-bold text-slate-800">Rs.418.00</span>
          </div>
        </div>

        {/* Gross Profit Margin */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">GROSS PROFIT MARGIN</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-teal-800 font-mono">32.6%</h4>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+1.8% this week</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>EST. NET PROFIT</span>
            <span className="font-mono font-bold text-slate-800">Rs.1,595.00</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Right Sidebar (Urgent Stock & Category Mix) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue & Velocity Chart + Barcode Scanner */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Revenue & Prescription Velocity</h3>
                  <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200">
                    Live Telemetry
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Peak dispensary load tracking across operative business hours</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-1 rounded-lg flex items-center text-xs font-medium">
                  <button 
                    onClick={() => setChartMode('hourly')}
                    className={`px-3 py-1 rounded-md transition-all ${chartMode === 'hourly' ? 'bg-teal-800 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Hourly Velocity
                  </button>
                  <button 
                    onClick={() => setChartMode('weekly')}
                    className={`px-3 py-1 rounded-md transition-all ${chartMode === 'weekly' ? 'bg-teal-800 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    7-Day Trend
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-teal-800"></span> Revenue</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-sky-400"></span> Margin</span>
                </div>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F766E" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0F766E" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorMargin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="velocity" stroke="#0F766E" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Velocity Index" />
                  <Area type="monotone" dataKey="margin" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#colorMargin)" name="Margin Index" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom Chart Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-100 text-xs">
              <div>
                <p className="text-slate-400 font-medium">CURRENT SPEED</p>
                <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">18 txns / hr</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">PEAK HOURLY FLOW</p>
                <p className="text-sm font-bold text-teal-800 font-mono mt-0.5">Rs.782.50 @ 18:00</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">RX / OTC RATIO</p>
                <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">1 : 3.8 OTC bias</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">DISPENSARY CYCLE</p>
                <p className="text-sm font-bold text-teal-800 font-mono mt-0.5">Avg 1m 42s / checkout</p>
              </div>
            </div>
          </div>

          {/* Rapid Barcode Verification & NDC Scanner Check */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <Scan className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Rapid Barcode Verification & NDC Scanner Check</h4>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-mono font-bold text-slate-800 w-36 focus:outline-none focus:border-teal-700"
                  />
                  <button 
                    onClick={() => setScanVerified(true)}
                    className="bg-teal-800 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-teal-900 transition-colors cursor-pointer"
                  >
                    VERIFY
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Hardware Scanner Connected</span>
              </div>
              {scanVerified && (
                <div className="bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <div>
                    <p className="text-xs font-bold text-teal-900">Augmentin 625mg (A...</p>
                    <p className="text-[10px] text-slate-500">Rack C-02 • Batch #AUG-...</p>
                  </div>
                  <span className="bg-teal-800 text-white font-bold text-[10px] px-2 py-0.5 rounded">14 IN STOCK</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Urgent Stock Watchlist & Category Sales Mix */}
        <div className="space-y-6">
          {/* Urgent Stock Watchlist */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Urgent Stock Watchlist</h3>
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  4 Actionable
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mb-4">Items requiring inventory reallocation or distributor reordering</p>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Augmentin 625mg Tab <span className="font-mono text-[10px] text-slate-500">#AUG-991</span></h4>
                    <p className="text-[10px] text-slate-500">GSK Pharma • 14 boxes left</p>
                  </div>
                  <span className="bg-red-100 text-red-700 font-bold text-[10px] px-2 py-0.5 rounded">
                    EXP: 12 DAYS
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-600">
                  <span>Rack B-04</span>
                  <button onClick={() => setCurrentTab('inventory')} className="text-teal-700 font-bold hover:underline cursor-pointer">Reorder →</button>
                </div>
              </div>

              {/* Item 2 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Ciproflox 500mg <span className="font-mono text-[10px] text-slate-500">#CPX-102</span></h4>
                    <p className="text-[10px] text-slate-500">Square Health • 6 strips left</p>
                  </div>
                  <span className="bg-red-100 text-red-700 font-bold text-[10px] px-2 py-0.5 rounded">
                    EXP: 19 DAYS
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-600">
                  <span>Rack A-11</span>
                  <button onClick={() => setCurrentTab('inventory')} className="text-teal-700 font-bold hover:underline cursor-pointer">Reorder →</button>
                </div>
              </div>

              {/* Item 3 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Disposable Gloves (100s) <span className="bg-teal-50 text-teal-800 text-[9px] px-1 rounded font-bold">SURGICAL</span></h4>
                    <p className="text-[10px] text-slate-500">Stock: 2 boxes (Min Level: 10)</p>
                  </div>
                  <span className="bg-red-100 text-red-700 font-bold text-[10px] px-2 py-0.5 rounded">
                    LOW STOCK
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-600">
                  <span>Depot Floor</span>
                  <button onClick={() => setCurrentTab('inventory')} className="text-teal-700 font-bold hover:underline cursor-pointer">Restock →</button>
                </div>
              </div>

              {/* Item 4 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Insulin Glargine 100 IU <span className="bg-sky-50 text-sky-700 text-[9px] px-1 rounded font-bold">COLD CHAIN</span></h4>
                    <p className="text-[10px] text-slate-500">Stock: 4 vials (Min Level: 8)</p>
                  </div>
                  <span className="bg-red-700 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                    CRITICAL 2-8°C
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-600">
                  <span>Fridge #1</span>
                  <button onClick={() => setCurrentTab('inventory')} className="text-teal-700 font-bold hover:underline cursor-pointer">Transfer →</button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setCurrentTab('inventory')}
              className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-teal-700" />
              <span>Generate Supplier Reorder Draft</span>
            </button>
          </div>

          {/* Category Sales Mix */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Category Sales Mix</h3>
            <p className="text-[11px] text-slate-500 mb-4">Today's breakdown by revenue share</p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-800">Antibiotics & Antimicrobials</span>
                  <span className="font-bold text-slate-900">34% ($1,663)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-700 h-full rounded-full" style={{ width: '34%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-800">Chronic Care & Cardiovascular</span>
                  <span className="font-bold text-slate-900">26% ($1,272)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-600 h-full rounded-full" style={{ width: '26%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-800">Pain Relief & Analgesics</span>
                  <span className="font-bold text-slate-900">22% ($1,076)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: '22%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span className="text-slate-800">Surgical & Dressing Supplies</span>
                  <span className="font-bold text-slate-900">18% ($881)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Fastest Velocity:</span>
              <span className="font-bold text-teal-800">Amoxicillin 500mg 48 Units</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Dispensary Transactions & Register Activity Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Recent Dispensary Transactions & Register Activity</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Real-time audit log of checkout slips, patient prescriptions, and invoice totals</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Filter invoices..."
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-700 w-48"
              />
            </div>
            <button 
              onClick={() => setCurrentTab('sales')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              FILTER
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-3.5 pl-4">INVOICE #</th>
                <th className="p-3.5">TIME</th>
                <th className="p-3.5">CUSTOMER / PATIENT</th>
                <th className="p-3.5">DOCTOR / PRESCRIBER</th>
                <th className="p-3.5">DISPENSED LINE ITEMS</th>
                <th className="p-3.5">AMOUNT</th>
                <th className="p-3.5">METHOD</th>
                <th className="p-3.5">CASHIER</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5 pr-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 pl-4 font-mono font-bold text-teal-800">{inv.invoiceNumber}</td>
                  <td className="p-3.5 text-slate-500">
                    <div>{inv.time}</div>
                    <div className="text-[10px] text-slate-400">{inv.date}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{inv.customerName}</div>
                    <div className="text-[10px] text-slate-500">{inv.customerType}</div>
                  </td>
                  <td className="p-3.5 text-slate-600">{inv.doctor}</td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-800">{inv.items.length} Items</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-xs">
                      {inv.items.map(i => i.name).join(', ')}
                    </div>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-900">${inv.totalAmount.toFixed(2)}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.paymentMethod === 'CASH' ? 'bg-emerald-100 text-emerald-800' :
                      inv.paymentMethod === 'VISA CARD' ? 'bg-sky-100 text-sky-800' :
                      inv.paymentMethod === 'MOBILE PAY' ? 'bg-purple-100 text-purple-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {inv.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3.5">{inv.cashier}</td>
                  <td className="p-3.5">
                    <span className="bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded text-[10px] font-bold">
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3.5 pr-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setCurrentTab('sales')}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                        title="View Receipt"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setCurrentTab('sales')}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                        title="Print Slip"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>Showing 5 of 148 transactions today</span>
          <span className="font-bold text-teal-800">Register Balance Audited: $1,420.50</span>
        </div>
      </div>
    </div>
  );
};
