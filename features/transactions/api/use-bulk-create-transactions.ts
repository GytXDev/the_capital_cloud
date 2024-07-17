// features/transactions/api/use-bulk-create.ts
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Messages traduits
const messages = {
    en: {
        success: "Transactions created",
        error: "Failed to create transactions"
    },
    fr: {
        success: "Transactions créées",
        error: "Échec de la création des transactions"
    }
};

const browserLanguage = typeof navigator !== "undefined"
    ? (navigator.language.split('-')[0] as keyof typeof messages)
    : 'en';

// Sélectionner les messages en fonction de la langue détectée
const selectedMessages = messages[browserLanguage] || messages.en;

type ResponseType = InferResponseType<typeof client.api.transactions["bulk-create"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.transactions["bulk-create"]["$post"]>["json"];

export const useBulkCreateTransactions = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.transactions["bulk-create"]["$post"]({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success(selectedMessages.success);
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
            // TODO: Also invalidate summary
        },
        onError: () => {
            toast.error(selectedMessages.error);
        }
    });

    return mutation;
};
