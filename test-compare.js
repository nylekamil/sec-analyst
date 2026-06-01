const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function testFetch(ticker) {
  try {
    const quote = await yahooFinance.quote(ticker);
    const summary = await yahooFinance.quoteSummary(ticker, {
      modules: ['summaryProfile', 'financialData', 'defaultKeyStatistics']
    });

    const summaryProfile = summary?.summaryProfile || {};
    const financialData = summary?.financialData || {};
    const defaultKeyStatistics = summary?.defaultKeyStatistics || {};

    const netIncome = defaultKeyStatistics.netIncomeToCommon !== undefined ? defaultKeyStatistics.netIncomeToCommon : 
                     (financialData.netIncomeToCommon !== undefined ? financialData.netIncomeToCommon : null);

    return {
      ticker,
      name: quote.longName || quote.shortName || ticker,
      currentPrice: quote.regularMarketPrice || financialData.currentPrice || 0,
      netIncome
    };
  } catch (err) {
    console.error(`Error querying ${ticker}:`, err.message);
    return null;
  }
}

async function runTest() {
  console.log("Starting Comparative Live API Handshake Tests...");
  const pairs = [
    ['MCD', 'SBUX'],
    ['AAPL', 'MSFT'],
    ['NVDA', 'AMD'],
    ['GOOGL', 'META']
  ];

  for (const [a, b] of pairs) {
    console.log(`\nEvaluating Pair: ${a} vs ${b}`);
    const dataA = await testFetch(a);
    const dataB = await testFetch(b);

    if (dataA && dataB) {
      console.log(`  [${a}] ${dataA.name} | Price: $${dataA.currentPrice} | Net Income (TTM): $${(dataA.netIncome / 1e9).toFixed(2)}B`);
      console.log(`  [${b}] ${dataB.name} | Price: $${dataB.currentPrice} | Net Income (TTM): $${(dataB.netIncome / 1e9).toFixed(2)}B`);
      console.log("  => Status: VALID PIPELINES SECURED");
    } else {
      console.log("  => Status: TRANS-SERVERS OFFLINE / CRITICAL ANOMALY");
    }
  }
}

runTest();
