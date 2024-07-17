// features/transactions/api/use-get-transaction.ts
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

// Définir les messages traduits
const messages = {
    en: {
        error: "Failed to fetch transaction"
    },
    fr: {
        error: "Échec de la récupération de la transaction"
    }
};

// Détecter la langue du navigateur et s'assurer que c'est une des clés de messages
const browserLanguage = (navigator.language.split('-')[0] as keyof typeof messages);

// Sélectionner les messages en fonction de la langue détectée
const selectedMessages = messages[browserLanguage] || messages.en;

export const useGetTransaction = (id?: string) => {
    const query = useQuery({
        enabled: !!id,
        queryKey: ["transaction", { id }],
        queryFn: async () => {
            const response = await client.api.transactions[":id"].$get({
                param: { id },
            });

            if (!response.ok) {
                throw new Error(selectedMessages.error);
            }

            const { data } = await response.json();
            return {
                ...data,
                amount: convertAmountFromMiliunits(data.amount),
            };
        },
    });
    return query;
};
