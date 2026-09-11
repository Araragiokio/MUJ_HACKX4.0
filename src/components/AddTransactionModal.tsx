import React, { useState, useMemo } from 'react';
import { 
  X, 
  Check, 
  Delete, 
  Building2, 
  Calendar as CalendarIcon, 
  ChevronDown, 
  Utensils, 
  Home, 
  Car, 
  ShoppingBag, 
  Tv, 
  Zap, 
  TrendingUp, 
  Briefcase, 
  CreditCard, 
  Stethoscope, 
  Film,
  Landmark,
  Banknote,
  Smartphone,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Transaction, AccountOption } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (newTxn: Transaction) => void;
}

type TransactionType = 'income' | 'expense' | 'transfer';

interface AccountConfig {
  id: AccountOption;
  label: string;
  icon: React.ElementType;
}

interface CategoryConfig {
  id: Transaction['category'];
  label: string;
  icon: React.ElementType;
}

const ACCOUNTS: AccountConfig[] = [
  { id: 'HDFC Bank', label: 'HDFC Bank', icon: Landmark },
  { id: 'ICICI Bank', label: 'ICICI Bank', icon: Building2 },
  { id: 'Cash', label: 'Cash', icon: Banknote },
  { id: 'UPI Wallet', label: 'UPI Wallet', icon: Smartphone },
  { id: 'SBI Bank', label: 'SBI Bank', icon: Landmark },
  { id: 'Axis Bank', label: 'Axis Bank', icon: Building2 },
];

