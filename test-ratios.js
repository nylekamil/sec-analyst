const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function test() {
  try {
    const summary = await yahooFinance.quoteSummary("MCD", {
      modules: ['summaryProfile', 'financialData', 'defaultKeyStatistics']
    });
    console.log("financialData keys:", Object.keys(summary.financialData || {}));
    console.log("MCD financialData.netIncomeToCommon:", summary.financialData?.netIncomeToCommon);
    console.log("MCD financialData.netIncome:", summary.financialData?.netIncome);
    
    console.log("\ndefaultKeyStatistics keys:", Object.keys(summary.defaultKeyStatistics || {}));
    console.log("MCD defaultKeyStatistics.netIncomeToCommon:", summary.defaultKeyStatistics?.netIncomeToCommon);
    console.log("MCD defaultKeyStatistics.netIncome:", summary.defaultKeyStatistics?.netIncome);
    
  } catch (err) {
    console.error(err);
  }
}
test();
