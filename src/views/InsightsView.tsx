import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Tv, 
  Utensils, 
  ShieldCheck, 
  CreditCard, 
  Info,
  TrendingUp,
  Percent
} from 'lucide-react';
import { ActionableInsight, ScreenType } from '../types';
import { INITIAL_INSIGHTS } from '../data/mockData';
import { formatINR } from '../utils/formatters';

interface InsightsViewProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenExplainModal: () => void;
  onOpenUnusedSubModal: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  onNavigate,
  onOpenExplainModal,
  onOpenUnusedSubModal,
}) => {
  const [insights, setInsights] = useState<ActionableInsight[]>(INITIAL_INSIGHTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAction = (insight: ActionableInsight) => {
    if (insight.id === 'insight-1') {
      onOpenUnusedSubModal();
    } else if (insight.id === 'insight-2') {
      onNavigate('transactions');
    } else if (insight.id === 'insight-3') {
      // Mark applied
      setInsights((prev) =>
        prev.map((i) => (i.id === insight.id ? { ...i, applied: true } : i))
      );
      showToast('Applied +₹3,000/month to Emergency Fund SIP pacing!');
    } else if (insight.id === 'insight-4') {
      onNavigate('liabilities');
    }
  };

  const totalIdentifiedSavings = insights.reduce((acc, i) => acc + i.potentialMonthlySaving, 0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Subscription':
        return <Tv className="w-5 h-5 text-purple-600" />;
      case 'Food':
        return <Utensils className="w-5 h-5 text-amber-600" />;
      case 'Savings':
        return <ShieldCheck className="w-5 h-5 text-teal-600" />;
      case 'Liability':
        return <CreditCard className="w-5 h-5 text-rose-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div id="insights-view" className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Grounded AI Engine
            </span>
            <span className="text-xs text-slate-400 font-medium">Continuous Ledger Diagnostics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Actionable Intelligence
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Deterministic recommendations with transparent financial calculations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenExplainModal}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-teal-400" />
            <span>Why These Recommendations?</span>
          </button>
        </div>
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Prioritized Financial Opportunities ({insights.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured transparent intelligence: Problem, Impact, Underlying Numbers, and Action.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">
              Potential improvement: <strong className="text-emerald-700 tabular-nums">+{formatINR(totalIdentifiedSavings)}/mo</strong>
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="text-[11px] text-slate-400">
              Demo data for illustration only. Not financial advice.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {insights.map((insight, idx) => {
            // Precise Structured Data for each insight
            const structuredData = {
              'insight-2': {
                problem: 'Discretionary food delivery spending surged 31% above your 90-day baseline.',
                impact: '₹2,500 / month excess outgo • Annualized recovery: ₹30,000',
                why: '14 food delivery orders totaling ₹6,850 in September (Swiggy + Zomato) vs historical ₹4,350/mo average.',
                actionLabel: 'Review food expenses',
              },
              'insight-3': {
                problem: 'Emergency fund is at ₹1,18,000 toward ₹2,00,000 target (₹82,000 remaining).',
                impact: 'Accelerates target completion by 2 full months (5 mos instead of 7 mos).',
                why: 'Redirecting ₹3,000/mo from trimmed discretionary spend increases monthly SIP from ₹12,000 to ₹15,000.',
                actionLabel: 'Boost emergency SIP',
              },
              'insight-4': {
                problem: 'HDFC Regalia credit card revolving balance of ₹42,000 incurring 38% APR interest.',
                impact: '₹1,470 / month finance charge • Prevents ₹8,420 in compound interest over 6 months.',
                why: 'Carries highest APR in your liability portfolio (38% vs 11.5% personal loan and 9.2% auto loan).',
                actionLabel: 'Accelerate card payoff',
              },
            }[insight.id] || {
              problem: insight.reason,
              impact: insight.impactLabel,
              why: `Derived from verified transaction telemetry and monthly cash flow metrics.`,
              actionLabel: insight.ctaText,
            };

            return (
              <div
                key={insight.id}
                id={`insight-card-${insight.id}`}
                className={`p-5 sm:p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  insight.applied
                    ? 'bg-emerald-50/50 border-emerald-200 shadow-2xs'
                    : 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/70 flex items-center justify-center shrink-0">
                        {getCategoryIcon(insight.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Opportunity #{idx + 1}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {insight.category}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-950 leading-snug tracking-tight">
                          {insight.title}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-emerald-700 block tabular-nums">
                        +{formatINR(insight.potentialMonthlySaving)}/mo
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">potential saving</span>
                    </div>
                  </div>

                  {/* 4-Part Structured Breakdown: Problem, Impact, Why */}
                  <div className="space-y-2.5 text-xs">
                    {/* PROBLEM */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                        Problem Detected
                      </span>
                      <p className="text-slate-800 font-medium leading-relaxed">
                        {structuredData.problem}
                      </p>
                    </div>

                    {/* IMPACT */}
                    <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                        Financial Impact
                      </span>
                      <p className="text-emerald-950 font-bold leading-relaxed">
                        {structuredData.impact}
                      </p>
                    </div>

                    {/* WHY */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          Why: Underlying Numbers
                        </span>
                        <button
                          onClick={onOpenExplainModal}
                          className="text-teal-700 hover:text-teal-800 text-[10px] font-semibold underline cursor-pointer"
                        >
                          Math formula
                        </button>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        {structuredData.why}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ACTION Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400 font-medium">
                    {insight.applied ? 'Action completed' : 'Recommended action'}
                  </div>
                  {insight.applied ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/90 px-3.5 py-1.5 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Applied to Plan
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAction(insight)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-950 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <span>{structuredData.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grounding & Explainability Context Card */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 space-y-1">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <Info className="w-4 h-4 text-teal-600" />
          <span>Explainable Recommendation Promise</span>
        </div>
        <p className="leading-relaxed">
          Every recommendation is mathematically derived from Aarav's verified bank inflows, liabilities, and recurring UPI mandates. No generic rules of thumb or black-box predictions.
        </p>
      </div>
    </div>
  );
};
