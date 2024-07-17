import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Définir les messages traduits
const messages = {
    en: {
        success: "Transaction created",
        error: "Failed to create transaction"
    },
    fr: {
        success: "Transaction créée",
        error: "Échec de la création de la transaction"
    }
};

const browserLanguage = typeof navigator !== "undefined"
    ? (navigator.language.split('-')[0] as keyof typeof messages)
    : 'en';

// Sélectionner les messages en fonction de la langue détectée
const selectedMessages = messages[browserLanguage] || messages.en;

type ResponseType = InferResponseType<typeof client.api.transactions.$post>;
type RequestType = InferRequestType<typeof client.api.transactions.$post>["json"];

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.transactions.$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success(selectedMessages.success);
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
            // TODO: Invalidate summary
        },
        onError: () => {
            toast.error(selectedMessages.error);
        }
    });

    return mutation;
};
