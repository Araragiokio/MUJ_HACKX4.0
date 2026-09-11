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
  HelpCircle,
  Plus,
  Trash2,
  Check,
  PartyPopper,
  Sparkles,
  X
} from 'lucide-react';
import { Liability } from '../types';
import { formatINR } from '../utils/formatters';
import { AddLiabilityModal } from '../components/AddLiabilityModal';
import { Modal } from '../components/Modal';

interface LiabilitiesViewProps {
  liabilities: Liability[];
  onAddLiability?: (liability: Liability) => void;
  onRemoveLiability?: (id: string) => void;
}

export const LiabilitiesView: React.FC<LiabilitiesViewProps> = ({ 
  liabilities,
  onAddLiability,
  onRemoveLiability,
}) => {
  const [extraPayment, setExtraPayment] = useState<number>(5000);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [liabilityToDelete, setLiabilityToDelete] = useState<Liability | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Re-sort liabilities by APR descending (Debt Avalanche)
  const sortedLiabilities = [...liabilities].sort((a, b) => b.interestRate - a.interestRate);

  // Derived Summary Totals
  const totalOutstanding = sortedLiabilities.reduce((acc, l) => acc + l.outstandingAmount, 0);
  const totalMonthlyEmi = sortedLiabilities.reduce((acc, l) => acc + l.monthlyEmi, 0);
  const totalMonthlyInterest = sortedLiabilities.reduce((acc, l) => acc + l.estimatedMonthlyInterest, 0);

  // Top Avalanche Priority Liability (Highest APR)
  const topLiability = sortedLiabilities[0] || null;

  // Payoff accelerator metrics for top liability
  const baselineMonths = topLiability ? (topLiability.tenureRemainingMonths || 10) : 0;
  const acceleratedMonths = topLiability 
    ? Math.max(1, Math.ceil(topLiability.outstandingAmount / (topLiability.monthlyEmi + extraPayment)))
    : 0;
  const interestAvoided = topLiability
    ? Math.round(Math.max(0, baselineMonths - acceleratedMonths) * topLiability.estimatedMonthlyInterest * 0.85)
    : 0;

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

  const handleConfirmRemove = () => {
    if (!liabilityToDelete) return;
    const name = liabilityToDelete.name;
    if (onRemoveLiability) {
      onRemoveLiability(liabilityToDelete.id);
    }
    setToastMessage(`🎉 ${name} paid off! You're now debt-free on this account.`);
    setLiabilityToDelete(null);

    // Auto-dismiss toast after 4 seconds
    setTimeout(() => {
      setToastMessage((current) => (current?.includes(name) ? null : current));
    }, 4000);
  };

  return (
    <div id="liabilities-view" className="space-y-6 pb-12">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div 
          id="liability-toast"
          className="p-4 rounded-2xl bg-emerald-600 text-white shadow-md flex items-center justify-between animate-in fade-in slide-in-from-top-3 duration-300"
        >
          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 text-emerald-100 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Title & Add Liability Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Liabilities & Debt Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Avalanche debt prioritization to minimize interest leak
          </p>
        </div>

        <button
          id="btn-open-add-liability"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300/80 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-600" />
          <span>+ Add Liability</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Principal Outstanding</span>
          <span className="text-2xl sm:text-[26px] font-extrabold text-slate-950 mt-1 block tabular-nums">
            {formatINR(totalOutstanding)}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            {sortedLiabilities.length} active loan & card account{sortedLiabilities.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Monthly Debt Service</span>
          <span className="text-2xl sm:text-[26px] font-extrabold text-slate-950 mt-1 block tabular-nums">
            {formatINR(totalMonthlyEmi)}/mo
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            {totalMonthlyEmi > 0 ? 'Monthly committed EMI allocations' : 'No active EMI commitments'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Monthly Interest Burn</span>
          <span className="text-2xl sm:text-[26px] font-extrabold text-rose-600 mt-1 block tabular-nums">
            ~{formatINR(totalMonthlyInterest)}/mo
          </span>
          <span className="text-[11px] text-rose-700 font-medium">
            {topLiability ? `~${formatINR(topLiability.estimatedMonthlyInterest)} from ${topLiability.name}` : 'Zero interest burn'}
          </span>
        </div>
      </div>

      {/* AI HERO RECOMMENDATION: Avalanche Strategy Card */}
      {topLiability ? (
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
                Prioritize the {topLiability.name} balance first.
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your {topLiability.name} balance ({topLiability.institution}) carries an effective {topLiability.interestRate}% APR. Diverting surplus cash here yields a risk-free {topLiability.interestRate}% guaranteed return on capital.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left md:text-right shrink-0 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                Estimated Monthly Interest
              </span>
              <span className="text-2xl font-extrabold text-rose-400 block tabular-nums">
                ~{formatINR(topLiability.estimatedMonthlyInterest)} / mo
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold block">
                Potential avoided: ~{formatINR(interestAvoided > 0 ? interestAvoided : 5000)} over timeline
              </span>
            </div>
          </div>

          {/* Interactive Payoff Accelerator Slider */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Test extra monthly prepayment towards {topLiability.name}:</span>
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
      ) : (
        <div className="p-6 rounded-2xl bg-emerald-950 text-white border border-emerald-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                Debt Free Status
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white">You're completely debt-free! 🎉</h3>
            <p className="text-xs text-emerald-200/90 leading-relaxed max-w-lg">
              No active credit card balances or loan commitments. All your disposable cash flow is available to allocate towards savings and financial goals.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-sm shrink-0 cursor-pointer"
          >
            + Add New Loan/Card
          </button>
        </div>
      )}

      {/* Ranked Repayment Order Section */}
      {sortedLiabilities.length > 0 ? (
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
            {sortedLiabilities.map((liab, index) => {
              const priorityClass = getPriorityBadge(liab.priority);
              return (
                <div
                  key={liab.id}
                  id={`liability-row-${liab.id}`}
                  className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:bg-slate-100/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs group"
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

                  <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
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

                    {/* Mark as Paid Off Button */}
                    <button
                      id={`btn-remove-liability-${liab.id}`}
                      onClick={() => setLiabilityToDelete(liab)}
                      title="Mark as paid off"
                      aria-label={`Mark ${liab.name} as paid off`}
                      className="p-2 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200/80 transition-all cursor-pointer shrink-0"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
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
      ) : (
        /* Empty State */
        <div 
          id="liabilities-empty-state"
          className="bg-white rounded-2xl p-10 border border-slate-200/90 shadow-2xs text-center space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
            <PartyPopper className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-slate-900">You have no active liabilities</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              All debt balances have been marked as paid off. You can add a new loan or credit card balance anytime to monitor repayment order and interest burn.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Liability</span>
          </button>
        </div>
      )}

      {/* Add Liability Modal */}
      {onAddLiability && (
        <AddLiabilityModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddLiability={onAddLiability}
        />
      )}

      {/* Mark Complete / Remove Confirmation Dialog */}
      <Modal
        isOpen={liabilityToDelete !== null}
        onClose={() => setLiabilityToDelete(null)}
        title="Mark Liability as Paid Off"
        subtitle="Confirm debt payoff and update repayment schedule"
      >
        {liabilityToDelete && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
                <span>{liabilityToDelete.name}</span>
                <span className="text-emerald-700">{formatINR(liabilityToDelete.outstandingAmount)}</span>
              </div>
              <p className="text-slate-500">
                {liabilityToDelete.institution} • Monthly EMI: {formatINR(liabilityToDelete.monthlyEmi)} • {liabilityToDelete.interestLabel}
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to mark <strong className="text-slate-900">{liabilityToDelete.name}</strong> as fully paid off and remove it from your liabilities?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setLiabilityToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemove}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Check className="w-4 h-4" />
                <span>Mark as Paid Off 🎉</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
