// features/accounts/api/use-create-accounts.ts
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Messages traduits pour les toasts et erreurs
const messages = {
    en: {
        successMessage: "Account created successfully.",
        errorMessage: "Failed to create account.",
    },
    fr: {
        successMessage: "Compte créé avec succès.",
        errorMessage: "Échec de la création du compte.",
    }
};

// Détecter la langue du navigateur et assurer que c'est une des clés de messages
const browserLanguage = typeof navigator !== "undefined"
    ? (navigator.language.split('-')[0] as keyof typeof messages)
    : 'en';

// Sélectionner les messages en fonction de la langue détectée
const selectedMessages = messages[browserLanguage] || messages.en;

type ResponseType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"];

export const useCreateAccount = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts.$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success(selectedMessages.successMessage);
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
        onError: (error) => {
            toast.error(`${selectedMessages.errorMessage}: ${error.message}`);
        }
    });

    return mutation;
};
