import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Info,
  ShieldCheck
} from 'lucide-react';
import { CashFlowChart } from '../components/CashFlowChart';
import { formatINR } from '../utils/formatters';

export const CashFlowView: React.FC = () => {
  const [showWarningDemo, setShowWarningDemo] = useState(false);

  const cashFlowItems = [
    { label: 'Current Liquid Balance', amount: 48000, type: 'balance', date: 'Available Today', note: 'HDFC Savings & Liquid Fund' },
    { label: 'Expected Salary', amount: 120000, type: 'inflow', date: '08 Sep (Credited)', note: 'TechCorp India Monthly Net' },
    { label: 'House Rent', amount: -28000, type: 'outflow', date: '01 Sep (Paid)', note: 'Prestige Lakeside 2BHK' },
    { label: 'Committed Loan EMIs', amount: -18500, type: 'outflow', date: '05 Sep (Cleared)', note: 'ICICI Personal + HDFC Bike + SBI' },
    { label: 'Health & Term Insurance', amount: -6000, type: 'outflow', date: '10 Sep (Cleared)', note: 'HDFC Ergo Annualized Premium' },
    { label: 'Broadband & Power Utilities', amount: -5300, type: 'outflow', date: '12 Sep (Cleared)', note: 'BESCOM + ACT Fibernet' },
    { label: 'Discretionary Dining & Retail', amount: -21300, type: 'outflow', date: 'Spread across month', note: 'Projected lifestyle burn' },
  ];

  const projectedMonthEnd = 88900;

  return (
    <div id="cash-flow-view" className="space-y-6 pb-12">
      {/* Top Reconciled Math Strip */}
      <div className="p-3.5 sm:px-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium">
          <span className="inline-flex items-center gap-1.5">
            <span className="text-slate-500">Opening Balance:</span>
            <strong className="text-slate-950 font-bold tabular-nums">₹48,000</strong>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">Actual</span>
          </span>
          <span className="text-slate-300 font-bold">+</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-slate-500">Salary:</span>
            <strong className="text-teal-700 font-bold tabular-nums">+₹1,20,000</strong>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">Actual</span>
          </span>
          <span className="text-slate-300 font-bold">−</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-slate-500">Total Debits:</span>
            <strong className="text-slate-950 font-bold tabular-nums">₹79,100</strong>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">Estimated</span>
          </span>
          <span className="text-slate-300 font-bold">=</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-slate-500">Projected Month-End:</span>
            <strong className="text-emerald-800 font-extrabold tabular-nums">₹88,900</strong>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-100 text-teal-800">Projected</span>
          </span>
        </div>
        <div className="text-[10px] text-slate-400 font-medium">
          Demo data for illustration only.
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Opening Balance</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">Actual</span>
          </div>
          <span className="text-2xl sm:text-[26px] font-extrabold text-slate-950 block tabular-nums">₹48,000</span>
          <span className="text-[11px] text-slate-400 font-medium block">HDFC Savings & Liquid Buffer</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Monthly Inflow</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">Actual</span>
          </div>
          <span className="text-2xl sm:text-[26px] font-extrabold text-teal-700 block tabular-nums">+₹1,20,000</span>
          <span className="text-[11px] text-teal-600 font-medium block">Net salary credited 08 Sep</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Projected Debits</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">Estimated</span>
          </div>
          <span className="text-2xl sm:text-[26px] font-extrabold text-slate-950 block tabular-nums">-₹79,100</span>
          <span className="text-[11px] text-slate-400 font-medium block">Rent, 4 EMIs, bills & living</span>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">Projected Month-End</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-200 text-teal-900">Projected</span>
          </div>
          <span className="text-2xl sm:text-[26px] font-extrabold text-emerald-800 block tabular-nums">
            ₹88,900
          </span>
          <span className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Healthy positive cash buffer
          </span>
        </div>
      </div>

      {/* Main Trajectory Chart */}
      <CashFlowChart simulationPace={showWarningDemo ? 'elevated' : 'standard'} />

      {/* Warning State Toggle Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className={`w-4 h-4 ${showWarningDemo ? 'text-amber-600' : 'text-slate-400'}`} />
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              Shortfall Warning Simulation Mode
            </span>
            <p className="text-[11px] text-slate-500">
              {showWarningDemo 
                ? 'Showing: Potential balance dip below ₹15,000 threshold on 24 Sep'
                : 'Showing: Standard baseline trajectory with safety buffer intact'
              }
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowWarningDemo(!showWarningDemo)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            showWarningDemo
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {showWarningDemo ? 'Reset to Healthy Baseline' : 'Simulate Cash Shortfall Alert'}
        </button>
      </div>

      {/* Interactive Warning Alert Banner if active */}
      {showWarningDemo && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <h4 className="text-sm font-bold text-rose-950">Potential Shortfall Detected</h4>
          </div>
          <p className="text-xs text-rose-900 leading-relaxed">
            "Based on your upcoming committed expenses, your balance may fall below ₹15,000 around 24 Sep if discretionary spending accelerates past ₹1,200/day."
          </p>
          <div className="text-[11px] text-rose-800 font-medium pt-1 border-t border-rose-200/60 flex items-center gap-2">
            <span>Recommended Mitigation:</span>
            <span className="font-bold underline cursor-pointer">Postpone discretionary electronics order until 01 Oct</span>
          </div>
        </div>
      )}

      {/* Itemized Cash Flow Schedule */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Inflows & Committed Outflow Ledger</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Deterministic monthly balance reconciliation for September 2026
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-lg">
            Reconciled
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {cashFlowItems.map((item, index) => {
            const isBalance = item.type === 'balance';
            const isInflow = item.type === 'inflow';

            return (
              <div
                key={index}
                className="py-3.5 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/70 transition-colors px-2 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isBalance
                        ? 'bg-blue-100 text-blue-800'
                        : isInflow
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isBalance ? '•' : isInflow ? '+' : '-'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{item.label}</span>
                    <span className="text-[11px] text-slate-400">
                      {item.note} • <span className="font-medium text-slate-600">{item.date}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`font-extrabold text-sm block tabular-nums ${
                      isBalance
                        ? 'text-slate-900'
                        : isInflow
                        ? 'text-emerald-700'
                        : 'text-slate-900'
                    }`}
                  >
                    {isBalance
                      ? formatINR(item.amount)
                      : isInflow
                      ? `+${formatINR(item.amount)}`
                      : `-${formatINR(Math.abs(item.amount))}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-900">
          <span>Reconciled Projected Balance (End of Month):</span>
          <span className="text-base text-emerald-700 font-extrabold tabular-nums">{formatINR(projectedMonthEnd)}</span>
        </div>
      </div>
    </div>
  );
};
