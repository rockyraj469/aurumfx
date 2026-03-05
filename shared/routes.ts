import { z } from "zod";
import { trades, portfolios } from './schema';

export const api = {
  portfolio: {
    get: {
      path: '/api/portfolio',
    },
  },
  trades: {
    list: {
      path: '/api/trades',
    },
    create: {
      path: '/api/trades',
      input: z.object({
        symbol: z.string(),
        type: z.enum(['buy', 'sell']),
        amount: z.string(),
        price: z.string(),
      }),
    },
  },
};