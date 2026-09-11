import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  RefreshCw, 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  Wallet, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { UserProfile } from '../types';
import { formatINR } from '../utils/formatters';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateSalary: (newSalary: number) => void;
  onResetDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateSalary,
  onResetDemoData,
}) => {
  const [salaryInput, setSalaryInput] = useState<number>(user.monthlySalary);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSalary(salaryInput);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div id="settings-view" className="space-y-6 pb-12 max-w-4xl">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-800 border border-teal-200/70 flex items-center justify-center font-extrabold text-xl shadow-2xs">
              AM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-950 tracking-tight">{user.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200/70 uppercase tracking-wider">
                  Demo User
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 font-medium">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {user.occupation} • {user.city}, KA
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block font-medium">Primary Liquid Account</span>
            <span className="text-sm font-bold text-slate-950 font-mono tracking-tight">{user.savingsAccount}</span>
          </div>
        </div>

        {/* Salary Calibration Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Calibrate Monthly Take-Home Pay
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Net Monthly Inflow (₹)
              </label>
              <input
                type="number"
                step="5000"
                value={salaryInput}
                onChange={(e) => setSalaryInput(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-950 font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Calibrated & Saved!</span>
                  </>
                ) : (
                  <span>Update Inflow Profile</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Demo State Control Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-slate-950 tracking-tight">Reset Demo Baseline</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Restore all mock transactions, goal progress, and liability orders to original hackathon baseline.
            </p>
          </div>
          <button
            onClick={onResetDemoData}
            className="px-4 py-2.5 rounded-xl border border-slate-200/90 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Freenance Product Vision Notice */}
      <div className="p-6 rounded-2xl bg-slate-950 text-white space-y-2 border border-slate-800 shadow-md">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
            Hackathon MVP Manifesto
          </span>
        </div>
        <p className="text-sm font-semibold text-white">
          "Most budgeting apps tell you what happened. Freenance tells you what happens next."
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          Demo data for illustration only. Not financial advice. Designed specifically for Indian working professionals navigating salary credits, EMIs, SIPs, and recurring subscriptions.
        </p>
      </div>
    </div>
  );
};
