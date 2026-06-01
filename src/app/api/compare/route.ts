import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { fetchLiveMarketData } from '@/lib/marketData';
import { generateAIComparison, isOpenAICurrentlyAvailable } from '@/lib/openai';
import { ComparisonReport } from '@/types';

const yahooFinance = new YahooFinance();

// Helper to check ticker validity against Yahoo Finance
async function validateTicker(ticker: string): Promise<{ isValid: boolean; errorMsg: string; errorType: string }> {
  try {
    const check = (await yahooFinance.quote(ticker)) as any;
    if (!check || (!check.regularMarketPrice && !check.shortName)) {
      return {
        isValid: false,
        errorMsg: `Invalid stock ticker symbol "${ticker}". Please confirm the ticker exists and try again.`,
        errorType: 'invalid_ticker'
      };
    }
    return { isValid: true, errorMsg: '', errorType: 'none' };
  } catch (err: any) {
    const message = err.message || '';
    const isNotFoundError = message.includes('404') || message.toLowerCase().includes('not found') || message.toLowerCase().includes('invalid') || message.toLowerCase().includes('validate');
    const isRateLimit = message.includes('429') || message.toLowerCase().includes('too many requests') || message.toLowerCase().includes('rate limit');
    
    if (isNotFoundError) {
      return {
        isValid: false,
        errorMsg: `Invalid stock ticker symbol "${ticker}". Please confirm the ticker exists and try again.`,
        errorType: 'invalid_ticker'
      };
    } else if (isRateLimit) {
      return { isValid: false, errorMsg: `Yahoo Finance API Rate Limit Exceeded: ${message}`, errorType: 'rate_limit' };
    } else {
      return { isValid: false, errorMsg: `Yahoo Finance API Failure: ${message}`, errorType: 'api_failure' };
    }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tickerAParam = searchParams.get('tickerA');
  const tickerBParam = searchParams.get('tickerB');

  if (!tickerAParam || !tickerBParam) {
    return NextResponse.json(
      { error: 'Both "tickerA" and "tickerB" query parameters are required.' },
      { status: 400 }
    );
  }

  const tickerA = tickerAParam.toUpperCase().trim();
  const tickerB = tickerBParam.toUpperCase().trim();

  if (tickerA === tickerB) {
    return NextResponse.json(
      { error: 'Please enter two different stock symbols for a comparative analysis.' },
      { status: 400 }
    );
  }

  // 1. Ticker Validation Checks
  const validationA = await validateTicker(tickerA);
  if (!validationA.isValid) {
    return NextResponse.json(
      { error: validationA.errorMsg, errorType: validationA.errorType },
      { status: validationA.errorType === 'rate_limit' ? 429 : 400 }
    );
  }

  const validationB = await validateTicker(tickerB);
  if (!validationB.isValid) {
    return NextResponse.json(
      { error: validationB.errorMsg, errorType: validationB.errorType },
      { status: validationB.errorType === 'rate_limit' ? 429 : 400 }
    );
  }

  // 2. OpenAI Key Check
  if (!isOpenAICurrentlyAvailable()) {
    return NextResponse.json(
      { error: 'OpenAI API Key is not configured in .env.local. A valid key is required for comparison memos.', needsSetup: true },
      { status: 400 }
    );
  }

  console.log(`[Compare API] Querying data for comparison: ${tickerA} vs ${tickerB}`);

  try {
    // 3. Fetch live data for both companies in parallel
    const [liveDataA, liveDataB] = await Promise.all([
      fetchLiveMarketData(tickerA),
      fetchLiveMarketData(tickerB)
    ]);

    // 4. Generate the comparative AI memo
    let aiComparison;
    try {
      aiComparison = await generateAIComparison(
        liveDataA.overview,
        liveDataA.financials,
        liveDataB.overview,
        liveDataB.financials
      );
    } catch (openaiErr: any) {
      console.error(`[Compare API] OpenAI Generation failed:`, openaiErr.message);
      const isRateLimit = openaiErr.message.includes('429') || openaiErr.message.toLowerCase().includes('rate limit') || openaiErr.message.toLowerCase().includes('quota');
      return NextResponse.json(
        { 
          error: isRateLimit 
            ? `OpenAI API Rate Limit Exceeded or Quota Exhausted: ${openaiErr.message}` 
            : `OpenAI comparative compilation failed: ${openaiErr.message}`,
          isRateLimit 
        },
        { status: 502 }
      );
    }

    // 5. Construct comparison payload
    const comparisonPayload: ComparisonReport = {
      tickerA,
      tickerB,
      generatedDate: new Date().toISOString().split('T')[0],
      dataA: {
        overview: liveDataA.overview,
        financials: liveDataA.financials,
        performance: liveDataA.performance
      },
      dataB: {
        overview: liveDataB.overview,
        financials: liveDataB.financials,
        performance: liveDataB.performance
      },
      aiAnalysis: aiComparison
    };

    return NextResponse.json(comparisonPayload);

  } catch (error: any) {
    console.error(`[Compare API] Fatal comparison error:`, error.message);
    return NextResponse.json(
      { error: `Internal Server Error during comparison compilation: ${error.message}` },
      { status: 500 }
    );
  }
}
