import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowUpRight, 
  HelpCircle, 
  TrendingUp, 
  CreditCard, 
  Calendar, 
  Target, 
  SlidersHorizontal,
  Tv,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Zap,
  Wallet
} from 'lucide-react';
import { 
  UserProfile, 
  ScreenType, 
  Subscription, 
  FinancialGoal, 
  Liability 
} from '../types';
import { HEALTH_METRICS, INITIAL_SUBSCRIPTIONS } from '../data/mockData';
import { HealthScoreRing } from '../components/HealthScoreRing';
import { MetricCard } from '../components/MetricCard';
import { ExpenseChart } from '../components/ExpenseChart';
import { formatINR } from '../utils/formatters';

interface DashboardViewProps {
  user: UserProfile;
  subscriptions: Subscription[];
  goals: FinancialGoal[];
  liabilities: Liability[];
  onNavigate: (screen: ScreenType) => void;
  onOpenExplainModal: () => void;
  onReviewSubscription: (sub: Subscription) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  subscriptions,
  goals,
  liabilities,
  onNavigate,
  onOpenExplainModal,
  onReviewSubscription,
}) => {
  const [opportunityDismissed, setOpportunityDismissed] = useState(false);

  const totalRecurring = subscriptions.reduce((acc, sub) => acc + sub.cost, 0);

  return (
    <div id="dashboard-view" className="space-y-6 pb-12">
      {/* Header with Product Mission Statement */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
              Good morning, {user.name.split(' ')[0]}
            </h2>
            <span className="text-xl select-none" aria-hidden="true">👋</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Most budgeting apps tell you what happened. FinSight helps you understand what happens next.
          </p>
        </div>

        {/* Live Context & Salary Cycle Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Bengaluru</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-normal">TechCorp (₹1.2L Net)</span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200/70 text-xs font-medium text-slate-600">
            <span>Primary: HDFC •• 4912</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: WHAT IS HAPPENING WITH MY MONEY? */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              What is happening with my money?
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Reconciled September 2026 Cash Flow
          </span>
        </div>

        {/* Reconciled Accounting Formula Strip */}
        <div className="p-3 sm:px-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium">
            <span className="inline-flex items-center gap-1">
              <span className="text-slate-500">Income</span>
              <strong className="text-slate-950 font-bold tabular-nums">₹1,20,000</strong>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">Actual</span>
            </span>
            <span className="text-slate-300 font-bold">−</span>
            <span className="inline-flex items-center gap-1">
              <span className="text-slate-500">Committed</span>
              <strong className="text-slate-950 font-bold tabular-nums">₹62,500</strong>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">Actual</span>
            </span>
            <span className="text-slate-300 font-bold">−</span>
            <span className="inline-flex items-center gap-1">
              <span className="text-slate-500">Discretionary</span>
              <strong className="text-slate-950 font-bold tabular-nums">₹21,300</strong>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">Estimated</span>
            </span>
            <span className="text-slate-300 font-bold">=</span>
            <span className="inline-flex items-center gap-1">
              <span className="text-slate-500">Projected Savings</span>
              <strong className="text-teal-700 font-extrabold tabular-nums">₹36,200</strong>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-100 text-teal-800">Projected</span>
            </span>
          </div>
          <div className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
            30.2% Savings Rate
          </div>
        </div>

        {/* Top Summary Section: Financial Health Score + Metric Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Ring Score Card */}
          <div className="lg:col-span-6 flex">
            <div className="w-full">
              <HealthScoreRing
                score={HEALTH_METRICS.score}
                maxScore={HEALTH_METRICS.maxScore}
                label={HEALTH_METRICS.label}
                onExploreLiabilities={() => onNavigate('liabilities')}
              />
            </div>
          </div>

          {/* Core 4 Metric Cards Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <MetricCard
              id="metric-monthly-income"
              title="Income"
              amount={HEALTH_METRICS.monthlyIncome}
              subtitle="Credited on 08 Sep • Actual"
              icon={Wallet}
              variant="income"
              onClick={() => onNavigate('transactions')}
            />
            <MetricCard
              id="metric-committed-expenses"
              title="Committed expenses"
              amount={HEALTH_METRICS.committedExpenses}
              subtitle="Rent, 4 EMIs, Insurance • Actual"
              icon={CreditCard}
              variant="committed"
              onClick={() => onNavigate('cashflow')}
            />
            <MetricCard
              id="metric-discretionary-spending"
              title="Discretionary spending"
              amount={HEALTH_METRICS.discretionarySpending}
              subtitle="12% higher than average • Estimated"
              icon={TrendingUp}
              variant="discretionary"
              onClick={() => onNavigate('transactions')}
            />
            <MetricCard
              id="metric-projected-savings"
              title="Projected savings"
              amount={HEALTH_METRICS.projectedSavings}
              subtitle="30.2% savings rate • Projected"
              icon={Target}
              variant="savings"
              onClick={() => onNavigate('goals')}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: WHAT SHOULD I DO ABOUT IT? */}
      {!opportunityDismissed && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                What should I do about it?
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              Demo data for illustration only. Not financial advice.
            </span>
          </div>

          <div 
            id="ai-insight-hero-card"
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 shadow-sm border border-indigo-900/60"
          >
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Your biggest opportunity
                  </span>
                  <span className="text-xs text-indigo-300/80 font-medium">FinSight Deterministic Reasoning</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
                  You can increase your monthly savings by approximately ₹7,500 without changing your essential lifestyle.
                </h3>

                {/* "How?" breakdown pills */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-semibold text-indigo-200">Recommended Optimization Levers:</span>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    <button
                      onClick={() => onReviewSubscription(subscriptions[0])}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white/95 border border-white/10 transition-colors cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                      <span>₹649/mo unused Netflix</span>
                    </button>
                    <button
                      onClick={() => onNavigate('transactions')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white/95 border border-white/10 transition-colors cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>₹2,500/mo dining surge</span>
                    </button>
                    <button
                      onClick={() => onNavigate('liabilities')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white/95 border border-white/10 transition-colors cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                      <span>₹1,470/mo card interest</span>
                    </button>
                    <button
                      onClick={onOpenExplainModal}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white/95 border border-white/10 transition-colors cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                      <span>₹2,881/mo shopping trim</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* CTA action cluster */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3.5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/10">
                <div className="text-left lg:text-right">
                  <span className="text-[11px] uppercase tracking-wider text-indigo-300 font-semibold block">
                    Potential improvement:
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 block tracking-tight tabular-nums">
                    ₹7,500 / month
                  </span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    id="btn-why-opportunity"
                    onClick={onOpenExplainModal}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-300" />
                    <span>Why?</span>
                  </button>

                  <button
                    id="btn-see-recommendations"
                    onClick={() => onNavigate('insights')}
                    className="flex-1 sm:flex-initial px-4.5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>See recommendations</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two-Column Mid Section: Expense Intelligence & Recurring Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Expense Intelligence (Donut Chart) */}
        <div className="lg:col-span-7 flex flex-col">
          <ExpenseChart onReviewSpending={() => onNavigate('transactions')} />
        </div>

        {/* Right: Recurring Subscriptions Section */}
        <div className="lg:col-span-5 flex flex-col">
          <div 
            id="recurring-subscriptions-card"
            className="h-full bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Detected Subscriptions</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  5 auto-renewing digital mandates
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Total Recurring</span>
                <span className="text-sm font-extrabold text-purple-700 tabular-nums">
                  {formatINR(totalRecurring)}/mo
                </span>
              </div>
            </div>

            {/* Subscriptions List */}
            <div className="space-y-2.5 flex-1">
              {subscriptions.map((sub) => {
                const isUnused = sub.usageStatus === 'possibly_unused';
                return (
                  <div
                    key={sub.id}
                    id={`sub-row-${sub.id}`}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs ${
                      isUnused
                        ? 'bg-amber-50/80 border-amber-200/90'
                        : 'bg-slate-50/70 border-slate-200/70 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isUnused ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {sub.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 truncate">{sub.name}</span>
                          {isUnused && (
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-200/80 text-amber-900 border border-amber-300">
                              Possibly unused
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          <span className="font-semibold text-slate-700">{formatINR(sub.cost)}</span>/mo • {sub.category}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isUnused ? (
                        <button
                          id="btn-review-unused-sub"
                          onClick={() => onReviewSubscription(sub)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-2xs transition-colors flex items-center gap-1"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          <span>Review</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                All UPI mandates verified
              </span>
              <button
                onClick={() => onNavigate('transactions')}
                className="text-teal-700 hover:text-teal-800 font-semibold inline-flex items-center gap-0.5 transition-colors"
              >
                <span>View charges</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Feature Banners: Life Simulator & Goals Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        {/* Life Simulator Hero Banner */}
        <div 
          onClick={() => onNavigate('simulator')}
          className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white border border-teal-800/40 shadow-2xs cursor-pointer hover:border-teal-700/60 hover:shadow-xs transition-all group flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-400/20 text-teal-300 border border-teal-300/30">
                Decision Sandbox
              </span>
              <SlidersHorizontal className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
            </div>
            <h4 className="text-lg font-bold text-white tracking-tight leading-snug">
              Life Decision Simulator
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              "What happens if life changes? Test a job switch, rent hike, or new car EMI before committing."
            </p>
          </div>
          <div className="pt-4 mt-3 border-t border-teal-900/60 flex items-center justify-between text-xs font-semibold text-teal-300 group-hover:text-teal-200">
            <span>Simulate Job Switch & Hike</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Goals Progress Snapshot */}
        <div 
          onClick={() => onNavigate('goals')}
          className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs cursor-pointer hover:border-slate-300 hover:shadow-xs transition-all group flex flex-col justify-between"
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Active Financial Goals ({goals.length})
              </span>
              <Target className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
            </div>

            <div className="space-y-3">
              {goals.slice(0, 2).map((goal) => {
                const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                return (
                  <div key={goal.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">{goal.title}</span>
                      <span className="font-bold text-slate-700 tabular-nums">
                        {percent}% <span className="text-slate-400 font-normal">({goal.estimatedMonths} mos left)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-800">
            <span>Manage All Goals & SIP Boosts</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
