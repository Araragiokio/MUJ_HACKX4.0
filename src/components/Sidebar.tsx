import React from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  TrendingUp, 
  Target, 
  CreditCard, 
  Sparkles, 
  SlidersHorizontal, 
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ScreenType, UserProfile } from '../types';
import { formatINR } from '../utils/formatters';

interface SidebarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  user: UserProfile;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  user,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navSections = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard' as ScreenType, label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Money',
      items: [
        { id: 'transactions' as ScreenType, label: 'Transactions', icon: ArrowLeftRight, badge: '3' },
        { id: 'cashflow' as ScreenType, label: 'Cash Flow', icon: TrendingUp },
      ],
    },
    {
      title: 'Planning',
      items: [
        { id: 'goals' as ScreenType, label: 'Goals', icon: Target, badge: '3' },
        { id: 'liabilities' as ScreenType, label: 'Liabilities', icon: CreditCard, alert: true },
      ],
    },
    {
      title: 'Intelligence',
      items: [
        { id: 'insights' as ScreenType, label: 'Insights', icon: Sparkles, highlight: true },
        { id: 'simulator' as ScreenType, label: 'Life Simulator', icon: SlidersHorizontal, isNew: true },
      ],
    },
  ];

  const handleItemClick = (screen: ScreenType) => {
    onNavigate(screen);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Product Identity */}
          <div className="p-5 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleItemClick('dashboard')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold tracking-tight text-slate-900">FinSight</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-teal-50 text-teal-700 rounded border border-teal-200/60">
                    MVP
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                  Financial Health Assistant
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentScreen === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`nav-${item.id}`}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-xs font-semibold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 transition-colors ${
                              isActive
                                ? 'text-teal-400'
                                : item.highlight
                                ? 'text-indigo-600 group-hover:text-indigo-700'
                                : 'text-slate-400 group-hover:text-slate-700'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {item.isNew && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              isActive ? 'bg-indigo-500/30 text-indigo-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                            }`}>
                              Hero
                            </span>
                          )}
                          {item.alert && (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="High priority attention" />
                          )}
                          {item.badge && !item.isNew && (
                            <span className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                              isActive ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Settings & User Profile */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
            <button
              id="nav-settings"
              onClick={() => handleItemClick('settings')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                currentScreen === 'settings'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className={`w-4 h-4 ${currentScreen === 'settings' ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>Settings & Profile</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Card */}
            <div 
              id="sidebar-user-card"
              onClick={() => handleItemClick('settings')}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200/70 hover:border-slate-300 cursor-pointer transition-all shadow-2xs"
            >
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                AM
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">Bal: {formatINR(user.currentBalance)}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500" title="Account active" />
            </div>

            <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-600" />
                Demo mode active
              </span>
              <span>₹ INR</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
