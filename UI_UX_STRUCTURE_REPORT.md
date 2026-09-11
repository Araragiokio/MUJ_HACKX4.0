# FinSight — UI/UX and Technical Architecture Specification Report

> **Target Audience:** Artificial Intelligence agents, LLM copilots, system architects, and frontend developers requiring an exhaustive, complete understanding of the FinSight web application's user interface, user experience, component hierarchy, design tokens, mathematical reasoning engine, and structural codebase organization.

---

## 1. Executive Summary & Core Product Thesis

**FinSight** (also referenced as **FinHealth**) is an AI-powered personal financial health assistant tailored for young working professionals (exemplified by Indian urban professionals in tech hubs like Bengaluru).

### 1.1 The Core Problem
Conventional personal finance and budgeting applications (e.g., Jupiter, Fi, INDmoney, Moneyview, Mint) excel at retroactive categorization: they ingest bank SMS or statements, chart expenses into pie charts, and tell the user where their money went last month. However, they fail to provide forward-looking, actionable, and mathematically verifiable recommendations.

### 1.2 The FinSight Value Proposition
FinSight operates on a forward-looking paradigm:
- **"What is happening with my money?"** — Real-time reconciliation of monthly income against committed outflows (housing, debt servicing, subscriptions, utilities) and discretionary burn.
- **"What should I do about it?"** — Numbered, deterministic optimization recommendations with step-by-step mathematical proof (e.g., how to unlock ₹7,500/month without compromising essential lifestyle).
- **"What happens if life changes?"** — A real-time Decision Sandbox (Life Simulator) where users adjust salary, rent, new EMIs, or discretionary spending, immediately seeing variance impacts across 6 core financial indicators.

### 1.3 The Strict AI vs. Math Separation Principle
A fundamental architectural tenet of FinSight is:
> **The LLM never computes numbers.**
> All debt avalanche rankings, loan amortization, savings rates, runway timelines, goal completion dates, and budget adherence ratios are computed deterministically in code. The AI layer (powered by Google Gemini) functions strictly as an explanation, contextualization, and conversational interface grounded in these pre-computed metrics.

---

## 2. Technical Stack & Dependencies

The project is structured as a modern Single Page Application (SPA) with zero external backend database dependencies for the demo mode:

| Layer | Technology | Version / Specification | Purpose |
|---|---|---|---|
| **Runtime & Bundler** | Vite | `^6.2.3` | Lightning-fast HMR and ESM build pipeline |
| **Framework** | React + ReactDOM | `^19.0.1` | Concurrent UI rendering, hook-driven state |
| **Language** | TypeScript | `~5.8.2` | Full static typing of financial entities and UI props |
| **CSS & Design Engine** | Tailwind CSS v4 | `@tailwindcss/vite ^4.1.14` | Utility-first styling with modern `@import "tailwindcss";` |
| **Icons** | Lucide React | `^0.546.0` | Comprehensive semantic icon set |
| **Data Visualization** | Recharts | `^3.10.1` | Donut charts, area charts, custom tooltips |
| **AI Integration** | Google GenAI API | Direct REST / `@google/genai ^2.4.0` | Ingests grounded financial context to answer queries |
| **Typography** | Google Fonts | Plus Jakarta Sans & JetBrains Mono | Loaded via Google Fonts CDN in `index.html` |
| **Local Persistence** | Web Storage API | `window.localStorage` | Persists user profile, subscriptions, goals, liabilities |

---

## 3. Visual Design System & UI/UX Standards

FinSight's visual aesthetic is clean, modern, and data-dense, drawing inspiration from high-end fintech platforms (such as Stripe, Linear, Mercury, and Apple Card).

### 3.1 Typography
Configured in `index.html` and applied globally across `body`:
- **Primary Body & Display Font:** `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif`
  - Weights utilized: `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold), `800` (ExtraBold).
  - Used for headings, body text, buttons, alerts, and navigation items.
- **Monospace / Numerical Font:** `'JetBrains Mono', monospace`
  - Used for account numbers (`HDFC Bank •• 4912`), reference codes (`TXN-IN-8892-01`), mathematical formula strips, and tabular numbers (`tabular-nums`).

### 3.2 Color Palette & Semantic Tokens

```
Canvas / Neutrals:
  - Background:          #F8FAFC (Slate-50) / #F8F9FA
  - Card Surfaces:       #FFFFFF (Pure White) with Slate-200/80 borders
  - Primary Text:        #0F172A (Slate-900 / Slate-950)
  - Secondary Text:      #64748B (Slate-500)
  - Muted Text / Meta:   #94A3B8 (Slate-400)

