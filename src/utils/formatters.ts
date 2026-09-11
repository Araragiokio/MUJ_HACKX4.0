/**
 * Indian currency formatting helper
 * Uses standard Indian numbering system (e.g. ₹1,20,000 / ₹2,00,000)
 */
export function formatINR(amount: number, showSign: boolean = false): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));

  // Format with en-IN locale
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(absAmount);

  if (showSign) {
    if (amount > 0) return `+₹${formatted}`;
    if (amount < 0) return `-₹${formatted}`;
    return `₹${formatted}`;
  }

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

/**
 * Compact Indian currency formatting (e.g. ₹1.2L, ₹85k)
 */
export function formatCompactINR(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  if (abs >= 10000000) {
    return `${sign}₹${(abs / 10000000).toFixed(1)}Cr`;
  }
  if (abs >= 100000) {
    return `${sign}₹${(abs / 100000).toFixed(1)}L`;
  }
  if (abs >= 1000) {
    return `${sign}₹${(abs / 1000).toFixed(0)}k`;
  }
  return `${sign}₹${abs}`;
}

export function getCategoryBadgeColor(category: string): { bg: string; text: string; border: string } {
  switch (category) {
    case 'Housing':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'Food & Dining':
    case 'Food':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'Transportation':
    case 'Transport':
      return { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' };
    case 'Shopping':
      return { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' };
    case 'Subscriptions':
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
    case 'Utilities':
      return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
    case 'Investments':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'Salary':
      return { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' };
    case 'Debt & EMIs':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  }
}
