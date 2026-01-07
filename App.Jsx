import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, ComposedChart, ScatterChart, Scatter, Cell,
  PieChart, Pie, Sector, ReferenceLine
} from 'recharts';
import { 
  Globe, TrendingUp, TrendingDown, Users, Factory, Activity, Scale, Droplets, 
  Coffee, Info, CheckSquare, Square, Check, Filter
} from 'lucide-react';

// --- CONFIGURATION & CONSTANTS ---
const ARABICA_MT_FACTOR = 17.01; // 37,500 lbs
const ROBUSTA_MT_FACTOR = 10.00; // 10 MT
const MARGIN_OUTRIGHT = 6000; 
const MARGIN_SPREAD = 1200;   

// Conversion: Cents/lb to USD/Ton = Price * 22.0462
const CENTS_LB_TO_USD_TON = 22.0462;

// --- DATA GENERATION ENGINE ---
const generateComplexData = () => {
  const weeks = 104;
  const data = [];
  
  // Initial states
  let priceNY = 165.00; 
  let priceLDN = 2450.00; 
  let oiNY = 210000;
  let oiLDN = 130000;
  
  // Flow Accumulators
  let cumulativeNominal = 0;
  let cumulativeMargin = 0;

  for (let i = 0; i < weeks; i++) {
    const date = new Date(2023, 0, 1 + (i * 7));
    const isRecent = i > weeks - 2; 
    const isMonth = i > weeks - 5; 
    const isYear = i > weeks - 53; 

    // Random Walks
    priceNY += (Math.random() - 0.48) * 8;
    priceLDN += (Math.random() - 0.48) * 60;
    
    oiNY += (Math.random() - 0.5) * 5000;
    oiLDN += (Math.random() - 0.5) * 3000;
    
    // Spreading Logic
    const spreadingNY = Math.floor(oiNY * (0.18 + Math.random() * 0.04));
    const spreadingLDN = Math.floor(oiLDN * (0.10 + Math.random() * 0.03));
    
    // Combined Metrics
    const totalOI = oiNY + oiLDN;
    
    const priceNY_USD_Ton = priceNY * CENTS_LB_TO_USD_TON;
    const avgPrice_USD_Ton = ((priceNY_USD_Ton * oiNY) + (priceLDN * oiLDN)) / totalOI;

    // --- Flow Calculations ---
    const deltaOINY = i > 0 ? oiNY - data[i-1].oiNY : 0;
    const deltaOILDN = i > 0 ? oiLDN - data[i-1].oiLDN : 0;
    
    const flowNY = (deltaOINY * priceNY * 375) / 1000000; 
    const flowLDN = (deltaOILDN * priceLDN * 10) / 1000000; 
    const weeklyNominalFlow = flowNY + flowLDN;

    const deltaSpread = (spreadingNY + spreadingLDN) - (i > 0 ? (data[i-1].spreadingTotal) : 0);
    const deltaOutright = (totalOI - (spreadingNY + spreadingLDN)) - (i > 0 ? (data[i-1].outrightTotal) : 0);
    const weeklyMarginFlow = ((deltaOutright * MARGIN_OUTRIGHT) + (deltaSpread * MARGIN_SPREAD)) / 1000000;

    cumulativeNominal += weeklyNominalFlow;
    cumulativeMargin += weeklyMarginFlow;

    // --- Macro Flows ---
    const macroMarket = cumulativeNominal * 2.5 + (Math.sin(i/10) * 500);
    const macroSofts = cumulativeNominal * 1.5 + (Math.cos(i/8) * 200);

    // --- Detailed Category Breakdown & Trader Counts ---
    // Simulating breakdown for both OI and Trader Counts
    const breakdown = (oi, baseTraders) => {
        // Ratios
        const r = {
            pmpu: 0.50, mm: 0.25, swap: 0.10, other: 0.05, nonrep: 0.10
        };
        // Trader Count Ratios (Usually more small traders in NonRep/Other)
        const tr = {
            pmpu: 0.15, mm: 0.15, swap: 0.05, other: 0.10, nonrep: 0.55
        };

        return {
            oi: {
                pmpuLong: oi * (r.pmpu * 0.1), pmpuShort: oi * (r.pmpu * 0.9),
                mmLong: oi * (r.mm * 0.7), mmShort: oi * (r.mm * 0.3),
                swapLong: oi * (r.swap * 0.6), swapShort: oi * (r.swap * 0.4),
                otherLong: oi * (r.other * 0.6), otherShort: oi * (r.other * 0.4),
                nonRepLong: oi * (r.nonrep * 0.5), nonRepShort: oi * (r.nonrep * 0.5),
            },
            traders: {
                pmpu: Math.floor(baseTraders * tr.pmpu),
                mm: Math.floor(baseTraders * tr.mm),
                swap: Math.floor(baseTraders * tr.swap),
                other: Math.floor(baseTraders * tr.other),
                nonrep: Math.floor(baseTraders * tr.nonrep)
            }
        };
    };

    const baseTradersNY = 200 + Math.floor(Math.random() * 50);
    const baseTradersLDN = 150 + Math.floor(Math.random() * 40);

    const nyData = breakdown(oiNY, baseTradersNY);
    const ldnData = breakdown(oiLDN, baseTradersLDN);

    // --- Physical (Step 4) ---
    const efp = Math.floor(Math.random() * 1500);

    data.push({
      id: i,
      date: date.toISOString().split('T')[0],
      
      // Prices
      priceNY,
      priceLDN,
      avgPrice_USD_Ton,
      
      // OI
      oiNY,
      oiLDN,
      totalOI,
      spreadingTotal: spreadingNY + spreadingLDN,
      outrightTotal: (oiNY + oiLDN) - (spreadingNY + spreadingLDN),
      
      // Flows
      weeklyNominalFlow,
      weeklyMarginFlow,
      cumulativeNominal,
      cumulativeMargin,
      macroMarket,
      macroSofts,

      // Categories (Granular)
      ny: nyData.oi,
      ldn: ldnData.oi,
      
      // Trader Counts (Granular)
      tradersNY: nyData.traders,
      tradersLDN: ldnData.traders,
      totalTraderCount: baseTradersNY + baseTradersLDN,

      // Physical
      pmpuShortMT_NY: nyData.oi.pmpuShort * ARABICA_MT_FACTOR,
      pmpuShortMT_LDN: ldnData.oi.pmpuShort * ROBUSTA_MT_FACTOR,
      efpMT: efp * ARABICA_MT_FACTOR, 
      
      timeframe: isRecent ? 'current' : isMonth ? 'month' : isYear ? 'year' : 'historical'
    });
  }

  // Step 6 Ranks
  return data.map((d, i) => {
    const slice = data.slice(Math.max(0, i - 52), i + 1);
    const maxP = Math.max(...slice.map(s => s.priceNY));
    const minP = Math.min(...slice.map(s => s.priceNY));
    
    // Net MM NY as proxy
    const net = d.ny.mmLong - d.ny.mmShort;
    const nets = slice.map(s => s.ny.mmLong - s.ny.mmShort);
    
    return {
      ...d,
      priceRank: ((d.priceNY - minP) / (maxP - minP)) * 100,
      oiRank: ((net - Math.min(...nets)) / (Math.max(...nets) - Math.min(...nets))) * 100
    };
  });
};

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-start gap-4 mb-6 border-b border-slate-800 pb-4">
    <div className="p-3 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-lg">
      <Icon size={24} className="text-amber-500" />
    </div>
    <div>
      <h2 className="text-xl font-bold text-slate-100">{title}</h2>
      <p className="text-sm text-slate-400 max-w-2xl">{subtitle}</p>
    </div>
  </div>
);

