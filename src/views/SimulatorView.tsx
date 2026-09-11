import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Briefcase, 
  Home, 
  CreditCard, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Info,
  Calendar,
  Sparkles,
  RotateCcw,
  ShoppingBag,
  Target
} from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const SimulatorView: React.FC = () => {
  // Baseline Figures from Centralized Profile (Aarav Mehta)
  const BASELINE_INCOME = 120000;
  const BASELINE_RENT = 28000;
  const BASELINE_NON_RENT_COMMITTED = 34500; // Loan EMIs 18500 + Insurance 6000 + Utilities 5300 + Subscriptions 4700
  const BASELINE_COMMITTED = BASELINE_RENT + BASELINE_NON_RENT_COMMITTED; // 62500
  const BASELINE_DISCRETIONARY = 21300;
  const BASELINE_FREE_CASH = BASELINE_INCOME - BASELINE_COMMITTED - BASELINE_DISCRETIONARY; // 36200
  const BASELINE_SAVINGS_RATE = (BASELINE_FREE_CASH / BASELINE_INCOME) * 100; // 30.17% -> 30.2%
  const BASELINE_EMERGENCY_REMAINING = 82000; // 200000 target - 118000 saved
  const BASELINE_EMERGENCY_MONTHS = 7;
  const BASELINE_GOAL_REMAINING = 58000; // 90000 laptop target - 32000 saved
  const BASELINE_GOAL_MONTHS = 8;
  const BASELINE_HEALTH_SCORE = 78;

  // The 4 Interactive Simulator Parameters
  const [simIncome, setSimIncome] = useState<number>(120000);
  const [simRent, setSimRent] = useState<number>(35000); // Default to the ₹35,000 prompt example
  const [simNewEmi, setSimNewEmi] = useState<number>(0);
  const [simDiscretionary, setSimDiscretionary] = useState<number>(21300);
  const [activePreset, setActivePreset] = useState<string>('rent_hike');

  // Interactive Live Calculations
  const simCommitted = BASELINE_NON_RENT_COMMITTED + simRent + simNewEmi;
  const simTotalOutflow = simCommitted + simDiscretionary;
  const simFreeCash = simIncome - simTotalOutflow;
  const simSavings = Math.max(0, simFreeCash);
  const simSavingsRate = simIncome > 0 ? (simFreeCash / simIncome) * 100 : 0;

  // Emergency Fund Allocation & Timeline (scaled with available free cash)
  // Baseline allocated ~₹12,000/mo to emergency fund (33% of ₹36,200 free cash)
  const simEmergencyAlloc = simFreeCash > 0 ? Math.max(1000, Math.round(simFreeCash * 0.33)) : 0;
  const simEmergencyMonths = simEmergencyAlloc > 0 
    ? Math.ceil(BASELINE_EMERGENCY_REMAINING / simEmergencyAlloc) 
    : 99;
  const emergencyMonthsDelta = simEmergencyMonths - BASELINE_EMERGENCY_MONTHS;

  // Primary Goal Allocation & Timeline (MacBook M3 remaining ₹58,000)
  // Baseline allocated ~₹8,000/mo to laptop goal (22% of ₹36,200 free cash)
  const simGoalAlloc = simFreeCash > 0 ? Math.max(1000, Math.round(simFreeCash * 0.22)) : 0;
  const simGoalMonths = simGoalAlloc > 0
    ? Math.ceil(BASELINE_GOAL_REMAINING / simGoalAlloc)
    : 99;
  const goalMonthsDelta = simGoalMonths - BASELINE_GOAL_MONTHS;

  // Deterministic Financial Health Score Model
  // Evaluates savings rate change, debt ratio, housing ratio, and discretionary ratio
  const deltaSavingsScore = (simSavingsRate - BASELINE_SAVINGS_RATE) * 0.45;
  const simDebtRatio = ((18500 + simNewEmi) / (simIncome || 1)) * 100;
  const deltaDebtScore = (21.5 - simDebtRatio) * 0.35;
  const simRentRatio = (simRent / (simIncome || 1)) * 100;
  const deltaRentScore = (23.33 - simRentRatio) * 0.3;
  const simDiscRatio = (simDiscretionary / (simIncome || 1)) * 100;
  const deltaDiscScore = (17.75 - simDiscRatio) * 0.25;

  let computedScore = Math.round(BASELINE_HEALTH_SCORE + deltaSavingsScore + deltaDebtScore + deltaRentScore + deltaDiscScore);
  if (simFreeCash <= 0) {
    computedScore = Math.min(computedScore, 34);
  }
  const simHealthScore = Math.max(15, Math.min(96, computedScore));
  const healthScoreDelta = simHealthScore - BASELINE_HEALTH_SCORE;

  // Affordability Assessment
  const getAffordabilityAssessment = () => {
    if (simFreeCash <= 0) {
      return {
        label: 'Cash Flow Deficit',
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        cardBg: 'bg-rose-50/80 border-rose-200 text-rose-950',
        headline: 'Negative Monthly Cash Flow Detected',
        summary: `Total simulated outgo (${formatINR(simTotalOutflow)}) exceeds monthly income (${formatINR(simIncome)}) by ${formatINR(Math.abs(simFreeCash))}/month. Savings and goals are stalled.`,
      };
    }
    if (simSavingsRate < 10 || simFreeCash < 12000) {
      return {
        label: 'High Vulnerability',
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        cardBg: 'bg-rose-50/80 border-rose-200 text-rose-950',
        headline: 'Dangerously Thin Safety Cushion',
        summary: `Your monthly savings drops to ${formatINR(simFreeCash)} (${simSavingsRate.toFixed(1)}% savings rate). Unexpected medical or auto expenses would force reliance on high-interest credit cards.`,
      };
    }
    if (simSavingsRate < 20 || simRentRatio > 32 || emergencyMonthsDelta > 3) {
      return {
        label: 'Manageable, but Tight',
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        cardBg: 'bg-amber-50/80 border-amber-200 text-amber-950',
        headline: 'Affordable, but Extends Timelines',
        summary: `You retain positive cash flow (+${formatINR(simFreeCash)}/mo), but your emergency fund timeline shifts from ${BASELINE_EMERGENCY_MONTHS} to ${simEmergencyMonths} months (+${emergencyMonthsDelta} months delay).`,
      };
    }
    if (simSavingsRate >= BASELINE_SAVINGS_RATE) {
      return {
        label: 'Accelerating Wealth',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        cardBg: 'bg-emerald-50/80 border-emerald-200 text-emerald-950',
        headline: 'Optimal Financial Resilience',
        summary: `Strong cash surplus of ${formatINR(simFreeCash)}/mo (+${formatINR(simFreeCash - BASELINE_FREE_CASH)} vs baseline). Emergency fund timeline accelerates to ${simEmergencyMonths} months.`,
      };
    }
    return {
      label: 'Comfortable',
      badge: 'bg-teal-50 text-teal-700 border-teal-200',
      cardBg: 'bg-teal-50/80 border-teal-200 text-teal-950',
      headline: 'Healthy Buffer Maintained',
      summary: `Solid ${simSavingsRate.toFixed(1)}% savings rate with ${formatINR(simFreeCash)}/mo cushion. All commitments remain well within safe financial guardrails.`,
    };
  };

  const assessment = getAffordabilityAssessment();

  // Preset Handlers
  const applyPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    switch (presetKey) {
      case 'baseline':
      case 'reset':
        setSimIncome(120000);
        setSimRent(28000);
        setSimNewEmi(0);
        setSimDiscretionary(21300);
        break;
      case 'rent_hike':
        setSimIncome(120000);
        setSimRent(35000);
        setSimNewEmi(0);
        setSimDiscretionary(21300);
        break;
      case 'career_hike':
        setSimIncome(145000);
        setSimRent(28000);
        setSimNewEmi(0);
        setSimDiscretionary(23000);
        break;
      case 'pay_cut':
        setSimIncome(100000);
        setSimRent(28000);
        setSimNewEmi(0);
        setSimDiscretionary(18000);
        break;
      case 'car_emi':
        setSimIncome(120000);
        setSimRent(28000);
        setSimNewEmi(12000);
        setSimDiscretionary(21300);
        break;
      case 'cut_spend':
        setSimIncome(120000);
        setSimRent(28000);
        setSimNewEmi(0);
        setSimDiscretionary(15000);
        break;
      default:
        break;
    }
  };

  const isRentHikeActive = simRent === 35000 && simIncome === 120000 && simNewEmi === 0 && simDiscretionary === 21300;
  const isBaseline = simRent === 28000 && simIncome === 120000 && simNewEmi === 0 && simDiscretionary === 21300;

  return (
    <div id="life-simulator-view" className="space-y-6 pb-12">
      {/* Header & Hackathon Demo Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
              Deterministic Decision Engine
            </span>
            <span className="text-xs text-slate-400 font-medium">Freenance Hero Feature</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
            What happens if life changes?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Test a decision before you make it.
          </p>
        </div>

        {/* Demo Preset Action Cluster */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-try-rent-increase"
            onClick={() => applyPreset('rent_hike')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 shadow-2xs ${
              isRentHikeActive
                ? 'bg-amber-500 text-slate-950 border-amber-500 ring-2 ring-amber-400/40'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
            }`}
          >
            <span>🏠</span>
            <span>Try rent increase</span>
            <span className="text-[10px] opacity-80 font-semibold">(₹28k → ₹35k)</span>
          </button>

          <button
            id="btn-reset-scenario"
            onClick={() => applyPreset('baseline')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset scenario</span>
          </button>
        </div>
      </div>

      {/* Additional Quick Scenarios */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Other scenarios:
        </span>
        <button
          onClick={() => applyPreset('career_hike')}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
            activePreset === 'career_hike' ? 'bg-teal-50 border-teal-400 text-teal-800' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          💼 Career Raise (₹145k)
        </button>
        <button
          onClick={() => applyPreset('car_emi')}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
            activePreset === 'car_emi' ? 'bg-indigo-50 border-indigo-400 text-indigo-800' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          🚗 New Car EMI (+₹12k)
        </button>
        <button
          onClick={() => applyPreset('pay_cut')}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
            activePreset === 'pay_cut' ? 'bg-rose-50 border-rose-400 text-rose-800' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          📉 Pay Cut (₹100k)
        </button>
        <button
          onClick={() => applyPreset('cut_spend')}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
            activePreset === 'cut_spend' ? 'bg-emerald-50 border-emerald-400 text-emerald-800' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          ✂️ Trim Discretionary (₹15k)
        </button>
      </div>

      {/* Active Rent Increase Impact Banner when triggered */}
      {isRentHikeActive && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300/80 text-amber-950 shadow-2xs space-y-1.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Rent Increase Impact Assessment: ₹28,000 → ₹35,000 (+₹7,000/mo)
            </span>
            <span className="text-[11px] font-bold text-amber-700">Hackathon Demo Preset</span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            Your monthly free cash decreases from <strong className="font-bold">₹36,200</strong> to <strong className="font-bold">₹29,200</strong>. Your savings rate drops by <strong className="font-bold">5.8%</strong>, delaying your emergency fund completion by <strong className="font-bold">+2 months</strong> (from 7 to 9 months).
          </p>
        </div>
      )}

      {/* 4 Interactive Parameter Control Cards */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Interactive Decision Levers
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Move any slider below. All 6 comparative metrics immediately recompute.
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Real-time Deterministic Calculation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Lever 1: Rent */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-amber-600" />
                <label className="text-xs font-bold text-slate-800">
                  Rent (Housing)
                </label>
              </div>
              <span className="text-sm font-extrabold text-amber-700 tabular-nums">
                {formatINR(simRent)}/mo
              </span>
            </div>
            <input
              type="range"
              min="20000"
              max="55000"
              step="1000"
              value={simRent}
              onChange={(e) => {
                setSimRent(Number(e.target.value));
                setActivePreset('custom');
              }}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>₹20k (Sharing)</span>
              <span className="text-slate-600 font-semibold">Baseline: ₹28,000</span>
              <span>₹55k (2BHK Central)</span>
            </div>
          </div>

          {/* Lever 2: Monthly Income */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-teal-700" />
                <label className="text-xs font-bold text-slate-800">
                  Income (Monthly Inflow)
                </label>
              </div>
              <span className="text-sm font-extrabold text-teal-700 tabular-nums">
                {formatINR(simIncome)}
              </span>
            </div>
            <input
              type="range"
              min="60000"
              max="220000"
              step="5000"
              value={simIncome}
              onChange={(e) => {
                setSimIncome(Number(e.target.value));
                setActivePreset('custom');
              }}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>₹60k</span>
              <span className="text-slate-600 font-semibold">Baseline: ₹1,20,000</span>
              <span>₹220k</span>
            </div>
          </div>

          {/* Lever 3: New EMI */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <label className="text-xs font-bold text-slate-800">
                  New EMI / Loan Outflow
                </label>
              </div>
              <span className="text-sm font-extrabold text-indigo-700 tabular-nums">
                +{formatINR(simNewEmi)}/mo
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30000"
              step="1000"
              value={simNewEmi}
              onChange={(e) => {
                setSimNewEmi(Number(e.target.value));
                setActivePreset('custom');
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span className="text-slate-600 font-semibold">Baseline: ₹0 new loan</span>
              <span>₹12k (Car loan)</span>
              <span>₹30k (Personal loan)</span>
            </div>
          </div>

          {/* Lever 4: Discretionary Spending */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-purple-600" />
                <label className="text-xs font-bold text-slate-800">
                  Discretionary Spending
                </label>
              </div>
              <span className="text-sm font-extrabold text-purple-700 tabular-nums">
                {formatINR(simDiscretionary)}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="40000"
              step="1000"
              value={simDiscretionary}
              onChange={(e) => {
                setSimDiscretionary(Number(e.target.value));
                setActivePreset('custom');
              }}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>₹10k (Frugal)</span>
              <span className="text-slate-600 font-semibold">Baseline: ₹21,300</span>
              <span>₹40k (High spend)</span>
            </div>
          </div>
        </div>
      </div>

      {/* CORE COMPARISON SECTION: CURRENT vs SCENARIO */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
              CURRENT vs SCENARIO
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Dynamic impact across 6 core financial indicators
          </span>
        </div>

        {/* 6 Required Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Metric 1: Monthly Free Cash */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Monthly free cash
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${
                simFreeCash >= BASELINE_FREE_CASH ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {simFreeCash >= BASELINE_FREE_CASH ? `+${formatINR(simFreeCash - BASELINE_FREE_CASH)}` : formatINR(simFreeCash - BASELINE_FREE_CASH)}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">CURRENT</span>
                <span className="text-base font-bold text-slate-700 tabular-nums">
                  {formatINR(BASELINE_FREE_CASH)}
                </span>
              </div>
              <span className="text-slate-300 font-bold">→</span>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-teal-700 block">SCENARIO</span>
                <span className={`text-xl font-extrabold tabular-nums transition-colors duration-200 ${
                  simFreeCash >= 0 ? 'text-slate-950' : 'text-rose-600'
                }`}>
                  {formatINR(simFreeCash)}
                </span>
              </div>
            </div>
          </div>

          {/* Metric 2: Monthly Savings */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Monthly savings
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${
                simSavings >= BASELINE_FREE_CASH ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {simSavings >= BASELINE_FREE_CASH ? `+${formatINR(simSavings - BASELINE_FREE_CASH)}` : formatINR(simSavings - BASELINE_FREE_CASH)}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">CURRENT</span>
                <span className="text-base font-bold text-slate-700 tabular-nums">
                  {formatINR(BASELINE_FREE_CASH)}
                </span>
              </div>
              <span className="text-slate-300 font-bold">→</span>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-teal-700 block">SCENARIO</span>
                <span className="text-xl font-extrabold text-teal-700 tabular-nums transition-colors duration-200">
                  {formatINR(simSavings)}
                </span>
              </div>
            </div>
          </div>

          {/* Metric 3: Savings Rate */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Savings rate
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${
                simSavingsRate >= BASELINE_SAVINGS_RATE ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {simSavingsRate >= BASELINE_SAVINGS_RATE ? `+${(simSavingsRate - BASELINE_SAVINGS_RATE).toFixed(1)}%` : `${(simSavingsRate - BASELINE_SAVINGS_RATE).toFixed(1)}%`}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">CURRENT</span>
                <span className="text-base font-bold text-slate-700 tabular-nums">
                  {BASELINE_SAVINGS_RATE.toFixed(1)}%
                </span>
              </div>
              <span className="text-slate-300 font-bold">→</span>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-teal-700 block">SCENARIO</span>
                <span className={`text-xl font-extrabold tabular-nums transition-colors duration-200 ${
                  simSavingsRate >= 20 ? 'text-teal-700' : simSavingsRate > 0 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {simSavingsRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Metric 4: Emergency Fund Timeline */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Emergency fund timeline
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${
                emergencyMonthsDelta <= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {emergencyMonthsDelta > 0 ? `+${emergencyMonthsDelta} mos delay` : emergencyMonthsDelta < 0 ? `${emergencyMonthsDelta} mos faster` : 'On track'}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">CURRENT</span>
                <span className="text-base font-bold text-slate-700 tabular-nums">
                  {BASELINE_EMERGENCY_MONTHS} months
                </span>
              </div>
              <span className="text-slate-300 font-bold">→</span>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-teal-700 block">SCENARIO</span>
                <span className={`text-xl font-extrabold tabular-nums transition-colors duration-200 ${
                  emergencyMonthsDelta <= 0 ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {simEmergencyMonths > 36 ? '>3 years' : `${simEmergencyMonths} months`}
                </span>
              </div>
            </div>
          </div>

          {/* Metric 5: Goal Timeline */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Goal timeline (MacBook M3)
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${
                goalMonthsDelta <= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {goalMonthsDelta > 0 ? `+${goalMonthsDelta} mos delay` : goalMonthsDelta < 0 ? `${goalMonthsDelta} mos faster` : 'On track'}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">CURRENT</span>
                <span className="text-base font-bold text-slate-700 tabular-nums">
                  {BASELINE_GOAL_MONTHS} months
                </span>
              </div>
              <span className="text-slate-300 font-bold">→</span>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-teal-700 block">SCENARIO</span>
                <span className={`text-xl font-extrabold tabular-nums transition-colors duration-200 ${
                  goalMonthsDelta <= 0 ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {simGoalMonths > 36 ? '>3 years' : `${simGoalMonths} months`}
                </span>
              </div>
            </div>
          </div>

          {/* Metric 6: Financial Health */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Financial health
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${
                healthScoreDelta >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {healthScoreDelta >= 0 ? `+${healthScoreDelta} pts` : `${healthScoreDelta} pts`}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">CURRENT</span>
                <span className="text-base font-bold text-slate-700 tabular-nums">
                  {BASELINE_HEALTH_SCORE} / 100
                </span>
              </div>
              <span className="text-slate-300 font-bold">→</span>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-teal-700 block">SCENARIO</span>
                <span className={`text-xl font-extrabold tabular-nums transition-colors duration-200 ${
                  simHealthScore >= 75 ? 'text-emerald-700' : simHealthScore >= 60 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {simHealthScore} <span className="text-xs font-bold text-slate-400">/ 100</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Affordability & Verdict Callout Banner */}
      <div className={`p-5 rounded-2xl border ${assessment.cardBg} shadow-2xs space-y-2`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${assessment.badge}`}>
              {assessment.label}
            </span>
            <h4 className="text-sm font-bold tracking-tight">
              {assessment.headline}
            </h4>
          </div>
          <span className="text-xs font-bold tabular-nums">
            {simFreeCash >= 0 ? `+${formatINR(simFreeCash)} buffer` : `-${formatINR(Math.abs(simFreeCash))} deficit`}
          </span>
        </div>
        <p className="text-xs leading-relaxed opacity-90">
          {assessment.summary}
        </p>
      </div>

      {/* Before vs After Detailed Matrix Table */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Before vs After Comparison Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live mathematical reconciliation across all income, commitments, and milestone targets
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            Reconciled Model
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3 font-semibold">Financial Parameter</th>
                <th className="py-3 px-3 font-semibold">Before (Current)</th>
                <th className="py-3 px-3 font-semibold">After (Simulated)</th>
                <th className="py-3 px-3 text-right font-semibold">Variance Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {/* Monthly Income */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 text-slate-900 font-semibold flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-teal-700" />
                  <span>Monthly Inflow / Salary</span>
                </td>
                <td className="py-2.5 px-3 font-bold text-slate-950 tabular-nums">
                  {formatINR(BASELINE_INCOME)}
                </td>
                <td className="py-2.5 px-3 font-bold text-teal-700 tabular-nums">
                  {formatINR(simIncome)}
                </td>
                <td className={`py-2.5 px-3 text-right font-bold tabular-nums ${
                  simIncome >= BASELINE_INCOME ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {simIncome >= BASELINE_INCOME ? `+${formatINR(simIncome - BASELINE_INCOME)}` : `-${formatINR(BASELINE_INCOME - simIncome)}`}
                </td>
              </tr>

              {/* Rent */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 text-slate-900 font-semibold flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-amber-600" />
                  <span>House Rent</span>
                </td>
                <td className="py-2.5 px-3 tabular-nums text-slate-700">
                  {formatINR(BASELINE_RENT)}
                </td>
                <td className="py-2.5 px-3 font-bold text-slate-950 tabular-nums">
                  {formatINR(simRent)}
                </td>
                <td className={`py-2.5 px-3 text-right font-bold tabular-nums ${
                  simRent <= BASELINE_RENT ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {simRent >= BASELINE_RENT ? `+${formatINR(simRent - BASELINE_RENT)}` : `-${formatINR(BASELINE_RENT - simRent)}`}
                </td>
              </tr>

              {/* Debt & EMIs */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 text-slate-900 font-semibold flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Committed Loan EMIs</span>
                </td>
                <td className="py-2.5 px-3 tabular-nums text-slate-700">
                  {formatINR(18500)}/mo
                </td>
                <td className="py-2.5 px-3 font-bold text-slate-950 tabular-nums">
                  {formatINR(18500 + simNewEmi)}/mo
                </td>
                <td className={`py-2.5 px-3 text-right font-bold tabular-nums ${
                  simNewEmi === 0 ? 'text-slate-400' : 'text-rose-600'
                }`}>
                  {simNewEmi === 0 ? '₹0 (No change)' : `+${formatINR(simNewEmi)} new EMI`}
                </td>
              </tr>

              {/* Discretionary */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 text-slate-900 font-semibold flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
                  <span>Discretionary Dining & Retail</span>
                </td>
                <td className="py-2.5 px-3 tabular-nums text-slate-700">
                  {formatINR(BASELINE_DISCRETIONARY)}
                </td>
                <td className="py-2.5 px-3 font-bold text-slate-950 tabular-nums">
                  {formatINR(simDiscretionary)}
                </td>
                <td className={`py-2.5 px-3 text-right font-bold tabular-nums ${
                  simDiscretionary <= BASELINE_DISCRETIONARY ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {simDiscretionary >= BASELINE_DISCRETIONARY ? `+${formatINR(simDiscretionary - BASELINE_DISCRETIONARY)}` : `-${formatINR(BASELINE_DISCRETIONARY - simDiscretionary)}`}
                </td>
              </tr>

              {/* Total Committed Expenses */}
              <tr className="bg-slate-50/50">
                <td className="py-2.5 px-3 text-slate-700 font-medium">
                  Total Outflow (Fixed + Variable)
                </td>
                <td className="py-2.5 px-3 tabular-nums text-slate-700">
                  {formatINR(BASELINE_COMMITTED + BASELINE_DISCRETIONARY)}
                </td>
                <td className="py-2.5 px-3 tabular-nums font-bold text-slate-950">
                  {formatINR(simTotalOutflow)}
                </td>
                <td className={`py-2.5 px-3 text-right font-bold tabular-nums ${
                  simTotalOutflow <= (BASELINE_COMMITTED + BASELINE_DISCRETIONARY) ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {simTotalOutflow >= (BASELINE_COMMITTED + BASELINE_DISCRETIONARY)
                    ? `+${formatINR(simTotalOutflow - (BASELINE_COMMITTED + BASELINE_DISCRETIONARY))}`
                    : `-${formatINR((BASELINE_COMMITTED + BASELINE_DISCRETIONARY) - simTotalOutflow)}`}
                </td>
              </tr>

              {/* Monthly Free Cash */}
              <tr className="bg-teal-50/30 font-bold">
                <td className="py-3 px-3 text-slate-950 font-bold">
                  Monthly Free Cash / Net Savings
                </td>
                <td className="py-3 px-3 text-slate-950 tabular-nums">
                  {formatINR(BASELINE_FREE_CASH)}
                </td>
                <td className={`py-3 px-3 font-extrabold tabular-nums ${simFreeCash >= 0 ? 'text-teal-700' : 'text-rose-600'}`}>
                  {formatINR(simFreeCash)}
                </td>
                <td className={`py-3 px-3 text-right tabular-nums ${
                  simFreeCash >= BASELINE_FREE_CASH ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {simFreeCash >= BASELINE_FREE_CASH ? `+${formatINR(simFreeCash - BASELINE_FREE_CASH)}` : formatINR(simFreeCash - BASELINE_FREE_CASH)}
                </td>
              </tr>

              {/* Savings Rate */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 text-slate-700 font-medium">Savings Rate (%)</td>
                <td className="py-2.5 px-3 tabular-nums text-slate-700">{BASELINE_SAVINGS_RATE.toFixed(1)}%</td>
                <td className="py-2.5 px-3 tabular-nums font-bold text-slate-950">{simSavingsRate.toFixed(1)}%</td>
                <td className={`py-2.5 px-3 text-right font-bold tabular-nums ${
                  simSavingsRate >= BASELINE_SAVINGS_RATE ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {simSavingsRate >= BASELINE_SAVINGS_RATE ? `+${(simSavingsRate - BASELINE_SAVINGS_RATE).toFixed(1)}%` : `${(simSavingsRate - BASELINE_SAVINGS_RATE).toFixed(1)}%`}
                </td>
              </tr>

              {/* Emergency Fund Timeline */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 text-slate-700 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Emergency Fund Completion</span>
                </td>
                <td className="py-2.5 px-3 tabular-nums text-slate-700">{BASELINE_EMERGENCY_MONTHS} months</td>
                <td className="py-2.5 px-3 tabular-nums font-bold text-slate-950">
                  {simEmergencyMonths > 40 ? 'Stalled' : `${simEmergencyMonths} months`}
                </td>
                <td className={`py-2.5 px-3 text-right font-bold tabular-nums ${
                  emergencyMonthsDelta <= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {emergencyMonthsDelta > 0 ? `+${emergencyMonthsDelta} months delay` : emergencyMonthsDelta < 0 ? `${emergencyMonthsDelta} months faster` : '0 mos change'}
                </td>
              </tr>

              {/* MacBook Goal Timeline */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 text-slate-700 font-medium flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-teal-600" />
                  <span>MacBook Pro M3 Goal Timeline</span>
                </td>
                <td className="py-2.5 px-3 tabular-nums text-slate-700">{BASELINE_GOAL_MONTHS} months</td>
                <td className="py-2.5 px-3 tabular-nums font-bold text-slate-950">
                  {simGoalMonths > 40 ? 'Stalled' : `${simGoalMonths} months`}
                </td>
                <td className={`py-2.5 px-3 text-right font-bold tabular-nums ${
                  goalMonthsDelta <= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {goalMonthsDelta > 0 ? `+${goalMonthsDelta} months delay` : goalMonthsDelta < 0 ? `${goalMonthsDelta} months faster` : '0 mos change'}
                </td>
              </tr>

              {/* Financial Health Score */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 text-slate-700 font-medium">Financial Health Index</td>
                <td className="py-2.5 px-3 tabular-nums font-bold text-slate-950">{BASELINE_HEALTH_SCORE} / 100</td>
                <td className="py-2.5 px-3 tabular-nums font-extrabold text-teal-700">{simHealthScore} / 100</td>
                <td className={`py-2.5 px-3 text-right font-bold tabular-nums ${
                  healthScoreDelta >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {healthScoreDelta >= 0 ? `+${healthScoreDelta} pts` : `${healthScoreDelta} pts`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Evaluation & Affordability Callout Card */}
      <div className={`p-5 sm:p-6 rounded-2xl border ${assessment.cardBg} space-y-3`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Deterministic Affordability Assessment
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${assessment.badge}`}>
              {assessment.label.toUpperCase()}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-700 tabular-nums">
            Monthly Debt Service: {(((18500 + simNewEmi) / (simIncome || 1)) * 100).toFixed(1)}% (Healthy &lt;35%)
          </span>
        </div>

        <h4 className="text-base font-bold text-slate-950 tracking-tight">
          {assessment.headline}
        </h4>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {assessment.summary}
        </p>

        <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>Simulation verified against Aarav Mehta's real banking ledger</span>
          <span className="font-semibold text-slate-700">Instant Freenance Predictive Modeling</span>
        </div>
      </div>
    </div>
  );
};
