import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { AlertTriangle, TrendingUp, Info, Sparkles, CheckCircle } from 'lucide-react';
import { CASH_FLOW_FORECAST_DATA } from '../data/mockData';
import { formatINR, formatCompactINR } from '../utils/formatters';

interface CashFlowChartProps {
  simulationPace?: 'standard' | 'conservative' | 'elevated';
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({
  simulationPace: defaultPace = 'standard',
}) => {
  const [pace, setPace] = useState<'standard' | 'conservative' | 'elevated'>(defaultPace);

  // Compute adjusted chart points based on interactive pace
  const chartData = CASH_FLOW_FORECAST_DATA.map((item) => {
    let balance = item.projectedBalance;
    if (pace === 'conservative') {
      // saves ~₹8,000 more
      balance += Math.round((item.day / 30) * 8500);
    } else if (pace === 'elevated') {
      // burns ₹12,000 more, dipping close to warning threshold
      balance -= Math.round((item.day / 30) * 14000);
    }
    return {
      ...item,
      displayBalance: balance,
    };
  });

  const projectedMonthEnd = chartData[chartData.length - 1].displayBalance;
  const isShortfallRisk = pace === 'elevated';

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white text-xs px-3 py-2.5 rounded-xl shadow-xl border border-slate-700 min-w-44">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1 mb-1">
            <span className="font-medium">{data.dateStr}</span>
            <span>Day {data.day} of 30</span>
          </div>
          <div className="text-emerald-400 font-extrabold text-sm">
            {formatINR(data.displayBalance)}
          </div>
          <div className="text-slate-300 text-[11px] mt-1 flex items-center gap-1 font-medium">
            <span>Event:</span> {data.event}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      id="cash-flow-chart-container"
      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Cash Flow Trajectory (September)</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
              Deterministic Runway
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time liquid balance projection mapped to committed debit dates
          </p>
        </div>

        {/* Spend Pace Interactive Simulator Tabs */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl text-xs self-start sm:self-auto border border-slate-200/60">
          <button
            onClick={() => setPace('conservative')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              pace === 'conservative'
                ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Conservative (-₹8.5k)
          </button>
          <button
            onClick={() => setPace('standard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              pace === 'standard'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Baseline
          </button>
          <button
            onClick={() => setPace('elevated')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              pace === 'elevated'
                ? 'bg-white text-amber-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            High Spend (+₹14k)
          </button>
        </div>
      </div>

      {/* Trajectory Area Chart */}
      <div className="h-64 sm:h-72 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isShortfallRisk ? '#F59E0B' : '#0D9488'} stopOpacity={0.25} />
                <stop offset="95%" stopColor={isShortfallRisk ? '#F59E0B' : '#0D9488'} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="dateStr"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748B' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748B' }}
              tickFormatter={(val) => formatCompactINR(val)}
              domain={['auto', 'auto']}
            />
            <Tooltip content={customTooltip} />
            <ReferenceLine
              y={25000}
              stroke="#EF4444"
              strokeDasharray="4 4"
              label={{
                value: 'Min Safety Buffer (₹25k)',
                position: 'insideBottomRight',
                fill: '#DC2626',
                fontSize: 10,
                fontWeight: 700,
              }}
            />
            <Area
              type="monotone"
              dataKey="displayBalance"
              stroke={isShortfallRisk ? '#D97706' : '#0D9488'}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#balanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Alert or Summary State */}
      {isShortfallRisk ? (
        <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-950">Potential Shortfall Warning:</span>
            <p className="mt-0.5 text-amber-800 leading-relaxed">
              Under elevated spending, your liquid buffer dips to ₹18,200 around 24 Sep after SIP debits and insurance renewals. Keep discretionary orders below ₹700/day to stay above your ₹25,000 safety threshold.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-teal-50/80 border border-teal-200/70 text-teal-900 flex items-start gap-3 text-xs">
          <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-950">Projected Month-End Close:</span>
              <span className="text-sm font-extrabold text-teal-700 tabular-nums">{formatINR(projectedMonthEnd)}</span>
            </div>
            <p className="mt-0.5 text-teal-800 leading-relaxed">
              All 4 loan EMIs, rent, insurance, and utilities are fully cushioned with an expected net surplus of {formatINR(projectedMonthEnd)}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
