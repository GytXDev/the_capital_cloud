import React from "react";
import CurrencyInput from "react-currency-input-field";
import { Info, MinusCircle, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useGetCurrency } from "@/features/currencies/api/use-get-currency";

// Tableaux de traductions
const translations = {
    fr: {
        useForIncome: "Utilisez [+] pour les revenus et [-] pour les dépenses",
        income: "Ceci sera compté comme revenu",
        expense: "Ceci sera compté comme dépense",
    },
    en: {
        useForIncome: "Use [+] for income and [-] for expense",
        income: "This will count as income",
        expense: "This will count as an expense",
    },
};

const browserLanguage = typeof navigator !== "undefined"
    ? (navigator.language.split('-')[0] as keyof typeof translations)
    : 'en';

const selectedTranslations = translations[browserLanguage];

type Props = {
    value: string;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    currency?: string; // Optionnelle pour la devise, pourra être mise à jour par l'API
}

export const AmountInput = ({
    value,
    onChange,
    placeholder,
    disabled,
    currency,
}: Props) => {
    const currencyQuery = useGetCurrency();
    const userCurrency = currencyQuery.data?.[0]?.currency || currency || "$"; // Utilise currency si disponible

    const parsedValue = parseFloat(value);
    const isIncome = parsedValue > 0;
    const isExpense = parsedValue < 0;

    const onReverseValue = () => {
        if (!value) return;
        const newValue = parseFloat(value) * -1;
        onChange(newValue.toString());
    }

    // Déterminez le préfixe et le suffixe en fonction de la devise
    let prefix: string | undefined;
    let suffix: string | undefined;

    switch (userCurrency) {
        case "USD":
            prefix = "$";
            suffix = undefined;
            break;
        case "EUR":
            prefix = "€";
            suffix = undefined;
            break;
        case "XAF":
            prefix = undefined;
            suffix = "FCFA";
            break;
        default:
            prefix = userCurrency;
            suffix = undefined;
    }

    // Ajoutez des espaces autour de FCFA
    const formattedSuffix = userCurrency === "XAF" ? " FCFA " : suffix;

    return (
        <div className="relative">
            <TooltipProvider>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            onClick={onReverseValue}
                            className={cn(
                                "bg-slate-400 hover:bg-slate-500 absolute top-1.5 left-1.5 rounded-md p-2 flex items-center justify-center transition",
                                isIncome && "bg-emerald-500 hover:bg-emerald-600",
                                isExpense && "bg-rose-500 hover:bg-rose-600",
                            )}
                        >
                            {!parsedValue && <Info className="size-3 text-white" />}
                            {isIncome && <PlusCircle className="size-3 text-white" />}
                            {isExpense && <MinusCircle className="size-3 text-white" />}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {selectedTranslations.useForIncome}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <CurrencyInput
                prefix={prefix}
                suffix={formattedSuffix}
                className="pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={placeholder}
                value={value}
                decimalsLimit={2}
                decimalScale={2}
                onValueChange={onChange}
                disabled={disabled}
            />
            <p className="text-xs text-muted-foreground mt-2">
                {isIncome && selectedTranslations.income}
                {isExpense && selectedTranslations.expense}
            </p>
        </div>
    );
}
