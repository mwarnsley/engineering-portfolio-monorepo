export type Holding = {
  symbol: string;
  shares: number;
  averagePrice: number;
};

export type PositionSummary = Holding & {
  currentPrice: number;
  marketValue: number;
  costBasis: number;
  gainLoss: number;
  gainLossPercent: number;
};
