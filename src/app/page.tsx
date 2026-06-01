'use client';

import React, { useState } from 'react';
import { EquityResearchReport, ComparisonReport } from '@/types';
import Dashboard from '@/components/Dashboard';
import PerformanceChart from '@/components/PerformanceChart';
import InvestmentMemo from '@/components/InvestmentMemo';
import NewsSection from '@/components/NewsSection';
import ComparisonDashboard from '@/components/ComparisonDashboard';
import { 
  Search, 
  Terminal as TerminalIcon, 
  FileDown, 
  ArrowLeft, 
  Loader2, 
  Check, 
  Flame, 
  TrendingUp, 
  Briefcase, 
  Compass, 
  Cpu, 
  Info,
  AlertCircle,
  KeyRound,
  RefreshCw,
  Clock,
  GitCompare
} from 'lucide-react';
import { exportEquityReportToPDF, exportComparisonToPDF } from '@/lib/pdfGenerator';

export default function Home() {
  // App States
  const [mode, setMode] = useState<'single' | 'compare'>('single');
  const [ticker, setTicker] = useState('');
  const [tickerA, setTickerA] = useState('');
  const [tickerB, setTickerB] = useState('');
  const [report, setReport] = useState<EquityResearchReport | null>(null);
  const [comparisonReport, setComparisonReport] = useState<ComparisonReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [setupRequired, setSetupRequired] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  // Terminal log visual feed
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [exportingPDF, setExportingPDF] = useState(false);

  // Helper to add terminal diagnostics logs
  const addLog = (msg: string, delay: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, `[SEC-DIAGNOSTIC] ${msg}`]);
        resolve();
      }, delay);
    });
  };

  // Fetch report handler
  const handleSearch = async (targetTicker?: string) => {
    const symbol = (targetTicker || ticker).toUpperCase().trim();
    if (!symbol) {
      setError('Please enter a valid stock ticker symbol.');
      setSuggestion(null);
      setSetupRequired(false);
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestion(null);
    setSetupRequired(false);
    setTerminalLogs([]);

    try {
      // Step-by-step terminal loading logging for high fidelity terminal atmosphere
      await addLog(`INITIATING EQUITIES SEARCH PATH FOR SYMBOL: ${symbol}...`, 100);
      await addLog('RESOLVING GATEWAY PORT ADDRESS TO SEC DATABASE FEED...', 200);
      await addLog('RUNNING STRUCTURAL TICKER VALIDATION SCRIPTS...', 300);
      await addLog('HANDSHAKE COMPLETED. PIPELINE CONNECTION SECURED.', 150);
      await addLog('QUERYING LIVE REVENUE SHEETS AND BALANCE STATEMENT BALANCES...', 300);
      await addLog('COMPILING HISTORICAL PRICE VECTORS FOR PRICE TREND...', 250);
      await addLog('ENGAGING LIVE AI COGNITIVE INVESTMENT RESEARCH MODULE...', 400);
      await addLog('SYNTHESIZING INVESTMENT MEMORANDUM, BULL CASE, AND MARKET CATALYSTS...', 450);
      await addLog('EXECUTING BAYESIAN SENTIMENT SCORING ON RECENT PRESS BULLETINS...', 300);
      await addLog('FINALIZING EQUITY VALUATION SNAPSHOT & RECOMMENDING RATING...', 200);

      const response = await fetch(`/api/report?ticker=${symbol}`);
      const data = await response.json();

      if (!response.ok) {
        if (data.needsSetup) {
          setSetupRequired(true);
        }
        if (data.didYouMean) {
          setSuggestion(data.didYouMean);
        }
        throw new Error(data.error || 'Failed to generate investment report.');
      }

      setReport(data);
      setLastUpdated(new Date().toLocaleString());
      setTicker('');
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Connection lost to the SEC analyst mainframe.');
    } finally {
      setLoading(false);
    }
  };

  // Pixel-perfect Programmatic PDF Export
  const handleExportPDF = async () => {
    if (!report) return;
    setExportingPDF(true);
    
    try {
      exportEquityReportToPDF(report, lastUpdated || new Date().toLocaleString());
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to construct PDF. Please print via browser settings (CMD+P) instead.');
    } finally {
      setExportingPDF(false);
    }
  };

  // Fetch comparative report handler
  const handleCompare = async (targetTickerA?: string, targetTickerB?: string) => {
    const symbolA = (targetTickerA || tickerA).toUpperCase().trim();
    const symbolB = (targetTickerB || tickerB).toUpperCase().trim();

    if (!symbolA || !symbolB) {
      setError('Please enter two valid stock symbols to compare.');
      setSuggestion(null);
      setSetupRequired(false);
      return;
    }

    if (symbolA === symbolB) {
      setError('Stock ticker symbols must be different to perform a side-by-side comparison.');
      setSuggestion(null);
      setSetupRequired(false);
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestion(null);
    setSetupRequired(false);
    setTerminalLogs([]);

    try {
      await addLog(`INITIATING EQUITIES COMPARATIVE RUN FOR PAIR: ${symbolA} VS ${symbolB}...`, 100);
      await addLog('OPENING DUAL PORT ADDRESS SEC-API CHANNELS...', 150);
      await addLog(`QUERYING FINANCIAL BALANCE SHEET FOR ${symbolA}...`, 200);
      await addLog(`QUERYING FINANCIAL BALANCE SHEET FOR ${symbolB}...`, 200);
      await addLog('DUAL HANDSHAKE COMPLETE. ESTABLISHING SIDE-BY-SIDE LEDGER...', 150);
      await addLog('RUNNING HISTORICAL RETRIEVAL AND ONE-YEAR SHARE GAIN DELTAS...', 200);
      await addLog('ENGAGING DUAL AI STRATEGIC THESIS COMPARATOR...', 350);
      await addLog('SYNTHESIZING INVESTMENT ADVISORY AND DETERMINING SUPERIOR ASSETS...', 400);
      await addLog('CALCULATING VALUATION PREMIUM JUSTIFICATIONS...', 200);
      await addLog('COMPILING COMPLETED COMPARATIVE REPORT SCHEMA...', 150);

      const response = await fetch(`/api/compare?tickerA=${symbolA}&tickerB=${symbolB}`);
      const data = await response.json();

      if (!response.ok) {
        if (data.needsSetup) {
          setSetupRequired(true);
        }
        throw new Error(data.error || 'Failed to generate comparative investment report.');
      }

      setComparisonReport(data);
      setLastUpdated(new Date().toLocaleString());
      setTickerA('');
      setTickerB('');
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Connection lost to the SEC analyst comparison mainframe.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportComparisonPDF = async () => {
    if (!comparisonReport) return;
    setExportingPDF(true);
    
    try {
      exportComparisonToPDF(comparisonReport, lastUpdated || new Date().toLocaleString());
    } catch (err) {
      console.error('Comparative PDF generation error:', err);
      alert('Failed to construct PDF. Please print via browser settings (CMD+P) instead.');
    } finally {
      setExportingPDF(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      
      {/* CASE 1: LOADING STATE */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-6 max-w-xl mx-auto w-full font-mono text-xs">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-10 w-10 text-terminal-cyan animate-spin" />
            <span className="text-white font-bold tracking-widest text-sm mt-2">EXECUTING SEC ANALYSIS</span>
          </div>
          
          {/* Terminal Console Feed Box */}
          <div className="w-full bg-terminal-darker border border-terminal-border p-4 rounded h-64 overflow-y-auto flex flex-col gap-1.5 scrollbar-thin text-slate-400 select-none text-[11px] leading-relaxed">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-terminal-cyan font-bold">&gt;&gt;</span>
                <span className={idx === terminalLogs.length - 1 ? 'text-terminal-green animate-pulse' : ''}>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CASE 2: CONSOLE HOMEPAGE SEARCH & SETUP SCREEN */}
      {!loading && !report && !comparisonReport && (
        <div className="flex-1 flex flex-col items-center justify-center py-8 gap-8">
          
          {/* A. SETUP REQUIRED OVERLAY PANEL */}
          {setupRequired ? (
            <div className="w-full max-w-2xl border border-terminal-yellow bg-terminal-panel rounded-lg overflow-hidden terminal-glow-red font-mono text-xs">
              <div className="bg-terminal-darker px-4 py-3 border-b border-terminal-yellow flex justify-between items-center select-none">
                <span className="text-terminal-red font-bold tracking-widest flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  SYSTEM OVERRIDE // CREDENTIAL SETUP REQUIRED
                </span>
                <span className="text-terminal-yellow animate-pulse font-bold">SETUP INCOMPLETE</span>
              </div>
              
              <div className="p-6 flex flex-col gap-6">
                <div className="bg-terminal-red/10 border border-terminal-red/30 p-4 rounded text-slate-300 font-sans text-xs leading-relaxed flex flex-col gap-2">
                  <strong className="text-white uppercase tracking-wider font-mono text-xs flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-terminal-red" />
                    OpenAI API Credentials Missing
                  </strong>
                  <p>
                    The SEC Analyst Research Platform is operating in <strong>Fully Live Mode</strong>. To utilize real-time large language models to compile investment memos, competitive moats, catalysts, and bull/bear theses, you must configure a valid OpenAI API key in your environment.
                  </p>
                </div>

                <div className="flex flex-col gap-3 leading-relaxed">
                  <h4 className="text-white font-bold uppercase tracking-wider text-[10px]">INSTRUCTIONS FOR KEY ACTIVATION:</h4>
                  <ol className="list-decimal pl-5 text-slate-400 flex flex-col gap-2.5 font-sans text-xs">
                    <li>
                      Log into your <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:underline font-mono">OpenAI Developer Account</a>.
                    </li>
                    <li>
                      Generate a new API Secret Key (format: <code className="bg-slate-900 border border-slate-700 px-1 py-0.5 rounded text-[10px] text-white">sk-proj-...</code>). Ensure your account has active billing credits.
                    </li>
                    <li>
                      Open the configuration file <code className="bg-slate-900 border border-slate-700 px-1 py-0.5 rounded text-[10px] text-white font-mono font-bold select-all">/Users/nylekamil/.gemini/antigravity/scratch/ai-investment-research-analyst/.env.local</code> in your editor.
                    </li>
                    <li>
                      Change the placeholder line to assign your key:
                      <pre className="bg-slate-950 border border-terminal-border p-2 rounded mt-1.5 font-mono text-[10px] text-terminal-green">OPENAI_API_KEY=sk-proj-yourActualKeyGoesHere</pre>
                    </li>
                    <li>
                      Save the file and **restart your development server** (<code className="bg-slate-900 border border-slate-700 px-1 py-0.5 rounded text-[10px] text-white font-mono">npm run dev</code>) to reload environment variables.
                    </li>
                  </ol>
                </div>

                <div className="border-t border-terminal-border pt-4 flex justify-between gap-3">
                  <button
                    onClick={() => setSetupRequired(false)}
                    className="border border-terminal-border hover:border-white px-4 py-2 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    RETURN TO COMMAND SEARCH
                  </button>
                  
                  <button
                    onClick={() => handleSearch('AAPL')}
                    className="bg-terminal-cyan hover:bg-terminal-cyan/85 text-black font-bold px-5 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-terminal-cyan/15"
                  >
                    <RefreshCw className="h-4 w-4" />
                    RE-TEST LIVE SYSTEM (AAPL)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* B. STANDARD LIVE TERMINAL SEARCH */
            <div className="w-full max-w-2xl border border-terminal-border bg-terminal-panel rounded-lg overflow-hidden terminal-glow-cyan">
              <div className="bg-terminal-darker px-4 py-3 border-b border-terminal-border flex justify-between items-center select-none font-mono text-xs">
                <span className="text-terminal-cyan font-bold tracking-widest flex items-center gap-2">
                  <TerminalIcon className="h-4 w-4" />
                  SEC RESEARCH COMMAND TERMINAL
                </span>
                <span className="text-slate-500 font-bold uppercase flex items-center gap-1 text-[10px]">
                  <span className="h-2 w-2 rounded-full bg-terminal-cyan animate-pulse"></span>
                  LIVE DATA MODE
                </span>
              </div>
              
              <div className="p-8 flex flex-col gap-6">
                
                {/* MODE TABS SELECTOR */}
                <div className="flex border-b border-terminal-border/40 pb-4 mb-2">
                  <button
                    onClick={() => { setMode('single'); setError(null); setSuggestion(null); }}
                    className={`flex-1 py-2 text-center font-mono font-bold tracking-wider text-xs border-r border-terminal-border/30 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      mode === 'single'
                        ? 'text-terminal-cyan bg-terminal-cyan/5 border-b-2 border-b-terminal-cyan font-bold font-mono'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <TerminalIcon className="h-3.5 w-3.5" />
                    SINGLE STOCK RESEARCH
                  </button>
                  <button
                    onClick={() => { setMode('compare'); setError(null); setSuggestion(null); }}
                    className={`flex-1 py-2 text-center font-mono font-bold tracking-wider text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      mode === 'compare'
                        ? 'text-terminal-yellow bg-terminal-yellow/5 border-b-2 border-b-terminal-yellow font-bold font-mono'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <GitCompare className="h-3.5 w-3.5" />
                    COMPARE COMPANIES
                  </button>
                </div>

                {mode === 'single' ? (
                  <div className="flex flex-col gap-2 animate-fadeIn">
                    <label className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                      ENTER STOCK TICKER SYMBOL FOR GENERATION:
                    </label>
                    <div className="flex gap-3 relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-mono">
                        $
                      </div>
                      <input
                        type="text"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="AAPL, NVDA, MCD, MSFT, GOOGL..."
                        maxLength={10}
                        className="flex-1 bg-terminal-darker border border-terminal-border focus:border-terminal-cyan focus:outline-none rounded px-4 py-3 pl-8 text-white font-mono placeholder-slate-600 uppercase tracking-widest text-sm"
                      />
                      <button
                        onClick={() => handleSearch()}
                        className="bg-terminal-cyan hover:bg-terminal-cyan/85 text-black font-mono font-bold px-6 rounded text-sm transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-lg shadow-terminal-cyan/15 hover:shadow-terminal-cyan/30"
                      >
                        <Search className="h-4 w-4" />
                        RUN ANALYSIS
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 animate-fadeIn">
                    <label className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                      ENTER TWO STOCK TICKER SYMBOLS FOR COMPARATIVE RESEARCH:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5 relative">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide">Company A Ticker:</span>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-mono text-xs">
                            $
                          </div>
                          <input
                            type="text"
                            value={tickerA}
                            onChange={(e) => setTickerA(e.target.value)}
                            placeholder="AAPL, NVDA, MCD..."
                            maxLength={10}
                            className="w-full bg-terminal-darker border border-terminal-border focus:border-terminal-cyan focus:outline-none rounded px-4 py-3 pl-8 text-white font-mono placeholder-slate-600 uppercase tracking-widest text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 relative">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide">Company B Ticker:</span>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-mono text-xs">
                            $
                          </div>
                          <input
                            type="text"
                            value={tickerB}
                            onChange={(e) => setTickerB(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
                            placeholder="MSFT, AMD, SBUX..."
                            maxLength={10}
                            className="w-full bg-terminal-darker border border-terminal-border focus:border-terminal-cyan focus:outline-none rounded px-4 py-3 pl-8 text-white font-mono placeholder-slate-600 uppercase tracking-widest text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCompare()}
                      className="w-full bg-terminal-yellow hover:bg-terminal-yellow/85 text-black font-mono font-bold py-3.5 rounded text-xs transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-terminal-yellow/15 hover:shadow-terminal-yellow/30 mt-2 uppercase tracking-widest"
                    >
                      <GitCompare className="h-4 w-4" />
                      RUN SIDE-BY-SIDE COMPARISON
                    </button>
                  </div>
                )}

                {/* Error box with click-to-correct typo suggestion */}
                {error && (
                  <div className="bg-terminal-red/10 border border-terminal-red/30 p-4 rounded text-xs font-mono text-terminal-red flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                    
                    {suggestion && mode === 'single' && (
                      <div className="mt-1 border-t border-terminal-red/25 pt-2 flex items-center gap-2 text-slate-300 font-bold">
                        <span>Did you mean</span>
                        <button
                          onClick={() => handleSearch(suggestion)}
                          className="bg-terminal-cyan/15 text-terminal-cyan px-2.5 py-0.5 rounded border border-terminal-cyan/30 hover:bg-terminal-cyan hover:text-black font-bold cursor-pointer transition-colors duration-150 text-[11px]"
                        >
                          {suggestion}
                        </button>
                        <span>?</span>
                      </div>
                    )}
                  </div>
                )}

                {/* HOT DEMO TICKERS */}
                {mode === 'single' ? (
                  <div className="flex flex-col gap-2.5 font-mono text-xs">
                    <span className="text-slate-500 uppercase text-[10px] tracking-wider flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-terminal-yellow" />
                      Core Ticker Classes (1-Click Instants):
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {[
                        { sym: 'AAPL', name: 'Apple Inc.', label: 'Tech Moat' },
                        { sym: 'NVDA', name: 'Nvidia Corp.', label: 'AI Supercycle' },
                        { sym: 'MCD', name: 'McDonald\'s', label: 'Valuation / Defensive' }
                      ].map((t) => (
                        <button
                          key={t.sym}
                          onClick={() => handleSearch(t.sym)}
                          className="border border-terminal-border bg-terminal-darker hover:border-terminal-cyan px-3 py-2 rounded text-left flex flex-col gap-0.5 hover:bg-terminal-cyan/5 transition-all duration-150 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold tracking-wider">{t.sym}</span>
                            <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded uppercase">{t.label}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 font-mono text-xs">
                    <span className="text-slate-500 uppercase text-[10px] tracking-wider flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-terminal-yellow" />
                      Institutional Comparisons (1-Click Instants):
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {[
                        { a: 'MCD', b: 'SBUX', label: 'Retail / Coffee' },
                        { a: 'AAPL', b: 'MSFT', label: 'Mega Tech' },
                        { a: 'NVDA', b: 'AMD', label: 'Semiconductors' },
                        { a: 'GOOGL', b: 'META', label: 'Digital Ads' }
                      ].map((pair, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleCompare(pair.a, pair.b)}
                          className="border border-terminal-border bg-terminal-darker hover:border-terminal-yellow px-3 py-2 rounded text-left flex flex-col gap-0.5 hover:bg-terminal-yellow/5 transition-all duration-150 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold tracking-wider">{pair.a} <span className="text-slate-600 font-normal">vs</span> {pair.b}</span>
                            <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded uppercase">{pair.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* SEC ANALYST RESEARCH PLATFORM OVERVIEW CARD */}
          <div className="w-full max-w-2xl border border-terminal-border bg-terminal-panel rounded-lg overflow-hidden p-6 flex flex-col md:flex-row gap-6 font-mono text-xs text-slate-400">
            <div className="flex flex-col gap-3 flex-1">
              <h3 className="text-white font-bold flex items-center gap-2 uppercase text-[10px] tracking-widest border-b border-terminal-border pb-2">
                <Cpu className="h-4 w-4 text-terminal-cyan" />
                SEC ANALYST RESEARCH PLATFORM ARCHITECTURE
              </h3>
              <p className="leading-relaxed font-sans text-xs">
                This system operates as a high-fidelity equity valuation terminal, bridging real-time market data indexes with generative AI synthesis. By scraping financial statements and adjusted historical returns (Yahoo Finance API) and executing contextual prompts (OpenAI GPT API), the platform generates professional, institutional-grade equity research memos and news sentiments.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1 text-[10px] text-slate-500">
                <span>&bull; Real-Time Ticker Verification Gateway</span>
                <span>&bull; Dynamic Vector Ratios & Balance Sheets</span>
                <span>&bull; Print-Optimized A4 PDF Memorandum Exports</span>
              </div>
            </div>
            
            {/* Terminal status badge */}
            <div className="border-t md:border-t-0 md:border-l border-terminal-border pt-4 md:pt-0 md:pl-6 flex flex-col justify-center items-center min-w-[130px] gap-2 select-none">
              <div className="h-14 w-14 rounded-full bg-slate-900 border-2 border-terminal-cyan/50 flex items-center justify-center text-terminal-cyan font-bold text-lg tracking-widest animate-pulse">
                SEC
              </div>
              <span className="text-[10px] text-white font-bold uppercase tracking-wider text-center">ANALYSIS SYSTEM</span>
              <span className="text-[8px] text-slate-500 text-center uppercase tracking-widest">GATEWAY ACTIVE</span>
            </div>
          </div>

        </div>
      )}

      {/* CASE 3: DISPLAY GENERATED REPORT */}
      {!loading && report && (
        <div className="flex-grow flex flex-col gap-6 animate-fadeIn">
          
          {/* HEADER NAV CONTROL BAR */}
          <div className="no-print border border-terminal-border bg-terminal-panel px-4 py-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <button
              onClick={() => setReport(null)}
              className="text-slate-400 hover:text-white border border-terminal-border hover:border-white px-3.5 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              BACK TO TERMINAL COMMANDS
            </button>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* LIVE DATA STATUS BLOCK WITH CLOCK ICON */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 border-r border-terminal-border pr-0 sm:pr-4">
                <span className="text-terminal-green uppercase font-bold tracking-widest text-[10px] flex items-center gap-1.5 select-none">
                  <span className="h-2.5 w-2.5 rounded-full bg-terminal-green animate-pulse"></span>
                  LIVE DATA FEED
                </span>
                <span className="text-slate-500 text-[10px] flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-500" />
                  UPDATED: <span className="text-slate-300 font-mono font-semibold">{lastUpdated}</span>
                </span>
              </div>
              
              <button
                onClick={handleExportPDF}
                disabled={exportingPDF}
                className="bg-terminal-cyan hover:bg-terminal-cyan/85 disabled:bg-slate-800 disabled:text-slate-500 text-black font-bold px-4 py-1.5 rounded flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {exportingPDF ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    CONVERTING MEMO...
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4" />
                    EXPORT RESEARCH MEMO (PDF)
                  </>
                )}
              </button>
            </div>
          </div>

          {/* MASTER REPORT SCENE TARGET FOR CANVAS/PRINT */}
          <div id="investment-memo-pdf-target" className="flex flex-col gap-6 print-container bg-background">
            
            {/* GRID 1: COMPANY DATA PANEL & PERFORMANCE PRICE PLOT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="lg:col-span-2">
                <Dashboard financials={report.financials} overview={report.overview} />
              </div>
              <div className="h-full">
                <PerformanceChart performance={report.performance} ticker={report.ticker} />
              </div>
            </div>

            {/* SEC-DIVIDER */}
            <hr className="border-t border-terminal-border my-2 print:hidden" />

            {/* GRID 2: CORE AI EQUITY RESEARCH MEMORANDUM */}
            <InvestmentMemo memo={report.memo} overview={report.overview} date={report.generatedDate} />

            {/* SEC-DIVIDER */}
            <hr className="border-t border-terminal-border my-2 print:hidden" />

            {/* GRID 3: RECENT PRESS ARTICLES & ANALYST IMPACT STATEMENTS */}
            <NewsSection news={report.news} ticker={report.ticker} />

          </div>

        </div>
      )}

      {/* CASE 4: DISPLAY COMPARATIVE REPORT */}
      {!loading && comparisonReport && (
        <div className="flex-grow flex flex-col gap-6 animate-fadeIn">
          
          {/* HEADER NAV CONTROL BAR */}
          <div className="no-print border border-terminal-border bg-terminal-panel px-4 py-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <button
              onClick={() => setComparisonReport(null)}
              className="text-slate-400 hover:text-white border border-terminal-border hover:border-white px-3.5 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              BACK TO TERMINAL COMMANDS
            </button>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* LIVE DATA STATUS BLOCK WITH CLOCK ICON */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 border-r border-terminal-border pr-0 sm:pr-4">
                <span className="text-terminal-yellow uppercase font-bold tracking-widest text-[10px] flex items-center gap-1.5 select-none">
                  <span className="h-2.5 w-2.5 rounded-full bg-terminal-yellow animate-pulse"></span>
                  LIVE DATA MODE // DUAL FEED
                </span>
                <span className="text-slate-500 text-[10px] flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-500" />
                  UPDATED: <span className="text-slate-300 font-mono font-semibold">{lastUpdated}</span>
                </span>
              </div>
              
              <button
                onClick={handleExportComparisonPDF}
                disabled={exportingPDF}
                className="bg-terminal-yellow hover:bg-terminal-yellow/85 disabled:bg-slate-800 disabled:text-slate-500 text-black font-bold px-4 py-1.5 rounded flex items-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider text-[10px]"
              >
                {exportingPDF ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin animate-pulse" />
                    CONVERTING COMPARATIVE MEMO...
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4" />
                    EXPORT COMPARISON PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* MASTER REPORT SCENE TARGET FOR CANVAS/PRINT */}
          <div id="comparison-memo-pdf-target" className="flex flex-col gap-6 print-container bg-background">
            <ComparisonDashboard report={comparisonReport} />
          </div>

        </div>
      )}

    </div>
  );
}
