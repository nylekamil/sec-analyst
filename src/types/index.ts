export interface CompanyOverview {
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: number; // in USD
  headquarters: string;
  ceo: string;
  description: string;
}

export interface FinancialDashboard {
  revenue: number | null;        // in USD
  revenueGrowth: number | null;  // in %
  netIncome: number | null;      // in USD
  eps: number | null;            // in USD
  freeCashFlow: number | null;   // in USD
  operatingMargin: number | null;// in %
  grossMargin: number | null;    // in %
  debt: number | null;           // in USD
  cash: number | null;           // in USD
  currentPE: number | null;
  forwardPE: number | null;
  evEbitda: number | null;
  priceToSales: number | null;
  high52Week: number;
  low52Week: number;
  currentPrice: number;
}

export interface PerformanceMetric {
  return1M: number;  // in %
  return3M: number;  // in %
  return6M: number;  // in %
  return1Y: number;  // in %
  return3Y: number;  // in %
  chartData: Array<{ date: string; price: number }>;
}

export interface BullBearItem {
  point: string;
  detail: string;
}

export interface CatalystItem {
  event: string;
  date: string;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface ValuationSnapshot {
  multiplesExplanation: string;
  industryAveragePE: number;
  historicalAveragePE: number;
  valuationStatus: 'Cheap' | 'Fair' | 'Expensive';
}

export interface InvestmentMemo {
  executiveSummary: string;
  businessOverview: string;
  industryAnalysis: string;
  bullCase: BullBearItem[];
  bearCase: BullBearItem[];
  catalysts: CatalystItem[];
  valuationSnapshot: ValuationSnapshot;
  finalRecommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  recommendationExplanation: string;
}

export interface NewsSentiment {
  positiveDevelopments: string[];
  negativeDevelopments: string[];
  investmentImplications: string;
}

export interface NewsStory {
  id: string;
  title: string;
  source: string;
  url: string;
  date: string;
  sentimentAnalysis?: NewsSentiment;
}

export interface EquityResearchReport {
  ticker: string;
  generatedDate: string;
  overview: CompanyOverview;
  financials: FinancialDashboard;
  performance: PerformanceMetric;
  memo: InvestmentMemo;
  news: NewsStory[];
  isMockData: boolean;
}

export interface ComparisonAIAnalysis {
  executiveSummary: string;
  growthComparison: string;
  marginComparison: string;
  valuationComparison: string;
  balanceSheetComparison: string;
  bullCaseA: Array<{ point: string; detail: string }>;
  bullCaseB: Array<{ point: string; detail: string }>;
  keyRisks: string;
  finalRecommendation: 'Prefer Company A' | 'Prefer Company B' | 'Neutral';
  recommendationExplanation: string;
}

export interface ComparisonReport {
  tickerA: string;
  tickerB: string;
  generatedDate: string;
  dataA: {
    overview: CompanyOverview;
    financials: FinancialDashboard;
    performance: PerformanceMetric;
  };
  dataB: {
    overview: CompanyOverview;
    financials: FinancialDashboard;
    performance: PerformanceMetric;
  };
  aiAnalysis: ComparisonAIAnalysis;
}
