import OpenAI from 'openai';
import { CompanyOverview, FinancialDashboard, InvestmentMemo, NewsSentiment, ComparisonAIAnalysis } from '../types';

// Helper to check if the OpenAI API Key is valid and not a placeholder
const isOpenAICurrentlyAvailable = () => {
  const key = process.env.OPENAI_API_KEY;
  return key && key !== 'your_openai_api_key_here' && key.trim() !== '';
};

// Initialize OpenAI client only if available
const getOpenAIClient = () => {
  if (!isOpenAICurrentlyAvailable()) {
    return null;
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
};

/**
 * Generate a professional hedge fund investment memo using OpenAI GPT.
 */
export async function generateAIMemo(
  overview: CompanyOverview,
  financials: FinancialDashboard,
  newsHeadlines: string[]
): Promise<InvestmentMemo> {
  const openai = getOpenAIClient();

  if (!openai) {
    throw new Error('OpenAI API Key is not configured or is using the placeholder.');
  }

  const prompt = `
You are an Elite Equity Research Analyst and Hedge Fund Portfolio Manager. Write a highly analytical, institutional-grade Investment Research Memo for ${overview.name} (${overview.ticker}).
Do not use generic fluff or enthusiastic marketing jargon. Write in a precise, objective, and quantitative tone typical of a Goldman Sachs or Point72 report.

CRITICAL TEMPORAL REQUIREMENT:
Today's date is June 1, 2026. All catalysts, product launches, timelines, and earnings release timelines must be strictly forward-looking relative to June 1, 2026. Under no circumstances should you generate references to past catalysts, events, or earnings releases that have already occurred. 
If exact future dates are unavailable, you MUST use general forward-looking terms:
- "Upcoming earnings release"
- "Next fiscal quarter"
- "Next 6-12 months"
Ensure all catalyst timelines represent future events starting from June 1, 2026.

COMPANY OVERVIEW:
- Name: ${overview.name}
- Sector: ${overview.sector}
- Industry: ${overview.industry}
- Market Cap: $${(overview.marketCap / 1e9).toFixed(2)}B
- Description: ${overview.description}

FINANCIAL DATA POINTS:
- Current Price: $${financials.currentPrice}
- Revenue: ${financials.revenue !== null ? '$' + (financials.revenue / 1e9).toFixed(2) + 'B' : 'Unavailable'} (Growth: ${financials.revenueGrowth !== null ? financials.revenueGrowth.toFixed(1) + '%' : 'Unavailable'})
- Net Income: ${financials.netIncome !== null ? '$' + (financials.netIncome / 1e9).toFixed(2) + 'B' : 'Unavailable'} (Margins: Operating ${financials.operatingMargin !== null ? financials.operatingMargin.toFixed(1) + '%' : 'Unavailable'}, Gross ${financials.grossMargin !== null ? financials.grossMargin.toFixed(1) + '%' : 'Unavailable'})
- FCF: ${financials.freeCashFlow !== null ? '$' + (financials.freeCashFlow / 1e9).toFixed(2) + 'B' : 'Unavailable'}
- Debt: ${financials.debt !== null ? '$' + (financials.debt / 1e9).toFixed(2) + 'B' : 'Unavailable'} | Cash: ${financials.cash !== null ? '$' + (financials.cash / 1e9).toFixed(2) + 'B' : 'Unavailable'}
- Trailing P/E: ${financials.currentPE !== null ? financials.currentPE : 'Unavailable'} | Forward P/E: ${financials.forwardPE !== null ? financials.forwardPE : 'Unavailable'} | EV/EBITDA: ${financials.evEbitda !== null ? financials.evEbitda : 'Unavailable'} | P/S: ${financials.priceToSales !== null ? financials.priceToSales : 'Unavailable'}
- 52-Week Range: $${financials.low52Week} - $${financials.high52Week}

RECENT NEWS HEADLINES:
${newsHeadlines.map(h => `- ${h}`).join('\n')}

Based on this data, perform deep research and generate a JSON object matching this structure EXACTLY:
{
  "executiveSummary": "2-3 paragraph professional summary analyzing core investment thesis, recent momentum, and structural outlook. Ensure highly qualitative and quantitative synthesis.",
  "businessOverview": "Explain what the company does, its core business units, primary high-margin drivers, and key durable competitive advantages (moats) like high switching costs, network effects, or brand equity.",
  "industryAnalysis": "Analyze industry growth CAGR, competitive landscape dynamics (who are the primary competitors?), and key sector-wide trends (AI adoption, regulatory hurdles, or supply chain changes).",
  "bullCase": [
    { "point": "Reason 1 (short headline)", "detail": "Detailed quantitative and strategic explanation of why this supports outperformance." },
    { "point": "Reason 2", "detail": "..." },
    { "point": "Reason 3", "detail": "..." },
    { "point": "Reason 4", "detail": "..." },
    { "point": "Reason 5", "detail": "..." }
  ],
  "bearCase": [
    { "point": "Risk 1 (short headline)", "detail": "Detailed strategic explanation of why this risk poses a threat to valuation or margins." },
    { "point": "Risk 2", "detail": "..." },
    { "point": "Risk 3", "detail": "..." },
    { "point": "Risk 4", "detail": "..." },
    { "point": "Risk 5", "detail": "..." }
  ],
  "catalysts": [
    { "event": "Event 1", "date": "Estimated Timeline", "impact": "High" or "Medium" or "Low", "description": "Specific upcoming corporate event (earnings, product launches, acquisitions, share repurchases, trials) and how it unlocks value." },
    { "event": "Event 2", "date": "...", "impact": "...", "description": "..." },
    { "event": "Event 3", "date": "...", "impact": "...", "description": "..." }
  ],
  "valuationSnapshot": {
    "multiplesExplanation": "Explain current multiples (P/E, EV/EBITDA, P/S) relative to historic averages and industry benchmarks.",
    "industryAveragePE": 22.5 (estimated float number),
    "historicalAveragePE": 19.8 (estimated float number),
    "valuationStatus": "Cheap" or "Fair" or "Expensive"
  },
  "finalRecommendation": "Strong Buy" or "Buy" or "Hold" or "Sell" or "Strong Sell",
  "recommendationExplanation": "A 2-3 sentence concluding summary that explicitly defends the final recommendation rating based on growth margins, competitive moat, and valuation limits."
}

Do not include any Markdown wrapper code blocks (like \`\`\`json). Return ONLY a raw, fully valid JSON string that matches the requested JSON schema.
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Extremely cost-efficient, lightning fast, and perfect for structured output tasks
      messages: [
        { role: 'system', content: 'You are an institutional equity research director.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    });

    const contentText = response.choices[0].message.content || '{}';
    return JSON.parse(contentText) as InvestmentMemo;
  } catch (error: any) {
    console.error('OpenAI generation error:', error);
    throw new Error(`Failed to generate AI Investment Memo: ${error.message}`);
  }
}

/**
 * Summarize and perform sentiment analysis on a news story using OpenAI.
 */
export async function generateNewsSentiment(
  newsTitle: string,
  newsSource: string,
  ticker: string
): Promise<NewsSentiment> {
  const openai = getOpenAIClient();

  if (!openai) {
    throw new Error('OpenAI API Key is not configured or is using the placeholder.');
  }

  const prompt = `
Analyze the following news headline for ${ticker}:
Title: "${newsTitle}"
Source: "${newsSource}"

Evaluate this news item as a hedge fund analyst. Generate a JSON object matching this structure EXACTLY:
{
  "positiveDevelopments": ["1-2 quick points on how this could benefit the stock price or margins"],
  "negativeDevelopments": ["1-2 quick points on potential negative impacts, risks, or costs"],
  "investmentImplications": "A concise single-sentence summary of what this means for a long-term equity investor."
}

Do not include any Markdown wrapper code blocks. Return ONLY a raw, fully valid JSON string that matches the requested JSON schema.
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a hedge fund analyst.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    });

    const contentText = response.choices[0].message.content || '{}';
    return JSON.parse(contentText) as NewsSentiment;
  } catch (error: any) {
    console.error('OpenAI news sentiment generation error:', error);
    return {
      positiveDevelopments: ['Unable to analyze sentiment (API offline).'],
      negativeDevelopments: ['Unable to analyze sentiment (API offline).'],
      investmentImplications: 'Sentiment analysis was bypassed due to API error.'
    };
  }
}

