import React from 'react';
import { Modal } from './Modal';
import { Subscription } from '../types';
import { formatINR } from '../utils/formatters';
import { AlertCircle, Calendar, CheckCircle2, ShieldAlert, Sparkles, Tv } from 'lucide-react';

interface UnusedSubscriptionModalProps {
  subscription: Subscription | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelSubscription: (id: string) => void;
}

export const UnusedSubscriptionModal: React.FC<UnusedSubscriptionModalProps> = ({
  subscription,
  isOpen,
  onClose,
  onCancelSubscription,
}) => {
  if (!subscription) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Recurring Subscription Review"
      subtitle="Freenance Usage Intelligence Audit"
    >
      <div className="space-y-5">
        {/* Service Header */}
        <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200/70 text-teal-800 flex items-center justify-center font-bold">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-950 text-sm tracking-tight">{subscription.name}</h4>
              <p className="text-xs text-slate-500 font-medium">{subscription.category} • Billed monthly</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-extrabold text-slate-950 block tabular-nums">
              {formatINR(subscription.cost)}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">per month</span>
          </div>
        </div>

        {/* Intelligence Callout */}
        <div className="p-4.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-950">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Low Utilization Detected</span>
          </div>
          <p className="leading-relaxed text-amber-900">
            {subscription.usageDetail}
          </p>
          <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-800 font-medium">
            <span>Consecutive Active Months: {subscription.monthsActive}</span>
            <span>Last Activity: {subscription.lastUsedDate}</span>
          </div>
        </div>

        {/* Financial Impact */}
        <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-200/80 space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span>Yearly cost if maintained:</span>
            <span className="font-bold text-slate-950 tabular-nums">{formatINR(subscription.cost * 12)} / year</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Opportunity with SIP compound @ 12%:</span>
            <span className="font-bold text-teal-700 tabular-nums">+₹9,200 after 1 year</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Recommended Action:</span>
            <span className="font-bold text-slate-900">Cancel or downgrade tier</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Keep Active For Now
          </button>
          <button
            type="button"
            onClick={() => {
              onCancelSubscription(subscription.id);
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Cancel & Save {formatINR(subscription.cost)}/mo</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
