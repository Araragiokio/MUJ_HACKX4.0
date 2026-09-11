import React from 'react';
import { Modal } from './Modal';
import { Calculator, Sparkles, TrendingUp, CheckCircle, Info } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface ExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: () => void;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const lineItems = [
    {
      source: 'Unused Subscription Pruning',
      detail: 'Cancel dormant Netflix account (0 streams in 45 days)',
      amount: 649,
      impact: 'Immediate liquid recovery',
      tag: 'Subscription',
    },
    {
      source: 'Food Delivery Optimization',
      detail: 'Switch 3 weekend late-night surge orders to batch pantry cooking',
      amount: 2500,
      impact: 'Recovers 31% delivery surcharge',
      tag: 'Discretionary',
    },
    {
      source: 'Credit-Card Interest Mitigation',
      detail: 'Clear HDFC Regalia ₹42k balance via liquid buffer to halt 38% APR',
      amount: 1470,
      impact: 'Eliminates recurring finance charge',
      tag: 'Debt Leak',
    },
    {
      source: 'Discretionary Shopping Cap',
      detail: 'Normalize impulsive e-commerce spend to your 90-day baseline',
      amount: 2881,
      impact: 'Non-lifestyle affecting trim',
      tag: 'Shopping',
    },
  ];

  const totalMonthlyImprovement = lineItems.reduce((acc, item) => acc + item.amount, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="How We Calculated +₹7,500 / month"
      subtitle="Explainable Financial Health Optimization"
    >
      <div className="space-y-5">
        <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/70 border border-teal-200/70 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold shadow-2xs">
              <Sparkles className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <span className="text-xs font-semibold text-teal-900 block">Identified Monthly Surplus</span>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-950 tabular-nums">
                +{formatINR(totalMonthlyImprovement)} / mo
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Annualized</span>
            <span className="text-xs sm:text-sm font-extrabold text-teal-800 tabular-nums">
              +{formatINR(totalMonthlyImprovement * 12)} / yr
            </span>
          </div>
        </div>

        {/* Itemized calculation breakdown */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Deterministic Formula Components
          </h4>
          <div className="space-y-2">
            {lineItems.map((item, index) => (
              <div
                key={index}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/60 transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-950">{item.source}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-200/70 text-slate-700">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.detail}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-extrabold text-teal-700 text-sm block tabular-nums">
                    +{formatINR(item.amount)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">per month</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Math verification banner */}
        <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-700 text-xs flex items-center justify-between font-mono">
          <span>₹649 + ₹2,500 + ₹1,470 + ₹2,881 =</span>
          <span className="font-bold text-slate-950 text-sm tabular-nums">₹7,500 / month</span>
        </div>

        {/* Attribution Notice */}
        <div className="flex items-start gap-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <p>
            These figures are based on the demo dataset for Aarav Mehta (₹1,20,000 monthly income in Bengaluru). No lifestyle sacrifice or essential compromise required.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close Breakdown
          </button>
          {onApply && (
            <button
              type="button"
              onClick={() => {
                onApply();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-teal-700 text-white hover:bg-teal-800 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Apply Recommended Plan</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
