// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import { currencyRates, Currency } from "@/lib/currency-rates";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
};

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000)
};

// convertir le montant depuis USD
export function convertAmountFromUSD(amount: number, currency: Currency): number {
  // Récupère le taux de change de l'USD vers la devise spécifiée
  const rate = currencyRates.USD[currency];
  if (!rate) {
    console.error(`No conversion rate found for USD to ${currency}`);
    return amount; // Retourner le montant inchangé si le taux n'est pas trouvé
  }
  return amount * rate;
}

// convertir le montant en USD
export function convertAmountToUSD(amount: number, currency: Currency): number {
  // Récupère le taux de change de la devise spécifiée en dollars
  const rate = currencyRates[currency]?.USD;
  if (!rate) {
    console.error(`No conversion rate found for ${currency} to USD`);
    return amount; // Retourner le montant inchangé si le taux n'est pas trouvé
  }
  return amount * rate;
}

export function formatCurrency(value: number, currency: Currency = "USD", minimumFractionDigits: number = 2): string {
  const baseCurrency: Currency = "USD"; // La devise de base pour les taux fixes

  // Format de base
  let formatter = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: minimumFractionDigits,
  });

  // Pour FCFA (XAF), nous devons ajouter des espaces entre les milliers
  if (currency === "XAF") {
    formatter = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: minimumFractionDigits,
      currencyDisplay: "symbol",
      useGrouping: true
    });
  }

  // Si la devise demandée est la devise de base, formate directement
  if (currency === baseCurrency) {
    return formatter.format(value);
  }

  // Obtenir le taux de change pour convertir depuis la devise de base
  const rates = currencyRates[baseCurrency];
  const rate = rates[currency];
  if (!rate) {
    console.error(`Conversion rate not found for ${baseCurrency} to ${currency}`);
    return formatter.format(value);
  }

  // Convertir le montant en fonction du taux de change
  const convertedValue = value * rate;
  return formatter.format(convertedValue);
}



export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function fillMissingDays(
  activeDays: {
    date: Date,
    income: number,
    expenses: number,
  }[],
  startDate: Date,
  endDate: Date,
) {
  if (activeDays.length === 0) {
    return [];
  }

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const transactionsByDay = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day));

    if (found) {
      return found;
    } else {
      return {
        date: day,
        income: 0,
        expenses: 0,
      };
    }
  });

  return transactionsByDay;
}

type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
};

export function formatDateRange(period?: Period, locale = 'en-US') {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const monthAbbr = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);
    return `${day} ${monthAbbr}`;
  };

  if (!period?.from) {
    return `${formatDate(defaultFrom)} - ${formatDate(defaultTo)} ${defaultTo.getFullYear()}`;
  }

  const from = new Date(period.from);
  const to = period.to ? new Date(period.to) : from;

  if (!period.to) {
    return formatDate(from);
  }

  const formattedFrom = formatDate(from);
  const formattedTo = formatDate(to);

  return `${formattedFrom} - ${formattedTo} ${to.getFullYear()}`;
}

export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = {
    addPrefix: false,
  }
) {
  // Format the percentage value
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);

  // Add a prefix if the option is set and the value is positive
  if (options.addPrefix && value > 0) {
    return `+${formattedValue}`;
  }

  return formattedValue;
}