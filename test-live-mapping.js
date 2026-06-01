const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function testTicker(symbol) {
  try {
    const quote = await yahooFinance.quote(symbol);
    const summary = await yahooFinance.quoteSummary(symbol, {
      modules: ['summaryProfile', 'financialData', 'defaultKeyStatistics']
    });

    const summaryProfile = summary?.summaryProfile || {};
    const financialData = summary?.financialData || {};
    const defaultKeyStatistics = summary?.defaultKeyStatistics || {};

    const netIncome = defaultKeyStatistics.netIncomeToCommon !== undefined ? defaultKeyStatistics.netIncomeToCommon : 
                     (financialData.netIncomeToCommon !== undefined ? financialData.netIncomeToCommon : null);

    console.log(`[${symbol}]`);
    console.log(`  - netIncomeToCommon (defaultKeyStatistics):`, defaultKeyStatistics.netIncomeToCommon);
    console.log(`  - netIncomeToCommon (financialData):`, financialData.netIncomeToCommon);
    console.log(`  - netIncome (mapped):`, netIncome);
    console.log(`  - revenue:`, financialData.totalRevenue);
    console.log(`  - freeCashflow:`, financialData.freeCashflow);
    console.log(`  - totalDebt:`, financialData.totalDebt);
    console.log(`  - totalCash:`, financialData.totalCash);
  } catch (err) {
    console.error(`Error testing ${symbol}:`, err.message);
  }
}

async function runAll() {
  const tickers = ['MCD', 'AAPL', 'MSFT', 'NVDA', 'GOOGL'];
  for (const t of tickers) {
    await testTicker(t);
    console.log('-'.repeat(50));
  }
}

runAll();
