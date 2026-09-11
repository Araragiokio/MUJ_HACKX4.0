# FinHealth — AI-Powered Personal Financial Health Assistant

Most budgeting apps stop at showing you where your money went. **FinHealth**
takes a user's income, spending, liabilities, and savings and turns them
into specific, numbered, explainable financial recommendations — not
generic advice like "spend less on dining out."

Built for **[Hackathon Name] — PS #3: Personal Financial Health Assistant**.

---

## The Problem

Most individuals have their financial life scattered across salary credits,
card statements, EMIs, insurance premiums, and small investments, with no
single view of where the money actually goes. Existing budgeting apps
categorize past spending well but rarely tell a user what to change next
month.

## What FinHealth Does

| Feature | What it means in practice |
|---|---|
| **Expense Intelligence** | Classifies transactions into categories, flags recurring subscriptions, separates essential from discretionary spending |
| **Cash Flow View** | Projects day-by-day balance from known inflows/outflows so a shortfall is visible *before* it happens |
| **Goal-Based Planning** | Set a goal (emergency fund, purchase, loan prepayment) and get a real, computed monthly contribution — not a rule of thumb |
| **Liability Intelligence** | Ranks active loans/credit by true effective cost, so you know exactly which one to pay off first and why |
| **Actionable Alerts** | Flags unusual spending, upcoming large debits, and subscriptions that have gone unused |
| **Explainable Recommendations** | Every number shown comes with the math behind it, so the user can verify it, not just trust it |
| **Simulation Mode** | Test a life decision (job change, rent increase, new EMI) and immediately see the effect on cash flow and goal timelines |

### What makes this different

Most Indian fintech apps (Jupiter, Fi, ET Money, INDmoney, Moneyview) are
strong at automatic categorization and reporting, but stop there — the
"insight" they give is usually a summary of the past, with the reasoning
hidden. FinHealth's core bet is that a financial assistant should show its
work: every recommendation is backed by a specific calculation the user can
inspect, and the app tells you what to actually do next month, not just
what happened last month.

---

## Architecture

```
┌─────────────────┐        REST/JSON        ┌──────────────────────┐
│   Frontend       │  ───────────────────►  │   Backend             │
│   React + Vite   │  ◄───────────────────  │   FastAPI (Python)    │
└─────────────────┘                         └──────────┬───────────┘
                                                         │
                                              ┌──────────┴───────────┐
                                              │  Calculators + Rules  │
                                              │  (pure Python math)   │
                                              └──────────┬───────────┘
                                                         │
                                              ┌──────────┴───────────┐
                                              │  Gemini API            │
                                              │  (explanation layer   │
                                              │   only — never does   │
                                              │   the math itself)    │
                                              └───────────────────────┘
```

**Design principle:** the LLM never computes numbers. All EMI, affordability,
cash-flow, and ranking math is deterministic Python. Gemini's only job is to
turn already-computed numbers into a natural-language explanation — this
keeps every figure shown to the user exactly correct and fully traceable.

---

## Tech Stack

**Backend**
- Python 3 + FastAPI — REST API
- Pydantic — request/response validation
- Uvicorn — ASGI server
- `google-genai` (official SDK) + Gemini 3.5 Flash-Lite — explanation layer only

**Frontend**
- React + Vite
- Tailwind CSS
- Recharts — cash flow / expense charts
- TanStack Query — API data fetching

**No database** for the MVP — data lives in memory for the demo session.
**No auth** — single-user flow. **No bank integration** — users onboard by
entering their numbers directly or importing a CSV.

---

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app + routes
│   │   ├── schemas.py         # Request/response models
│   │   ├── calculators.py     # EMI, affordability, cash flow, savings math
│   │   ├── rules_engine.py    # Financial rules of thumb (EMI/income ratio, etc.)
│   │   └── gemini_client.py   # Gemini API wrapper (explanation layer)
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   └── (React + Vite app)
└── README.md
```

---

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# paste your Gemini API key into .env — get one free at https://aistudio.google.com/apikey

uvicorn app.main:app --reload --port 8000
```

API docs (auto-generated): `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
npm run dev
```

App runs at `http://localhost:5173` (default Vite port).

---

## API Overview

| Method | Endpoint | Purpose | Status |
|---|---|---|---|
| GET | `/health` | Health check | ✅ Built |
| POST | `/financial-advice` | Explainable Q&A on a specific financial decision | ✅ Built |
| GET | `/onboarding/status` | Whether the user has completed onboarding | 🚧 Planned |
| POST | `/profile` | Save income, fixed expenses, savings from onboarding | 🚧 Planned |
| POST | `/transactions` | Add a transaction manually | 🚧 Planned |
| POST | `/transactions/import` | Bulk-import transactions from CSV | 🚧 Planned |
| GET | `/transactions` | List classified transactions | 🚧 Planned |
| GET | `/cashflow/projection` | Day-by-day projected balance | 🚧 Planned |
| POST | `/liabilities` | Add a loan/credit line | 🚧 Planned |
| GET | `/liabilities` | Ranked liabilities by true cost | 🚧 Planned |
| POST | `/goals` | Create a savings/purchase/prepayment goal | 🚧 Planned |
| GET | `/goals` | List goals with required monthly contribution | 🚧 Planned |
| GET | `/alerts` | Active alerts (unusual spend, upcoming debits, unused subs) | 🚧 Planned |
| POST | `/simulate` | Before/after impact of a life-decision change | 🚧 Planned |

Full request/response shapes are in `backend/app/schemas.py`.

The Gemini API key is used **only server-side** — it's never sent to or
stored in the frontend.

---

## Non-Goals (by design, for hackathon scope)

- No real bank account linking / Account Aggregator integration
- No user authentication or multi-user accounts
- No ML-based anomaly detection — alerts and classification are rule/threshold-based
- No mobile app — web only

---

## Team

- [Add team member names + roles]

## License

[Add license, e.g. MIT — or leave unlicensed for hackathon scope]
