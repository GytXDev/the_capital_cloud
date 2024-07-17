// features/accounts/api/use-delete-account.ts
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Messages traduits pour les toasts et erreurs
const messages = {
    en: {
        successMessage: "Account deleted successfully.",
        errorMessage: "Failed to delete account.",
    },
    fr: {
        successMessage: "Compte supprimé avec succès.",
        errorMessage: "Échec de la suppression du compte.",
    }
};

// Détecter la langue du navigateur et assurer que c'est une des clés de messages
const browserLanguage = (navigator.language.split('-')[0] as keyof typeof messages);

// Sélectionner les messages en fonction de la langue détectée
const selectedMessages = messages[browserLanguage] || messages.en;

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;

export const useDeleteAccount = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async () => {
            const response = await client.api.accounts[":id"]["$delete"]({
                param: { id },
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
        onError: (error) => {
            toast.error(`${selectedMessages.errorMessage}: ${error.message}`);
        }
    });

    return mutation;
};
