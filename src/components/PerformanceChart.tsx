import React from 'react';
import { PerformanceMetric } from '@/types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

interface PerformanceChartProps {
  performance: PerformanceMetric;
  ticker: string;
}

export default function PerformanceChart({ performance, ticker }: PerformanceChartProps) {
  
  // Choose theme color based on 1Y Return
  const isPositive = performance.return1Y >= 0;
  const glowColor = isPositive ? 'var(--terminal-green)' : 'var(--terminal-red)';
  const glowColorHex = isPositive ? '#00ff66' : '#ff3b30';
  const glowColorDim = isPositive ? 'rgba(0, 255, 102, 0.15)' : 'rgba(255, 59, 48, 0.15)';

  const returnMetrics = [
    { label: '1M Return', value: performance.return1M },
    { label: '3M Return', value: performance.return3M },
    { label: '6M Return', value: performance.return6M },
    { label: '1Y Return', value: performance.return1Y },
    { label: '3Y Return', value: performance.return3Y },
  ];

  return (
    <div className="border border-terminal-border bg-terminal-panel rounded-lg overflow-hidden font-mono p-4 flex flex-col gap-4">
      
      {/* HEADER WITH RETURN BADGES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-terminal-border pb-3 gap-2">
        <div>
          <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">HISTORICAL PRICE CHART ({ticker})</span>
          <span className="text-[10px] text-slate-500 block">SOURCE: YAHOO FINANCE HISTORICAL PRICE FEED</span>
        </div>
        
        {/* Returns Badges Bar */}
        <div className="flex flex-wrap gap-2 text-xs">
          {returnMetrics.map((m, idx) => {
            const valIsPos = m.value >= 0;
            return (
              <div 
                key={idx} 
                className="border border-terminal-border bg-terminal-darker rounded px-2.5 py-1 flex items-center gap-1.5"
              >
                <span className="text-slate-500 text-[10px]">{m.label}:</span>
                <span className={`font-bold ${valIsPos ? 'text-terminal-green' : 'text-terminal-red'}`}>
                  {valIsPos ? '+' : ''}{m.value.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECHARTS PLOT AREA */}
      <div className="w-full h-[280px]">
        {performance.chartData && performance.chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={performance.chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={glowColorHex} stopOpacity={0.25}/>
                  <stop offset="95%" stopColor={glowColorHex} stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
                dx={-5}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b111e',
                  borderColor: '#1e293b',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: '#fff',
                }}
                labelStyle={{ color: '#64748b', fontWeight: 'bold' }}
                formatter={(value: any) => [`$${parseFloat(value).toFixed(2)}`, 'Price']}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={glowColorHex} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#chartGlow)" 
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
            No chart data available
          </div>
        )}
      </div>
      
    </div>
  );
}
