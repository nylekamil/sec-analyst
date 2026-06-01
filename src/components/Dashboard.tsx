import React from 'react';
import { FinancialDashboard, CompanyOverview } from '@/types';
import { 
  DollarSign, 
  Percent, 
  TrendingUp, 
  ShieldAlert, 
  Award, 
  PieChart, 
  Building,
  User,
  MapPin
} from 'lucide-react';

interface DashboardProps {
  financials: FinancialDashboard;
  overview: CompanyOverview;
}

// Utility to format large currency amounts
export const formatLargeCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined) return 'Unavailable';
  if (value === 0) return '$0.00';
  const absVal = Math.abs(value);
  const suffix = value < 0 ? '-' : '';
  
  if (absVal >= 1e12) {
    return `${suffix}$${(absVal / 1e12).toFixed(2)}T`;
  }
  if (absVal >= 1e9) {
    return `${suffix}$${(absVal / 1e9).toFixed(2)}B`;
  }
  if (absVal >= 1e6) {
    return `${suffix}$${(absVal / 1e6).toFixed(2)}M`;
  }
  return `${suffix}$${value.toLocaleString()}`;
};

export const formatPercent = (value: number | null | undefined) => {
  if (value === undefined || value === null) return 'Unavailable';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export default function Dashboard({ financials, overview }: DashboardProps) {
  
  // Solvency calculations
  const netCash = (financials.cash !== null && financials.cash !== undefined && financials.debt !== null && financials.debt !== undefined)
    ? financials.cash - financials.debt
    : null;
  
  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* SECTION 1: COMPANY CARD PROFILE */}
      <div className="border border-terminal-border bg-terminal-panel p-6 rounded-lg grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono">{overview.name}</h1>
            <span className="bg-terminal-cyan/15 text-terminal-cyan px-2.5 py-0.5 rounded text-xs font-mono font-bold border border-terminal-cyan/30">
              {overview.ticker}
            </span>
            <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
              {overview.sector}
            </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mt-2">{overview.description}</p>
        </div>
        
        <div className="border-t lg:border-t-0 lg:border-l border-terminal-border pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between text-xs font-mono gap-3 text-slate-400">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5"><Building className="h-3.5 w-3.5 text-terminal-cyan" /> HQ:</span>
            <span className="text-white font-bold">{overview.headquarters}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-terminal-cyan" /> CEO:</span>
            <span className="text-white font-bold">{overview.ceo}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5"><PieChart className="h-3.5 w-3.5 text-terminal-cyan" /> Industry:</span>
            <span className="text-white font-bold text-right truncate max-w-[150px]" title={overview.industry}>{overview.industry}</span>
          </div>
          <div className="flex justify-between items-center border-t border-terminal-border/50 pt-2">
            <span>Market Capitalization:</span>
            <span className="text-terminal-cyan font-bold text-sm tracking-wide">
              {formatLargeCurrency(overview.marketCap)}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: DIGITAL RATIOS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* WIDGET 1: MARKET DATA */}
        <div className="border border-terminal-border bg-terminal-panel p-4 rounded-lg flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between text-slate-500 text-xs uppercase tracking-wider mb-2">
            <span>Market Price</span>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">
              ${financials.currentPrice.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
              <span>52W Low: <span className="text-white">${financials.low52Week.toFixed(2)}</span></span>
              <span>52W High: <span className="text-white">${financials.high52Week.toFixed(2)}</span></span>
            </div>
          </div>
        </div>

        {/* WIDGET 2: PERFORMANCE RATIOS */}
        <div className="border border-terminal-border bg-terminal-panel p-4 rounded-lg flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between text-slate-500 text-xs uppercase tracking-wider mb-2">
            <span>Valuation Multiples</span>
            <TrendingUp className="h-4 w-4 text-terminal-cyan" />
          </div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
            <div className="flex justify-between border-b border-terminal-border/50 pb-1">
              <span className="text-slate-500">P/E:</span>
              <span className="text-white font-bold">{financials.currentPE !== null && financials.currentPE !== undefined ? financials.currentPE.toFixed(1) : 'Unavailable'}</span>
            </div>
            <div className="flex justify-between border-b border-terminal-border/50 pb-1">
              <span className="text-slate-500">FWD P/E:</span>
              <span className="text-white font-bold">{financials.forwardPE !== null && financials.forwardPE !== undefined ? financials.forwardPE.toFixed(1) : 'Unavailable'}</span>
            </div>
            <div className="flex justify-between pb-0.5">
              <span className="text-slate-500">EV/EBIT:</span>
              <span className="text-white font-bold">{financials.evEbitda !== null && financials.evEbitda !== undefined ? financials.evEbitda.toFixed(1) : 'Unavailable'}</span>
            </div>
            <div className="flex justify-between pb-0.5">
              <span className="text-slate-500">P/S Ratio:</span>
              <span className="text-white font-bold">{financials.priceToSales !== null && financials.priceToSales !== undefined ? financials.priceToSales.toFixed(1) : 'Unavailable'}</span>
            </div>
          </div>
        </div>

        {/* WIDGET 3: OPERATIONS AND GROWTH */}
        <div className="border border-terminal-border bg-terminal-panel p-4 rounded-lg flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between text-slate-500 text-xs uppercase tracking-wider mb-2">
            <span>Growth & Profit</span>
            <Percent className="h-4 w-4 text-terminal-green" />
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs text-slate-500">Revenue Growth:</span>
              <span className={`text-sm font-bold ${
                financials.revenueGrowth === null || financials.revenueGrowth === undefined
                  ? 'text-slate-400'
                  : financials.revenueGrowth >= 0
                    ? 'text-terminal-green'
                    : 'text-terminal-red'
              }`}>
                {formatPercent(financials.revenueGrowth)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 text-xs mt-2 border-t border-terminal-border/50 pt-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Mgn:</span>
                <span className="text-white font-bold">
                  {financials.grossMargin !== null && financials.grossMargin !== undefined ? `${financials.grossMargin.toFixed(1)}%` : 'Unavailable'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Oper Mgn:</span>
                <span className="text-white font-bold">
                  {financials.operatingMargin !== null && financials.operatingMargin !== undefined ? `${financials.operatingMargin.toFixed(1)}%` : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* WIDGET 4: SOLVENCY */}
        <div className="border border-terminal-border bg-terminal-panel p-4 rounded-lg flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between text-slate-500 text-xs uppercase tracking-wider mb-2">
            <span>Solvency Position</span>
            <ShieldAlert className="h-4 w-4 text-terminal-yellow" />
          </div>
          <div className="text-xs flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Debt:</span>
              <span className="text-white font-bold">{formatLargeCurrency(financials.debt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cash Assets:</span>
              <span className="text-white font-bold">{formatLargeCurrency(financials.cash)}</span>
            </div>
            <div className="flex justify-between border-t border-terminal-border/50 pt-1.5">
              <span className="text-slate-500">Net Liquidity:</span>
              <span className={`font-bold ${
                netCash === null 
                  ? 'text-slate-400' 
                  : netCash >= 0 
                    ? 'text-terminal-green' 
                    : 'text-terminal-red'
              }`}>
                {formatLargeCurrency(netCash)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 3: DETAILED OPERATIONS AND INCOME ANALYSIS SHEET */}
      <div className="border border-terminal-border bg-terminal-panel rounded-lg overflow-hidden font-mono text-xs">
        <div className="bg-terminal-darker px-4 py-3 border-b border-terminal-border flex justify-between items-center">
          <span className="text-slate-400 font-bold uppercase tracking-wide">Financial Statement Dashboard (TTM)</span>
          <span className="text-slate-500 text-[10px]">ALL FIGURES IN USD // SOURCE: YAHOO FINANCE & SEC EDGAR TTM FILINGS</span>
        </div>
        
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-r border-terminal-border/50 pr-4">
            <h3 className="text-slate-400 font-bold mb-3 border-b border-terminal-border/50 pb-1.5 uppercase text-[10px]">Operations & Volumes</h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Revenue (Total Sales):</span>
                <span className="text-white font-bold">{formatLargeCurrency(financials.revenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Net Income:</span>
                <span className="text-white font-bold">{formatLargeCurrency(financials.netIncome)}</span>
              </div>
              <div className="flex justify-between border-t border-terminal-border/30 pt-2">
                <span className="text-slate-500">Earnings Per Share (EPS):</span>
                <span className="text-white font-bold">
                  {financials.eps !== null && financials.eps !== undefined ? `$${financials.eps.toFixed(2)}` : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="border-r border-terminal-border/50 pr-4">
            <h3 className="text-slate-400 font-bold mb-3 border-b border-terminal-border/50 pb-1.5 uppercase text-[10px]">Cash Flow Metrics</h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Free Cash Flow (FCF):</span>
                <span className="text-white font-bold">{formatLargeCurrency(financials.freeCashFlow)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">FCF Conversion Rate:</span>
                <span className="text-white font-bold">
                  {financials.netIncome !== null && financials.netIncome !== undefined && financials.freeCashFlow !== null && financials.freeCashFlow !== undefined && financials.netIncome > 0
                    ? `${((financials.freeCashFlow / financials.netIncome) * 100).toFixed(1)}%`
                    : 'Unavailable'}
                </span>
              </div>
              <div className="flex justify-between border-t border-terminal-border/30 pt-2">
                <span className="text-slate-500">FCF Yield (on Cap):</span>
                <span className="text-white font-bold">
                  {financials.freeCashFlow !== null && financials.freeCashFlow !== undefined && overview.marketCap > 0
                    ? `${((financials.freeCashFlow / overview.marketCap) * 100).toFixed(2)}%`
                    : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-slate-400 font-bold mb-3 border-b border-terminal-border/50 pb-1.5 uppercase text-[10px]">Valuation Check</h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Implied FCF Multiple:</span>
                <span className="text-white font-bold">
                  {financials.freeCashFlow !== null && financials.freeCashFlow !== undefined && financials.freeCashFlow > 0
                    ? `${(overview.marketCap / financials.freeCashFlow).toFixed(1)}x`
                    : 'Unavailable'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Enterprise Value (EV):</span>
                <span className="text-white font-bold">
                  {formatLargeCurrency(
                    (financials.debt !== null && financials.debt !== undefined && financials.cash !== null && financials.cash !== undefined)
                      ? (overview.marketCap + financials.debt - financials.cash)
                      : null
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-terminal-border/30 pt-2">
                <span className="text-slate-500">P/E Premium:</span>
                <span className="text-white font-bold">
                  {financials.currentPE !== null && financials.currentPE !== undefined && financials.forwardPE !== null && financials.forwardPE !== undefined && financials.forwardPE !== 0
                    ? `${((financials.currentPE / financials.forwardPE - 1) * 100).toFixed(1)}%`
                    : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
