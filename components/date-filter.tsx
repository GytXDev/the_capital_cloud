// components/date-filter.tsx
"use client";
import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import qs from 'query-string';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { cn, formatDateRange } from '@/lib/utils';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';

export const DateFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const accountId = params.get('accountId');
  const from = params.get('from') || '';
  const to = params.get('to') || '';


  // Tableaux de traductions
  const translations = {
    fr: {
      reset: "",
      apply: "",
    },
    en: {
      reset: "Reset",
      apply: "Apply",
    },
  };

  const browserLanguage = typeof navigator !== "undefined"
    ? (navigator.language.split('-')[0] as keyof typeof translations)
    : 'en';

  const selectedTranslations = translations[browserLanguage];


  const defaultTo = new Date();
  const defautltFrom = subDays(defaultTo, 30);

  // Move the declaration and initialization of paramState before useState
  const paramState = {
    from: from ? new Date(from) : defautltFrom,
    to: to ? new Date(to) : defaultTo,
  };

  const [date, setDate] = useState<DateRange | undefined>(paramState);
  const [locale, setLocale] = useState('en-US'); // Default to 'en-US'

  useEffect(() => {
    // Update locale based on user's browser language
    setLocale(navigator.language);
  }, []);

  const pushToUrl = (dateRange: DateRange | undefined) => {
    const query = {
      from: format(dateRange?.from || defautltFrom, 'yyyy-MM-dd'),
      to: format(dateRange?.to || defaultTo, 'yyyy-MM-dd'),
      accountId,
    };
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );

    router.push(url);
  };

  const onReset = () => {
    setDate(undefined);
    pushToUrl(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={false}
          size="sm"
          variant="outline"
          className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition"
        >
          <span>{formatDateRange(paramState, locale)}</span>
          <ChevronDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="lg:w-auto w-full p-0" align="start">
        <Calendar
          disabled={false}
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
        <div className="p-4 w-full flex items-center gap-x-2">
          <PopoverClose asChild>
            <Button onClick={onReset} disabled={!date?.from || !date?.to} className="w-full" variant="outline">
              Reset
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button onClick={() => pushToUrl(date)} disabled={!date?.from || !date?.to} className="w-full">
              Apply
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};
