import jsPDF from 'jspdf';
import { EquityResearchReport, ComparisonReport } from '@/types';
import { formatLargeCurrency, formatPercent } from '@/components/Dashboard';

export function exportEquityReportToPDF(report: EquityResearchReport, lastUpdated: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageHeight = 297;
  const pageWidth = 210;
  const margin = 20;
  const usableWidth = pageWidth - (margin * 2); // 170mm
  
  let y = 25;
  let pageNum = 1;

  // Primary colors
  const corporateBlue = [15, 23, 42]; // #0f172a (Deep Slate)
  const accentTeal = [14, 116, 144];   // #0e7490 (Muted Teal)
  const textDark = [51, 65, 85];      // #334155 (Slate Gray)
  const lineLight = [226, 232, 240];  // #e2e8f0 (Light Gray)
  
  // Helpers
  const setFontBold = (size: number) => {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(size);
  };

  const setFontRegular = (size: number) => {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(size);
  };

  const setFontItalic = (size: number) => {
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(size);
  };

  const addHeader = () => {
    setFontRegular(8);
    doc.setTextColor(148, 163, 184);
    doc.text('SEC ANALYST RESEARCH PLATFORM  //  INSTITUTIONAL EQUITY MEMO', margin, 12);
    doc.text(`TICKER: ${report.ticker}`, pageWidth - margin - 20, 12, { align: 'right' });
    
    // Header divider
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, 14, pageWidth - margin, 14);
  };

  const addFooter = () => {
    // Footer divider
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);

    // Disclaimer
    setFontItalic(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'This report is for educational purposes only and does not constitute investment advice.',
      pageWidth / 2,
      pageHeight - 14,
      { align: 'center' }
    );

    // Page Number
    setFontRegular(8);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 25) {
      addFooter();
      doc.addPage();
      pageNum++;
      y = 25; // reset top margin
      addHeader();
    }
  };

  // ---------------- PAGE 1: TITLE & STATS ----------------
  addHeader();

  // Platform Title
  setFontBold(20);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text('SEC Analyst Research Platform', margin, y);
  y += 6;

  // Memorandum Label
  setFontBold(10);
  doc.setTextColor(accentTeal[0], accentTeal[1], accentTeal[2]);
  doc.text('EQUITY RESEARCH MEMORANDUM', margin, y);
  
  // Date and Sync
  setFontRegular(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Sync Time: ${lastUpdated}`, pageWidth - margin, y - 2, { align: 'right' });
  y += 6;

  // Title Divider line
  doc.setDrawColor(accentTeal[0], accentTeal[1], accentTeal[2]);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // COMPANY PROFILE PANEL
  checkPageBreak(35);
  doc.setFillColor(248, 250, 252); // #f8fafc
  doc.rect(margin, y, usableWidth, 32, 'F');
  doc.setDrawColor(lineLight[0], lineLight[1], lineLight[2]);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, usableWidth, 32, 'S');

  // Left Details
  setFontBold(12);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text(`${report.overview.name}`, margin + 5, y + 6);
  
  setFontBold(8);
  doc.setTextColor(accentTeal[0], accentTeal[1], accentTeal[2]);
  doc.text(`TICKER: ${report.ticker}`, margin + 5, y + 11);
  
  setFontRegular(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`Sector: ${report.overview.sector}`, margin + 5, y + 17);
  doc.text(`Industry: ${report.overview.industry}`, margin + 5, y + 22);
  doc.text(`HQ: ${report.overview.headquarters}`, margin + 5, y + 27);

  // Right Details
  const ratingText = report.memo.finalRecommendation.toUpperCase();
  setFontBold(9);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('FINAL RATING:', pageWidth - margin - 55, y + 8, { align: 'right' });
  
  // Glowing Recommendation box
  let boxColor = [220, 252, 231]; // light green
  let textColor = [21, 128, 61];  // dark green
  if (ratingText.includes('SELL')) {
    boxColor = [254, 226, 226]; // light red
    textColor = [185, 28, 28];   // dark red
  } else if (ratingText.includes('HOLD')) {
    boxColor = [254, 243, 199]; // light yellow
    textColor = [180, 83, 9];    // dark yellow
  }
  
  doc.setFillColor(boxColor[0], boxColor[1], boxColor[2]);
  doc.rect(pageWidth - margin - 50, y + 4, 45, 6, 'F');
  setFontBold(9);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(ratingText, pageWidth - margin - 27.5, y + 8.5, { align: 'center' });

  setFontRegular(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`Market Price: $${report.financials.currentPrice.toFixed(2)}`, pageWidth - margin - 5, y + 17, { align: 'right' });
  doc.text(`Market Cap: ${formatLargeCurrency(report.overview.marketCap)}`, pageWidth - margin - 5, y + 22, { align: 'right' });
  doc.text(`Date Generated: ${report.generatedDate}`, pageWidth - margin - 5, y + 27, { align: 'right' });

  y += 38;

  // FINANCIAL STATEMENTS TABLE
  checkPageBreak(50);
  setFontBold(10);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text('KEY FINANCIAL METRICS & VALUATION SUMMARY', margin, y);
  y += 3;

  doc.setDrawColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 1.5;

  // Table Headers
  setFontBold(8.5);
  doc.setTextColor(accentTeal[0], accentTeal[1], accentTeal[2]);
  doc.text('FINANCIAL STATEMENTS', margin + 3, y + 4);
  doc.text('OPERATIONS & MARGINS', margin + 63, y + 4);
  doc.text('VALUATION MULTIPLES', margin + 123, y + 4);
  
  doc.setDrawColor(lineLight[0], lineLight[1], lineLight[2]);
  doc.setLineWidth(0.3);
  doc.line(margin, y + 6, pageWidth - margin, y + 6);
  y += 6;

  // Table rows
  const financialsRows = [
    { 
      label1: 'Revenue (TTM):', 
      val1: formatLargeCurrency(report.financials.revenue), 
      label2: 'Revenue Growth:', 
      val2: formatPercent(report.financials.revenueGrowth), 
      label3: 'Trailing P/E:', 
      val3: report.financials.currentPE !== null && report.financials.currentPE !== undefined ? `${report.financials.currentPE.toFixed(1)}x` : 'Unavailable' 
    },
    { 
      label1: 'Net Income:', 
      val1: formatLargeCurrency(report.financials.netIncome), 
      label2: 'Gross Margin:', 
      val2: report.financials.grossMargin !== null && report.financials.grossMargin !== undefined ? `${report.financials.grossMargin.toFixed(1)}%` : 'Unavailable', 
      label3: 'Forward P/E:', 
      val3: report.financials.forwardPE !== null && report.financials.forwardPE !== undefined ? `${report.financials.forwardPE.toFixed(1)}x` : 'Unavailable' 
    },
    { 
      label1: 'Free Cash Flow:', 
      val1: formatLargeCurrency(report.financials.freeCashFlow), 
      label2: 'Operating Margin:', 
      val2: report.financials.operatingMargin !== null && report.financials.operatingMargin !== undefined ? `${report.financials.operatingMargin.toFixed(1)}%` : 'Unavailable', 
      label3: 'EV / EBITDA:', 
      val3: report.financials.evEbitda !== null && report.financials.evEbitda !== undefined ? `${report.financials.evEbitda.toFixed(1)}x` : 'Unavailable' 
    },
    { 
      label1: 'Total Cash Assets:', 
      val1: formatLargeCurrency(report.financials.cash), 
      label2: '52-Week Range:', 
      val2: `$${report.financials.low52Week.toFixed(2)} - $${report.financials.high52Week.toFixed(2)}`, 
      label3: 'Price-to-Sales:', 
      val3: report.financials.priceToSales !== null && report.financials.priceToSales !== undefined ? `${report.financials.priceToSales.toFixed(1)}x` : 'Unavailable' 
    },
    { 
      label1: 'Total Debt Liabilities:', 
      val1: formatLargeCurrency(report.financials.debt), 
      label2: 'Earnings Per Share:', 
      val2: report.financials.eps !== null && report.financials.eps !== undefined ? `$${report.financials.eps.toFixed(2)}` : 'Unavailable', 
      label3: 'Implied FCF Yield:', 
      val3: report.financials.freeCashFlow !== null && report.financials.freeCashFlow !== undefined && report.overview.marketCap > 0 ? `${((report.financials.freeCashFlow / report.overview.marketCap) * 100).toFixed(2)}%` : 'Unavailable' 
    }
  ];

  setFontRegular(8);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  
  financialsRows.forEach((row, i) => {
    // Column 1
    doc.text(row.label1, margin + 3, y + 4.5);
    doc.text(row.val1, margin + 40, y + 4.5);
    
    // Column 2
    doc.text(row.label2, margin + 63, y + 4.5);
    doc.text(row.val2, margin + 98, y + 4.5);
    
    // Column 3
    doc.text(row.label3, margin + 123, y + 4.5);
    doc.text(row.val3, margin + 155, y + 4.5);

    // Row lines
    doc.setDrawColor(241, 245, 249); // very light gray
    doc.line(margin, y + 6.5, pageWidth - margin, y + 6.5);
    y += 6.5;
  });

  y += 6;

  // I. EXECUTIVE SUMMARY
  const execLines = doc.splitTextToSize(report.memo.executiveSummary, usableWidth);
  checkPageBreak(execLines.length * 4.5 + 15);
  
  setFontBold(10);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text('I. Executive Summary', margin, y);
  y += 3;
  
  doc.setDrawColor(accentTeal[0], accentTeal[1], accentTeal[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + 30, y);
  y += 4;

  setFontRegular(9);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(execLines, margin, y);
  y += execLines.length * 4.5 + 8;

  // II. BUSINESS OVERVIEW
  const bizLines = doc.splitTextToSize(report.memo.businessOverview, usableWidth);
  checkPageBreak(bizLines.length * 4.5 + 15);

  setFontBold(10);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text('II. Business Overview & Moat Analysis', margin, y);
  y += 3;
  
  doc.setDrawColor(accentTeal[0], accentTeal[1], accentTeal[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + 45, y);
  y += 4;

  setFontRegular(9);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(bizLines, margin, y);
  y += bizLines.length * 4.5 + 8;

  // ---------------- PAGE 2: ANALYSIS & BULL/BEAR ----------------
  // III. INDUSTRY ANALYSIS
  const indLines = doc.splitTextToSize(report.memo.industryAnalysis, usableWidth);
  checkPageBreak(indLines.length * 4.5 + 15);

  setFontBold(10);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text('III. Industry Trends & Competitive Landscape', margin, y);
  y += 3;
  
  doc.setDrawColor(accentTeal[0], accentTeal[1], accentTeal[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + 55, y);
  y += 4;

  setFontRegular(9);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(indLines, margin, y);
  y += indLines.length * 4.5 + 8;

  // IV. BULL CASE
  checkPageBreak(40);
  setFontBold(10);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text('IV. Bull Case: Drivers for Outperformance', margin, y);
  y += 3;
  
  doc.setDrawColor(accentTeal[0], accentTeal[1], accentTeal[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + 48, y);
  y += 5;

  report.memo.bullCase.forEach((item, idx) => {
    const textLines = doc.splitTextToSize(`${idx + 1}. ${item.point}: ${item.detail}`, usableWidth - 5);
    checkPageBreak(textLines.length * 4.5 + 2);
    
    // Render point
    setFontBold(8.5);
    doc.setTextColor(21, 128, 61); // Green index bullet
    doc.text(`[BULL]`, margin, y);
    
    setFontRegular(8.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(textLines, margin + 12, y);
    y += textLines.length * 4.5 + 1.5;
  });

  y += 6;

  // V. BEAR CASE
  checkPageBreak(40);
  setFontBold(10);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text('V. Bear Case: Risks & Valuation Overhangs', margin, y);
  y += 3;
  
  doc.setDrawColor(accentTeal[0], accentTeal[1], accentTeal[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + 48, y);
  y += 5;

  report.memo.bearCase.forEach((item, idx) => {
    const textLines = doc.splitTextToSize(`${idx + 1}. ${item.point}: ${item.detail}`, usableWidth - 5);
    checkPageBreak(textLines.length * 4.5 + 2);
    
    // Render point
    setFontBold(8.5);
    doc.setTextColor(185, 28, 28); // Red index bullet
    doc.text(`[RISK]`, margin, y);
    
    setFontRegular(8.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(textLines, margin + 12, y);
    y += textLines.length * 4.5 + 1.5;
  });

  y += 6;

  // VI. VALUE CATALYSTS
  checkPageBreak(35);
  setFontBold(10);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text('VI. Upcoming Value Catalysts', margin, y);
  y += 3;
  
  doc.setDrawColor(accentTeal[0], accentTeal[1], accentTeal[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + 40, y);
  y += 5;

  report.memo.catalysts.forEach((c, idx) => {
    const textLines = doc.splitTextToSize(`- ${c.event} (Timeline: ${c.date} | Impact: ${c.impact}): ${c.description}`, usableWidth - 5);
    checkPageBreak(textLines.length * 4.5 + 2);

    setFontRegular(8.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(textLines, margin, y);
    y += textLines.length * 4.5 + 1.5;
  });

  y += 6;

  // VII. VALUATION SNAPSHOT
  const valLines = doc.splitTextToSize(report.memo.recommendationExplanation, usableWidth);
  const snapshotLines = doc.splitTextToSize(report.memo.valuationSnapshot.multiplesExplanation, usableWidth);
  checkPageBreak(valLines.length * 4.5 + snapshotLines.length * 4.5 + 30);

  setFontBold(10);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text('VII. Valuation & Recommendation Rationale', margin, y);
  y += 3;
  
  doc.setDrawColor(accentTeal[0], accentTeal[1], accentTeal[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + 50, y);
  y += 4;

  setFontRegular(9);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(snapshotLines, margin, y);
  y += snapshotLines.length * 4.5 + 3;

  doc.text(valLines, margin, y);
  y += valLines.length * 4.5 + 6;

  // DATA SOURCES PANEL
  checkPageBreak(18);
  setFontBold(8.5);
  doc.setTextColor(accentTeal[0], accentTeal[1], accentTeal[2]);
  doc.text('DATA SOURCES & INTEGRATION CHANNELS', margin, y);
  y += 2.5;

  setFontRegular(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Market quotes, income aggregates, balance sheet metrics and historical returns: YAHOO FINANCE API FEED\nResearch compilation, bull/bear modeling, industry vectors, ratings and news sentiment scoring: SEC ANALYST AI RESEARCH SYNTHESIZER',
    margin,
    y
  );

  // Set final page footer
  addFooter();

  // Save PDF
  doc.save(`SEC_ANALYST_REPORT_${report.ticker}_${report.generatedDate}.pdf`);
}

export function exportComparisonToPDF(report: ComparisonReport, lastUpdated: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageHeight = 297;
  const pageWidth = 210;
  const margin = 20;
  const usableWidth = pageWidth - (margin * 2); // 170mm
  
  let y = 25;
  let pageNum = 1;

  const corporateBlue = [15, 23, 42]; // #0f172a (Deep Slate)
  const accentTeal = [14, 116, 144];   // #0e7490 (Muted Teal)
  const accentYellow = [180, 83, 9];   // Muted Gold
  const textDark = [51, 65, 85];      // #334155 (Slate Gray)
  const lineLight = [226, 232, 240];  // #e2e8f0 (Light Gray)
  
  // Helpers
  const setFontBold = (size: number) => {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(size);
  };

  const setFontRegular = (size: number) => {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(size);
  };

  const setFontItalic = (size: number) => {
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(size);
  };

  const addHeader = () => {
    setFontRegular(8);
    doc.setTextColor(148, 163, 184);
    doc.text('SEC ANALYST RESEARCH PLATFORM  //  COMPARATIVE INVESTMENT MEMO', margin, 12);
    doc.text(`TICKERS: ${report.tickerA} VS ${report.tickerB}`, pageWidth - margin - 35, 12, { align: 'right' });
    
    // Header divider
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, 14, pageWidth - margin, 14);
  };

  const addFooter = () => {
    // Footer divider
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);

    // Disclaimer
    setFontItalic(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'This report is for educational purposes only and does not constitute investment advice.',
      pageWidth / 2,
      pageHeight - 14,
      { align: 'center' }
    );

    // Page Number
    setFontRegular(8);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 25) {
      addFooter();
      doc.addPage();
      pageNum++;
      y = 25; // reset top margin
      addHeader();
    }
  };

  // ---------------- PAGE 1: TITLE & STATS ----------------
  addHeader();

  // Platform Title
  setFontBold(18);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text('SEC Analyst Research Platform', margin, y);
  y += 6;

  // Memorandum Label
  setFontBold(10);
  doc.setTextColor(accentTeal[0], accentTeal[1], accentTeal[2]);
  doc.text(`COMPARATIVE INVESTMENT MEMORANDUM: ${report.tickerA} VS ${report.tickerB}`, margin, y);
  
  // Date and Sync
  setFontRegular(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Sync Time: ${lastUpdated}`, pageWidth - margin, y - 2, { align: 'right' });
  y += 6;

  // Title Divider line
  doc.setDrawColor(accentTeal[0], accentTeal[1], accentTeal[2]);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // COMPARATIVE GENERAL STATS BLOCK
  checkPageBreak(35);
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, usableWidth, 24, 'F');
  doc.setDrawColor(lineLight[0], lineLight[1], lineLight[2]);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, usableWidth, 24, 'S');

  // Left side: Ticker A Profile Summary
  setFontBold(10);
  doc.setTextColor(accentTeal[0], accentTeal[1], accentTeal[2]);
  doc.text(`Company A: ${report.dataA.overview.name} (${report.tickerA})`, margin + 5, y + 6);
  setFontRegular(8);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`Sector: ${report.dataA.overview.sector}`, margin + 5, y + 11);
  doc.text(`Industry: ${report.dataA.overview.industry}`, margin + 5, y + 16);

  // Right side: Ticker B Profile Summary
  setFontBold(10);
  doc.setTextColor(accentYellow[0], accentYellow[1], accentYellow[2]);
  doc.text(`Company B: ${report.dataB.overview.name} (${report.tickerB})`, pageWidth - margin - 5, y + 6, { align: 'right' });
  setFontRegular(8);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`Sector: ${report.dataB.overview.sector}`, pageWidth - margin - 5, y + 11, { align: 'right' });
  doc.text(`Industry: ${report.dataB.overview.industry}`, pageWidth - margin - 5, y + 16, { align: 'right' });

  y += 30;

  // RECOMMENDATION BANNER IN PDF
  checkPageBreak(25);
  doc.setFillColor(240, 249, 255); // light cyan bg
  doc.rect(margin, y, usableWidth, 18, 'F');
  doc.setDrawColor(186, 230, 253);
  doc.rect(margin, y, usableWidth, 18, 'S');

  setFontBold(8.5);
  doc.setTextColor(3, 105, 161);
  doc.text('AI STRATEGIC PORTFOLIO RECOMMENDATION:', margin + 5, y + 6);
  setFontBold(9.5);
  doc.text(report.aiAnalysis.finalRecommendation.toUpperCase(), margin + 5, y + 12);
  
  // Date Generated
  setFontRegular(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Date Compiled: ${report.generatedDate}`, pageWidth - margin - 5, y + 11, { align: 'right' });
  y += 24;

  // SIDE-BY-SIDE LEDGER TABLE IN PDF
  checkPageBreak(90);
  setFontBold(10);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text('SIDE-BY-SIDE FINANCIAL INDICATOR LEDGER', margin, y);
  y += 3;

  doc.setDrawColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 1.5;

  // Table Headers
  setFontBold(8.5);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text('FINANCIAL METRIC', margin + 3, y + 4);
  doc.text(`${report.tickerA} VALUE`, margin + 75, y + 4, { align: 'center' });
  doc.text(`${report.tickerB} VALUE`, margin + 150, y + 4, { align: 'right' });
  
  doc.setDrawColor(lineLight[0], lineLight[1], lineLight[2]);
  doc.setLineWidth(0.3);
  doc.line(margin, y + 6, pageWidth - margin, y + 6);
  y += 6;

  // Build metrics for PDF row rendering
  const getPDFRow = (label: string, key: string, valA: any, valB: any, formatType: 'currency' | 'percent' | 'largeCurrency' | 'multiple' | 'raw') => {
    let formattedA = 'Unavailable';
    let formattedB = 'Unavailable';

    if (formatType === 'largeCurrency') {
      formattedA = formatLargeCurrency(valA);
      formattedB = formatLargeCurrency(valB);
    } else if (formatType === 'percent') {
      formattedA = formatPercent(valA);
      formattedB = formatPercent(valB);
    } else if (formatType === 'currency') {
      formattedA = valA !== null && valA !== undefined ? `$${Number(valA).toFixed(2)}` : 'Unavailable';
      formattedB = valB !== null && valB !== undefined ? `$${Number(valB).toFixed(2)}` : 'Unavailable';
    } else if (formatType === 'multiple') {
      formattedA = valA !== null && valA !== undefined ? `${Number(valA).toFixed(1)}x` : 'Unavailable';
      formattedB = valB !== null && valB !== undefined ? `${Number(valB).toFixed(1)}x` : 'Unavailable';
    } else {
      formattedA = valA !== undefined && valA !== null ? String(valA) : 'Unavailable';
      formattedB = valB !== undefined && valB !== null ? String(valB) : 'Unavailable';
    }

    return { label, valA: formattedA, valB: formattedB };
  };

  const pdfRows = [
    getPDFRow('Market Price', 'price', report.dataA.financials.currentPrice, report.dataB.financials.currentPrice, 'currency'),
    getPDFRow('Market Capitalization', 'marketCap', report.dataA.overview.marketCap, report.dataB.overview.marketCap, 'largeCurrency'),
    getPDFRow('Revenue (TTM)', 'revenue', report.dataA.financials.revenue, report.dataB.financials.revenue, 'largeCurrency'),
    getPDFRow('Revenue Growth', 'revenueGrowth', report.dataA.financials.revenueGrowth, report.dataB.financials.revenueGrowth, 'percent'),
    getPDFRow('Net Income (TTM)', 'netIncome', report.dataA.financials.netIncome, report.dataB.financials.netIncome, 'largeCurrency'),
    getPDFRow('Free Cash Flow (TTM)', 'freeCashFlow', report.dataA.financials.freeCashFlow, report.dataB.financials.freeCashFlow, 'largeCurrency'),
    getPDFRow('Gross Margin', 'grossMargin', report.dataA.financials.grossMargin, report.dataB.financials.grossMargin, 'percent'),
    getPDFRow('Operating Margin', 'operatingMargin', report.dataA.financials.operatingMargin, report.dataB.financials.operatingMargin, 'percent'),
    getPDFRow('Trailing P/E Multiple', 'currentPE', report.dataA.financials.currentPE, report.dataB.financials.currentPE, 'multiple'),
    getPDFRow('Forward P/E Multiple', 'forwardPE', report.dataA.financials.forwardPE, report.dataB.financials.forwardPE, 'multiple'),
    getPDFRow('EV / EBITDA', 'evEbitda', report.dataA.financials.evEbitda, report.dataB.financials.evEbitda, 'multiple'),
    getPDFRow('Price-to-Sales (TTM)', 'priceToSales', report.dataA.financials.priceToSales, report.dataB.financials.priceToSales, 'multiple'),
    getPDFRow('Total Debt Liabilities', 'debt', report.dataA.financials.debt, report.dataB.financials.debt, 'largeCurrency'),
    getPDFRow('Total Cash Assets', 'cash', report.dataA.financials.cash, report.dataB.financials.cash, 'largeCurrency'),
    getPDFRow('1-Year Stock Performance', 'return1Y', report.dataA.performance.return1Y, report.dataB.performance.return1Y, 'percent'),
  ];

  setFontRegular(8);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);

  pdfRows.forEach((row) => {
    doc.text(row.label, margin + 3, y + 4.5);
    doc.text(row.valA, margin + 75, y + 4.5, { align: 'center' });
    doc.text(row.valB, margin + 150, y + 4.5, { align: 'right' });

    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + 6, pageWidth - margin, y + 6);
    y += 6;
  });

  y += 6;

  // ---------------- PAGE 2: AI ANALYTICAL ANALYSIS ----------------
  // I. EXECUTIVE COMPARISON SUMMARY
  const execLines = doc.splitTextToSize(report.aiAnalysis.executiveSummary, usableWidth);
  checkPageBreak(execLines.length * 4.5 + 15);
  
  setFontBold(10);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text('I. Executive Comparison Summary', margin, y);
  y += 3;
  doc.setDrawColor(accentTeal[0], accentTeal[1], accentTeal[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + 40, y);
  y += 4;

  setFontRegular(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(execLines, margin, y);
  y += execLines.length * 4.5 + 8;

  // II. GROWTH VECTOR COMPARISON
  const growthLines = doc.splitTextToSize(report.aiAnalysis.growthComparison, usableWidth);
  checkPageBreak(growthLines.length * 4.5 + 15);

  setFontBold(10);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text('II. Revenue Expansion & Growth Comparison', margin, y);
  y += 3;
  doc.line(margin, y, margin + 55, y);
  y += 4;

  doc.text(growthLines, margin, y);
  y += growthLines.length * 4.5 + 8;

  // III. MARGIN & PROFITABILITY COMPARISON
  const marginLines = doc.splitTextToSize(report.aiAnalysis.marginComparison, usableWidth);
  checkPageBreak(marginLines.length * 4.5 + 15);

  setFontBold(10);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text('III. Profitability & Margin Competitive Moats', margin, y);
  y += 3;
  doc.line(margin, y, margin + 55, y);
  y += 4;

  doc.text(marginLines, margin, y);
  y += marginLines.length * 4.5 + 8;

  // IV. VALUATION MULTIPLES COMPARISON
  const valLines = doc.splitTextToSize(report.aiAnalysis.valuationComparison, usableWidth);
  checkPageBreak(valLines.length * 4.5 + 15);

  setFontBold(10);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text('IV. Valuation Ratios & Premium Justifications', margin, y);
  y += 3;
  doc.line(margin, y, margin + 55, y);
  y += 4;

  doc.text(valLines, margin, y);
  y += valLines.length * 4.5 + 8;

  // V. SOLVENCY & BALANCE SHEET COMPARISON
  const balanceLines = doc.splitTextToSize(report.aiAnalysis.balanceSheetComparison, usableWidth);
  checkPageBreak(balanceLines.length * 4.5 + 15);

  setFontBold(10);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text('V. Balance Sheet Solvency & Leverage Assets', margin, y);
  y += 3;
  doc.line(margin, y, margin + 55, y);
  y += 4;

  doc.text(balanceLines, margin, y);
  y += balanceLines.length * 4.5 + 8;

  // VI. BULL CASE FOR COMPANY A
  checkPageBreak(35);
  setFontBold(10);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text(`VI. Strategic Bull Cases for ${report.tickerA}`, margin, y);
  y += 3;
  doc.line(margin, y, margin + 50, y);
  y += 5;

  report.aiAnalysis.bullCaseA.forEach((item, idx) => {
    const textLines = doc.splitTextToSize(`${idx + 1}. ${item.point}: ${item.detail}`, usableWidth - 10);
    checkPageBreak(textLines.length * 4.5 + 3);
    
    setFontBold(8);
    doc.setTextColor(21, 128, 61);
    doc.text('[BULL A]', margin, y);
    setFontRegular(8);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(textLines, margin + 14, y);
    y += textLines.length * 4.5 + 1.5;
  });

  y += 6;

  // VII. BULL CASE FOR COMPANY B
  checkPageBreak(35);
  setFontBold(10);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text(`VII. Strategic Bull Cases for ${report.tickerB}`, margin, y);
  y += 3;
  doc.line(margin, y, margin + 50, y);
  y += 5;

  report.aiAnalysis.bullCaseB.forEach((item, idx) => {
    const textLines = doc.splitTextToSize(`${idx + 1}. ${item.point}: ${item.detail}`, usableWidth - 10);
    checkPageBreak(textLines.length * 4.5 + 3);
    
    setFontBold(8);
    doc.setTextColor(180, 83, 9);
    doc.text('[BULL B]', margin, y);
    setFontRegular(8);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(textLines, margin + 14, y);
    y += textLines.length * 4.5 + 1.5;
  });

  y += 6;

  // VIII. RISK OVERHANGS MATRIX
  const riskLines = doc.splitTextToSize(report.aiAnalysis.keyRisks, usableWidth);
  checkPageBreak(riskLines.length * 4.5 + 15);

  setFontBold(10);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text('VIII. Comparative Risk Overhangs Matrix', margin, y);
  y += 3;
  doc.line(margin, y, margin + 55, y);
  y += 4;

  doc.text(riskLines, margin, y);
  y += riskLines.length * 4.5 + 8;

  // IX. FINAL RECOMMENDATION DETAILS
  const recExplanationLines = doc.splitTextToSize(report.aiAnalysis.recommendationExplanation, usableWidth);
  checkPageBreak(recExplanationLines.length * 4.5 + 20);

  setFontBold(10);
  doc.setTextColor(corporateBlue[0], corporateBlue[1], corporateBlue[2]);
  doc.text('IX. Final Relative Advisory Summary', margin, y);
  y += 3;
  doc.line(margin, y, margin + 45, y);
  y += 5;

  setFontBold(9);
  doc.setTextColor(accentTeal[0], accentTeal[1], accentTeal[2]);
  doc.text(`RECOMMENDED POSITION: ${report.aiAnalysis.finalRecommendation.toUpperCase()}`, margin, y);
  y += 5;

  setFontRegular(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(recExplanationLines, margin, y);
  y += recExplanationLines.length * 4.5 + 6;

  // Set final page footer
  addFooter();

  // Save PDF
  doc.save(`SEC_ANALYST_COMPARISON_${report.tickerA}_VS_${report.tickerB}_${report.generatedDate}.pdf`);
}

export default exportEquityReportToPDF;
