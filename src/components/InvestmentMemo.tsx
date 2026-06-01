import React from 'react';
import { InvestmentMemo as MemoType, CompanyOverview } from '@/types';
import { 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  HelpCircle,
  TrendingUp,
  FileText,
  BadgeAlert,
  ArrowUpRight
} from 'lucide-react';

interface InvestmentMemoProps {
  memo: MemoType;
  overview: CompanyOverview;
  date: string;
}

export default function InvestmentMemo({ memo, overview, date }: InvestmentMemoProps) {
  
  // Determine recommendation styling
  const getRecommendationStyle = (rec: string) => {
    switch (rec) {
      case 'Strong Buy':
        return { bg: 'bg-terminal-green/15', text: 'text-terminal-green', border: 'border-terminal-green', glow: 'terminal-glow-green' };
      case 'Buy':
        return { bg: 'bg-terminal-green/10', text: 'text-terminal-green/90', border: 'border-terminal-green/50', glow: '' };
      case 'Hold':
        return { bg: 'bg-terminal-yellow/15', text: 'text-terminal-yellow', border: 'border-terminal-yellow/50', glow: '' };
      case 'Sell':
        return { bg: 'bg-terminal-red/10', text: 'text-terminal-red/90', border: 'border-terminal-red/50', glow: '' };
      case 'Strong Sell':
        return { bg: 'bg-terminal-red/15', text: 'text-terminal-red', border: 'border-terminal-red', glow: 'terminal-glow-red' };
      default:
        return { bg: 'bg-slate-800', text: 'text-white', border: 'border-slate-700', glow: '' };
    }
  };

  const recStyle = getRecommendationStyle(memo.finalRecommendation);

  return (
    <div id="investment-memo-pdf-target" className="w-full flex flex-col gap-6 print-page">
      
      {/* INSTITUTIONAL MEMO HEADER */}
      <div className={`border ${recStyle.border} ${recStyle.bg} ${recStyle.glow} p-6 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-6 print-card`}>
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest">
            <FileText className="h-4 w-4 text-terminal-cyan" />
            EQUITY RESEARCH INVESTMENT MEMORANDUM
          </div>
          <h2 className="text-xl font-bold font-mono text-white mt-1">
            {overview.name} ({overview.ticker})
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            VALUATOR: <span className="text-slate-300">SEC ANALYST RESEARCH PLATFORM</span> &bull; DATE: <span className="text-slate-300">{date}</span> &bull; SOURCE: <span className="text-slate-500 font-bold">SEC ANALYST AI RESEARCH SYNTHESIZER</span>
          </p>
        </div>
        
        {/* RECOMMENDATION BADGE */}
        <div className="flex flex-col items-center justify-center border-l-0 md:border-l border-terminal-border/50 pl-0 md:pl-8 min-w-[200px] gap-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">FINAL RATING</span>
          <span className={`text-2xl font-bold font-mono uppercase tracking-wider ${recStyle.text} digital-glow`}>
            {memo.finalRecommendation}
          </span>
          <span className="text-[10px] font-mono text-slate-400 text-center max-w-[180px] leading-relaxed mt-1">
            {memo.recommendationExplanation}
          </span>
        </div>
      </div>

      {/* CORE SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT & CENTER: REPORT SECTIONS */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Executive Summary */}
          <div className="border border-terminal-border bg-terminal-panel p-6 rounded-lg flex flex-col gap-3">
            <h3 className="text-sm font-bold font-mono text-terminal-cyan uppercase tracking-wider border-b border-terminal-border pb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-terminal-cyan"></span>
              I. Executive Summary
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{memo.executiveSummary}</p>
          </div>

          {/* Business Overview */}
          <div className="border border-terminal-border bg-terminal-panel p-6 rounded-lg flex flex-col gap-3">
            <h3 className="text-sm font-bold font-mono text-terminal-cyan uppercase tracking-wider border-b border-terminal-border pb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-terminal-cyan"></span>
              II. Business Overview & Moat Analysis
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{memo.businessOverview}</p>
          </div>

          {/* Industry Analysis */}
          <div className="border border-terminal-border bg-terminal-panel p-6 rounded-lg flex flex-col gap-3">
            <h3 className="text-sm font-bold font-mono text-terminal-cyan uppercase tracking-wider border-b border-terminal-border pb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-terminal-cyan"></span>
              III. Industry Trends & Competitive Landscape
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{memo.industryAnalysis}</p>
          </div>

        </div>

        {/* RIGHT COLUMN: BULL/BEAR CASES & CATALYSTS */}
        <div className="flex flex-col gap-6">
          
          {/* VALUATION SNAPSHOT CARD */}
          <div className="border border-terminal-border bg-terminal-panel p-4 rounded-lg flex flex-col gap-3 font-mono text-xs">
            <h3 className="text-slate-400 font-bold uppercase tracking-wider border-b border-terminal-border pb-1.5 text-[10px] flex items-center justify-between">
              <span>IV. Valuation Snapshot</span>
              <span className={`px-2 py-0.5 rounded text-[9px] uppercase ${
                memo.valuationSnapshot.valuationStatus === 'Cheap' ? 'bg-terminal-green/10 text-terminal-green border border-terminal-green/20' : 
                memo.valuationSnapshot.valuationStatus === 'Fair' ? 'bg-terminal-yellow/10 text-terminal-yellow border border-terminal-yellow/20' : 
                'bg-terminal-red/10 text-terminal-red border border-terminal-red/20'
              }`}>
                {memo.valuationSnapshot.valuationStatus}
              </span>
            </h3>
            <p className="text-slate-300 leading-relaxed">{memo.valuationSnapshot.multiplesExplanation}</p>
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-terminal-border/50 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Industry Avg P/E:</span>
                <span className="text-white font-bold">{memo.valuationSnapshot.industryAveragePE}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Historical Avg P/E:</span>
                <span className="text-white font-bold">{memo.valuationSnapshot.historicalAveragePE}x</span>
              </div>
            </div>
          </div>

          {/* CATALYSTS PANEL */}
          <div className="border border-terminal-border bg-terminal-panel p-4 rounded-lg flex flex-col gap-3 font-mono text-xs">
            <h3 className="text-slate-400 font-bold uppercase tracking-wider border-b border-terminal-border pb-1.5 text-[10px] flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-terminal-cyan" />
              V. Value Catalysts
            </h3>
            
            <div className="flex flex-col gap-3">
              {memo.catalysts && memo.catalysts.map((c, idx) => (
                <div key={idx} className="border-b border-terminal-border/30 pb-2.5 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-white font-bold tracking-tight">{c.event}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[8px] uppercase ${
                      c.impact === 'High' ? 'bg-terminal-red-dim text-terminal-red border border-terminal-red/20' :
                      c.impact === 'Medium' ? 'bg-terminal-yellow/10 text-terminal-yellow border border-terminal-yellow/20' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {c.impact} Impact
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mb-1">Estimated Timeline: <span className="text-slate-400">{c.date}</span></div>
                  <p className="text-[10px] text-slate-400 leading-normal">{c.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* FULL WIDTH SECTION: BULL & BEAR BULLETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* BULL THESIS */}
        <div className="border border-terminal-border bg-terminal-panel p-6 rounded-lg flex flex-col gap-4">
          <h3 className="text-sm font-bold font-mono text-terminal-green uppercase tracking-wider border-b border-terminal-border pb-2.5 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-terminal-green" />
            VI. Bull Case: Drivers for Outperformance
          </h3>
          
          <ul className="flex flex-col gap-4 text-xs font-mono">
            {memo.bullCase && memo.bullCase.map((item, idx) => (
              <li key={idx} className="flex gap-3 items-start leading-relaxed">
                <CheckCircle2 className="h-4 w-4 text-terminal-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-bold text-sm tracking-tight">{idx + 1}. {item.point}</h4>
                  <p className="text-slate-400 mt-1 leading-normal font-sans text-xs">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* BEAR THESIS */}
        <div className="border border-terminal-border bg-terminal-panel p-6 rounded-lg flex flex-col gap-4">
          <h3 className="text-sm font-bold font-mono text-terminal-red uppercase tracking-wider border-b border-terminal-border pb-2.5 flex items-center gap-2">
            <BadgeAlert className="h-4 w-4 text-terminal-red" />
            VII. Bear Case: Risks & Valuation Hurdles
          </h3>
          
          <ul className="flex flex-col gap-4 text-xs font-mono">
            {memo.bearCase && memo.bearCase.map((item, idx) => (
              <li key={idx} className="flex gap-3 items-start leading-relaxed">
                <XCircle className="h-4 w-4 text-terminal-red shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-bold text-sm tracking-tight">{idx + 1}. {item.point}</h4>
                  <p className="text-slate-400 mt-1 leading-normal font-sans text-xs">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
}
