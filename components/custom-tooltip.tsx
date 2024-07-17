import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "./ui/separator";

interface CustomTooltipProps {
    active?: boolean;
    payload?: any;
}

// Tableaux de traductions
const translations = {
    fr: {
        income: "Revenus",
        expenses: "Dépenses",
        dateFormat: "dd MMM yyyy"
    },
    en: {
        income: "Income",
        expenses: "Expenses",
        dateFormat: "MMM dd, yyy"
    },
};

const browserLanguage = typeof navigator !== "undefined"
    ? (navigator.language.split('-')[0] as keyof typeof translations)
    : 'en';

const selectedTranslations = translations[browserLanguage];


export const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (!active || !payload || !payload.length) return null;

    const date = payload[0].payload.date;
    const income = payload[0].value;
    const expenses = payload[1].value;

    return (
        <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
            <div className="text-sm p-2 px-3 bg-muted text-muted-foreground">
                {format(date, selectedTranslations.dateFormat)}
            </div>
            <Separator />
            <div className="p-2 px-3 space-y-1">
                <div className="flex items-center justify-between gap-x-4">
                    <div className="flex items-center gap-x-2">
                        <div className="size-1.5 bg-blue-500 rounded-full" />
                        <p className="text-sm text-muted-foreground">
                            {selectedTranslations.income}
                        </p>
                    </div>
                    <p className="text-sm text-right font-medium">
                        {formatCurrency(income)}
                    </p>
                </div>
            </div>
            <div className="p-2 px-3 space-y-1">
                <div className="flex items-center justify-between gap-x-4">
                    <div className="flex items-center gap-x-2">
                        <div className="size-1.5 bg-rose-500 rounded-full" />
                        <p className="text-sm text-muted-foreground">
                            {selectedTranslations.expenses}
                        </p>
                    </div>
                    <p className="text-sm text-right font-medium">
                        {formatCurrency(expenses * -1)}
                    </p>
                </div>
            </div>
        </div>
    );
};
