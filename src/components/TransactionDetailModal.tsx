import React from 'react';
import { Modal } from './Modal';
import { Transaction } from '../types';
import { formatINR, getCategoryBadgeColor } from '../utils/formatters';
import { ArrowDownLeft, ArrowUpRight, Calendar, CreditCard, Tag, ShieldCheck, MapPin } from 'lucide-react';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  if (!transaction) return null;

  const badgeStyle = getCategoryBadgeColor(transaction.category);
  const isIncome = transaction.type === 'income';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Details"
      subtitle={`Ref: TXN-IN-${transaction.id.replace('tx-', '8892-')}`}
    >
      <div className="space-y-5">
        {/* Merchant & Amount Hero */}
        <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold ${
              isIncome ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-800'
            }`}>
              {isIncome ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">{transaction.merchant}</h4>
              <p className="text-xs text-slate-500">{transaction.displayDate}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-xl font-extrabold block ${
              isIncome ? 'text-teal-700' : 'text-slate-900'
            }`}>
              {formatINR(transaction.amount, true)}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <ShieldCheck className="w-3 h-3" />
              {transaction.status}
            </span>
          </div>
        </div>

        {/* Ledger Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
            <span className="text-slate-400 block font-medium">Category</span>
            <span className={`inline-block px-2 py-0.5 rounded-md font-semibold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
              {transaction.category}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
            <span className="text-slate-400 block font-medium">Payment Mode</span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
              {transaction.paymentMode}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
            <span className="text-slate-400 block font-medium">Account / Card</span>
            <span className="font-bold text-slate-800 font-mono">HDFC Bank •• 4912</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
            <span className="text-slate-400 block font-medium">Intelligence Flag</span>
            <span className="font-bold text-slate-800">
              {transaction.isRecurring ? 'Recurring Mandate' : 'Standard Clearing'}
            </span>
          </div>
        </div>

        {/* Notes */}
        {transaction.notes && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <span className="font-bold text-slate-700 block mb-1">Financial Intelligence Note:</span>
            <p className="text-slate-600 leading-relaxed">{transaction.notes}</p>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-950 text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