Semantic Primary (Health & Wealth):
  - Teal-600 / 700:      #0D9488 / #0F766E (Primary action, health scores, brand badges)
  - Teal-50 / Emerald-50: Tints for highlight surfaces and badges

Financial Sentiment Accents:
  - Inflow / Positive:   Emerald (#10B981 / #047857) — Actual credits, surplus, accelerated goals
  - Outflow / Neutral:   Slate (#334155 / #0F172A) — Fixed committed debits
  - Warning / Review:    Amber (#F59E0B / #B45309) — Discretionary surge, unused subscriptions, tight budgets
  - Danger / Debt / APR: Rose (#F43F5E / #BE123C) — Credit card interest leak, deficits, high DTI
  - Intelligence / AI:   Indigo & Purple (#6366F1, #8B5CF6) — AI drawers, dark hero opportunity cards

Dark Hero Cards (High-Contrast Intelligence Surfaces):
  - Gradient:            from-slate-950 via-indigo-950 to-slate-900
  - Text:                Pure white with slate-300 secondary and emerald-400 / amber-300 accents
```

### 3.3 Number Formatting Rules
Located in `src/utils/formatters.ts`:
- **Indian Numbering System:** Values format with Indian grouping (e.g., `₹1,20,000`, `₹48,000`, `₹2,00,000`) using `Intl.NumberFormat('en-IN')`.
- **Compact Formatter:** Values above ₹1,00,000 format as `₹1.2L`, `₹145k`, `₹1Cr`.
- **Signed Numbers:** Inflow prepends `+₹`, outflows show `-₹` or standard `₹` with contextual badges (`Actual`, `Estimated`, `Projected`).

### 3.4 Elevation, Card Anatomy, and Responsive Layout
- **Cards:** Defined with `bg-white rounded-2xl border border-slate-200/90 shadow-2xs`.
- **Interactive Elements:** Subtle micro-interactions with `hover:border-slate-300`, `transition-all`, `cursor-pointer`, and active rings.
- **Formulas & Strips:** Top of views features a "Reconciled Formula Strip" highlighting arithmetic progression (`Income − Committed − Discretionary = Net Savings`).
- **Responsive Breakpoints:**
  - `Desktop (>= 1024px / lg)`: Persistent 256px (`w-64`) left sidebar; main content offset by `lg:pl-64`.
  - `Mobile (< 1024px)`: Collapsible slide-over drawer sidebar with backdrop blur + sticky TopBar with hamburger trigger + fixed bottom navigation bar (`#mobile-bottom-nav`) for 5 primary tabs.

---

## 4. Complete Codebase Structure & File Map

```
d:/New folder/MUJ_HACKX4.0/
├── index.html                   # HTML entry point, Google Fonts, meta tags, root container
├── package.json                 # Dependency definitions and dev scripts
├── tsconfig.json                # TypeScript compiler config (ESNext, React JSX)
├── vite.config.ts               # Vite configuration with React and Tailwind v4 plugins
├── .env.example                 # Template for Gemini API key & host configuration
├── README.md                    # Project overview, problem statement, and API roadmap
└── src/
    ├── main.tsx                 # React application mount to DOM (#root)
    ├── App.tsx                  # Root component, global state, screen router, modal system
    ├── index.css                # Global CSS stylesheet importing Tailwind CSS v4
    ├── types.ts                 # Central domain entity interfaces and type unions
    ├── data/
    │   └── mockData.ts          # Central seed profile (Aarav Mehta), transactions, debts, goals
    ├── utils/
    │   ├── formatters.ts        # INR currency formatters, category badge styles
    │   └── geminiClient.ts      # Client-side Google Gemini 3.5 Flash-Lite API wrapper
    ├── components/
    │   ├── Sidebar.tsx          # Persistent desktop sidebar & mobile slide-over drawer
    │   ├── TopBar.tsx           # Sticky top header with liquid balance, AI button, demo reset
    │   ├── MetricCard.tsx       # Reusable 4-pillar financial metric cards
    │   ├── HealthScoreRing.tsx  # SVG circular progress gauge with Tier A- index breakdown
    │   ├── ExpenseChart.tsx     # Recharts donut visualization with interactive slice tooltips
    │   ├── CashFlowChart.tsx    # Recharts area graph for 30-day runway projection
    │   ├── Modal.tsx            # Accessible backdrop modal shell with escape and close handlers
    │   ├── ExplainModal.tsx     # "Why?" itemized calculation modal (+₹7,500/mo breakdown)
    │   ├── UnusedSubscriptionModal.tsx # Subscription audit modal with 1-click cancel
    │   ├── CreateGoalModal.tsx  # Paced goal creation modal with live monthly slider
    │   ├── TransactionDetailModal.tsx  # Single transaction inspector with reference codes
    │   ├── AddTransactionModal.tsx     # Full ledger entry modal with built-in calculator keypad
    │   └── AskFinSightDrawer.tsx       # AI chat drawer with pinned user profile & presets
    └── views/
        ├── DashboardView.tsx    # Overview: Health score, 4 metrics, hero insight, donut, subs
        ├── TransactionsView.tsx # Ledger: Search, filter by type/category, sort, add modal
        ├── CashFlowView.tsx     # Daily runway projection, inflow/outflow timeline, debit dates
        ├── GoalsView.tsx        # Goal milestones, progress meters, pacing increment buttons
        ├── LiabilitiesView.tsx  # Avalanche debt ranking, high-interest credit card alert
        ├── InsightsView.tsx     # Explainable recommendations catalog with actionable cards
        ├── SimulatorView.tsx    # Life Decision Sandbox: 4 sliders, 6 comparative metrics, matrix
        └── SettingsView.tsx     # Profile preferences, salary recalibration, demo data reset
```

---

## 5. Domain Entities & Type Definitions

Located in `src/types.ts`:

### 5.1 Screens (`ScreenType`)
```typescript
export type ScreenType = 
  | 'dashboard'
  | 'transactions'
  | 'cashflow'
  | 'goals'
  | 'liabilities'
  | 'insights'
  | 'simulator'
  | 'settings';
```

### 5.2 User Profile (`UserProfile`)
```typescript
export interface UserProfile {
  name: string;             // "Aarav Mehta"
  age: number;              // 27
  city: string;             // "Bengaluru"
  occupation: string;       // "Senior Product Designer"
  monthlySalary: number;    // 120000 (INR)
  currentBalance: number;   // 48000 (INR)
  savingsAccount: string;   // "HDFC Bank •• 4912"
}
```

### 5.3 Transactions & Ledger (`Transaction`)
```typescript
export interface Transaction {
  id: string;               // e.g. "tx-1"
  date: string;             // ISO date or format string "2026-09-08"
  displayDate: string;      // "08 Sep 2026"
  merchant: string;         // e.g. "TechCorp India", "Swiggy", "Prestige Estates"
  category: 
    | 'Housing' | 'Food & Dining' | 'Transportation' | 'Shopping' 
    | 'Subscriptions' | 'Utilities' | 'Investments' | 'Salary' 
    | 'Debt & EMIs' | 'Healthcare' | 'Entertainment' | 'Transfer';
  amount: number;           // Positive for income, negative for expense
  type: 'income' | 'expense' | 'transfer';
  paymentMode: 'UPI' | 'Credit Card' | 'NetBanking' | 'Debit Card' | 'Auto-Debit' | 'Cash';
  account?: string;         // "HDFC Bank", "ICICI Bank", etc.
  transferFrom?: string;
  transferTo?: string;
  status: 'Completed' | 'Pending';
  notes?: string;
  isRecurring?: boolean;
}
```

### 5.4 Subscriptions & Digital Mandates (`Subscription`)
```typescript
export interface Subscription {
  id: string;               // e.g. "sub-1"
  name: string;             // "Netflix", "Spotify", "Cult.fit Gym"
  cost: number;             // Monthly charge in INR
  billingCycle: 'monthly' | 'yearly';
  category: string;
  lastBilled: string;
  usageStatus: 'active' | 'possibly_unused';
  usageDetail: string;      // Diagnostic reason: e.g. "0 streaming hours in 45 days"
  lastUsedDate: string;
  monthsActive: number;
}
```

### 5.5 Financial Goals (`FinancialGoal`)
```typescript
export interface FinancialGoal {
  id: string;               // e.g. "goal-1"
  title: string;            // "Emergency Fund", "MacBook Pro M3", "Japan Vacation"
  category: string;
  targetAmount: number;     // e.g. 200000
  currentAmount: number;    // e.g. 118000
  monthlyContribution: number; // e.g. 12000
  targetDate: string;       // "Apr 2027"
  estimatedMonths: number;  // 7
  color: string;            // Hex color code
}
```

### 5.6 Liabilities & Debt Servicing (`Liability`)
```typescript
export interface Liability {
  id: string;               // e.g. "liab-1"
  name: string;             // "HDFC Regalia Credit Card"
  institution: string;      // "HDFC Bank"
  type: 'Credit Card' | 'Personal Loan' | 'Vehicle Loan' | 'Education Loan' | 'Home Loan';
  outstandingAmount: number;// e.g. 42000
  interestRate: number;     // APR percentage: e.g. 38.0
  interestLabel: string;    // "38.0% APR"
  monthlyEmi: number;       // e.g. 4200
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedMonthlyInterest: number; // e.g. 1470
  tenureRemainingMonths: number;
  avalancheRank: number;    // 1 (Highest priority to pay off)
}
```

---

## 6. Detailed UX Breakdown by Screen

### 6.1 Overview Dashboard (`DashboardView.tsx`)
The primary executive command center. Organized into two vertical narrative questions:

#### Section 1: "What is happening with my money?"
1. **Reconciled Accounting Formula Strip:**
   - Visual display: `Income (₹1,20,000 Actual) − Committed (₹62,500 Actual) − Discretionary (₹21,300 Estimated) = Projected Savings (₹36,200 Projected)`.
   - Right pill: `30.2% Savings Rate`.
2. **Financial Health Score Gauge (`HealthScoreRing.tsx`):**
   - SVG circular progress ring displaying `78 / 100`.
   - Classification: `Tier A- • Healthy, with room to optimize`.
   - 4 Micro-pillars: Savings Rate (30.2%), Debt-to-Income (21.5%), Liquid Runway (3.2 months), Discretionary Adherence (84%).
3. **Core 4 Metric Cards Grid (`MetricCard.tsx`):**
   - **Monthly Income:** `₹1,20,000` (Credited on 08 Sep • Actual)
   - **Committed Expenses:** `₹62,500` (Rent, 4 EMIs, Insurance • Actual)
   - **Discretionary Spending:** `₹21,300` (12% higher than average • Estimated)
   - **Projected Savings:** `₹36,200` (30.2% savings rate • Projected)

#### Section 2: "What should I do about it?"
1. **AI Hero Opportunity Card (`#ai-insight-hero-card`):**
   - High-contrast dark gradient card (`from-slate-950 via-indigo-950 to-slate-900`).
   - Headline: *"You can increase your monthly savings by approximately ₹7,500 without changing your essential lifestyle."*
   - Interactive levers:
     - `₹649/mo unused Netflix` → opens `UnusedSubscriptionModal`
     - `₹2,500/mo dining surge` → routes to `transactions` view
     - `₹1,470/mo card interest` → routes to `liabilities` view
     - `₹2,881/mo shopping trim` → opens `ExplainModal`
   - Action cluster:
     - `Why?` button: Launches `ExplainModal` with full calculation breakdown.
     - `See recommendations` button: Navigates to `insights` screen.
2. **Expense Intelligence Card (`ExpenseChart.tsx`):**
   - Interactive Recharts Donut chart visualizing spending categories: Housing (38.7%), Food (18.5%), Shopping (11.9%), Transport (10.0%), Utilities (7.3%), Subscriptions (6.9%), Other (6.7%).
   - Center hover callout showing category name and INR sum.
3. **Detected Subscriptions Card:**
   - Audits 5 auto-renewing digital mandates totaling `₹4,999/mo`.
   - Flagged badge: `Netflix` marked as `Possibly unused` (0 streaming hours in 45 days) with amber review button.
4. **Bottom Discovery Cards:**
   - **Life Decision Simulator Teaser:** Deep teal card inviting user to simulate job change, rent hike, or loan.
   - **Goals Snapshot:** Progress bars for Emergency Fund and MacBook Pro M3 with remaining months.

---

### 6.2 Transactions & Ledger (`TransactionsView.tsx`)
The single source of truth for all historical inflows, debits, and transfers:
1. **Inflow/Outflow Summary Cards:**
   - Total Inflow (₹1,20,000), Total Outflow (₹79,100), Net September Cash Flow (+₹40,900).
2. **Filter & Control Toolbar:**
   - Instant search input matching merchants, categories, or notes.
   - Type filter pills: `All`, `Expenses`, `Income`.
   - Category dropdown filter.
   - Date and Amount sort toggles (`Newest`, `Oldest`, `Highest`, `Lowest`).
   - `+ Add Transaction` button opening the comprehensive creation modal.
3. **Transaction List:**
   - Each row displays: Category icon, Merchant name, Date & Payment mode (`UPI`, `Credit Card`, `Auto-Debit`), Amount formatted with color (Green for income, Dark for expense), and recurring badge.
   - Clicking any transaction opens `TransactionDetailModal.tsx`.

---

### 6.3 Cash Flow Projection (`CashFlowView.tsx`)
Forward-looking liquidity telemetry to prevent account overdrafts:
1. **Reconciled Opening-to-Close Strip:**
   - `Opening (₹48,000) + Salary (+₹1,20,000) − Total Debits (₹79,100) = Month-End (₹88,900)`.
2. **Interactive 30-Day Runway Chart (`CashFlowChart.tsx`):**
   - Recharts Area chart plotting daily balance across September.
   - Step drops correlate with real debit events: Rent on 1st, Loan EMIs on 5th, Insurance on 10th, Utilities on 12th.
   - Interactive Pace Selector:
     - `Standard`: Default baseline trajectory.
     - `Conservative`: Assumes ₹8,500 lower discretionary burn.
     - `Elevated`: Assumes heavy burn, displaying warning when balance dips close to safe reserve threshold.
3. **Committed Schedule Timeline:**
   - Vertical card listing every fixed outflow event with institution, amount, and cleared/upcoming status.

---

### 6.4 Smart Financial Goals (`GoalsView.tsx`)
Goal progress tracking and automated SIP pacing:
1. **Aggregate Pillars:**
   - Total Target across all goals: `₹3,90,000`
   - Accumulated Capital: `₹1,70,000` (43.6% funded)
   - Monthly Automated Pace: `₹28,000/mo`
2. **Interactive Goal Cards:**
   - **Emergency Fund (Safety Net):** Target ₹2,00,000 | Saved ₹1,18,000 (59%) | ₹12,000/mo pace | 7 months remaining.
   - **MacBook Pro M3 (Productivity):** Target ₹90,000 | Saved ₹32,000 (36%) | ₹8,000/mo pace | 8 months remaining.
   - **Japan Vacation (Travel):** Target ₹1,00,000 | Saved ₹20,000 (20%) | ₹8,000/mo pace | 10 months remaining.
   - **Interactive Pacing Adjustment:**
     - `+₹1,000` and `−₹1,000` buttons recalculate estimated months to completion in real-time.
3. **Modal Integration:**
   - `+ Create goal` button triggers `CreateGoalModal.tsx` with dynamic target date projection.

---

### 6.5 Liabilities & Debt Intelligence (`LiabilitiesView.tsx`)
Focuses on stopping wealth leakage from high-interest debt:
1. **Aggregate Debt Pillars:**
   - Total Outstanding Principal: `₹3,82,000` across 4 loan/credit accounts.
   - Monthly Debt Service: `₹18,500/mo` (21.5% DTI — healthy under 35%).
   - Monthly Interest Burn: `~₹2,420/mo` (with ₹1,470 from credit card alone).
2. **Debt Avalanche Hero Card (`#debt-avalanche-hero`):**
   - Prioritizes paying off the HDFC Regalia Credit Card balance (₹42,000 @ 38% APR) ahead of personal, bike, and education loans.
   - Mathematical justification: Diverting surplus cash here earns a guaranteed risk-free 38% effective return.
3. **Ranked Liability Accounts Table:**
   - Accounts ranked by Avalanche priority (#1 Credit Card 38%, #2 ICICI Personal Loan 13.5%, #3 HDFC Bike Loan 9.2%, #4 SBI Education Loan 8.5%).
   - Displays tenure remaining, monthly EMI, and monthly interest charge.
4. **Interactive Prepayment Accelerator Simulator:**
   - Slider to add ₹1,00,0 to ₹15,000 extra monthly prepayment to the card.
   - Live recalculation of interest avoided (up to ₹8,420 saved) and months saved.

---

### 6.6 Actionable Intelligence (`InsightsView.tsx`)
A transparent catalog of optimization opportunities with step-by-step math:
1. **Identified Monthly Surplus Banner:**
   - Identifies total potential recovery of `+₹7,500 / month` (₹90,000 annualized).
2. **Actionable Cards Catalog:**
   - **Insight #1 (Subscription):** Dormant Netflix account pruning (+₹649/mo). Action button opens `UnusedSubscriptionModal`.
   - **Insight #2 (Food):** Weekend food delivery surcharge optimization (+₹2,500/mo). Action routes to `transactions`.
   - **Insight #3 (Savings):** Directing surplus into Emergency Fund SIP (+₹3,000/mo). Action marks insight applied with live toast notification.
   - **Insight #4 (Liability):** Eliminating revolving credit-card balance (+₹1,470/mo interest savings). Action routes to `liabilities`.
3. **Math Verification Callout:**
   - Provides exact arithmetic check: `₹649 + ₹2,500 + ₹1,470 + ₹2,881 = ₹7,500/mo`.

---

### 6.7 Life Decision Simulator (`SimulatorView.tsx`)
The centerpiece feature for forward-looking scenario modeling.

#### Baseline Profile Constants
- Monthly Net Inflow: `₹1,20,000`
- Current Rent: `₹28,000`
- Fixed Committed (non-rent): `₹34,500` (EMIs ₹18.5k + Insurance ₹6k + Utilities ₹5.3k + Subs ₹4.7k)
- Baseline Discretionary Spending: `₹21,300`
- Baseline Free Cash / Savings: `₹36,200` (30.2% savings rate)
- Emergency Fund Remaining: `₹82,000` (7 months remaining)
- Primary Goal (MacBook) Remaining: `₹58,000` (8 months remaining)
- Baseline Financial Health Score: `78 / 100`

#### The 4 Interactive Decision Levers (Sliders)
1. **Housing Rent:** Range ₹20,000 to ₹55,000 (Step ₹1,000). Default demo trigger: ₹35,000 (+₹7,000 hike).
2. **Monthly Income:** Range ₹60,000 to ₹2,20,000 (Step ₹5,000).
3. **New EMI / Loan:** Range ₹0 to ₹30,000 (Step ₹1,000).
4. **Discretionary Spending:** Range ₹10,000 to ₹40,000 (Step ₹1,000).

#### One-Click Scenario Presets
- `🏠 Try rent increase`: Immediately shifts rent from ₹28k to ₹35k.
- `💼 Career Raise`: Simulates salary boost to ₹1,45,000.
- `🚗 New Car EMI`: Adds a ₹12,000/month auto loan.
- `📉 Pay Cut`: Simulates salary reduction to ₹1,00,000.
- `✂️ Trim Discretionary`: Reduces discretionary burn to ₹15,000.
- `Reset scenario`: Restores baseline values.

#### The 6 Core Comparative Metrics (CURRENT vs SCENARIO)
Every slider movement instantly recomputes all 6 metrics with variance indicators:
1. **Monthly Free Cash:** `₹36,200` → `₹29,200` (-₹7,000 delta)
2. **Monthly Savings:** `₹36,200` → `₹29,200` (-₹7,000 delta)
3. **Savings Rate:** `30.2%` → `24.3%` (-5.8% drop)
4. **Emergency Fund Timeline:** `7 months` → `9 months` (+2 months delay)
5. **Goal Timeline (MacBook):** `8 months` → `10 months` (+2 months delay)
6. **Financial Health Score:** `78` → `72 / 100` (-6 points impact)

#### Live Before vs After Comparison Matrix Table
An interactive table showing every parameter, before value, after value, and calculated difference.

#### Deterministic Affordability Assessment
Categorizes the resulting scenario into 5 distinct verdicts:
- **Cash Flow Deficit** (Free cash <= 0)
- **High Vulnerability** (Savings rate < 10% or Free cash < ₹12k)
- **Manageable, but Tight** (Savings rate < 20%, Rent ratio > 32%, or timeline delay > 3 months)
- **Comfortable** (Healthy buffer preserved)
- **Accelerating Wealth** (Savings rate exceeds baseline)

---

### 6.8 Preferences & Settings (`SettingsView.tsx`)
- Displays user card: Aarav Mehta, Senior Product Designer, Bengaluru.
- Salary recalibration input: User can modify net take-home salary and persist to local storage.
- System reset button: Purges local storage overrides and restores initial hackathon dataset.

---

## 7. Global Modals & Overlay Drawers

### 7.1 `ExplainModal.tsx` ("How We Calculated +₹7,500/mo")
- Modal detailing the 4 deterministic optimization components:
  1. Unused Subscription Pruning: +₹649
  2. Food Delivery Optimization: +₹2,500
  3. Credit Card Interest Mitigation: +₹1,470
  4. Discretionary Shopping Cap: +₹2,881
- Mathematical check: Displays explicit formula equation summing to ₹7,500.
- Action button: "Apply Recommended Plan" which routes to Insights.

### 7.2 `UnusedSubscriptionModal.tsx` ("Recurring Subscription Review")
- Displays audited subscription metrics (consecutive active months, last usage date, utilization text).
- Financial consequence calculation: Computes annual cost and lost opportunity if compounded at 12% in an index SIP.
- 1-Click Action: "Cancel & Save ₹649/mo", which updates the subscription state in `App.tsx` and saves to local storage.

### 7.3 `CreateGoalModal.tsx` ("Create New Financial Goal")
- Fields: Goal Title, Category, Target Amount, Current Amount, Monthly Contribution, Target Timeline (months).
- Synchronized calculation: Adjusting target amount or months automatically recomputes the required monthly contribution.
- Submission appends new goal into state and persists to local storage.

### 7.4 `TransactionDetailModal.tsx` ("Transaction Details")
- Displays merchant icon, amount, completed status, category badge, payment mode, account string, and AI classification note.

### 7.5 `AddTransactionModal.tsx` ("Add Transaction to Ledger")
A high-productivity transaction creation modal featuring:
- In-modal arithmetic keypad with operator evaluation (`+`, `-`, `×`, `÷`).
- Transaction type pills: `Expense`, `Income`, `Transfer`.
- Category selector grid with 11 categorized icons.
- Account picker: HDFC Bank, ICICI Bank, SBI Bank, Axis Bank, Cash, UPI Wallet.
- Transfer logic: Displays "Transfer From" and "Transfer To" accounts when type is transfer.

### 7.6 `AskFinSightDrawer.tsx` ("Ask FinSight AI")
A slide-over conversational drawer providing direct access to Google Gemini:
- **Pinned Grounded Context:** The prompt injects Aarav Mehta's entire financial state (income, balance, committed expenses, health score, debt balances, and interest rates).
- **Prompt Constraints:**
  - AI is forbidden from hallucinating or inventing numbers.
  - Required to answer concisely (2-4 sentences or clean separate lines).
  - Explicit rule: Do not output markdown asterisks (`*`) or hash headers (`#`), keeping output conversational and legible.
- **Preset Quick Prompts:**
  - *"Can I afford an iPhone 16 Pro (₹1,34,000) right now?"*
  - *"Why is my food spending flagged this month?"*
  - *"Should I pay HDFC Credit Card or Personal Loan first?"*
  - *"How can I reach my ₹2,00,000 Emergency Fund faster?"*

---

## 8. State Architecture & Data Flow

```
                                  ┌─────────────────────────────┐
                                  │      window.localStorage    │
                                  │  - finsight_user            │
                                  │  - finsight_subs            │
                                  │  - finsight_goals           │
                                  │  - finsight_liabilities     │
                                  └──────────────┬──────────────┘
                                                 │ (hydrate on mount)
                                                 ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           App.tsx                                                │
│                                                                                                  │
│   State Hooks:                                                                                   │
│   - currentScreen: ScreenType ('dashboard' | 'transactions' | 'simulator' | ...)                 │
│   - user: UserProfile (Aarav Mehta)                                                              │
│   - subscriptions: Subscription[]                                                                │
│   - goals: FinancialGoal[]                                                                       │
│   - liabilities: Liability[]                                                                     │
│   - transactions: Transaction[]                                                                  │
│   - activeModals: explainOpen, goalOpen, subToReview, txnToReview, aiDrawerOpen                  │
│                                                                                                  │
│   Handlers:                                                                                      │
│   - handleCancelSubscription(id)  --> updates state & saves to localStorage                      │
│   - handleAddGoal(goal)           --> prepends to goals & saves                                  │
│   - handleUpdateGoalContribution  --> updates monthly delta & recalculates estimated months      │
│   - handleUpdateSalary(newSalary) --> updates user profile                                       │
│   - handleResetDemoData()         --> clears localStorage & reloads INITIAL_* constants          │
└──────────────────────────────────────┬───────────────────────────────────────────────────────────┘
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            ▼                          ▼                          ▼
     [Sidebar.tsx]                [TopBar.tsx]            [Active View Component]
  - Desktop nav links          - Liquid balance badge    - DashboardView
  - Mobile slide-out           - Reset demo button       - TransactionsView
  - User avatar & status       - "Ask FinSight AI" CTA   - CashFlowView
                                                         - GoalsView
                                                         - LiabilitiesView
                                                         - InsightsView
                                                         - SimulatorView
                                                         - SettingsView
```

---

## 9. AI Integration & Prompt Engineering Architecture

The AI module is located in `src/utils/geminiClient.ts` and consumed by `src/components/AskFinSightDrawer.tsx`.

### 9.1 API Invocation Mechanism
```typescript
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = "gemini-flash-lite-latest";

export async function askFinSightAI(prompt: string, context: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${context}\n\nUser question: ${prompt}` }],
          },
        ],
      }),
    }
  );
  // Parses response candidate parts and handles fallback errors
}
```

### 9.2 Injected Ground Truth Context
Every query is prepended with the user's verified financial snapshot:
```
User profile:
- Name: Aarav Mehta
- Monthly Income: ₹1,20,000
- Committed Expenses: ₹62,500 (rent, 4 EMIs, insurance)
- Discretionary Spending: ₹21,300 this month
- Projected Savings: ₹36,200/month (30.2% savings rate)
- Liquid Balance: ₹48,000
- Financial Health Score: 78/100 (Tier A-)
- Debt-to-Income Ratio: 21.5%
- Liquid Runway: 3.2 months
- Credit Card: HDFC Regalia, ₹42,000 revolving balance @ ~38% APR
- Personal Loan: ICICI, ₹1,80,000 @ 13.5%
- Bike Loan: 9.2% APR
- Education Loan: 8.5% APR
- Emergency Fund Goal: ₹2,00,000 target, ₹1,18,000 saved so far
```

---

## 10. Key Interaction Flows & User Journeys

### Journey 1: Identifying & Pruning Unused Subscriptions
1. User lands on `DashboardView`.
2. Right column reveals `Detected Subscriptions` with `Netflix` marked as `Possibly unused`.
3. User clicks amber `Review` button.
4. `UnusedSubscriptionModal` opens displaying diagnostic evidence: *"0 streaming hours detected in the last 45 days. Last profile login was on July 2."*
5. User clicks `Cancel & Save ₹649/mo`.
6. Subscription status immediately updates, toast confirms savings, and recurring expense totals recompute.

### Journey 2: Testing a Life Decision (Rent Hike Scenario)
1. User navigates to `SimulatorView` via sidebar or dashboard hero banner.
2. User clicks demo preset `🏠 Try rent increase (₹28k → ₹35k)`.
3. Rent slider animates to ₹35,000.
4. Yellow alert banner renders impact: Free cash drops from ₹36,200 to ₹29,200; savings rate drops by 5.8%; Emergency Fund delayed by +2 months.
5. All 6 comparative cards display animated before-and-after variance chips.
6. The Comparison Matrix table details line-by-line financial variance.

### Journey 3: Debt Avalanche Exploration
1. User navigates to `LiabilitiesView`.
2. User observes the high-priority debt banner highlighting the HDFC Credit Card (38% APR).
3. User drags the prepayment accelerator slider to test adding ₹5,000/month.
4. Visual readout calculates the payoff accelerating by 5 months, avoiding ~₹8,420 in finance fees.

### Journey 4: Querying FinSight AI on Affordability
1. User clicks the top-right `Ask FinSight AI` button in `TopBar`.
2. Drawer slides out from the right with preset discovery prompts.
3. User clicks *"Can I afford an iPhone 16 Pro (₹1,34,000) right now?"*.
4. FinSight AI analyzes the ₹48,000 liquid balance, ₹36,200 monthly free cash, and ₹42,000 credit card debt, delivering a grounded warning that purchasing in cash wipes out emergency liquidity, and financing at credit card APR adds ₹4,000+/month in debt leak.

---

## 11. Developer & AI Reference Checklist

When maintaining or extending FinSight:
1. **Never let an LLM compute interest, EMIs, or runway timelines:** Always write deterministic TypeScript functions and feed the result into the UI or AI context.
2. **Preserve Indian Numbering Formats:** Use `formatINR(val)` from `src/utils/formatters.ts` for consistent rupee rendering with commas (`₹1,20,000`).
3. **Keep `mockData.ts` and `SimulatorView.tsx` baselines synchronized:** When altering Aarav Mehta's base income or rent, ensure both files reflect the same numbers so variances remain 100% mathematically correct.
4. **Follow the semantic badge hierarchy:** Green/Emerald for actual income and accelerated goals, Amber for warnings/discretionary surges, Rose for credit card interest and deficits, Teal for verified product metrics.
5. **Mobile-first accessibility:** Ensure every new screen or modal works smoothly on 375px wide screens (iPhone SE) up to ultra-wide 4K monitors.
