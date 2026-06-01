'use client';

import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw } from 'lucide-react';

interface TickerQuote {
  ticker: string;
  price: number;
  changePercent: number;
  success: boolean;
}

export default function TickerBanner() {
  const [quotes, setQuotes] = useState<TickerQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [timestamp, setTimestamp] = useState<string | null>(null);

  const fetchQuotes = async () => {
    try {
      const res = await fetch('/api/tickers');
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      
      if (data.quotes && Array.isArray(data.quotes)) {
        setQuotes(data.quotes);
        setTimestamp(data.timestamp || new Date().toLocaleTimeString());
        setError(false);
      } else {
        throw new Error('Malformed quotes response');
      }
    } catch (e) {
      console.error('[Ticker Banner] Failed to fetch quotes:', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
    
    // Refresh quotes every 60 seconds
    const interval = setInterval(() => {
      fetchQuotes();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Duplicate quotes array to create continuous marquee flow
  const renderMarqueeQuotes = (list: TickerQuote[]) => {
    return list.map((q, idx) => {
      if (!q.success) {
        return (
          <span key={`${q.ticker}-${idx}`} className="flex gap-2 text-slate-500">
            <span>{q.ticker}</span>
            <span className="font-bold">[Data unavailable]</span>
          </span>
        );
      }
      
      const isPositive = q.changePercent >= 0;
      const formattedPrice = q.price ? `$${q.price.toFixed(2)}` : 'N/A';
      const formattedPercent = q.changePercent 
        ? `${isPositive ? '+' : ''}${q.changePercent.toFixed(2)}%` 
        : '0.00%';

      return (
        <span key={`${q.ticker}-${idx}`} className="flex gap-2">
          <span className="text-slate-400 font-bold">{q.ticker}</span>
          <span className={`font-semibold ${isPositive ? 'text-terminal-green' : 'text-terminal-red'}`}>
            {formattedPrice} ({formattedPercent})
          </span>
        </span>
      );
    });
  };

  return (
    <div className="no-print w-full border-b border-terminal-border bg-terminal-panel h-8 overflow-hidden flex items-center text-xs font-mono select-none relative z-10">
      
      {/* Indicator HUD Left Box */}
      <div className="h-full bg-terminal-darker border-r border-terminal-border px-3.5 flex items-center shrink-0 gap-1.5 text-[9px] uppercase tracking-wider relative z-20">
        <span className={`h-1.5 w-1.5 rounded-full ${error ? 'bg-terminal-red animate-ping' : 'bg-terminal-cyan animate-pulse'}`}></span>
        <span className={error ? 'text-terminal-red font-bold' : 'text-terminal-cyan font-bold'}>
          {error ? 'TAPE OFFLINE' : 'LIVE TAPE'}
        </span>
        {timestamp && !error && (
          <span className="text-slate-500 hidden sm:inline border-l border-terminal-border/50 pl-2 flex items-center gap-0.5">
            <Clock className="h-2.5 w-2.5 text-slate-500" />
            {timestamp}
          </span>
        )}
      </div>

      {/* Marquee Content */}
      <div className="flex-1 overflow-hidden relative flex items-center z-0">
        {loading ? (
          <div className="pl-4 text-slate-500 flex items-center gap-1.5 text-[10px]">
            <RefreshCw className="h-3 w-3 animate-spin text-terminal-cyan" />
            CONNECTING TICKER TAPE DATA STREAM...
          </div>
        ) : error || quotes.length === 0 ? (
          <div className="pl-4 text-terminal-red font-bold text-[10px]">
            ERROR: REAL-TIME TAPE DATA UNAVAILABLE // SEC FEED BLOCKED
          </div>
        ) : (
          <div className="animate-marquee whitespace-nowrap flex gap-8 items-center py-1">
            {/* Render items twice to allow infinite loop marquee */}
            {renderMarqueeQuotes(quotes)}
            {renderMarqueeQuotes(quotes)}
          </div>
        )}
      </div>
      
    </div>
  );
}
