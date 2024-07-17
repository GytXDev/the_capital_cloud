// features/accounts/api/use-edit-account.ts
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Messages traduits pour les toasts et erreurs
const messages = {
    en: {
        successMessage: "Account updated successfully.",
        errorMessage: "Failed to edit account.",
    },
    fr: {
        successMessage: "Compte mis à jour avec succès.",
        errorMessage: "Échec de la modification du compte.",
    }
};

// Détecter la langue du navigateur et assurer que c'est une des clés de messages
const browserLanguage = (navigator.language.split('-')[0] as keyof typeof messages);

// Sélectionner les messages en fonction de la langue détectée
const selectedMessages = messages[browserLanguage] || messages.en;

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>["json"];

export const useEditAccount = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts[":id"]["$patch"]({
                param: { id },
                json,
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success(selectedMessages.successMessage);
            queryClient.invalidateQueries({ queryKey: ["account", { id }] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });

            // TODO: Invalidate summary and transactions
        },
        onError: () => {
            toast.error(selectedMessages.errorMessage);
        }
    });

    return mutation;
};
