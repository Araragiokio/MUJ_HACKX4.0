import React, { useState } from 'react';
import { Modal } from './Modal';
import { Liability } from '../types';
import { Plus, CreditCard, Landmark, Percent, IndianRupee, Calendar } from 'lucide-react';

interface AddLiabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLiability: (liability: Liability) => void;
}

export const AddLiabilityModal: React.FC<AddLiabilityModalProps> = ({
  isOpen,
  onClose,
  onAddLiability,
}) => {
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [type, setType] = useState<Liability['type']>('Credit Card');
  const [rateInput, setRateInput] = useState<string>('');
  const [rateType, setRateType] = useState<'apr' | 'monthly'>('apr');
  const [monthlyEmi, setMonthlyEmi] = useState<string>('');
  const [outstandingAmount, setOutstandingAmount] = useState<string>('');
  const [tenureMonths, setTenureMonths] = useState<string>('');
  const [priorityInput, setPriorityInput] = useState<'HIGH' | 'MEDIUM' | 'LOW' | 'AUTO'>('AUTO');

  const numRate = parseFloat(rateInput) || 0;
  const numEmi = parseFloat(monthlyEmi) || 0;
  const numOutstanding = parseFloat(outstandingAmount) || 0;
  const numTenure = parseInt(tenureMonths, 10) || 0;

  // Calculate APR
  const aprValue = rateType === 'monthly' ? Number((numRate * 12).toFixed(1)) : numRate;

  // Auto compute priority if set to AUTO
  const computedPriority: 'HIGH' | 'MEDIUM' | 'LOW' =
    priorityInput !== 'AUTO'
      ? priorityInput
      : aprValue >= 20
        ? 'HIGH'
        : aprValue >= 10
          ? 'MEDIUM'
          : 'LOW';

  // Calculate estimated monthly interest
  const estimatedMonthlyInterest = Math.round((numOutstanding * (aprValue / 100)) / 12);

  // Auto calculate tenure if not provided
  const estimatedTenure = numTenure > 0
    ? numTenure
    : numEmi > 0
      ? Math.max(1, Math.ceil(numOutstanding / numEmi))
      : 12;

  const isValid =
    name.trim().length > 0 &&
    institution.trim().length > 0 &&
    numRate > 0 &&
    numEmi > 0 &&
    numOutstanding > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const interestLabel =
      rateType === 'monthly'
        ? `${numRate}% per mo (~${aprValue}% APR)`
        : `${aprValue}% p.a.`;

    const newLiability: Liability = {
      id: `liab-${Date.now()}`,
      name: name.trim(),
      institution: institution.trim(),
      type,
      outstandingAmount: numOutstanding,
      interestRate: aprValue,
      interestLabel,
      monthlyEmi: numEmi,
      priority: computedPriority,
      estimatedMonthlyInterest,
      tenureRemainingMonths: estimatedTenure,
      avalancheRank: 1, // Re-sorted by parent/handler
    };

    onAddLiability(newLiability);

    // Reset form
    setName('');
    setInstitution('');
    setType('Credit Card');
    setRateInput('');
    setRateType('apr');
    setMonthlyEmi('');
    setOutstandingAmount('');
    setTenureMonths('');
    setPriorityInput('AUTO');

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Liability"
      subtitle="Track loans and card balances for automated debt avalanche ranking"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Liability Name & Institution */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Liability Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Credit Card (HDFC Regalia)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lender / Bank Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Landmark className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. HDFC Bank, ICICI, SBI"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Type & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Account Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Liability['type'])}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Vehicle Loan">Vehicle Loan</option>
              <option value="Education Loan">Education Loan</option>
              <option value="Home Loan">Home Loan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Priority Ranking
            </label>
            <select
              value={priorityInput}
              onChange={(e) => setPriorityInput(e.target.value as any)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              <option value="AUTO">Auto-compute (Based on APR)</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Interest Rate with % per mo vs % APR toggle */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Interest Rate <span className="text-rose-500">*</span>
            </label>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => setRateType('apr')}
                className={`px-2 py-0.5 rounded-md transition-colors ${rateType === 'apr'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                % APR (p.a.)
              </button>
              <button
                type="button"
                onClick={() => setRateType('monthly')}
                className={`px-2 py-0.5 rounded-md transition-colors ${rateType === 'monthly'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                % per mo
              </button>
            </div>
          </div>
          <div className="relative">
            <Percent className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="number"
              step="any"
              min="0"
              required
              placeholder={rateType === 'apr' ? 'e.g. 38.0 for 38% APR' : 'e.g. 3.2 for 3.2%/mo'}
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 tabular-nums"
            />
          </div>
          {numRate > 0 && rateType === 'monthly' && (
            <p className="text-[11px] text-teal-700 font-medium mt-1">
              Equivalent APR stored for avalanche sorting: <strong className="font-extrabold">{aprValue}% APR</strong>
            </p>
          )}
        </div>

        {/* Financial Amounts Grid: Outstanding Balance, Monthly EMI, Months Remaining */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Outstanding Balance (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0"
              required
              placeholder="e.g. 42000"
              value={outstandingAmount}
              onChange={(e) => setOutstandingAmount(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-950 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Monthly EMI (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0"
              required
              placeholder="e.g. 5000"
              value={monthlyEmi}
              onChange={(e) => setMonthlyEmi(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-950 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tenure Left (Mos)
            </label>
            <input
              type="number"
              step="1"
              min="0"
              placeholder={`e.g. ${estimatedTenure}`}
              value={tenureMonths}
              onChange={(e) => setTenureMonths(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 tabular-nums"
            />
          </div>
        </div>

        {/* Live Interest Burn Preview */}
        {numOutstanding > 0 && numRate > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Estimated Monthly Interest Burn
              </span>
              <span className="text-slate-600 font-medium">
                Effective Rate: {aprValue}% APR ({computedPriority} Priority)
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-extrabold text-rose-600 block tabular-nums">
                ~₹{estimatedMonthlyInterest.toLocaleString('en-IN')}/mo
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${isValid
                ? 'bg-teal-700 hover:bg-teal-800'
                : 'bg-slate-300 cursor-not-allowed opacity-70'
              }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Liability</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
