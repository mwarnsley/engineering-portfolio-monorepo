export type TransactionType = 'buy' | 'sell';

export type Transaction = {
  id: string;
  symbol: string;
  type: TransactionType;
  shares: number;
  price: number;
  total: number;
  timestamp: string;
};
