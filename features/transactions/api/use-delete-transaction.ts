// features/transactions/api/use-create-transactions.ts
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Définir les messages traduits
const messages = {
    en: {
        success: "Transaction deleted",
        error: "Failed to delete transaction"
    },
    fr: {
        success: "Transaction supprimée",
        error: "Échec de la suppression de la transaction"
    }
};

const browserLanguage = typeof navigator !== "undefined"
    ? (navigator.language.split('-')[0] as keyof typeof messages)
    : 'en';

// Sélectionner les messages en fonction de la langue détectée
const selectedMessages = messages[browserLanguage] || messages.en;

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>;

export const useDeleteTransaction = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async () => {
            const response = await client.api.transactions[":id"]["$delete"]({
                param: { id },
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success(selectedMessages.success);
            queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
            // TODO: Invalidate summary and transactions
        },
        onError: () => {
            toast.error(selectedMessages.error);
        }
    });

    return mutation;
};
