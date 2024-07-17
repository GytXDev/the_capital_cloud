// features/accounts/api/use-bulk-delete.ts
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Messages traduits pour les toasts et erreurs
const messages = {
    en: {
        successMessage: "Accounts deleted successfully.",
        errorMessage: "Failed to delete accounts.",
    },
    fr: {
        successMessage: "Comptes supprimés avec succès.",
        errorMessage: "Échec de la suppression des comptes.",
    }
};


const browserLanguage = typeof navigator !== "undefined" 
  ? (navigator.language.split('-')[0] as keyof typeof messages) 
  : 'en';


// Sélectionner les messages en fonction de la langue détectée
const selectedMessages = messages[browserLanguage] || messages.en;

type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteAccounts = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts["bulk-delete"]["$post"]({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success(selectedMessages.successMessage);
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: (error) => {
            toast.error(`${selectedMessages.errorMessage}: ${error.message}`);
        }
    });

    return mutation;
};
