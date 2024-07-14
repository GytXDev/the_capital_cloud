// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
};

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000)
};

export function formatCurrency(value: number) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};

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

export function formatDateRange(period?: Period) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const locale = navigator.language || "en-US";

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const monthAbbr = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);
    const year = new Intl.DateTimeFormat(locale, { year: "numeric" }).format(date);

    // Manage the abbreviation of the month without the period
    const monthAbbrWithoutDot = monthAbbr.replace(/\.$/, '');

    return `${day} ${monthAbbrWithoutDot}`;
  };

  if (!period?.from) {
    return `${formatDate(defaultFrom)} - ${formatDate(defaultTo)} ${defaultTo.getFullYear()}`;
  }

  const from = new Date(period.from);
  const to = period.to ? new Date(period.to) : from;

  if (!period.to) {
    return formatDate(from);
  }

  // Check if the dates are in the same year
  const sameYear = from.getFullYear() === to.getFullYear();
  const formattedFrom = formatDate(from);
  const formattedTo = formatDate(to);

  return sameYear
    ? `${formattedFrom} - ${formattedTo} ${to.getFullYear()}`
    : `${formattedFrom} ${from.getFullYear()} - ${formattedTo} ${to.getFullYear()}`;
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

