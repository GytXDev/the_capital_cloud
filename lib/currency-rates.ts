// lib/currency-rates.ts

export type Currency = 'USD' | 'XAF' | 'EUR';

interface CurrencyRates {
  [key: string]: {
    [key: string]: number;
  };
}

export const currencyRates: CurrencyRates = {
  USD: {
    XAF:  602.596,
    EUR: 0.91864583,
  },
  XAF: {
    USD:  0.00165949,
    EUR: 0.00152449,
  },
  EUR: {
    USD: 1.08856,
    XAF: 655.957,
  }
};