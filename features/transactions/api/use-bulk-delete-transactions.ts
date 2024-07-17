// features/transactions/api/use-bulk-delete.ts
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

// Définir les langues supportées
type SupportedLanguages = 'en' | 'fr';

// Détecter la langue du navigateur
const browserLanguage: SupportedLanguages = navigator.language.split('-')[0] as SupportedLanguages;

// Définir les messages traduits
const messages: Record<SupportedLanguages, { success: string; error: string }> = {
    en: {
        success: "Transactions deleted",
        error: "Failed to delete transactions"
    },
    fr: {
        success: "Transactions supprimées",
        error: "Échec de la suppression des transactions"
    }
};

// Sélectionner les messages en fonction de la langue détectée
const selectedMessages = messages[browserLanguage] || messages.en;

type ResponseType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.transactions["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteTransactions = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.transactions["bulk-delete"]["$post"]({json});
            return await response.json();
        },
        onSuccess: () => {
            toast.success(selectedMessages.success);
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            // TODO: Also invalidate summary
        },
        onError: () => {
            toast.error(selectedMessages.error);
        }
    });

    return mutation;
};