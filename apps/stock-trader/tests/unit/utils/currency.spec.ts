import { describe, expect, it } from 'vitest';
import { formatCurrency, formatPercent, formatSignedCurrency } from '@/utils/currency';

describe('currency utils', () => {
  it('formats usd values', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
  });

  it('formats positive percentages', () => {
    expect(formatPercent(3.456)).toBe('+3.46%');
  });

  it('formats negative signed currency', () => {
    expect(formatSignedCurrency(-72.3)).toBe('-$72.30');
  });
});
