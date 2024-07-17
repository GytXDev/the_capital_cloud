// components/data-grid.tsx
"use client";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { DataCard, DataCardLoading } from "./data-card";

// Tableaux de traductions
const translations = {
    fr: {
        remaining: "Capital",
        income: "Revenu",
        expenses: "Dépenses",
    },
    en: {
        remaining: "Remaining",
        income: "Income",
        expenses: "Capital",
    },
};

const browserLanguage = typeof navigator !== "undefined"
    ? (navigator.language.split('-')[0] as keyof typeof translations)
    : 'en';

const selectedTranslations = translations[browserLanguage];

export const DataGrid = () => {
    const { data, isLoading } = useGetSummary();
    const params = useSearchParams();
    const to = params.get("to") || undefined;
    const from = params.get("from") || undefined;

    const dateRangeLabel = formatDateRange({ to, from });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
                <DataCardLoading />
                <DataCardLoading />
                <DataCardLoading />
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2">
            <DataCard
                title={selectedTranslations.remaining}
                value={data?.remainingAmount}
                percentageChange={data?.remainingChange}
                icon={FaPiggyBank}
                variant="default"
                dateRange={dateRangeLabel}
            />
            <DataCard
                title={selectedTranslations.income}
                value={data?.incomeAmount}
                percentageChange={data?.incomeChange}
                icon={FaArrowTrendUp}
                variant="success"
                dateRange={dateRangeLabel}
            />
            <DataCard
                title={selectedTranslations.expenses}
                value={data?.expensesAmount}
                percentageChange={data?.expenseChange}
                icon={FaArrowTrendDown}
                variant="danger"
                dateRange={dateRangeLabel}
            />
        </div>
    );
};
