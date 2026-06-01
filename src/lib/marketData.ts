import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();
import { CompanyOverview, FinancialDashboard, PerformanceMetric, NewsStory } from '../types';

// Format numbers into billions or millions
const formatCap = (num: number) => {
  return num || 0;
};

export async function fetchLiveMarketData(ticker: string): Promise<{
  overview: CompanyOverview;
  financials: FinancialDashboard;
  performance: PerformanceMetric;
  news: NewsStory[];
}> {
  const symbol = ticker.toUpperCase().trim();

  try {
    // 1. Fetch Quote
    const quote = (await yahooFinance.quote(symbol)) as any;
    if (!quote || (!quote.regularMarketPrice && !quote.shortName)) {
      throw new Error(`Symbol ${symbol} not found on Yahoo Finance`);
    }

    // 2. Fetch Profile & Key Stats
    let summaryProfile: any = {};
    let financialData: any = {};
    let defaultKeyStatistics: any = {};
    
    try {
      const summary = (await yahooFinance.quoteSummary(symbol, {
        modules: ['summaryProfile', 'financialData', 'defaultKeyStatistics']
      })) as any;
      if (summary) {
        summaryProfile = summary.summaryProfile || {};
        financialData = summary.financialData || {};
        defaultKeyStatistics = summary.defaultKeyStatistics || {};
      }
    } catch (e) {
      console.warn(`Could not fetch detailed summary modules for ${symbol}, using basic quote data`);
    }

    // 3. Assemble Company Overview
    const overview: CompanyOverview = {
      ticker: symbol,
      name: quote.longName || quote.shortName || `${symbol} Corp`,
      sector: summaryProfile.sector || 'N/A',
      industry: summaryProfile.industry || 'N/A',
      marketCap: quote.marketCap || 0,
      headquarters: `${summaryProfile.city || ''}${summaryProfile.state ? ', ' + summaryProfile.state : ''}${summaryProfile.country ? ', ' + summaryProfile.country : ''}` || 'N/A',
      ceo: summaryProfile.companyOfficers?.[0]?.name || 'N/A',
      description: summaryProfile.longBusinessSummary || 'No description available.'
    };

    // 4. Assemble Financial Dashboard
    const currentPrice = quote.regularMarketPrice || financialData.currentPrice || 0;
    
    // Live Yahoo Finance extracts mapping
    const revenue = financialData.totalRevenue !== undefined ? financialData.totalRevenue : null;
    const revenueGrowth = financialData.revenueGrowth !== undefined ? (financialData.revenueGrowth * 100) : null;
    
    // Core Fix: Map Net Income from defaultKeyStatistics.netIncomeToCommon
    const netIncome = defaultKeyStatistics.netIncomeToCommon !== undefined ? defaultKeyStatistics.netIncomeToCommon : 
                     (financialData.netIncomeToCommon !== undefined ? financialData.netIncomeToCommon : null);
                     
    const eps = quote.epsTrailingTwelveMonths !== undefined ? quote.epsTrailingTwelveMonths : 
                (defaultKeyStatistics.trailingEps !== undefined ? defaultKeyStatistics.trailingEps : null);
                
    const freeCashFlow = financialData.freeCashflow !== undefined ? financialData.freeCashflow : null;
    const operatingMargin = financialData.operatingMargins !== undefined ? (financialData.operatingMargins * 100) : null;
    const grossMargin = financialData.grossMargins !== undefined ? (financialData.grossMargins * 100) : null;
    const debt = financialData.totalDebt !== undefined ? financialData.totalDebt : null;
    const cash = financialData.totalCash !== undefined ? financialData.totalCash : null;
    
    const currentPE = quote.trailingPE !== undefined ? quote.trailingPE : null;
    const forwardPE = quote.forwardPE !== undefined ? quote.forwardPE : null;
    const evEbitda = defaultKeyStatistics.enterpriseToEbitda !== undefined ? defaultKeyStatistics.enterpriseToEbitda : null;
    const priceToSales = defaultKeyStatistics.priceToSalesTrailing12Months !== undefined ? defaultKeyStatistics.priceToSalesTrailing12Months : null;

    // 5. Add Logging for Missing Financial Statement Fields
    const missingFields: string[] = [];
    if (revenue === null) missingFields.push('Revenue');
    if (netIncome === null) missingFields.push('Net Income');
    if (eps === null) missingFields.push('EPS');
    if (freeCashFlow === null) missingFields.push('Free Cash Flow');
    if (debt === null) missingFields.push('Debt Liabilities');
    if (cash === null) missingFields.push('Cash Assets');
    if (currentPE === null) missingFields.push('Trailing P/E');
    if (forwardPE === null) missingFields.push('Forward P/E');
    if (evEbitda === null) missingFields.push('EV/EBITDA');
    if (priceToSales === null) missingFields.push('Price-to-Sales');

    if (missingFields.length > 0) {
      console.warn(`[Market Data Feed] Ticker ${symbol} is missing key financial statement items: ${missingFields.join(', ')}`);
    }

    const financials: FinancialDashboard = {
      currentPrice,
      revenue,
      revenueGrowth,
      netIncome,
      eps,
      freeCashFlow,
      operatingMargin,
      grossMargin,
      debt,
      cash,
      currentPE,
      forwardPE,
      evEbitda,
      priceToSales,
      high52Week: quote.fiftyTwoWeekHigh || currentPrice,
      low52Week: quote.fiftyTwoWeekLow || currentPrice
    };

    // 5. Fetch Historical Data for return metrics & charts
    const now = new Date();
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(now.getFullYear() - 3);
    
    let chartData: Array<{ date: string; price: number }> = [];
    let return1M = 0;
    let return3M = 0;
    let return6M = 0;
    let return1Y = 0;
    let return3Y = 0;

    try {
      const history = (await yahooFinance.historical(symbol, {
        period1: Math.floor(threeYearsAgo.getTime() / 1000),
        period2: Math.floor(now.getTime() / 1000),
        interval: '1d'
      })) as any;

      if (history && history.length > 0) {
        // Map daily points to monthly points for cleaner rendering
        const cleanHistory = history.filter((h: any) => h.close !== undefined) as Array<{ date: Date; close: number }>;
        
        // Return calculations
        const lastIdx = cleanHistory.length - 1;
        const lastPrice = cleanHistory[lastIdx].close;

        const getReturn = (daysAgo: number) => {
          const targetDate = new Date();
          targetDate.setDate(now.getDate() - daysAgo);
          // Find closest date in history
          const match = cleanHistory.find(h => new Date(h.date) >= targetDate);
          if (match && match.close) {
            return ((lastPrice - match.close) / match.close) * 100;
          }
          return 0;
        };

        return1M = getReturn(30);
        return3M = getReturn(90);
        return6M = getReturn(180);
        return1Y = getReturn(365);
        return3Y = getReturn(1095);

        // Subsample history to ~30 points for chart visualization
        const step = Math.max(1, Math.floor(cleanHistory.length / 30));
        chartData = [];
        for (let i = 0; i < cleanHistory.length; i += step) {
          const item = cleanHistory[i];
          chartData.push({
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            price: Math.round(item.close * 100) / 100
          });
        }
        
        // Ensure last item is current price
        if (chartData.length > 0) {
          chartData[chartData.length - 1] = {
            date: now.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            price: Math.round(lastPrice * 100) / 100
          };
        }
      }
    } catch (e: any) {
      console.error(`Could not fetch history for ${symbol}:`, e.message);
      throw new Error(`Failed to retrieve historical price data for "${symbol}" from Yahoo Finance: ${e.message}`);
    }

    const performance: PerformanceMetric = {
      return1M: Math.round(return1M * 10) / 10,
      return3M: Math.round(return3M * 10) / 10,
      return6M: Math.round(return6M * 10) / 10,
      return1Y: Math.round(return1Y * 10) / 10,
      return3Y: Math.round(return3Y * 10) / 10,
      chartData
    };

    // 6. Fetch news items
    let news: NewsStory[] = [];
    try {
      const searchResult = (await yahooFinance.search(symbol, { newsCount: 5 })) as any;
      if (searchResult && searchResult.news) {
        news = searchResult.news.slice(0, 5).map((n: any, idx: number) => ({
          id: n.uuid || `n-${idx}`,
          title: n.title,
          source: n.publisher || 'Finance News',
          url: n.link || 'https://finance.yahoo.com',
          date: n.providerPublishTime ? new Date(n.providerPublishTime * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        }));
      }
    } catch (e) {
      console.warn(`Could not fetch news headlines for ${symbol}, using basic titles`);
    }



    return {
      overview,
      financials,
      performance,
      news
    };

  } catch (error: any) {
    console.error(`Yahoo Finance error for ticker ${symbol}:`, error.message);
    throw new Error(`Invalid stock ticker symbol "${symbol}". Please confirm the ticker exists and try again.`);
  }
}
