import type { Metadata } from "next";
import "./globals.css";
import TickerBanner from '@/components/TickerBanner';

export const metadata: Metadata = {
  title: "SEC Analyst Research Platform",
  description: "Elite equity research analyst platform generating institutional-grade investment reports and memos for public equities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-background antialiased dark">
      <body className="min-h-full flex flex-col crt-overlay font-sans text-foreground">
        
        {/* Terminal Header */}
        <header className="no-print border-b border-terminal-border bg-terminal-darker px-4 py-2 flex items-center justify-between text-xs font-mono select-none">
          <div className="flex items-center gap-4">
            <span className="text-terminal-cyan font-bold tracking-widest flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-terminal-cyan animate-pulse"></span>
              SEC-ANALYST // v1.0.0
            </span>
            <span className="text-muted-foreground border-l border-terminal-border pl-4 hidden md:inline">
              PROJECT ARCHITECTURE: NEXT.js + TAILWIND v4 + GPT-4o-mini
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-terminal-cyan bg-terminal-cyan-glow px-2 py-0.5 rounded border border-terminal-cyan/30 text-[10px] uppercase font-bold">
              SEC Analyst Research Platform
            </span>
            <span className="text-muted-foreground">
              FEED STATUS: <span className="text-terminal-green">ONLINE</span>
            </span>
          </div>
        </header>

        {/* Persistent Ticker Tape Tape */}
        <TickerBanner />

        {/* Main Workspace */}
        <main className="flex-1 flex flex-col bg-background">
          {children}
        </main>

        {/* Terminal Footer */}
        <footer className="no-print border-t border-terminal-border bg-terminal-darker px-4 py-2 flex items-center justify-between text-[10px] font-mono text-slate-500 select-none">
          <div>
            <span>SYSTEM DIRECTORY: </span>
            <span className="text-slate-400">/Users/nylekamil/.gemini/antigravity/scratch/ai-investment-research-analyst</span>
          </div>
          <div className="flex gap-4">
            <span>F1: HELP</span>
            <span>F2: DATA SWITCH</span>
            <span>ESC: TERMINAL EXIT</span>
            <span className="text-terminal-cyan font-bold">&copy; 2026 SEC ANALYST RESEARCH PLATFORM</span>
          </div>
        </footer>

      </body>
    </html>
  );
}
