# SEC Analyst

AI-powered equity research platform that generates institutional-grade investment memoranda, valuation analysis, company comparisons, and downloadable PDF research reports using live market data.

## Overview

SEC Analyst is a full-stack investment research platform designed to streamline equity analysis through real-time financial data and AI-generated research. Users can analyze public companies, compare businesses side-by-side, generate investment memos, and export professional PDF reports.

The platform combines live Yahoo Finance market data with OpenAI-powered investment analysis to simulate the workflow of institutional equity research teams.

### Key Capabilities

- Real-time financial data integration
- AI-generated equity research reports
- PDF memorandum export
- Historical performance analysis
- Company comparison engine
- Institutional-style valuation framework

---

## Live Demo

[https://YOUR-VERCEL-LINK.vercel.app](https://sec-analyst.vercel.app)

Try:
- AAPL
- NVDA
- MSFT
- MCD

## Features

### Live Market Data
- Real-time stock quotes
- Company profiles and business descriptions
- Market capitalization
- Revenue growth metrics
- Operating and gross margins
- Cash and debt balances
- Historical price performance

### AI Investment Research
- Institutional-style investment memoranda
- Bull case analysis
- Bear case analysis
- Investment catalysts
- Risk assessment
- AI-generated investment ratings

### Company Comparison Engine
- Side-by-side company analysis
- Valuation multiple comparison
- Growth metric comparison
- Profitability benchmarking
- Balance sheet comparison

### PDF Export System
- Professional research reports
- Company comparison reports
- Downloadable PDF memoranda
- Portfolio-ready presentation format

### Interactive Dashboard
- Historical performance charts
- Live market statistics
- Financial statement summaries
- Dynamic ticker search

---

## Tech Stack

### Frontend
- Next.js 16
- TypeScript
- React
- Tailwind CSS

### Backend
- Next.js API Routes
- OpenAI API
- Yahoo Finance API

### Data & Research
- Live market data integration
- AI-generated equity research
- Financial metric calculations
- Historical return analysis

### Deployment
- Vercel
- GitHub

---

## Architecture

User Input (Ticker Symbol)
↓
Yahoo Finance API
↓
Financial Data Processing Layer
↓
OpenAI GPT-4o-mini Analysis Engine
↓
Investment Memorandum Generation
↓
Interactive Dashboard + PDF Export

---

## Platform Screenshots

### Equity Research Dashboard
<img width="1352" height="664" alt="Screenshot 2026-06-11 at 11 56 05 AM" src="https://github.com/user-attachments/assets/ded115c4-9f6d-4ca5-8cb3-140929d6991c" />


### Company Research Report 
<img width="1507" height="755" alt="Screenshot 2026-06-11 at 12 00 02 PM" src="https://github.com/user-attachments/assets/a62e1b82-bdba-4f26-a67d-0f717376c296" /> 


### Financial Statement Dashboard 
<img width="1512" height="752" alt="Screenshot 2026-06-11 at 12 00 50 PM" src="https://github.com/user-attachments/assets/83ad0a9a-c364-4c1a-8c71-5421d43b4b7f" />


### Investment Memo 
<img width="1512" height="749" alt="Screenshot 2026-06-11 at 12 01 29 PM" src="https://github.com/user-attachments/assets/545fa358-a039-4977-a7b2-41ca04b4ca96" />


### Bull vs Bear Analysis   
<img width="1511" height="577" alt="Screenshot 2026-06-11 at 12 02 52 PM" src="https://github.com/user-attachments/assets/01d75cb0-e50a-4b1e-b866-a8d62f0c165b" />


---

## Example Workflow

1. Search for a public company ticker (AAPL, NVDA, MSFT, etc.)
2. Generate an AI-powered investment memorandum
3. Review valuation, growth, profitability, and solvency metrics
4. Compare companies side-by-side
5. Export a professional PDF report

---

## Installation

Clone the repository:

```bash
git clone https://github.com/nylekamil/sec-analyst.git
cd sec-analyst
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
OPENAI_API_KEY=your_api_key_here
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Future Improvements

- Portfolio tracking
- Earnings transcript analysis
- SEC filing analysis
- Watchlists and alerts
- Multi-company benchmarking
- Analyst recommendation aggregation
- Portfolio optimization tools

---

## Why I Built This

I built SEC Analyst to combine my interests in investing, technology, and artificial intelligence.

The goal was to recreate a professional equity research workflow by integrating live market data, financial statement analysis, valuation metrics, and AI-generated investment memoranda into a single platform.

Through this project, I gained experience building full-stack applications, integrating external APIs, deploying production software, and applying AI to real-world financial research problems.

---

## Author

**Nyle Kamil**

University of Southern California (USC)

Economics & Computer Science

GitHub: https://github.com/nylekamil
