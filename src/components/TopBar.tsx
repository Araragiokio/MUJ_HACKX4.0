import React from 'react';
import { Menu, Sparkles, RefreshCw, Wallet, Shield } from 'lucide-react';
import { ScreenType, UserProfile } from '../types';
import { formatINR } from '../utils/formatters';

interface TopBarProps {
  currentScreen: ScreenType;
  user: UserProfile;
  onOpenMobileMenu: () => void;
  onOpenAskAi: () => void;
  onResetDemoData: () => void;
  onNavigate: (screen: ScreenType) => void;
}

const SCREEN_TITLES: Record<ScreenType, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Overview Dashboard',
    subtitle: 'Real-time financial pulse and forward-looking telemetry',
  },
  transactions: {
    title: 'Transactions & Ledger',
    subtitle: 'Categorized stream with intelligence tagging',
  },
  cashflow: {
    title: 'Cash Flow Projection',
    subtitle: 'Daily runway and committed inflow/outflow forecast',
  },
  goals: {
    title: 'Smart Financial Goals',
    subtitle: 'Automated contributions and timeline forecasting',
  },
  liabilities: {
    title: 'Liabilities & Debt Intelligence',
    subtitle: 'Avalanche debt prioritization to minimize interest leak',
  },
  insights: {
    title: 'Actionable Intelligence',
    subtitle: 'Explainable opportunities to recover cash flow',
  },
  simulator: {
    title: 'Life Decision Simulator',
    subtitle: 'Test career, housing, and loan scenarios before committing',
  },
  settings: {
    title: 'Preferences & Demo Profile',
    subtitle: 'Manage profile parameters and demo simulation data',
  },
};

export const TopBar: React.FC<TopBarProps> = ({
  currentScreen,
  user,
  onOpenMobileMenu,
  onOpenAskAi,
  onResetDemoData,
  onNavigate,
}) => {
  const currentInfo = SCREEN_TITLES[currentScreen] || SCREEN_TITLES.dashboard;

  return (
    <header 
      id="app-topbar" 
      className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          id="mobile-menu-trigger"
          onClick={onOpenMobileMenu}
          className="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Title & context */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {currentInfo.title}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Demo Mode
            </span>
          </div>
          <p className="hidden sm:block text-xs text-slate-500 font-medium">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick balance badge */}
        <div 
          onClick={() => onNavigate('cashflow')}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          title="Click to view Cash Flow"
        >
          <Wallet className="w-3.5 h-3.5 text-teal-600" />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block leading-none">Liquid Balance</span>
            <span className="text-xs font-bold text-slate-900 leading-none">{formatINR(user.currentBalance)}</span>
          </div>
        </div>

        {/* Reset Demo Data Button */}
        <button
          id="btn-reset-demo"
          onClick={onResetDemoData}
          title="Reset demo data to default baseline"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors hidden sm:flex items-center justify-center"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Ask Freenance AI button */}
        <button
          id="btn-ask-freenance"
          onClick={onOpenAskAi}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-teal-700 text-white text-xs font-semibold shadow-sm shadow-indigo-600/20 hover:shadow-md hover:brightness-105 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Ask Freenance AI</span>
        </button>
      </div>
    </header>
  );
};
