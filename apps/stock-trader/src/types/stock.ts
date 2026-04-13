export type Timeframe = '1D' | '1W' | '1M' | '1Y';

export type Stock = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
};

export type QuoteResponse = {
  c?: number;
  d?: number;
  dp?: number;
};

export type CandleResponse = {
  c?: number[];
  t?: number[];
  s?: string;
};

export type PricePoint = {
  time: number;
  value: number;
};
