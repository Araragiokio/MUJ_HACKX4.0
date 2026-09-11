export type ScreenType = 
  | 'dashboard'
  | 'transactions'
  | 'cashflow'
  | 'goals'
  | 'liabilities'
  | 'insights'
  | 'simulator'
  | 'settings';

export interface UserProfile {
  name: string;
  age: number;
  city: string;
  occupation: string;
  monthlySalary: number;
  currentBalance: number;
  savingsAccount: string;
}

export type AccountOption = 'HDFC Bank' | 'ICICI Bank' | 'Cash' | 'UPI Wallet' | 'Axis Bank' | 'SBI Bank';

export interface Transaction {
  id: string;
  date: string; // ISO date or DD MMM format
  displayDate: string;
  merchant: string;
  category: 'Housing' | 'Food & Dining' | 'Transportation' | 'Shopping' | 'Subscriptions' | 'Utilities' | 'Investments' | 'Salary' | 'Debt & EMIs' | 'Healthcare' | 'Entertainment' | 'Transfer';
  amount: number; // positive for income, negative for expense, 0 or neutral for transfer
  type: 'income' | 'expense' | 'transfer';
  paymentMode: 'UPI' | 'Credit Card' | 'NetBanking' | 'Debit Card' | 'Auto-Debit' | 'Cash';
  account?: AccountOption | string;
  transferFrom?: AccountOption | string;
  transferTo?: AccountOption | string;
  status: 'Completed' | 'Pending';
  iconName?: string;
  notes?: string;
  isRecurring?: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly';
  category: string;
  lastBilled: string;
  usageStatus: 'active' | 'possibly_unused';
  usageDetail: string;
  lastUsedDate: string;
  monthsActive: number;
}

export interface FinancialGoal {
  id: string;
  title: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  targetDate: string;
  estimatedMonths: number;
  color: string;
}

export interface Liability {
  id: string;
  name: string;
  institution: string;
  type: 'Credit Card' | 'Personal Loan' | 'Vehicle Loan' | 'Education Loan' | 'Home Loan';
  outstandingAmount: number;
  interestRate: number; // percentage
  interestLabel: string;
  monthlyEmi: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedMonthlyInterest: number;
  tenureRemainingMonths: number;
  avalancheRank: number;
}

export interface ActionableInsight {
  id: string;
  title: string;
  category: 'Subscription' | 'Food' | 'Savings' | 'Liability' | 'Investment';
  potentialMonthlySaving: number;
  reason: string;
  ctaText: string;
  targetScreen?: ScreenType;
  impactLabel: string;
  applied?: boolean;
  breakdown: {
    label: string;
    amount: number;
  }[];
}

export interface CashFlowDay {
  day: number;
  dateStr: string;
  inflow: number;
  outflow: number;
  projectedBalance: number;
  event?: string;
}

export interface SimulatorState {
  scenario: 'job_change' | 'rent_increase' | 'new_emi';
  currentSalary: number;
  newSalary: number;
  currentRent: number;
  newRent: number;
  newEmiAmount: number;
  newEmiDuration: number;
  emiPurpose: string;
}
