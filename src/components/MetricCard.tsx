import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface MetricCardProps {
  id?: string;
  title: string;
  amount: number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'income' | 'committed' | 'discretionary' | 'savings' | 'neutral';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  amount,
  subtitle,
  icon: Icon,
  variant = 'neutral',
  onClick,
}) => {
  const getTheme = () => {
    switch (variant) {
      case 'income':
        return {
          iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
          accent: 'text-emerald-700',
          cardHover: 'hover:border-emerald-300 hover:shadow-xs',
          deltaBadge: 'bg-emerald-50 text-emerald-700',
        };
      case 'committed':
        return {
          iconBg: 'bg-blue-50 text-blue-700 border-blue-200/70',
          accent: 'text-slate-900',
          cardHover: 'hover:border-blue-300 hover:shadow-xs',
          deltaBadge: 'bg-blue-50 text-blue-700',
        };
      case 'discretionary':
        return {
          iconBg: 'bg-amber-50 text-amber-700 border-amber-200/70',
          accent: 'text-amber-700',
          cardHover: 'hover:border-amber-300 hover:shadow-xs',
          deltaBadge: 'bg-amber-50 text-amber-700',
        };
      case 'savings':
        return {
          iconBg: 'bg-teal-50 text-teal-700 border-teal-200/70',
          accent: 'text-teal-700',
          cardHover: 'hover:border-teal-300 hover:shadow-xs',
          deltaBadge: 'bg-teal-50 text-teal-700',
        };
      default:
        return {
          iconBg: 'bg-slate-50 text-slate-700 border-slate-200',
          accent: 'text-slate-900',
          cardHover: 'hover:border-slate-300 hover:shadow-xs',
          deltaBadge: 'bg-slate-50 text-slate-700',
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      id={id}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs transition-all duration-200 ${
        onClick
          ? `cursor-pointer ${theme.cardHover} active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-teal-500/20`
          : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${theme.iconBg} transition-transform group-hover:scale-105 duration-200`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl sm:text-[26px] font-bold text-slate-950 tracking-tight tabular-nums">
          {formatINR(amount)}
        </div>
        {subtitle && (
          <p className="text-[11px] text-slate-500 font-medium flex items-center justify-between gap-1 pt-0.5">
            <span className="truncate">{subtitle}</span>
            {onClick && (
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
            )}
          </p>
        )}
      </div>
    </div>
  );
};
