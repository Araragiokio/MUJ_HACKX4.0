import React from 'react';
import { ShieldCheck, ArrowUpRight, TrendingUp } from 'lucide-react';

interface HealthScoreRingProps {
  score: number;
  maxScore?: number;
  label: string;
  onExploreLiabilities?: () => void;
}

export const HealthScoreRing: React.FC<HealthScoreRingProps> = ({
  score = 78,
  maxScore = 100,
  label = 'Healthy, with room to optimize',
  onExploreLiabilities,
}) => {
  const radius = 58;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / maxScore) * circumference;

  return (
    <div 
      id="financial-health-card" 
      className="h-full bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Ring visual */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90 drop-shadow-2xs"
          >
            {/* Background circle */}
            <circle
              stroke="#F1F5F9"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress circle */}
            <circle
              stroke="url(#scoreGradient)"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0D9488" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center score readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-slate-950 tracking-tight leading-none tabular-nums">
              {score}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              Out of {maxScore}
            </span>
          </div>
        </div>

        {/* Narrative */}
        <div className="flex-1 min-w-0 text-center sm:text-left space-y-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Financial Health Index
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Tier A- • Healthy
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {label}
          </h2>
          
          <p className="text-xs text-slate-500 leading-relaxed">
            Strong savings rate and emergency cushion, but revolving credit-card interest is trimming 3.4 points off your maximum score.
          </p>
        </div>
      </div>

      {/* Micro pillars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3.5 border-t border-slate-100">
        <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-200/60 text-center sm:text-left transition-colors hover:bg-slate-100/70">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Savings Rate</span>
          <span className="text-xs font-bold text-emerald-700 tabular-nums mt-0.5 block">30.2%</span>
          <span className="text-[10px] text-slate-400 font-medium hidden sm:block">Above 20% target</span>
        </div>
        <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-200/60 text-center sm:text-left transition-colors hover:bg-slate-100/70">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Debt-to-Income</span>
          <span className="text-xs font-bold text-slate-800 tabular-nums mt-0.5 block">21.5%</span>
          <span className="text-[10px] text-emerald-600 font-medium hidden sm:block">Healthy (&lt;35%)</span>
        </div>
        <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-200/60 text-center sm:text-left transition-colors hover:bg-slate-100/70">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Liquid Runway</span>
          <span className="text-xs font-bold text-slate-800 tabular-nums mt-0.5 block">3.2 months</span>
          <span className="text-[10px] text-slate-400 font-medium hidden sm:block">Essential coverage</span>
        </div>
        <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-200/60 text-center sm:text-left transition-colors hover:bg-slate-100/70">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Discretionary Trim</span>
          <span className="text-xs font-bold text-teal-700 tabular-nums mt-0.5 block">84% Adherence</span>
          <span className="text-[10px] text-slate-400 font-medium hidden sm:block">Room to save ₹3.2k</span>
        </div>
      </div>
    </div>
  );
};
