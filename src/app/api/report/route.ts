import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { fetchLiveMarketData } from '@/lib/marketData';
import { generateAIMemo, generateNewsSentiment, isOpenAICurrentlyAvailable } from '@/lib/openai';
import { EquityResearchReport } from '@/types';

const yahooFinance = new YahooFinance();

// Helper to get ticker suggestions for common typos
function getTickerSuggestion(symbol: string): string | null {
  const clean = symbol.toUpperCase().trim();
  
  const typoMap: Record<string, string> = {
    'APPL': 'AAPL',
    'APLE': 'AAPL',
    'APP': 'AAPL',
    'APL': 'AAPL',
    'NVADA': 'NVDA',
    'NVD': 'NVDA',
    'NVDIA': 'NVDA',
    'NVAD': 'NVDA',
    'MSF': 'MSFT',
    'MSFTS': 'MSFT',
    'MC': 'MCD',
    'MCDD': 'MCD',
    'MCDON': 'MCD',
    'TSL': 'TSLA',
    'TESL': 'TSLA',
    'AMZ': 'AMZN',
    'NFL': 'NFLX',
    'FB': 'META',
    'GOGL': 'GOOGL',
    'GOOG': 'GOOGL'
  };

  if (typoMap[clean]) {
    return typoMap[clean];
  }

  // Edit distance character overlap with major tickers
  const coreTickers = ['AAPL', 'NVDA', 'MCD', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META'];
  for (const core of coreTickers) {
    if (core.startsWith(clean) && clean.length >= 2) {
      return core;
    }
    const coreChars = new Set(core.split(''));
    const cleanChars = clean.split('');
    const overlap = cleanChars.filter(c => coreChars.has(c)).length;
    if (overlap >= 3 && Math.abs(core.length - clean.length) <= 2) {
      return core;
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tickerParam = searchParams.get('ticker');

  if (!tickerParam) {
    return NextResponse.json(
      { error: 'Query parameter "ticker" is required' },
      { status: 400 }
    );
  }

  const ticker = tickerParam.toUpperCase().trim();
  
  // 1. Core Ticker Validation against Yahoo Finance
  let isValidTicker = true;
  let validationErrorMsg = '';
  let errorType: 'none' | 'invalid_ticker' | 'rate_limit' | 'api_failure' = 'none';
  
  try {
    const check = (await yahooFinance.quote(ticker)) as any;
    if (!check) {
      isValidTicker = false;
      errorType = 'invalid_ticker';
      validationErrorMsg = `Invalid stock ticker symbol "${ticker}". Please confirm the ticker exists and try again.`;
    } else if (!check.regularMarketPrice && !check.shortName) {
      isValidTicker = false;
      errorType = 'invalid_ticker';
      validationErrorMsg = `Invalid stock ticker symbol "${ticker}". Please confirm the ticker exists and try again.`;
    }
  } catch (err: any) {
    const message = err.message || '';
    const code = err.code || '';
    
    // Distinguish error categories
    const isRateLimit = message.includes('429') || message.toLowerCase().includes('too many requests') || message.toLowerCase().includes('rate limit');
    const isNotFoundError = message.includes('404') || message.toLowerCase().includes('not found') || message.toLowerCase().includes('invalid') || message.toLowerCase().includes('validate');
    const isNetworkError = code === 'ENOTFOUND' || code === 'ETIMEDOUT' || code === 'ECONNREFUSED' || message.includes('fetch') || message.includes('network');

    if (isNotFoundError) {
      isValidTicker = false;
      errorType = 'invalid_ticker';
      validationErrorMsg = `Invalid stock ticker symbol "${ticker}". Please confirm the ticker exists and try again.`;
    } else if (isRateLimit) {
      errorType = 'rate_limit';
      return NextResponse.json(
        { error: `Yahoo Finance API Rate Limit Exceeded: ${message}`, isRateLimit: true },
        { status: 429 }
      );
    } else if (isNetworkError) {
      errorType = 'api_failure';
      return NextResponse.json(
        { error: `Yahoo Finance API network/server offline: ${message}` },
        { status: 503 }
      );
    } else {
      errorType = 'api_failure';
      return NextResponse.json(
        { error: `Yahoo Finance query failure: ${message}` },
        { status: 500 }
      );
    }
  }

  // If validation fails (confirmed invalid ticker), return 400 with a suggestion
  if (!isValidTicker) {
    let suggestion = getTickerSuggestion(ticker);
    if (suggestion === ticker) {
      suggestion = null;
    }
    
    console.log(`[Research API] Ticker validation failed for ${ticker}. Suggestion: ${suggestion}`);
    return NextResponse.json(
      { 
        error: validationErrorMsg || `Invalid stock ticker symbol "${ticker}".`, 
        didYouMean: suggestion 
      },
      { status: 400 }
    );
  }

  // 2. OpenAI API Key Presence Validation
  const isOpenAIAbsent = !isOpenAICurrentlyAvailable();
  if (isOpenAIAbsent) {
    console.warn('[Research API] Request blocked: OpenAI API Key is missing.');
    return NextResponse.json(
      { 
        error: 'OpenAI API Key is not configured. The SEC Analyst Research Platform requires an OpenAI API key to compile institutional investment memos.', 
        needsSetup: true 
      },
      { status: 400 }
    );
  }

  console.log(`[Research API] Initiating live market data & AI memo compilation for: ${ticker}`);

  try {
    // 3. Fetch live stock data, returns, and news
    const liveData = await fetchLiveMarketData(ticker);

    // 4. Extract news headlines for AI contextual prompts
    const newsHeadlines = liveData.news.map(n => n.title);

    // 5. Generate the institutional AI investment memo
    let aiMemo;
    try {
      aiMemo = await generateAIMemo(liveData.overview, liveData.financials, newsHeadlines);
    } catch (openaiErr: any) {
      console.error(`[Research API] OpenAI Memo generation failed for ${ticker}:`, openaiErr.message);
      const isRateLimit = openaiErr.message.includes('429') || openaiErr.message.toLowerCase().includes('rate limit') || openaiErr.message.toLowerCase().includes('quota');
      return NextResponse.json(
        { 
          error: isRateLimit 
            ? `OpenAI API Rate Limit Exceeded or Quota Exhausted: ${openaiErr.message}` 
            : `OpenAI API compilation failed: ${openaiErr.message}`,
          isRateLimit 
        },
        { status: 502 }
      );
    }

    // 6. Summarize and analyze sentiment for the news stories in parallel
    const newsWithSentiment = await Promise.all(
      liveData.news.map(async (story) => {
        try {
          const sentiment = await generateNewsSentiment(story.title, story.source, ticker);
          return { ...story, sentimentAnalysis: sentiment };
        } catch (sentErr) {
          console.warn(`[Research API] Sentiment analysis failed for story "${story.title}". Returning baseline story.`);
          return story;
        }
      })
    );

    // 7. Construct unified equity research report
    const reportPayload: EquityResearchReport = {
      ticker,
      generatedDate: new Date().toISOString().split('T')[0],
      overview: liveData.overview,
      financials: liveData.financials,
      performance: liveData.performance,
      memo: aiMemo,
      news: newsWithSentiment,
      isMockData: false
    };

    return NextResponse.json(reportPayload);

  } catch (error: any) {
    console.error(`[Research API] Fatal execution error for ${ticker}:`, error.message);
    return NextResponse.json(
      { error: `Internal Server Error during data compilation: ${error.message}` },
      { status: 500 }
    );
  }
}