// --- RADIAL CHART COMPONENT (Step 3) ---
const RadialCounterparty = ({ data }) => {
  const latest = data[data.length - 1];
  
  // Aggregated Data
  const longs = [
    { name: 'Managed Money', value: latest.ny.mmLong + latest.ldn.mmLong, fill: '#f59e0b' },
    { name: 'Swap Dealers', value: latest.ny.swapLong + latest.ldn.swapLong, fill: '#10b981' },
    { name: 'Industry (PMPU)', value: latest.ny.pmpuLong + latest.ldn.pmpuLong, fill: '#3b82f6' },
    { name: 'Other/Non-Rep', value: latest.ny.otherLong + latest.ldn.otherLong, fill: '#64748b' },
  ];

  const shorts = [
    { name: 'Industry (PMPU)', value: latest.ny.pmpuShort + latest.ldn.pmpuShort, fill: '#3b82f6' },
    { name: 'Managed Money', value: latest.ny.mmShort + latest.ldn.mmShort, fill: '#f59e0b' },
    { name: 'Swap Dealers', value: latest.ny.swapShort + latest.ldn.swapShort, fill: '#10b981' },
    { name: 'Other/Non-Rep', value: latest.ny.otherShort + latest.ldn.otherShort, fill: '#64748b' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[350px] w-full">
      <div className="relative h-full w-full bg-slate-800/30 rounded-full border border-slate-800/50 flex flex-col items-center justify-center p-4">
        <h4 className="absolute top-4 text-emerald-400 font-bold text-sm uppercase tracking-widest">LONGS (Buyers)</h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={longs} 
              cx="50%" cy="50%" 
              startAngle={90} endAngle={450}
              innerRadius={60} outerRadius={90} 
              paddingAngle={2} dataKey="value"
            >
              {longs.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} stroke="rgba(0,0,0,0)" />)}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} itemStyle={{fontSize: '11px'}} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="relative h-full w-full bg-slate-800/30 rounded-full border border-slate-800/50 flex flex-col items-center justify-center p-4">
        <h4 className="absolute top-4 text-red-400 font-bold text-sm uppercase tracking-widest">SHORTS (Sellers)</h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={shorts} 
              cx="50%" cy="50%" 
              startAngle={90} endAngle={-270}
              innerRadius={60} outerRadius={90} 
              paddingAngle={2} dataKey="value"
            >
              {shorts.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} stroke="rgba(0,0,0,0)" />)}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} itemStyle={{fontSize: '11px'}} />
             <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function App() {
  const [activeStep, setActiveStep] = useState(1);
  const data = useMemo(() => generateComplexData(), []);
  const latest = data[data.length - 1];

  // --- STEP 1 STATE ---
  const [flowToggles, setFlowToggles] = useState({ market: true, softs: true, coffee: true });
  const toggleFlow = (key) => setFlowToggles(prev => ({ ...prev, [key]: !prev[key] }));

  // --- STEP 2 STATE ---
  const [structMarkets, setStructMarkets] = useState({ ny: true, ldn: false });
  const [structCats, setStructCats] = useState({ pmpu: true, mm: true, swap: true, other: true, nonrep: false });

  // Helper to calculate Step 2 Data
  const processedStructData = useMemo(() => {
      return data.map(d => {
        let stackedData = {};
        const markets = [];
        if (structMarkets.ny) markets.push('ny');
        if (structMarkets.ldn) markets.push('ldn');
        
        ['pmpu', 'mm', 'swap', 'other', 'nonRep'].forEach(cat => {
            let val = 0;
            markets.forEach(m => {
                val += d[m][`${cat}Long`] + d[m][`${cat}Short`];
            });
            stackedData[cat] = val;
        });
        
        // Avg Price Logic
        let price = 0;
        if (structMarkets.ny && structMarkets.ldn) price = d.avgPrice_USD_Ton;
        else if (structMarkets.ny) price = d.priceNY;
        else if (structMarkets.ldn) price = d.priceLDN;
        
        return { ...d, ...stackedData, displayPrice: price };
      });
  }, [data, structMarkets]);

  // --- STEP 4 STATE ---
  const [indView, setIndView] = useState('combined');

  // --- STEP 5 STATE (DRY POWDER) ---
  const [dpMarkets, setDpMarkets] = useState({ ny: true, ldn: true });
  const [dpCats, setDpCats] = useState({ pmpu: true, mm: true, swap: true, other: true, nonrep: true });

  // Helper to calculate Step 5 Data
  const processedDpData = useMemo(() => {
    return data.map(d => {
        let totalVol = 0;
        let totalTraders = 0;
        const markets = [];
        if (dpMarkets.ny) markets.push({ key: 'ny', mt: ARABICA_MT_FACTOR, tr: d.tradersNY });
        if (dpMarkets.ldn) markets.push({ key: 'ldn', mt: ROBUSTA_MT_FACTOR, tr: d.tradersLDN });

        // Iterate through selected markets
        markets.forEach(m => {
            // Iterate through selected categories
            Object.keys(dpCats).forEach(cat => {
                if (dpCats[cat]) {
                    // Volume (Long+Short) * MT Factor
                    const vol = (d[m.key][`${cat}Long`] + d[m.key][`${cat}Short`]) * m.mt;
                    totalVol += vol;
                    // Traders
                    totalTraders += m.tr[cat.toLowerCase()];
                }
            });
        });

        return { ...d, dpVol: totalVol, dpTraders: totalTraders };
    });
  }, [data, dpMarkets, dpCats]);


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <nav className="fixed top-0 left-0 w-20 h-full bg-slate-900 border-r border-slate-800 flex flex-col items-center py-8 z-50">
        <div className="mb-10 p-3 bg-amber-600 rounded-xl shadow-lg">
          <Coffee size={24} className="text-white" />
        </div>
        <div className="flex flex-col gap-8">
          {[
            { id: 1, icon: Globe, label: "Flow" },
            { id: 2, icon: Activity, label: "Struct" },
            { id: 3, icon: Users, label: "Players" },
            { id: 4, icon: Factory, label: "Industry" },
            { id: 5, icon: Droplets, label: "Powder" },
            { id: 6, icon: Scale, label: "Cycle" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveStep(item.id)}
              className={`flex flex-col items-center gap-1 transition-all ${activeStep === item.id ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <item.icon size={20} />
              <span className="text-[9px] font-bold uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pl-20 min-h-screen">
        <div className="max-w-6xl mx-auto p-8">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Coffee Intelligence Unit
              </h1>
              <p className="text-slate-500 text-sm">Framework: Advanced Positioning Flow & Sentiment</p>
            </div>
            <div className="flex items-center gap-6 bg-slate-900 p-4 rounded-xl border border-slate-800">
               <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Combined Spot Avg</p>
                  <p className="text-2xl font-mono text-emerald-400 font-bold">${latest.avgPrice_USD_Ton.toFixed(0)}<span className="text-xs ml-1 font-normal">/ton</span></p>
               </div>
            </div>
          </header>

          <div className="space-y-12">
            
            {/* STEP 1: GLOBAL MONEY FLOW */}
            {activeStep === 1 && (
              <section className="animate-in fade-in slide-in-from-bottom-4">
                <SectionHeader 
                  icon={Globe} 
                  title="1. Global Money Flow" 
                  subtitle="Cumulative Flow Analysis: Compare broad commodity flows vs specific coffee complex flows." 
                />
                
                <div className="flex flex-wrap gap-4 mb-6">
                  {[
                    { key: 'market', label: 'Commodity Market', color: '#94a3b8' },
                    { key: 'softs', label: 'Soft Commodities', color: '#60a5fa' },
                    { key: 'coffee', label: 'Coffee Complex', color: '#f59e0b' }
                  ].map((item) => (
                    <button 
                      key={item.key}
                      onClick={() => toggleFlow(item.key)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all ${
                        flowToggles[item.key] 
                          ? 'bg-slate-800 border-slate-600 text-slate-100' 
                          : 'bg-transparent border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-sm ${flowToggles[item.key] ? 'bg-current' : 'border border-current'}`} style={{ color: item.color }} />
                      <span className="text-xs font-bold">{item.label}</span>
                    </button>
                  ))}
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-[450px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={data.slice(-52)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="date" stroke="#475569" fontSize={10} tickFormatter={v => v.slice(5)} />
                        <YAxis yAxisId="left" stroke="#475569" fontSize={10} label={{ value: 'Cumulative ($M)', angle: -90, position: 'insideLeft', fill: '#475569' }} />
                        <YAxis yAxisId="right" orientation="right" stroke="#475569" fontSize={10} label={{ value: 'Weekly Change ($M)', angle: 90, position: 'insideRight', fill: '#475569' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                        <Legend />
                        
                        {flowToggles.market && <Line yAxisId="left" type="monotone" dataKey="macroMarket" name="Commodity Market" stroke="#94a3b8" strokeWidth={1} dot={false} strokeDasharray="3 3" />}
                        {flowToggles.softs && <Line yAxisId="left" type="monotone" dataKey="macroSofts" name="Soft Commodities" stroke="#60a5fa" strokeWidth={1} dot={false} strokeDasharray="3 3" />}
                        
                        {flowToggles.coffee && (
                          <>
                            <Bar yAxisId="right" dataKey="weeklyMarginFlow" name="Coffee Weekly Flow" fill="#f59e0b" opacity={0.3} barSize={8} />
                            <Line yAxisId="left" type="monotone" dataKey="cumulativeNominal" name="Coffee Nominal (Cum)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                            <Line yAxisId="left" type="monotone" dataKey="cumulativeMargin" name="Coffee Margin-Adj (Cum)" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                          </>
                        )}
                      </ComposedChart>
                    </ResponsiveContainer>
                </div>
              </section>
            )}

            {/* STEP 2: STRUCTURAL INTEGRITY */}
            {activeStep === 2 && (
              <section className="animate-in fade-in slide-in-from-bottom-4">
                <SectionHeader 
                  icon={Activity} 
                  title="2. Structural Integrity (Gross OI)" 
                  subtitle="Select Markets (Mix) and Categories to analyze Open Interest composition." 
                />

                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  {/* Market Select */}
                  <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    {['ny', 'ldn'].map(m => (
                      <button
                        key={m}
                        onClick={() => setStructMarkets(prev => ({ ...prev, [m]: !prev[m] }))}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all uppercase ${structMarkets[m] ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        {m === 'ny' ? 'NY Arabica' : 'LDN Robusta'}
                      </button>
                    ))}
                  </div>

                  {/* Category Select */}
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { k: 'pmpu', l: 'PMPU', c: '#3b82f6' },
                      { k: 'mm', l: 'Managed Money', c: '#f59e0b' },
                      { k: 'swap', l: 'Swap/Index', c: '#10b981' },
                      { k: 'other', l: 'Other Rept', c: '#64748b' },
                      { k: 'nonrep', l: 'Non Rept', c: '#94a3b8' }
                    ].map(cat => (
                      <button
                        key={cat.k}
                        onClick={() => setStructCats(prev => ({ ...prev, [cat.k]: !prev[cat.k] }))}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all ${
                          structCats[cat.k] 
                            ? 'bg-slate-900 border-slate-700 text-slate-200' 
                            : 'bg-transparent border-slate-800 text-slate-600'
                        }`}
                      >
                         <div className={`w-2 h-2 rounded-full ${structCats[cat.k] ? 'bg-current' : 'border border-current'}`} style={{ color: cat.c }} />
                         <span className="text-[10px] font-bold uppercase">{cat.l}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={processedStructData.slice(-52)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#475569" fontSize={10} tickFormatter={v => v.slice(5)} />
                      <YAxis yAxisId="left" stroke="#475569" fontSize={10} label={{ value: 'Open Interest (Lots)', angle: -90, position: 'insideLeft', fill: '#475569' }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#475569" fontSize={10} label={{ value: 'Price', angle: 90, position: 'insideRight', fill: '#475569' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                      <Legend />
                      
                      {structCats.pmpu && <Area yAxisId="left" type="monotone" stackId="1" dataKey="pmpu" name="PMPU" fill="#3b82f6" stroke="#3b82f6" />}
                      {structCats.mm && <Area yAxisId="left" type="monotone" stackId="1" dataKey="mm" name="Managed Money" fill="#f59e0b" stroke="#f59e0b" />}
                      {structCats.swap && <Area yAxisId="left" type="monotone" stackId="1" dataKey="swap" name="Swap Dealers" fill="#10b981" stroke="#10b981" />}
                      {structCats.other && <Area yAxisId="left" type="monotone" stackId="1" dataKey="other" name="Other Reportables" fill="#64748b" stroke="#64748b" />}
                      {structCats.nonrep && <Area yAxisId="left" type="monotone" stackId="1" dataKey="nonRep" name="Non Reportables" fill="#94a3b8" stroke="#94a3b8" />}
                      
                      <Line yAxisId="right" type="monotone" dataKey="displayPrice" name="Price" stroke="#ffffff" strokeWidth={2} dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}

            {/* STEP 3: PLAYERS (Real Radial) */}
            {activeStep === 3 && (
              <section className="animate-in fade-in slide-in-from-bottom-4">
                 <SectionHeader 
                  icon={Users} 
                  title="3. Counterparty Mapping (Radial)" 
                  subtitle="Liquidity Handshake: Analyzing the balance between Long ownership and Short ownership." 
                />
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                   <RadialCounterparty data={data} />
                </div>
              </section>
            )}

            {/* STEP 4: INDUSTRY PULSE (MT) */}
            {activeStep === 4 && (
              <section className="animate-in fade-in slide-in-from-bottom-4">
                <SectionHeader 
                  icon={Factory} 
                  title="4. Industry Pulse (Metric Tons)" 
                  subtitle="PMPU Short Coverage vs Price. Toggle Markets to see physical hedging depth." 
                />
                 
                 <div className="flex gap-2 mb-6 bg-slate-900 p-1 rounded-lg border border-slate-800 w-fit">
                  {['ny', 'ldn', 'combined'].map(m => (
                    <button
                      key={m}
                      onClick={() => setIndView(m)}
                      className={`px-4 py-2 rounded-md text-xs font-bold transition-all uppercase ${indView === m ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {m}
                    </button>
                  ))}
                 </div>

                 <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={data.slice(-52)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="date" stroke="#475569" fontSize={10} tickFormatter={v => v.slice(5)} />
                        <YAxis yAxisId="left" stroke="#475569" fontSize={10} tickFormatter={v => `${(v/1000).toFixed(0)}k`} label={{ value: 'Metric Tons', angle: -90, position: 'insideLeft', fill: '#475569' }} />
                        <YAxis yAxisId="right" orientation="right" stroke="#475569" fontSize={10} label={{ value: 'Price', angle: 90, position: 'insideRight', fill: '#475569' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                        <Legend />
                        
                        <Area 
                          yAxisId="left" type="monotone" 
                          dataKey={indView === 'ny' ? 'pmpuShortMT_NY' : indView === 'ldn' ? 'pmpuShortMT_LDN' : 'pmpuShortMT'} 
                          name="Industry Short (MT)" 
                          fill="#3b82f6" fillOpacity={0.2} stroke="#3b82f6" 
                        />
                        <Bar yAxisId="left" dataKey="efpMT" name="EFP (Physical Delivery)" fill="#10b981" barSize={10} />
                        <Line 
                          yAxisId="right" type="monotone" 
                          dataKey={indView === 'ny' ? 'priceNY' : indView === 'ldn' ? 'priceLDN' : 'avgPrice_USD_Ton'} 
                          name="Price (Right Axis)" 
                          stroke="#ffffff" strokeWidth={2} dot={false} 
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                 </div>
              </section>
            )}

            {/* STEP 5: DRY POWDER */}
            {activeStep === 5 && (
              <section className="animate-in fade-in slide-in-from-bottom-4">
                <SectionHeader 
                  icon={Droplets} 
                  title="5. Dry Powder Indicator" 
                  subtitle="Visualizing min/max potential vs markets with significant participation upside." 
                />

                 {/* Step 5 Controls */}
                 <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  {/* Market Select */}
                  <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    {['ny', 'ldn'].map(m => (
                      <button
                        key={m}
                        onClick={() => setDpMarkets(prev => ({ ...prev, [m]: !prev[m] }))}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all uppercase ${dpMarkets[m] ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        {m === 'ny' ? 'NY Arabica' : 'LDN Robusta'}
                      </button>
                    ))}
                  </div>

                  {/* Category Select */}
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { k: 'pmpu', l: 'PMPU', c: '#3b82f6' },
                      { k: 'mm', l: 'Managed Money', c: '#f59e0b' },
                      { k: 'swap', l: 'Swap/Index', c: '#10b981' },
                      { k: 'other', l: 'Other Rept', c: '#64748b' },
                      { k: 'nonrep', l: 'Non Rept', c: '#94a3b8' }
                    ].map(cat => (
                      <button
                        key={cat.k}
                        onClick={() => setDpCats(prev => ({ ...prev, [cat.k]: !prev[cat.k] }))}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all ${
                          dpCats[cat.k] 
                            ? 'bg-slate-900 border-slate-700 text-slate-200' 
                            : 'bg-transparent border-slate-800 text-slate-600'
                        }`}
                      >
                         <div className={`w-2 h-2 rounded-full ${dpCats[cat.k] ? 'bg-current' : 'border border-current'}`} style={{ color: cat.c }} />
                         <span className="text-[10px] font-bold uppercase">{cat.l}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis 
                        type="number" 
                        dataKey="dpTraders" 
                        name="Traders" 
                        stroke="#475569" 
                        label={{ value: 'Filtered Trader Count', position: 'bottom', offset: 0, fill: '#475569', fontSize: 10 }} 
                      />
                      <YAxis 
                        type="number" 
                        dataKey="dpVol" 
                        name="Volume (MT)" 
                        stroke="#475569" 
                        tickFormatter={v => `${(v/1000).toFixed(0)}k`}
                        label={{ value: 'Filtered Volume (Metric Tons)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 10 }}
                      />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter data={processedDpData}>
                        {processedDpData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.timeframe === 'current' ? '#ef4444' : entry.timeframe === 'month' ? '#f97316' : entry.timeframe === 'year' ? '#3b82f6' : '#334155'} 
                            fillOpacity={entry.timeframe === 'historical' ? 0.2 : 0.8}
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}

             {/* STEP 6: CYCLE MATRIX */}
            {activeStep === 6 && (
              <section className="animate-in fade-in slide-in-from-bottom-4">
                <SectionHeader 
                  icon={Scale} 
                  title="6. Cycle Location (OB/OS Matrix)" 
                  subtitle="Mapping the convergence of Price Rank and Net Positioning Rank." 
                />
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-[450px] relative">
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-2 grid-rows-2 opacity-10 m-12">
                    <div className="border border-slate-700 bg-slate-500/20"></div>
                    <div className="border border-slate-700 bg-red-500/40 flex items-center justify-center"><span className="text-[10px] font-bold text-red-400 -rotate-45">OVERBOUGHT</span></div>
                    <div className="border border-slate-700 bg-emerald-500/40 flex items-center justify-center"><span className="text-[10px] font-bold text-emerald-400 -rotate-45">OVERSOLD</span></div>
                    <div className="border border-slate-700 bg-slate-500/20"></div>
                  </div>
                  
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis type="number" dataKey="oiRank" domain={[0, 100]} stroke="#475569" label={{ value: 'Net Positioning Rank (%)', position: 'bottom', offset: 0, fill: '#475569', fontSize: 10 }} />
                      <YAxis type="number" dataKey="priceRank" domain={[0, 100]} stroke="#475569" label={{ value: 'Price Rank (%)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 10 }} />
                      <ReferenceLine x={50} stroke="#475569" strokeDasharray="5 5" />
                      <ReferenceLine y={50} stroke="#475569" strokeDasharray="5 5" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter data={data.slice(-52)}>
                        {data.slice(-52).map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 51 ? '#ef4444' : '#64748b'} 
                            fillOpacity={index === 51 ? 1 : 0.4} 
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}

          </div>
          
          <footer className="mt-20 pt-10 border-t border-slate-900 flex justify-between text-slate-600 text-[10px] uppercase tracking-widest font-bold">
            <span>Project: CIU Coffee Complex</span>
            <div className="flex gap-4">
               <span>NY: {(latest.priceNY).toFixed(2)} ¢</span>
               <span>LDN: {(latest.priceLDN).toFixed(0)} $</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
