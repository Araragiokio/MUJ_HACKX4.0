import React from 'react';
import { 
  Target, 
  Plus, 
  Calendar, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { FinancialGoal } from '../types';
import { formatINR } from '../utils/formatters';

interface GoalsViewProps {
  goals: FinancialGoal[];
  onOpenCreateGoal: () => void;
  onUpdateGoalContribution: (id: string, delta: number) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  onOpenCreateGoal,
  onUpdateGoalContribution,
}) => {
  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalMonthlyPace = goals.reduce((acc, g) => acc + g.monthlyContribution, 0);

  return (
    <div id="goals-view" className="space-y-6 pb-12">
      {/* Top Banner & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Financial Goals & Pacing
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated monthly allocations with real-time completion forecasting
          </p>
        </div>

        <button
          id="btn-open-create-goal"
          onClick={onOpenCreateGoal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm shadow-teal-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create goal</span>
        </button>
      </div>

      {/* Overview Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Target Across Goals</span>
          <span className="text-2xl sm:text-[26px] font-extrabold text-slate-950 mt-1 block tabular-nums">{formatINR(totalTarget)}</span>
          <span className="text-[11px] text-slate-400 font-medium">3 active milestone targets</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Accumulated Capital</span>
          <span className="text-2xl sm:text-[26px] font-extrabold text-teal-700 mt-1 block tabular-nums">{formatINR(totalSaved)}</span>
          <span className="text-[11px] text-teal-600 font-semibold tabular-nums">
            {((totalSaved / totalTarget) * 100).toFixed(0)}% overall funded
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Monthly Automated Commitment</span>
          <span className="text-2xl sm:text-[26px] font-extrabold text-slate-950 mt-1 block tabular-nums">{formatINR(totalMonthlyPace)}/mo</span>
          <span className="text-[11px] text-slate-400 font-medium">Direct debit SIP allocation</span>
        </div>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <div
              key={goal.id}
              id={`goal-card-${goal.id}`}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all group"
            >
              <div className="space-y-3.5">
                {/* Header & Tag */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200/70 uppercase tracking-wider">
                      {goal.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-950 mt-2 leading-snug tracking-tight">
                      {goal.title}
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-teal-700 font-bold shrink-0 group-hover:scale-105 transition-transform">
                    <Target className="w-4 h-4" />
                  </div>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-950 font-bold tabular-nums">{percent}% Funded</span>
                    <span className="text-slate-500 tabular-nums">{formatINR(goal.currentAmount)} of {formatINR(goal.targetAmount)}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 text-right tabular-nums">
                    Remaining: {formatINR(remaining)}
                  </div>
                </div>

                {/* Meta details */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-medium">Monthly Allocation:</span>
                    <span className="font-extrabold text-slate-950 tabular-nums">{formatINR(goal.monthlyContribution)}/mo</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-medium">Estimated Target:</span>
                    <span className="font-bold text-teal-700 tabular-nums">
                      {goal.estimatedMonths} months ({goal.targetDate})
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Acceleration Tool */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500 font-medium">Accelerate:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onUpdateGoalContribution(goal.id, 1000)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200/70 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Boost monthly contribution by ₹1,000"
                  >
                    <Zap className="w-3 h-3" />
                    <span>+₹1,000</span>
                  </button>
                  <button
                    onClick={() => onUpdateGoalContribution(goal.id, 2000)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200/70 transition-colors cursor-pointer"
                    title="Boost monthly contribution by ₹2,000"
                  >
                    <span>+₹2,000</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Fund Intelligence Note */}
      <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-teal-900 flex items-start gap-3.5 text-xs">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-teal-950 text-sm">Emergency Fund Milestone Notice:</span>
          <p className="mt-1 leading-relaxed text-teal-900">
            At ₹1,18,000, Aarav currently possesses 3.2 months of essential expense coverage (Rent + 4 EMIs + Groceries = ₹36,500/mo bare essentials). Reaching ₹2,00,000 unlocks full 6-month safety net status.
          </p>
        </div>
      </div>
    </div>
  );
};
