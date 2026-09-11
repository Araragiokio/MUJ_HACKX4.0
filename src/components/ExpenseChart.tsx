import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertCircle, ArrowUpRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { EXPENSE_CATEGORIES, EXPENSE_INTELLIGENCE } from '../data/mockData';
import { formatINR } from '../utils/formatters';

interface ExpenseChartProps {
  onReviewSpending?: () => void;
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ onReviewSpending }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = EXPENSE_CATEGORIES.reduce((acc, curr) => acc + curr.amount, 0);

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-slate-700">
          <div className="font-semibold text-slate-100">{data.name}</div>
          <div className="text-emerald-400 font-bold mt-0.5">{formatINR(data.amount)}</div>
          <div className="text-slate-400 text-[10px] mt-0.5">
            {((data.amount / total) * 100).toFixed(1)}% of total monthly outgo
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      id="expense-intelligence-card"
      className="h-full bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-5 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Expense Intelligence</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated categorization of ₹{total.toLocaleString('en-IN')} monthly outgo
          </p>
        </div>
        <button
          id="btn-review-spending"
          onClick={onReviewSpending}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100/80 border border-teal-200/70 transition-colors"
        >
          <span>Review ledger</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main visual & breakdown grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1">
        {/* Donut Chart */}
        <div className="md:col-span-5 h-56 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={customTooltip} />
              <Pie
                data={EXPENSE_CATEGORIES}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={3}
                dataKey="amount"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {EXPENSE_CATEGORIES.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="white"
                    strokeWidth={activeIndex === index ? 3 : 1.5}
                    className="cursor-pointer transition-all duration-150"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {activeIndex !== null ? EXPENSE_CATEGORIES[activeIndex].name : 'Total Outgo'}
            </span>
            <span className="text-lg font-extrabold text-slate-950 tabular-nums">
              {activeIndex !== null 
                ? formatINR(EXPENSE_CATEGORIES[activeIndex].amount)
                : formatINR(total)
              }
            </span>
          </div>
        </div>

        {/* Categories Legend list */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EXPENSE_CATEGORIES.map((cat, idx) => (
            <div
              key={cat.name}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                activeIndex === idx 
                  ? 'bg-slate-100 border-slate-300 shadow-2xs' 
                  : 'bg-slate-50/70 border-slate-200/60 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-xs font-medium text-slate-750 truncate">{cat.name}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-slate-900 block tabular-nums">{formatINR(cat.amount)}</span>
                <span className="text-[10px] text-slate-400 font-medium tabular-nums">
                  {((cat.amount / total) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Structural Spend Composition Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-100">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Essential</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-base font-bold text-slate-950 tabular-nums">
            {formatINR(EXPENSE_INTELLIGENCE.essentialSpending)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Rent, utilities, groceries (46.5%)
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider">Discretionary</span>
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-base font-bold text-amber-950 tabular-nums">
            {formatINR(EXPENSE_INTELLIGENCE.discretionarySpending)}
          </div>
          <div className="text-[11px] text-amber-800 mt-0.5">
            Dining, shopping & lifestyle (+12%)
          </div>
        </div>

        <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/70">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-purple-900 uppercase tracking-wider">Subscriptions</span>
            <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-base font-bold text-purple-950 tabular-nums">
            {formatINR(EXPENSE_INTELLIGENCE.recurringSubscriptions)}
          </div>
          <div className="text-[11px] text-purple-800 mt-0.5">
            5 active digital subscriptions
          </div>
        </div>
      </div>

      {/* Discretionary Variance Alert */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-bold">{EXPENSE_INTELLIGENCE.insightText}</span>
          <p className="text-amber-800 mt-0.5 leading-relaxed">
            Trimming ₹3,200 from weekend delivery would shift your projected savings back above ₹39,000 without lifestyle strain.
          </p>
        </div>
      </div>
    </div>
  );
};