const CATEGORIES: CategoryConfig[] = [
  { id: 'Food & Dining', label: 'Food & Dining', icon: Utensils },
  { id: 'Housing', label: 'Housing', icon: Home },
  { id: 'Transportation', label: 'Transportation', icon: Car },
  { id: 'Shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'Subscriptions', label: 'Subscriptions', icon: Tv },
  { id: 'Utilities', label: 'Utilities', icon: Zap },
  { id: 'Investments', label: 'Investments', icon: TrendingUp },
  { id: 'Salary', label: 'Salary', icon: Briefcase },
  { id: 'Debt & EMIs', label: 'Debt & EMIs', icon: CreditCard },
  { id: 'Healthcare', label: 'Healthcare', icon: Stethoscope },
  { id: 'Entertainment', label: 'Entertainment', icon: Film },
];

/**
 * Safe expression evaluator for raw calculator string (e.g. "450+120" or "500-50*2").
 * Performs standard operator precedence (* and / before + and -) with left-to-right evaluation.
 * Returns evaluated number or 0 on error/empty.
 */
export function evaluateCalculatorExpression(expr: string): number {
  if (!expr || expr.trim() === '') return 0;

  const cleanExpr = expr.replace(/×/g, '*').replace(/−/g, '-').replace(/÷/g, '/').trim();

  const tokens: (number | string)[] = [];
  let currentNum = '';

  for (let i = 0; i < cleanExpr.length; i++) {
    const char = cleanExpr[i];
    if (['+', '-', '*', '/'].includes(char)) {
      if (char === '-' && (currentNum === '' || tokens[tokens.length - 1] === '+' || tokens[tokens.length - 1] === '-' || tokens[tokens.length - 1] === '*' || tokens[tokens.length - 1] === '/')) {
        currentNum += char;
      } else {
        if (currentNum !== '') {
          const parsed = parseFloat(currentNum);
          if (isNaN(parsed)) return 0;
          tokens.push(parsed);
          currentNum = '';
        }
        tokens.push(char);
      }
    } else if (/[0-9.]/.test(char)) {
      currentNum += char;
    }
  }

  if (currentNum !== '') {
    const parsed = parseFloat(currentNum);
    if (!isNaN(parsed)) tokens.push(parsed);
  }

  if (tokens.length === 0) return 0;

  // Pass 1: Multiply & Divide
  const pass1: (number | string)[] = [];
  let idx = 0;
  while (idx < tokens.length) {
    const token = tokens[idx];
    if (token === '*' || token === '/') {
      const prevNum = pass1.pop();
      const nextNum = tokens[idx + 1];
      if (typeof prevNum !== 'number' || typeof nextNum !== 'number') return 0;
      let result = 0;
      if (token === '*') result = prevNum * nextNum;
      if (token === '/') result = nextNum !== 0 ? prevNum / nextNum : 0;
      pass1.push(result);
      idx += 2;
    } else {
      pass1.push(token);
      idx++;
    }
  }

  // Pass 2: Add & Subtract
  if (pass1.length === 0) return 0;
  let result = typeof pass1[0] === 'number' ? pass1[0] : 0;
  idx = 1;

  while (idx < pass1.length) {
    const op = pass1[idx];
    const nextVal = pass1[idx + 1];
    if (typeof nextVal !== 'number') break;
    if (op === '+') result += nextVal;
    if (op === '-') result -= nextVal;
    idx += 2;
  }

  return isNaN(result) ? 0 : result;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  
  // Income / Expense specific state
  const [account, setAccount] = useState<AccountOption>('HDFC Bank');
  const [category, setCategory] = useState<Transaction['category']>('Food & Dining');

  // Transfer specific state
  const [fromAccount, setFromAccount] = useState<AccountOption>('HDFC Bank');
  const [toAccount, setToAccount] = useState<AccountOption>('ICICI Bank');

  const [notes, setNotes] = useState('');
  const [amountExpression, setAmountExpression] = useState('0');
  const [date, setDate] = useState<Date>(new Date());
  
  // Dropdown toggles
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isFromAccountOpen, setIsFromAccountOpen] = useState(false);
  const [isToAccountOpen, setIsToAccountOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const evaluatedAmount = useMemo(() => {
    return evaluateCalculatorExpression(amountExpression);
  }, [amountExpression]);

  // Validation for transfer: From and To cannot be equal
  const isSameTransferAccount = type === 'transfer' && fromAccount === toAccount;
  const isSaveDisabled = evaluatedAmount <= 0 || isSameTransferAccount;

  if (!isOpen) return null;

  const handleKeypadPress = (val: string) => {
    if (val === '=') {
      const evalVal = evaluateCalculatorExpression(amountExpression);
      setAmountExpression(evalVal.toString());
      return;
    }

    if (amountExpression === '0' && /[0-9]/.test(val)) {
      setAmountExpression(val);
      return;
    }

    const lastChar = amountExpression.slice(-1);
    const isOp = (c: string) => ['+', '−', '×', '÷', '*', '-', '/'].includes(c);
    if (isOp(lastChar) && isOp(val)) {
      setAmountExpression((prev) => prev.slice(0, -1) + val);
      return;
    }

    setAmountExpression((prev) => prev + val);
  };

  const handleBackspace = () => {
    if (amountExpression.length <= 1) {
      setAmountExpression('0');
    } else {
      setAmountExpression((prev) => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    setAmountExpression('0');
  };

  const handleSave = () => {
    if (isSaveDisabled) return;

    const isoDateStr = date.toISOString().split('T')[0];
    const isToday = new Date().toDateString() === date.toDateString();
    const formattedDate = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    const displayDateStr = isToday ? `Today, ${formattedDate}` : formattedDate;

    const paymentModeMap: Record<AccountOption, Transaction['paymentMode']> = {
      'HDFC Bank': 'Debit Card',
      'ICICI Bank': 'NetBanking',
      'Cash': 'Cash',
      'UPI Wallet': 'UPI',
      'SBI Bank': 'NetBanking',
      'Axis Bank': 'Credit Card',
    };

    let newTxn: Transaction;

    if (type === 'transfer') {
      const merchantText = notes.trim()
        ? notes.trim()
        : `Transfer: ${fromAccount} → ${toAccount}`;

      newTxn = {
        id: `tx-${Date.now()}`,
        date: isoDateStr,
        displayDate: displayDateStr,
        merchant: merchantText,
        category: 'Transfer',
        amount: Math.abs(evaluatedAmount),
        type: 'transfer',
        paymentMode: paymentModeMap[fromAccount] || 'UPI',
        account: fromAccount,
        transferFrom: fromAccount,
        transferTo: toAccount,
        status: 'Completed',
        notes: notes.trim() || undefined,
      };
    } else {
      const finalAmount = type === 'income' ? Math.abs(evaluatedAmount) : -Math.abs(evaluatedAmount);
      newTxn = {
        id: `tx-${Date.now()}`,
        date: isoDateStr,
        displayDate: displayDateStr,
        merchant: notes.trim() ? notes.trim() : `${category} (${account})`,
        category: category,
        amount: finalAmount,
        type: type,
        paymentMode: paymentModeMap[account] || 'UPI',
        account: account,
        status: 'Completed',
        notes: notes.trim() || undefined,
      };
    }

    onAddTransaction(newTxn);
    handleResetAndClose();
  };

  const handleResetAndClose = () => {
    setType('expense');
    setAccount('HDFC Bank');
    setCategory('Food & Dining');
    setFromAccount('HDFC Bank');
    setToAccount('ICICI Bank');
    setNotes('');
    setAmountExpression('0');
    setDate(new Date());
    setIsAccountOpen(false);
    setIsCategoryOpen(false);
    setIsFromAccountOpen(false);
    setIsToAccountOpen(false);
    setIsDatePickerOpen(false);
    onClose();
  };

  // Helper configs
  const selectedAccountObj = ACCOUNTS.find((a) => a.id === account) || ACCOUNTS[0];
  const selectedCategoryObj = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const selectedFromObj = ACCOUNTS.find((a) => a.id === fromAccount) || ACCOUNTS[0];
  const selectedToObj = ACCOUNTS.find((a) => a.id === toAccount) || ACCOUNTS[1];

  const AccountIcon = selectedAccountObj.icon;
  const CategoryIcon = selectedCategoryObj.icon;
  const FromIcon = selectedFromObj.icon;
  const ToIcon = selectedToObj.icon;

  const formattedDateTimeStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) + ' | ' + date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  let amountTextColor = 'text-slate-900';
  let amountSign = '';
  if (type === 'income') {
    amountTextColor = 'text-emerald-600';
    amountSign = '+';
  } else if (type === 'expense') {
    amountTextColor = 'text-rose-600';
    amountSign = '-';
  } else {
    amountTextColor = 'text-teal-700';
    amountSign = '⇄ ';
  }

  return (
    <div 
      id="add-transaction-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
    >
      <div 
        id="add-transaction-modal-card"
        className="bg-white w-full h-full sm:h-auto sm:max-w-md sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col justify-between transition-all animate-in zoom-in-95 duration-200"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <button
            type="button"
            onClick={handleResetAndClose}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <h2 className="text-sm font-bold text-slate-900">Add Transaction</h2>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaveDisabled}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
              !isSaveDisabled
                ? 'bg-teal-700 text-white hover:bg-teal-800 shadow-2xs cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Segmented Control Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
            {(['income', 'expense', 'transfer'] as TransactionType[]).map((tab) => {
              const isSelected = type === tab;
              const labelMap: Record<TransactionType, string> = {
                income: 'Income',
                expense: 'Expense',
                transfer: 'Transfer',
              };
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setType(tab);
                    setIsAccountOpen(false);
                    setIsCategoryOpen(false);
                    setIsFromAccountOpen(false);
                    setIsToAccountOpen(false);
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-slate-950 font-extrabold shadow-2xs'
                      : 'text-slate-500 font-medium hover:text-slate-800'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-teal-700 stroke-[3]" />}
                  <span>{labelMap[tab]}</span>
                </button>
              );
            })}
          </div>

          {/* Conditional Two-Selector Row */}
          {type === 'transfer' ? (
            /* Transfer Mode: "From" (left) & "To" (right) */
            <div className="space-y-1.5">
              <div className="grid grid-cols-2 gap-2.5">
                {/* From Account Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFromAccountOpen(!isFromAccountOpen);
                      setIsToAccountOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1.5 bg-teal-100/80 text-teal-800 rounded-lg shrink-0">
                        <FromIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">From</span>
                        <span className="text-xs font-bold text-slate-900 truncate block">{selectedFromObj.label}</span>
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                  </button>

                  {/* From Account Dropdown */}
                  {isFromAccountOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 space-y-1 animate-in fade-in duration-150">
                      {ACCOUNTS.map((acc) => {
                        const AccItemIcon = acc.icon;
                        const isSelected = acc.id === fromAccount;
                        return (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => {
                              setFromAccount(acc.id);
                              setIsFromAccountOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                              isSelected ? 'bg-teal-50 text-teal-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <AccItemIcon className="w-4 h-4 text-teal-700" />
                              <span>{acc.label}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-teal-700" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* To Account Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsToAccountOpen(!isToAccountOpen);
                      setIsFromAccountOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1.5 bg-teal-100/80 text-teal-800 rounded-lg shrink-0">
                        <ToIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">To</span>
                        <span className="text-xs font-bold text-slate-900 truncate block">{selectedToObj.label}</span>
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                  </button>

                  {/* To Account Dropdown */}
                  {isToAccountOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 space-y-1 animate-in fade-in duration-150">
                      {ACCOUNTS.map((acc) => {
                        const AccItemIcon = acc.icon;
                        const isSelected = acc.id === toAccount;
                        return (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => {
                              setToAccount(acc.id);
                              setIsToAccountOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                              isSelected ? 'bg-teal-50 text-teal-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <AccItemIcon className="w-4 h-4 text-teal-700" />
                              <span>{acc.label}</span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-teal-700" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Inline warning if From and To are identical */}
              {isSameTransferAccount && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] font-semibold animate-in fade-in duration-150">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>"From" and "To" accounts cannot be the same.</span>
                </div>
              )}
            </div>
          ) : (
            /* Income / Expense Mode: "Account" (left) & "Category" (right) */
            <div className="grid grid-cols-2 gap-2.5">
              {/* Account Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountOpen(!isAccountOpen);
                    setIsCategoryOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 bg-teal-100/80 text-teal-800 rounded-lg shrink-0">
                      <AccountIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">Account</span>
                      <span className="text-xs font-bold text-slate-900 truncate block">{selectedAccountObj.label}</span>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                </button>

                {/* Account Dropdown */}
                {isAccountOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 space-y-1 animate-in fade-in duration-150">
                    {ACCOUNTS.map((acc) => {
                      const AccItemIcon = acc.icon;
                      const isSelected = acc.id === account;
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => {
                            setAccount(acc.id);
                            setIsAccountOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            isSelected ? 'bg-teal-50 text-teal-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <AccItemIcon className="w-4 h-4 text-teal-700" />
                            <span>{acc.label}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-teal-700" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Category Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryOpen(!isCategoryOpen);
                    setIsAccountOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 bg-teal-100/80 text-teal-800 rounded-lg shrink-0">
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">Category</span>
                      <span className="text-xs font-bold text-slate-900 truncate block">{selectedCategoryObj.label}</span>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                </button>

                {/* Category Dropdown */}
                {isCategoryOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 max-h-48 overflow-y-auto space-y-1 animate-in fade-in duration-150">
                    {CATEGORIES.map((cat) => {
                      const CatItemIcon = cat.icon;
                      const isSelected = cat.id === category;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setCategory(cat.id);
                            setIsCategoryOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            isSelected ? 'bg-teal-50 text-teal-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <CatItemIcon className="w-4 h-4 text-teal-700 shrink-0" />
                            <span className="truncate">{cat.label}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-teal-700 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes Field */}
          <div>
            <textarea
              rows={2}
              placeholder="Add notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none bg-slate-50/40"
            />
          </div>

          {/* Amount Display & Calculator Header */}
          <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Amount (₹)</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-600 px-2 py-0.5 rounded bg-slate-200/60 transition-colors cursor-pointer"
                >
                  C
                </button>
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  title="Backspace"
                >
                  <Delete className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-1 flex items-baseline justify-end gap-1.5 overflow-x-auto py-1">
              <span className={`text-2xl sm:text-3xl font-black tabular-nums tracking-tight ${amountTextColor}`}>
                {amountSign}₹{amountExpression}
              </span>
            </div>

            {/[+−×÷*\/]/.test(amountExpression) && (
              <div className="text-right text-[11px] text-slate-400 font-medium tabular-nums">
                = ₹{evaluatedAmount.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          {/* Keypad 4x4 Grid */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: '7', type: 'num' },
              { label: '8', type: 'num' },
              { label: '9', type: 'num' },
              { label: '÷', type: 'op' },
              { label: '4', type: 'num' },
              { label: '5', type: 'num' },
              { label: '6', type: 'num' },
              { label: '×', type: 'op' },
              { label: '1', type: 'num' },
              { label: '2', type: 'num' },
              { label: '3', type: 'num' },
              { label: '−', type: 'op' },
              { label: '.', type: 'num' },
              { label: '0', type: 'num' },
              { label: '=', type: 'op' },
              { label: '+', type: 'op' },
            ].map((btn) => {
              const isOp = btn.type === 'op';
              return (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => handleKeypadPress(btn.label)}
                  className={`py-3 rounded-xl font-bold text-sm sm:text-base transition-all active:scale-95 cursor-pointer shadow-2xs ${
                    isOp
                      ? 'bg-teal-100/70 text-teal-800 hover:bg-teal-200/80 border border-teal-200/70 font-extrabold'
                      : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-200/90 font-bold'
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom bar: Date Picker Trigger */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/90 shrink-0">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1 cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4 text-teal-700" />
              <span className="tabular-nums">{formattedDateTimeStr}</span>
            </button>

            {isDatePickerOpen && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-30 animate-in fade-in duration-150 text-center space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">Select Date & Time</span>
                <input
                  type="datetime-local"
                  value={date.toISOString().slice(0, 16)}
                  onChange={(e) => {
                    if (e.target.value) setDate(new Date(e.target.value));
                  }}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(false)}
                  className="w-full py-1 bg-teal-700 text-white rounded-lg text-xs font-bold hover:bg-teal-800 cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
