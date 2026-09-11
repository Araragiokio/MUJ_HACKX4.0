import React, { useState } from 'react';
import { 
  CreditCard, 
  AlertCircle, 
  TrendingDown, 
  ArrowRight, 
  ShieldAlert, 
  Zap, 
  Info,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { Liability } from '../types';
import { formatINR } from '../utils/formatters';

interface LiabilitiesViewProps {
  liabilities: Liability[];
}

export const LiabilitiesView: React.FC<LiabilitiesViewProps> = ({ liabilities }) => {
  const [extraPayment, setExtraPayment] = useState<number>(5000);

  const totalOutstanding = liabilities.reduce((acc, l) => acc + l.outstandingAmount, 0);
  const totalMonthlyEmi = liabilities.reduce((acc, l) => acc + l.monthlyEmi, 0);
  const totalMonthlyInterest = liabilities.reduce((acc, l) => acc + l.estimatedMonthlyInterest, 0);

  // Credit card payoff calculation
  const ccLiability = liabilities.find((l) => l.type === 'Credit Card') || liabilities[0];
  const baselineMonths = ccLiability.tenureRemainingMonths; // approx 10 months with minimum pay
  const acceleratedMonths = Math.max(1, Math.ceil(ccLiability.outstandingAmount / (ccLiability.monthlyEmi + extraPayment)));
  const interestAvoided = Math.round((baselineMonths - acceleratedMonths) * ccLiability.estimatedMonthlyInterest * 0.85);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-rose-50 text-rose-700 border-rose-200/80 font-bold';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200/80 font-semibold';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-semibold';
    }
  };

  return (
    <div id="liabilities-view" className="space-y-6 pb-12">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Principal Outstanding</span>
          <span className="text-2xl sm:text-[26px] font-extrabold text-slate-950 mt-1 block tabular-nums">{formatINR(totalOutstanding)}</span>
          <span className="text-[11px] text-slate-400 font-medium">4 active loan & card accounts</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Monthly Debt Service</span>
          <span className="text-2xl sm:text-[26px] font-extrabold text-slate-950 mt-1 block tabular-nums">{formatINR(totalMonthlyEmi)}/mo</span>
          <span className="text-[11px] text-slate-400 font-medium">21.5% of monthly salary (Healthy &lt;35%)</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Monthly Interest Burn</span>
          <span className="text-2xl sm:text-[26px] font-extrabold text-rose-600 mt-1 block tabular-nums">~{formatINR(totalMonthlyInterest)}/mo</span>
          <span className="text-[11px] text-rose-700 font-medium">₹1,470 from credit card alone</span>
        </div>
      </div>

      {/* AI HERO RECOMMENDATION: Prioritize Credit Card First */}
      <div 
        id="debt-avalanche-hero"
        className="p-5 sm:p-6 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-md space-y-5"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Avalanche Priority #1
              </span>
              <span className="text-xs text-slate-400 font-medium">Debt Optimization Strategy</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Prioritize the credit card balance first.
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your HDFC Regalia balance carries an effective 38% APR (~3.2% monthly finance fee). Diverting surplus cash here yields a risk-free 38% guaranteed return on capital.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left md:text-right shrink-0 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
              Estimated Monthly Interest
            </span>
            <span className="text-2xl font-extrabold text-rose-400 block tabular-nums">
              ~₹1,470 / mo
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold block">
              Potential avoided: ~₹8,420 over 6 mos
            </span>
          </div>
        </div>

        {/* Interactive Payoff Accelerator Slider */}
        <div className="pt-4 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Test extra monthly prepayment towards Credit Card:</span>
            <span className="font-bold text-white text-sm tabular-nums">+{formatINR(extraPayment)}/mo</span>
          </div>
          <input
            type="range"
            min="1000"
            max="15000"
            step="1000"
            value={extraPayment}
            onChange={(e) => setExtraPayment(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
          />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400 font-medium">
            <span>Debt-free in: <strong className="text-emerald-400 font-bold">{acceleratedMonths} months</strong> (vs {baselineMonths} mos baseline)</span>
            <span className="text-emerald-300 font-bold">Avoids ~{formatINR(interestAvoided)} in compounding fees</span>
          </div>
        </div>
      </div>

      {/* Ranked Repayment Order Table */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Ranked Repayment Order (Debt Avalanche)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mathematically optimized to minimize lifetime interest outgo
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            Highest APR First
          </span>
        </div>

        <div className="space-y-2.5">
          {[...liabilities]
            .sort((a, b) => b.interestRate - a.interestRate)
            .map((liab, index) => {
              const priorityClass = getPriorityBadge(liab.priority);
              return (
                <div
                  key={liab.id}
                  id={`liability-row-${liab.id}`}
                  className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:bg-slate-100/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0 shadow-2xs">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-950 text-sm">{liab.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] border ${priorityClass}`}>
                          {liab.priority} PRIORITY
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {liab.institution} • Monthly EMI: <span className="font-semibold text-slate-700">{formatINR(liab.monthlyEmi)}</span> • {liab.tenureRemainingMonths} mos left
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 block font-medium uppercase">Interest Rate</span>
                      <span className="font-extrabold text-slate-900 block tabular-nums">{liab.interestLabel}</span>
                    </div>

                    <div className="text-right min-w-28">
                      <span className="text-[10px] text-slate-400 block font-medium uppercase">Outstanding</span>
                      <span className="font-extrabold text-slate-950 text-sm block tabular-nums">
                        {formatINR(liab.outstandingAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Clear Disclaimer Mandate */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-500 text-[11px] leading-relaxed">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-700">Disclaimer:</strong> Demo estimate for illustration only. Not personalized financial advice. Individual credit card terms, compound billing cycles, and loan foreclosure charges vary per lender agreement.
          </p>
        </div>
      </div>
    </div>
  );
};
