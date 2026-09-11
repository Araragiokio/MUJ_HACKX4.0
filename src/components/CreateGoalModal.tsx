import React, { useState } from 'react';
import { Modal } from './Modal';
import { FinancialGoal } from '../types';
import { formatINR } from '../utils/formatters';
import { Target, Calendar, Sparkles, Plus, IndianRupee } from 'lucide-react';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (goal: FinancialGoal) => void;
}

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  isOpen,
  onClose,
  onAddGoal,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personal Growth');
  const [targetAmount, setTargetAmount] = useState<number>(100000);
  const [currentAmount, setCurrentAmount] = useState<number>(15000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(14200);
  const [desiredMonths, setDesiredMonths] = useState<number>(6);

  // Keep monthly contribution and desired months synchronized
  const handleTargetChange = (newTarget: number) => {
    setTargetAmount(newTarget);
    const rem = Math.max(0, newTarget - currentAmount);
    if (desiredMonths > 0) {
      setMonthlyContribution(Math.ceil(rem / desiredMonths));
    }
  };

  const handleCurrentChange = (newCurrent: number) => {
    setCurrentAmount(newCurrent);
    const rem = Math.max(0, targetAmount - newCurrent);
    if (desiredMonths > 0) {
      setMonthlyContribution(Math.ceil(rem / desiredMonths));
    }
  };

  const handleMonthlyChange = (newMonthly: number) => {
    setMonthlyContribution(newMonthly);
    const rem = Math.max(0, targetAmount - currentAmount);
    if (newMonthly > 0) {
      const calcMonths = Math.max(1, Math.ceil(rem / newMonthly));
      setDesiredMonths(calcMonths);
    }
  };

  const handleMonthsChange = (newMonths: number) => {
    setDesiredMonths(newMonths);
    const rem = Math.max(0, targetAmount - currentAmount);
    if (newMonths > 0) {
      setMonthlyContribution(Math.ceil(rem / newMonths));
    }
  };

  const remaining = Math.max(0, targetAmount - currentAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || targetAmount <= 0) return;

    const actualMonthly = monthlyContribution > 0 ? monthlyContribution : (desiredMonths > 0 ? Math.ceil(remaining / desiredMonths) : 1000);
    const actualMonths = actualMonthly > 0 ? Math.max(1, Math.ceil(remaining / actualMonthly)) : desiredMonths;

    // Calculate approximate target month string
    const targetDateObj = new Date();
    targetDateObj.setMonth(targetDateObj.getMonth() + actualMonths);
    const targetDateStr = targetDateObj.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

    const newGoal: FinancialGoal = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      category,
      targetAmount,
      currentAmount,
      monthlyContribution: actualMonthly,
      targetDate: targetDateStr,
      estimatedMonths: actualMonths,
      color: '#0D9488',
    };

    onAddGoal(newGoal);
    setTitle('');
    setTargetAmount(100000);
    setCurrentAmount(15000);
    setMonthlyContribution(14200);
    setDesiredMonths(6);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Financial Goal"
      subtitle="Define your target and let Freenance automate pacing"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Goal Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Goal Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Electric Scooter (Ather 450X), Wedding Fund"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            <option value="Safety Net">Safety Net & Emergency</option>
            <option value="Work & Tools">Work & Tech Hardware</option>
            <option value="Travel & Leisure">Travel & Leisure</option>
            <option value="Personal Growth">Personal Growth & Upskilling</option>
            <option value="Vehicle & Commute">Vehicle & Commute</option>
            <option value="Home & Family">Home & Family</option>
          </select>
        </div>

        {/* Amount Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Target Amount (₹)
            </label>
            <input
              type="number"
              min="1000"
              step="1000"
              required
              value={targetAmount}
              onChange={(e) => handleTargetChange(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-950 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Already Saved (₹)
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={currentAmount}
              onChange={(e) => handleCurrentChange(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-950 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Monthly Contribution (₹)
            </label>
            <input
              type="number"
              min="500"
              step="500"
              required
              value={monthlyContribution}
              onChange={(e) => handleMonthlyChange(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-teal-700 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 tabular-nums"
            />
          </div>
        </div>

        {/* Desired Duration Slider */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Estimated Pacing Timeline:</span>
            <span className="font-bold text-teal-700 tabular-nums">{desiredMonths} months</span>
          </div>
          <input
            type="range"
            min="2"
            max="36"
            step="1"
            value={desiredMonths}
            onChange={(e) => handleMonthsChange(Number(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>2 months</span>
            <span>12 months</span>
            <span>24 months</span>
            <span>36 months</span>
          </div>
        </div>

        {/* Live Calculation Output Card */}
        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-teal-900 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider block">
              Automated Goal Plan
            </span>
            <p className="text-[11px] text-teal-700 font-medium">
              Remaining {formatINR(remaining)} • ~{desiredMonths} months to 100% funded
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-extrabold text-teal-700 block tabular-nums">
              {formatINR(monthlyContribution)}
            </span>
            <span className="text-[10px] text-teal-600 font-medium">per month SIP</span>
          </div>
        </div>

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
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-teal-700 text-white hover:bg-teal-800 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Goal</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
