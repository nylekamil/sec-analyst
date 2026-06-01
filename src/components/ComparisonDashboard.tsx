import React, { useState } from 'react';
import { ComparisonReport } from '@/types';
import { formatLargeCurrency, formatPercent } from './Dashboard';
import { 
  Building, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  ShieldAlert, 
  Award, 
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ComparisonDashboardProps {
  report: ComparisonReport;
}

export default function ComparisonDashboard({ report }: ComparisonDashboardProps) {
  const { tickerA, tickerB, dataA, dataB, aiAnalysis, generatedDate } = report;
  const [activeTab, setActiveTab] = useState<'memo' | 'bullCase' | 'risks'>('memo');
  const [activeSubTab, setActiveSubTab] = useState<'exec' | 'growth' | 'margin' | 'valuation' | 'balance'>('exec');

  // Helper to determine the "better" value for highlights
  // Higher is better for most metrics, lower is better for debt and valuation multiples
  const getWinner = (
    key: string,
    valA: number | null | undefined,
    valB: number | null | undefined
  ): 'A' | 'B' | 'none' => {
    if (valA === null || valA === undefined || isNaN(valA)) return 'B';
    if (valB === null || valB === undefined || isNaN(valB)) return 'A';
    if (valA === valB) return 'none';

    const lowerIsBetter = ['debt', 'currentPE', 'forwardPE', 'evEbitda', 'priceToSales'].includes(key);

    if (lowerIsBetter) {
      // For multiples, if one is negative/0, prefer the positive positive multiple
      if (['currentPE', 'forwardPE', 'evEbitda'].includes(key)) {
        if (valA <= 0) return 'B';
        if (valB <= 0) return 'A';
      }
      return valA < valB ? 'A' : 'B';
    } else {
      return valA > valB ? 'A' : 'B';
    }
  };

  const getMetricRow = (
    label: string,
    key: string,
    valA: any,
    valB: any,
    formatType: 'currency' | 'percent' | 'largeCurrency' | 'multiple' | 'raw' | 'range'
  ) => {
    let formattedA = 'Unavailable';
    let formattedB = 'Unavailable';
    let winner: 'A' | 'B' | 'none' = 'none';

    if (formatType === 'largeCurrency') {
      formattedA = formatLargeCurrency(valA);
      formattedB = formatLargeCurrency(valB);
      winner = getWinner(key, valA, valB);
    } else if (formatType === 'percent') {
      formattedA = formatPercent(valA);
      formattedB = formatPercent(valB);
      winner = getWinner(key, valA, valB);
    } else if (formatType === 'currency') {
      formattedA = valA !== null && valA !== undefined ? `$${Number(valA).toFixed(2)}` : 'Unavailable';
      formattedB = valB !== null && valB !== undefined ? `$${Number(valB).toFixed(2)}` : 'Unavailable';
      winner = getWinner(key, valA, valB);
    } else if (formatType === 'multiple') {
      formattedA = valA !== null && valA !== undefined ? `${Number(valA).toFixed(1)}x` : 'Unavailable';
      formattedB = valB !== null && valB !== undefined ? `${Number(valB).toFixed(1)}x` : 'Unavailable';
      winner = getWinner(key, valA, valB);
    } else if (formatType === 'range') {
      formattedA = valA ? `$${valA.low?.toFixed(2)} - $${valA.high?.toFixed(2)}` : 'Unavailable';
      formattedB = valB ? `$${valB.low?.toFixed(2)} - $${valB.high?.toFixed(2)}` : 'Unavailable';
      winner = 'none'; // no winner for ranges
    } else {
      formattedA = valA !== undefined && valA !== null ? String(valA) : 'Unavailable';
      formattedB = valB !== undefined && valB !== null ? String(valB) : 'Unavailable';
      winner = 'none';
    }

    return { label, formattedA, formattedB, winner };
  };

  const metricRows = [
    getMetricRow('Market Price', 'price', dataA.financials.currentPrice, dataB.financials.currentPrice, 'currency'),
    getMetricRow('Market Capitalization', 'marketCap', dataA.overview.marketCap, dataB.overview.marketCap, 'largeCurrency'),
    getMetricRow('Revenue (TTM)', 'revenue', dataA.financials.revenue, dataB.financials.revenue, 'largeCurrency'),
    getMetricRow('Revenue Growth', 'revenueGrowth', dataA.financials.revenueGrowth, dataB.financials.revenueGrowth, 'percent'),
    getMetricRow('Net Income (TTM)', 'netIncome', dataA.financials.netIncome, dataB.financials.netIncome, 'largeCurrency'),
    getMetricRow('Free Cash Flow (TTM)', 'freeCashFlow', dataA.financials.freeCashFlow, dataB.financials.freeCashFlow, 'largeCurrency'),
    getMetricRow('Gross Margin', 'grossMargin', dataA.financials.grossMargin, dataB.financials.grossMargin, 'percent'),
    getMetricRow('Operating Margin', 'operatingMargin', dataA.financials.operatingMargin, dataB.financials.operatingMargin, 'percent'),
    getMetricRow('Trailing P/E Multiple', 'currentPE', dataA.financials.currentPE, dataB.financials.currentPE, 'multiple'),
    getMetricRow('Forward P/E Multiple', 'forwardPE', dataA.financials.forwardPE, dataB.financials.forwardPE, 'multiple'),
    getMetricRow('EV / EBITDA', 'evEbitda', dataA.financials.evEbitda, dataB.financials.evEbitda, 'multiple'),
    getMetricRow('Price-to-Sales (TTM)', 'priceToSales', dataA.financials.priceToSales, dataB.financials.priceToSales, 'multiple'),
    getMetricRow('Total Debt Liabilities', 'debt', dataA.financials.debt, dataB.financials.debt, 'largeCurrency'),
    getMetricRow('Total Cash Assets', 'cash', dataA.financials.cash, dataB.financials.cash, 'largeCurrency'),
    getMetricRow('52-Week Trading Range', 'range', 
      { low: dataA.financials.low52Week, high: dataA.financials.high52Week },
      { low: dataB.financials.low52Week, high: dataB.financials.high52Week }, 'range'),
    getMetricRow('1-Year Stock Performance', 'return1Y', dataA.performance.return1Y, dataB.performance.return1Y, 'percent'),
  ];

  return (
    <div className="w-full flex flex-col gap-6 font-mono">
      
      {/* 1. TOP DUAL HEADER BANNER */}
      <div className="border border-terminal-border bg-terminal-panel p-6 rounded-lg grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
        
        {/* Company A */}
        <div className="md:col-span-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-terminal-cyan/15 text-terminal-cyan px-2.5 py-0.5 rounded text-xs font-bold border border-terminal-cyan/30">
              {tickerA}
            </span>
            <h2 className="text-lg font-bold text-white truncate" title={dataA.overview.name}>{dataA.overview.name}</h2>
          </div>
          <p className="text-[11px] text-slate-500 truncate">{dataA.overview.sector} // {dataA.overview.industry}</p>
        </div>

        {/* VS Divider */}
        <div className="md:col-span-1 flex justify-center text-slate-600 font-bold text-xl italic select-none">
          VS
        </div>

        {/* Company B */}
        <div className="md:col-span-3 flex flex-col gap-1.5 text-right items-end">
          <div className="flex items-center gap-2 flex-row-reverse">
            <span className="bg-terminal-yellow/15 text-terminal-yellow px-2.5 py-0.5 rounded text-xs font-bold border border-terminal-yellow/30">
              {tickerB}
            </span>
            <h2 className="text-lg font-bold text-white truncate" title={dataB.overview.name}>{dataB.overview.name}</h2>
          </div>
          <p className="text-[11px] text-slate-500 truncate">{dataB.overview.sector} // {dataB.overview.industry}</p>
        </div>

      </div>

      {/* 2. SIDE-BY-SIDE LEDGER TABLE */}
      <div className="border border-terminal-border bg-terminal-panel rounded-lg overflow-hidden text-xs">
        
        {/* Table Header */}
        <div className="bg-terminal-darker px-4 py-3 border-b border-terminal-border grid grid-cols-3 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
          <span>Financial Indicator (TTM)</span>
          <span className="text-center text-terminal-cyan font-mono">{tickerA} Ledger</span>
          <span className="text-right text-terminal-yellow font-mono">{tickerB} Ledger</span>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col">
          {metricRows.map((row, idx) => (
            <div 
              key={idx} 
              className={`px-4 py-3 border-b border-terminal-border/40 grid grid-cols-3 items-center hover:bg-slate-900/30 transition-colors ${
                idx % 2 === 0 ? 'bg-terminal-darker/10' : ''
              }`}
            >
              <span className="text-slate-400 tracking-wide">{row.label}</span>
              
              {/* Value A */}
              <div className="text-center font-bold">
                <span className={`px-2 py-0.5 rounded ${
                  row.winner === 'A' 
                    ? 'bg-terminal-green/10 text-terminal-green border border-terminal-green/30 font-semibold' 
                    : 'text-white'
                }`}>
                  {row.formattedA}
                  {row.winner === 'A' && ' ◀'}
                </span>
              </div>
              
              {/* Value B */}
              <div className="text-right font-bold">
                <span className={`px-2 py-0.5 rounded inline-block ${
                  row.winner === 'B' 
                    ? 'bg-terminal-green/10 text-terminal-green border border-terminal-green/30 font-semibold' 
                    : 'text-white'
                }`}>
                  {row.winner === 'B' && '▶ '}
                  {row.formattedB}
                </span>
              </div>

            </div>
          ))}
        </div>
        
        <div className="bg-terminal-darker px-4 py-2 text-[10px] text-slate-500 flex justify-between border-t border-terminal-border">
          <span>* HIGHLIGHTED metrics indicate superior performing assets</span>
          <span>SOURCE: SEC EDGAR SYNC & YAHOO FINANCE SERVICES</span>
        </div>

      </div>

      {/* 3. DYNAMIC AI RECOMMENDATION CALLOUT */}
      <div className="border border-terminal-border/60 bg-terminal-panel/85 p-5 rounded-lg font-mono text-xs flex flex-col gap-3 relative overflow-hidden terminal-glow-cyan">
        <div className="absolute top-0 right-0 bg-terminal-cyan/15 text-terminal-cyan text-[9px] font-bold px-3 py-1 border-l border-b border-terminal-border uppercase tracking-widest flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          AI Portfolio Recommendation
        </div>

        <div className="flex items-center gap-2 text-white font-bold uppercase text-[10px] tracking-wider">
          <Award className="h-4 w-4 text-terminal-cyan" />
          Relative Recommendation Consensus
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-stretch mt-1">
          
          {/* Recommendation Box */}
          <div className="bg-slate-900 border border-terminal-border rounded p-4 flex flex-col justify-center items-center text-center min-w-[170px] gap-1">
            <span className="text-[9px] uppercase tracking-wider text-slate-500">Relative Rating:</span>
            <span className={`text-base font-bold tracking-widest uppercase ${
              aiAnalysis.finalRecommendation.includes('Company A') 
                ? 'text-terminal-cyan' 
                : aiAnalysis.finalRecommendation.includes('Company B')
                  ? 'text-terminal-yellow'
                  : 'text-slate-400'
            }`}>
              {aiAnalysis.finalRecommendation === 'Prefer Company A' ? `PREFER ${tickerA}` :
               aiAnalysis.finalRecommendation === 'Prefer Company B' ? `PREFER ${tickerB}` : 'NEUTRAL / FAIR'}
            </span>
          </div>

          {/* Explanation Text */}
          <div className="flex-1 flex items-center font-sans text-xs text-slate-300 leading-relaxed bg-slate-950/20 border border-slate-900/60 p-4 rounded">
            {aiAnalysis.recommendationExplanation}
          </div>

        </div>
      </div>

      {/* 4. AI REPORT CHAPTERS SWITCH PANEL */}
      <div className="border border-terminal-border bg-terminal-panel rounded-lg overflow-hidden">
        
        {/* Main Tab Controller */}
        <div className="bg-terminal-darker border-b border-terminal-border flex">
          {[
            { id: 'memo', label: 'INVESTMENT THESIS COMPARISON' },
            { id: 'bullCase', label: 'BULL CASES & UPSIDES' },
            { id: 'risks', label: 'RISK FACTOR MATRIX' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 text-[10px] font-bold tracking-wider border-r border-terminal-border transition-colors cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-terminal-panel text-terminal-cyan border-t-2 border-t-terminal-cyan' 
                  : 'text-slate-500 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6">
          
          {/* CATEGORY 1: MEMO DETAILED CHAPTERS */}
          {activeTab === 'memo' && (
            <div className="flex flex-col gap-6">
              
              {/* Nested Sub-Tab Row */}
              <div className="flex gap-2 flex-wrap border-b border-slate-800 pb-3">
                {[
                  { id: 'exec', label: 'Executive Summary' },
                  { id: 'growth', label: 'Growth Vector' },
                  { id: 'margin', label: 'Marginal Moats' },
                  { id: 'valuation', label: 'Valuation snapshot' },
                  { id: 'balance', label: 'Solvency check' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubTab(sub.id as any)}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                      activeSubTab === sub.id
                        ? 'bg-slate-800 text-white border-terminal-border/80'
                        : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300'
                    }`}
                  >
                    {sub.label.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Sub-Tab Contents */}
              <div className="text-slate-300 font-sans text-xs leading-relaxed">
                {activeSubTab === 'exec' && (
                  <div className="flex flex-col gap-2 animate-fadeIn">
                    <h4 className="font-mono text-white text-[10px] uppercase font-bold tracking-wider mb-1 text-terminal-cyan">I. Executive Summary Comparison</h4>
                    <p className="whitespace-pre-line">{aiAnalysis.executiveSummary}</p>
                  </div>
                )}
                {activeSubTab === 'growth' && (
                  <div className="flex flex-col gap-2 animate-fadeIn">
                    <h4 className="font-mono text-white text-[10px] uppercase font-bold tracking-wider mb-1 text-terminal-cyan">II. Expansion & Revenue Comparison</h4>
                    <p className="whitespace-pre-line">{aiAnalysis.growthComparison}</p>
                  </div>
                )}
                {activeSubTab === 'margin' && (
                  <div className="flex flex-col gap-2 animate-fadeIn">
                    <h4 className="font-mono text-white text-[10px] uppercase font-bold tracking-wider mb-1 text-terminal-cyan">III. Margin Strength & Pricing Power Moats</h4>
                    <p className="whitespace-pre-line">{aiAnalysis.marginComparison}</p>
                  </div>
                )}
                {activeSubTab === 'valuation' && (
                  <div className="flex flex-col gap-2 animate-fadeIn">
                    <h4 className="font-mono text-white text-[10px] uppercase font-bold tracking-wider mb-1 text-terminal-cyan">IV. Relative Multiples & Valuation Rationale</h4>
                    <p className="whitespace-pre-line">{aiAnalysis.valuationComparison}</p>
                  </div>
                )}
                {activeSubTab === 'balance' && (
                  <div className="flex flex-col gap-2 animate-fadeIn">
                    <h4 className="font-mono text-white text-[10px] uppercase font-bold tracking-wider mb-1 text-terminal-cyan">V. Liquidity, Debt, & Leverage Comparison</h4>
                    <p className="whitespace-pre-line">{aiAnalysis.balanceSheetComparison}</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* CATEGORY 2: BULL CASES */}
          {activeTab === 'bullCase' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans text-xs text-slate-300">
              
              {/* Ticker A Bull Cases */}
              <div className="flex flex-col gap-4 animate-fadeIn">
                <h4 className="font-mono text-white text-[10px] font-bold uppercase tracking-wider pb-2 border-b border-terminal-cyan/20 flex items-center gap-1 text-terminal-cyan">
                  <TrendingUp className="h-4 w-4 text-terminal-green" />
                  Bull Cases for {tickerA}
                </h4>
                
                <div className="flex flex-col gap-3">
                  {aiAnalysis.bullCaseA.map((item, idx) => (
                    <div key={idx} className="flex gap-3 bg-slate-950/20 border border-slate-900 p-3.5 rounded leading-relaxed">
                      <span className="font-mono text-terminal-green font-bold shrink-0">B{idx + 1}</span>
                      <div>
                        <strong className="text-white block font-mono text-[11px] mb-1">{item.point}</strong>
                        {item.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ticker B Bull Cases */}
              <div className="flex flex-col gap-4 animate-fadeIn">
                <h4 className="font-mono text-white text-[10px] font-bold uppercase tracking-wider pb-2 border-b border-terminal-yellow/20 flex items-center gap-1 text-terminal-yellow">
                  <TrendingUp className="h-4 w-4 text-terminal-green" />
                  Bull Cases for {tickerB}
                </h4>
                
                <div className="flex flex-col gap-3">
                  {aiAnalysis.bullCaseB.map((item, idx) => (
                    <div key={idx} className="flex gap-3 bg-slate-950/20 border border-slate-900 p-3.5 rounded leading-relaxed">
                      <span className="font-mono text-terminal-yellow font-bold shrink-0">B{idx + 1}</span>
                      <div>
                        <strong className="text-white block font-mono text-[11px] mb-1">{item.point}</strong>
                        {item.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* CATEGORY 3: RISK COMPARISON */}
          {activeTab === 'risks' && (
            <div className="flex flex-col gap-4 animate-fadeIn font-sans text-xs text-slate-300 leading-relaxed">
              <h4 className="font-mono text-white text-[10px] font-bold uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center gap-1.5 text-terminal-cyan">
                <ShieldAlert className="h-4 w-4 text-terminal-yellow" />
                COMPARATIVE RISK MATRICES & VALUATION OVERHANGS
              </h4>
              <p className="whitespace-pre-line mt-1">{aiAnalysis.keyRisks}</p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
