// components/category-tooltip.tsx
import { formatCurrency } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { useGetCurrency } from "@/features/currencies/api/use-get-currency";
import { Currency } from "@/lib/currency-rates";

const translations = {
    fr: {
        expenses: "Dépenses",
    },
    en: {
        expenses: "Expenses",
    },
};

const browserLanguage = typeof navigator !== "undefined"
    ? (navigator.language.split('-')[0] as keyof typeof translations)
    : 'en';

const selectedTranslations = translations[browserLanguage];

export const CategoryTooltip = ({ active, payload }: any) => {
    if (!active) return null;

    const { data: currencyData, isLoading, isError } = useGetCurrency();

    if (isLoading) return <div>Loading...</div>;
    if (isError || !currencyData || currencyData.length === 0) return <div>Error fetching currency</div>;

    const userCurrency: Currency = currencyData?.[0]?.currency as Currency || "USD";

    const name = payload[0].payload.name;
    const value = payload[0].value;

    return (
        <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
            <div className="text-sm p-2 px-3 bg-muted text-muted-foreground">
                {name}
            </div>
            <Separator />
            <div className="p-2 px-3 space-y-1">
                <div className="flex items-center justify-between gap-x-4">
                    <div className="flex items-center gap-x-2">
                        <div className="size-1.5 bg-rose-500 rounded-full" />
                        <p className="text-sm text-muted-foreground">
                            {selectedTranslations.expenses}
                        </p>
                    </div>
                    <p className="text-sm text-right font-medium">
                        {formatCurrency(value * -1, userCurrency)}
                    </p>
                </div>
            </div>
        </div>
    );
};
