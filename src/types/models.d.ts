interface PancakeSwapToken {
  name: string;
  symbol: string;
  price: string;
  price_BNB: string;
}

interface PancakeSwapTokenResponse {
  updated_at: number;
  data: Record<string, PancakeSwapToken>;
}
