import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export async function GET() {
  const tickers = ['AAPL', 'MSFT', 'NVDA', 'MCD', 'GOOGL', 'AMZN', 'META', 'TSLA'];
  
  try {
    const quotes = await Promise.all(
      tickers.map(async (ticker) => {
        try {
          const quote = (await yahooFinance.quote(ticker)) as any;
          if (!quote) {
            throw new Error(`No data returned for ${ticker}`);
          }
          return {
            ticker,
            price: quote.regularMarketPrice || 0,
            changePercent: quote.regularMarketChangePercent || 0,
            success: true
          };
        } catch (e: any) {
          console.error(`[Ticker API] Failed to fetch quote for ${ticker}:`, e.message);
          return { ticker, success: false };
        }
      })
    );
    
    return NextResponse.json({ 
      quotes, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
    });
  } catch (err: any) {
    console.error('[Ticker API] Fatal marquee fetch error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
export const revalidate = 0;