/**
 * Generate a side-by-side comparative analysis of two companies.
 */
export async function generateAIComparison(
  overviewA: CompanyOverview,
  financialsA: FinancialDashboard,
  overviewB: CompanyOverview,
  financialsB: FinancialDashboard
): Promise<ComparisonAIAnalysis> {
  const openai = getOpenAIClient();

  if (!openai) {
    throw new Error('OpenAI API Key is not configured or is using the placeholder.');
  }

  const prompt = `
You are an Elite Equity Research Analyst and Hedge Fund Portfolio Manager. Write a highly analytical, institutional-grade Comparative Investment Memo comparing two companies:
Company A: ${overviewA.name} (${overviewA.ticker})
Company B: ${overviewB.name} (${overviewB.ticker})

Do not use generic fluff or enthusiastic marketing jargon. Write in a precise, objective, and quantitative tone typical of a Goldman Sachs or Point72 report.

CRITICAL TEMPORAL REQUIREMENT:
Today's date is June 1, 2026. All comparative estimates, product launches, timelines, and earnings release timelines must be strictly forward-looking relative to June 1, 2026. Under no circumstances should you generate references to past catalysts, events, or earnings releases that have already occurred.

COMPANY A OVERVIEW & DATA:
- Name: ${overviewA.name} (${overviewA.ticker})
- Sector: ${overviewA.sector} | Industry: ${overviewA.industry}
- Market Cap: $${(overviewA.marketCap / 1e9).toFixed(2)}B
- Price: $${financialsA.currentPrice}
- Revenue: ${financialsA.revenue !== null ? '$' + (financialsA.revenue / 1e9).toFixed(2) + 'B' : 'Unavailable'} (Growth: ${financialsA.revenueGrowth !== null ? financialsA.revenueGrowth.toFixed(1) + '%' : 'Unavailable'})
- Net Income: ${financialsA.netIncome !== null ? '$' + (financialsA.netIncome / 1e9).toFixed(2) + 'B' : 'Unavailable'} (Margins: Operating ${financialsA.operatingMargin !== null ? financialsA.operatingMargin.toFixed(1) + '%' : 'Unavailable'}, Gross ${financialsA.grossMargin !== null ? financialsA.grossMargin.toFixed(1) + '%' : 'Unavailable'})
- FCF: ${financialsA.freeCashFlow !== null ? '$' + (financialsA.freeCashFlow / 1e9).toFixed(2) + 'B' : 'Unavailable'}
- Debt: ${financialsA.debt !== null ? '$' + (financialsA.debt / 1e9).toFixed(2) + 'B' : 'Unavailable'} | Cash: ${financialsA.cash !== null ? '$' + (financialsA.cash / 1e9).toFixed(2) + 'B' : 'Unavailable'}
- Trailing P/E: ${financialsA.currentPE !== null ? financialsA.currentPE.toFixed(1) : 'Unavailable'} | Forward P/E: ${financialsA.forwardPE !== null ? financialsA.forwardPE.toFixed(1) : 'Unavailable'} | EV/EBITDA: ${financialsA.evEbitda !== null ? financialsA.evEbitda.toFixed(1) : 'Unavailable'} | P/S: ${financialsA.priceToSales !== null ? financialsA.priceToSales.toFixed(1) : 'Unavailable'}

COMPANY B OVERVIEW & DATA:
- Name: ${overviewB.name} (${overviewB.ticker})
- Sector: ${overviewB.sector} | Industry: ${overviewB.industry}
- Market Cap: $${(overviewB.marketCap / 1e9).toFixed(2)}B
- Price: $${financialsB.currentPrice}
- Revenue: ${financialsB.revenue !== null ? '$' + (financialsB.revenue / 1e9).toFixed(2) + 'B' : 'Unavailable'} (Growth: ${financialsB.revenueGrowth !== null ? financialsB.revenueGrowth.toFixed(1) + '%' : 'Unavailable'})
- Net Income: ${financialsB.netIncome !== null ? '$' + (financialsB.netIncome / 1e9).toFixed(2) + 'B' : 'Unavailable'} (Margins: Operating ${financialsB.operatingMargin !== null ? financialsB.operatingMargin.toFixed(1) + '%' : 'Unavailable'}, Gross ${financialsB.grossMargin !== null ? financialsB.grossMargin.toFixed(1) + '%' : 'Unavailable'})
- FCF: ${financialsB.freeCashFlow !== null ? '$' + (financialsB.freeCashFlow / 1e9).toFixed(2) + 'B' : 'Unavailable'}
- Debt: ${financialsB.debt !== null ? '$' + (financialsB.debt / 1e9).toFixed(2) + 'B' : 'Unavailable'} | Cash: ${financialsB.cash !== null ? '$' + (financialsB.cash / 1e9).toFixed(2) + 'B' : 'Unavailable'}
- Trailing P/E: ${financialsB.currentPE !== null ? financialsB.currentPE.toFixed(1) : 'Unavailable'} | Forward P/E: ${financialsB.forwardPE !== null ? financialsB.forwardPE.toFixed(1) : 'Unavailable'} | EV/EBITDA: ${financialsB.evEbitda !== null ? financialsB.evEbitda.toFixed(1) : 'Unavailable'} | P/S: ${financialsB.priceToSales !== null ? financialsB.priceToSales.toFixed(1) : 'Unavailable'}

Based on this data, perform a deep strategic, financial, and competitive comparison, and generate a JSON object matching this structure EXACTLY:
{
  "executiveSummary": "2-3 paragraphs comparing the investment profiles, core moats, high-level business models, and strategic positions of both companies.",
  "growthComparison": "Compare the historical and forward revenue growth rates, expansion opportunities, and product pipeline strategies for both companies.",
  "marginComparison": "Compare gross and operating margins, profitability profiles, cost control measures, and pricing power advantages.",
  "valuationComparison": "Analyze the multiples (P/E, Forward P/E, EV/EBITDA, P/S) relative to each other, historical levels, and general market rates. Explain who has the valuation premium and if it is justified.",
  "balanceSheetComparison": "Evaluate the liquidity, leverage, debt liabilities, cash assets, and solvency ratios of both companies. Highlight who has a stronger solvency position.",
  "bullCaseA": [
    { "point": "Reason A1", "detail": "Strategic/quantitative detail for Company A outperformance." },
    { "point": "Reason A2", "detail": "..." },
    { "point": "Reason A3", "detail": "..." },
    { "point": "Reason A4", "detail": "..." },
    { "point": "Reason A5", "detail": "..." }
  ],
  "bullCaseB": [
    { "point": "Reason B1", "detail": "Strategic/quantitative detail for Company B outperformance." },
    { "point": "Reason B2", "detail": "..." },
    { "point": "Reason B3", "detail": "..." },
    { "point": "Reason B4", "detail": "..." },
    { "point": "Reason B5", "detail": "..." }
  ],
  "keyRisks": "Compare key operational, financial, industry, macro-economic, and structural risks for both companies.",
  "finalRecommendation": "Prefer Company A" or "Prefer Company B" or "Neutral",
  "recommendationExplanation": "A 2-3 sentence concluding summary that explicitly defends the final relative recommendation based on growth rates, margins, valuation, and balance sheet safety."
}

Use the specific ticker names in the prompt details and JSON text fields rather than generic placeholders (i.e. refer to ${overviewA.ticker} and ${overviewB.ticker} directly). Return ONLY a raw, fully valid JSON string that matches the requested JSON schema.
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an institutional equity research director.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    });

    const contentText = response.choices[0].message.content || '{}';
    return JSON.parse(contentText) as ComparisonAIAnalysis;
  } catch (error: any) {
    console.error('OpenAI comparative memo generation error:', error);
    throw new Error(`Failed to generate AI Comparative Memo: ${error.message}`);
  }
}

export { isOpenAICurrentlyAvailable };
