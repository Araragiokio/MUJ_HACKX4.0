import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Calendar, 
  Download, 
  ChevronDown, 
  CreditCard,
  CheckCircle2,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Transaction } from '../types';
import { formatINR, getCategoryBadgeColor } from '../utils/formatters';
import { AddTransactionModal } from '../components/AddTransactionModal';

interface TransactionsViewProps {
  transactions: Transaction[];
  onSelectTransaction: (txn: Transaction) => void;
  onAddTransaction?: (txn: Transaction) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onSelectTransaction,
  onAddTransaction,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<'ALL' | 'income' | 'expense'>('ALL');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Distinct categories
  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return Array.from(set);
  }, [transactions]);

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((txn) => {
        const matchesSearch = 
          txn.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
          txn.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (txn.notes && txn.notes.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCat = selectedCategory === 'ALL' || txn.category === selectedCategory;
        const matchesType = selectedType === 'ALL' || txn.type === selectedType;

        return matchesSearch && matchesCat && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === 'amount-desc') return Math.abs(b.amount) - Math.abs(a.amount);
        if (sortBy === 'amount-asc') return Math.abs(a.amount) - Math.abs(b.amount);
        return 0;
      });
  }, [transactions, searchTerm, selectedCategory, selectedType, sortBy]);

  const totalInflow = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalOutflow = Math.abs(
    transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0)
  );

  const handleAddNewTxn = (newTxn: Transaction) => {
    if (onAddTransaction) {
      onAddTransaction(newTxn);
    }
  };

  return (
    <div id="transactions-view" className="space-y-5 pb-12">
      {/* Header Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Inflow (Sep)</span>
          <span className="text-2xl sm:text-[26px] font-extrabold text-teal-700 mt-1 block tabular-nums">{formatINR(totalInflow)}</span>
          <span className="text-[11px] text-slate-400 font-medium">Salary & consulting credits</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Outflow (Sep)</span>
          <span className="text-2xl sm:text-[26px] font-extrabold text-slate-950 mt-1 block tabular-nums">{formatINR(totalOutflow)}</span>
          <span className="text-[11px] text-slate-400 font-medium">{transactions.length} debited entries</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Net September Cash Flow</span>
          <span className="text-2xl sm:text-[26px] font-extrabold text-emerald-700 mt-1 block tabular-nums">
            +{formatINR(totalInflow - totalOutflow)}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold">Positive delta to liquid savings</span>
        </div>
      </div>

      {/* Control Bar: Search, Category, Type, Sort, Add Transaction */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search merchants, Swiggy, Netflix, rent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          {/* Type filters tabs */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl text-xs w-full md:w-auto shrink-0 border border-slate-200/60">
            <button
              onClick={() => setSelectedType('ALL')}
              className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedType === 'ALL'
                  ? 'bg-white text-slate-950 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedType('expense')}
              className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedType === 'expense'
                  ? 'bg-white text-slate-950 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Debits
            </button>
            <button
              onClick={() => setSelectedType('income')}
              className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedType === 'income'
                  ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Credits
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-48 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-44 shrink-0">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>

          {/* + Add Transaction Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 border-b border-slate-200/90 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Merchant & Intelligence Tag</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold font-semibold">Mode</th>
                <th className="py-3.5 px-4 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((txn) => {
                const badge = getCategoryBadgeColor(txn.category);
                const isIncome = txn.type === 'income';

                return (
                  <tr
                    key={txn.id}
                    id={`txn-row-${txn.id}`}
                    onClick={() => onSelectTransaction(txn)}
                    className="hover:bg-slate-50/90 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap tabular-nums">
                      {txn.displayDate}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isIncome
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200/80'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-950 block truncate group-hover:text-teal-700 transition-colors">
                            {txn.merchant}
                          </span>
                          {txn.notes && (
                            <span className="text-[11px] text-slate-400 block truncate font-normal">
                              {txn.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {txn.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        {txn.paymentMode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span
                        className={`font-extrabold text-sm tabular-nums ${
                          isIncome ? 'text-emerald-700' : 'text-slate-950'
                        }`}
                      >
                        {formatINR(txn.amount, true)}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 space-y-1">
                      <Search className="w-6 h-6 text-slate-300" />
                      <p className="text-xs font-medium text-slate-500">No transactions match your search or filter criteria.</p>
                      <p className="text-[11px] text-slate-400">Try resetting filters to view all entries.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer count */}
        <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="tabular-nums">
            Showing {filteredTransactions.length} of {transactions.length} verified demo entries
          </span>
          <span className="font-semibold text-teal-700">Click any row for ledger breakdown</span>
        </div>
      </div>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddNewTxn}
      />
    </div>
  );
};
