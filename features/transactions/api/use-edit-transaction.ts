// features/transactions/api/use-edit-transactions.ts
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Définir les messages traduits
const messages = {
    en: {
        success: "Transaction updated",
        error: "Failed to edit transaction"
    },
    fr: {
        success: "Transaction mise à jour",
        error: "Échec de la modification de la transaction"
    }
};

// Détecter la langue du navigateur et s'assurer que c'est une des clés de messages
const browserLanguage = (navigator.language.split('-')[0] as keyof typeof messages);

// Sélectionner les messages en fonction de la langue détectée
const selectedMessages = messages[browserLanguage] || messages.en;

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"];


export const useEditTransaction = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.transactions[":id"]["$patch"]({
                param: { id },
                json,
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success(selectedMessages.success);
            queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
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
