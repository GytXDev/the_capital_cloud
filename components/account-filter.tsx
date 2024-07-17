// components/account-filter.tsx
"use client";

import qs from "query-string";
import {
    useRouter,
    usePathname,
    useSearchParams,
} from "next/navigation";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

// Tableaux de traductions
const translations = {
    fr: {
        allAccounts: "Tous les comptes",
        accountPlaceholder: "Compte",
    },
    en: {
        allAccounts: "All accounts",
        accountPlaceholder: "Account",
    },
};

const browserLanguage = typeof navigator !== "undefined"
    ? (navigator.language.split('-')[0] as keyof typeof translations)
    : 'en';

const selectedTranslations = translations[browserLanguage];

export const AccountFilter = () => {
    const router = useRouter();
    const pathname = usePathname();

    const params = useSearchParams();
    const accountId = params.get("accountId") || "all";
    const from = params.get("from") || "";
    const to = params.get("to") || "";

    const {
        isLoading: isLoadingSummary,
    } = useGetSummary();

    const {
        data: accounts,
        isLoading: isLoadingAccounts
    } = useGetAccounts();

    const onChange = (newValue: string) => {
        const query = {
            accountId: newValue === "all" ? "" : newValue,
            from,
            to
        };

        const url = `${pathname}?${qs.stringify(query, { skipNull: true, skipEmptyString: true })}`;

        router.push(url);
    }

    return (
        <Select
            value={accountId}
            onValueChange={onChange}
            disabled={isLoadingAccounts || isLoadingSummary}
        >
            <SelectTrigger
                className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition"
            >
                <SelectValue placeholder={selectedTranslations.accountPlaceholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">
                    {selectedTranslations.allAccounts}
                </SelectItem>
                {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                        {account.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
