import React, { useState, useEffect } from 'react';
import { 
  ScreenType, 
  UserProfile, 
  Transaction, 
  Subscription, 
  FinancialGoal, 
  Liability 
} from './types';
import { 
  INITIAL_USER, 
  INITIAL_TRANSACTIONS, 
  INITIAL_SUBSCRIPTIONS, 
  INITIAL_GOALS, 
  INITIAL_LIABILITIES 
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ExplainModal } from './components/ExplainModal';
import { UnusedSubscriptionModal } from './components/UnusedSubscriptionModal';
import { CreateGoalModal } from './components/CreateGoalModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { AskFinSightDrawer } from './components/AskFinSightDrawer';

// Views
import { DashboardView } from './views/DashboardView';
import { TransactionsView } from './views/TransactionsView';
import { CashFlowView } from './views/CashFlowView';
import { GoalsView } from './views/GoalsView';
import { LiabilitiesView } from './views/LiabilitiesView';
import { InsightsView } from './views/InsightsView';
import { SimulatorView } from './views/SimulatorView';
import { SettingsView } from './views/SettingsView';

// Mobile Bottom Nav Icons
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  TrendingUp, 
  Target, 
  SlidersHorizontal 
} from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');

  // Load from localStorage or fallback to defaults
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('finsight_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('finsight_subs');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    const saved = localStorage.getItem('finsight_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [liabilities, setLiabilities] = useState<Liability[]>(() => {
    const saved = localStorage.getItem('finsight_liabilities');
    return saved ? JSON.parse(saved) : INITIAL_LIABILITIES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Modals state
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] = useState(false);
  const [selectedSubToReview, setSelectedSubToReview] = useState<Subscription | null>(null);
  const [selectedTxnToReview, setSelectedTxnToReview] = useState<Transaction | null>(null);
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('finsight_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('finsight_subs', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('finsight_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('finsight_liabilities', JSON.stringify(liabilities));
  }, [liabilities]);

  // Handlers
  const handleResetDemoData = () => {
    localStorage.removeItem('finsight_user');
    localStorage.removeItem('finsight_subs');
    localStorage.removeItem('finsight_goals');
    localStorage.removeItem('finsight_liabilities');
    setUser(INITIAL_USER);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setGoals(INITIAL_GOALS);
    setLiabilities(INITIAL_LIABILITIES);
    setTransactions(INITIAL_TRANSACTIONS);
    setCurrentScreen('dashboard');
  };

  const handleCancelSubscription = (subId: string) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === subId
          ? {
              ...s,
              usageStatus: 'active' as const,
              usageDetail: 'Subscription cancelled. Saves ₹' + s.cost + '/mo.',
            }
          : s
      )
    );
  };

  const handleAddGoal = (newGoal: FinancialGoal) => {
    setGoals((prev) => [newGoal, ...prev]);
  };

  const handleUpdateGoalContribution = (goalId: string, delta: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const newContrib = g.monthlyContribution + delta;
          const remaining = Math.max(0, g.targetAmount - g.currentAmount);
          const newEstimatedMonths = Math.max(1, Math.ceil(remaining / newContrib));
          return {
            ...g,
            monthlyContribution: newContrib,
            estimatedMonths: newEstimatedMonths,
          };
        }
        return g;
      })
    );
  };

  const handleUpdateSalary = (newSalary: number) => {
    setUser((prev) => ({ ...prev, monthlySalary: newSalary }));
  };

  const handleAddTransaction = (newTxn: Transaction) => {
    setTransactions((prev) => [newTxn, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F172A] flex flex-col antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        user={user}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        <TopBar
          currentScreen={currentScreen}
          user={user}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenAskAi={() => setIsAskAiOpen(true)}
          onResetDemoData={handleResetDemoData}
          onNavigate={setCurrentScreen}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-5 pb-20 lg:pb-12 max-w-7xl w-full mx-auto">
          {currentScreen === 'dashboard' && (
            <DashboardView
              user={user}
              subscriptions={subscriptions}
              goals={goals}
              liabilities={liabilities}
              onNavigate={setCurrentScreen}
              onOpenExplainModal={() => setIsExplainModalOpen(true)}
              onReviewSubscription={(sub) => setSelectedSubToReview(sub)}
            />
          )}

          {currentScreen === 'transactions' && (
            <TransactionsView
              transactions={transactions}
              onSelectTransaction={(txn) => setSelectedTxnToReview(txn)}
              onAddTransaction={handleAddTransaction}
            />
          )}

          {currentScreen === 'cashflow' && <CashFlowView />}

          {currentScreen === 'goals' && (
            <GoalsView
              goals={goals}
              onOpenCreateGoal={() => setIsCreateGoalModalOpen(true)}
              onUpdateGoalContribution={handleUpdateGoalContribution}
            />
          )}

          {currentScreen === 'liabilities' && (
            <LiabilitiesView liabilities={liabilities} />
          )}

          {currentScreen === 'insights' && (
            <InsightsView
              onNavigate={setCurrentScreen}
              onOpenExplainModal={() => setIsExplainModalOpen(true)}
              onOpenUnusedSubModal={() => setSelectedSubToReview(subscriptions[0])}
            />
          )}

          {currentScreen === 'simulator' && <SimulatorView />}

          {currentScreen === 'settings' && (
            <SettingsView
              user={user}
              onUpdateSalary={handleUpdateSalary}
              onResetDemoData={handleResetDemoData}
            />
          )}
        </main>

        {/* Mobile Bottom Quick Navigation Bar */}
        <nav 
          id="mobile-bottom-nav" 
          aria-label="Mobile Bottom Navigation"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-lg"
        >
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
              currentScreen === 'dashboard' ? 'text-teal-700 font-bold' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentScreen('transactions')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
              currentScreen === 'transactions' ? 'text-teal-700 font-bold' : 'text-slate-500'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Ledger</span>
          </button>

          <button
            onClick={() => setCurrentScreen('cashflow')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
              currentScreen === 'cashflow' ? 'text-teal-700 font-bold' : 'text-slate-500'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Cash Flow</span>
          </button>

          <button
            onClick={() => setCurrentScreen('goals')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
              currentScreen === 'goals' ? 'text-teal-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Goals</span>
          </button>

          <button
            onClick={() => setCurrentScreen('simulator')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
              currentScreen === 'simulator' ? 'text-teal-700 font-bold' : 'text-slate-500'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Simulator</span>
          </button>
        </nav>
      </div>

      {/* Global Modals */}
      <ExplainModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        onApply={() => {
          setIsExplainModalOpen(false);
          setCurrentScreen('insights');
        }}
      />

      <UnusedSubscriptionModal
        isOpen={selectedSubToReview !== null}
        subscription={selectedSubToReview}
        onClose={() => setSelectedSubToReview(null)}
        onCancelSubscription={handleCancelSubscription}
      />

      <CreateGoalModal
        isOpen={isCreateGoalModalOpen}
        onClose={() => setIsCreateGoalModalOpen(false)}
        onAddGoal={handleAddGoal}
      />

      <TransactionDetailModal
        isOpen={selectedTxnToReview !== null}
        transaction={selectedTxnToReview}
        onClose={() => setSelectedTxnToReview(null)}
      />

      <AskFinSightDrawer
        isOpen={isAskAiOpen}
        onClose={() => setIsAskAiOpen(false)}
        user={user}
      />
    </div>
  );
}
