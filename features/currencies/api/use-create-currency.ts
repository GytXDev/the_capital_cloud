// features/currencies/api/use-create-currency.ts
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Messages traduits pour les succès et erreurs
const messages = {
    en: {
        successMessage: "Currency created successfully.",
        errorMessage: "Failed to create currency.",
    },
    fr: {
        successMessage: "Devise créée avec succès.",
        errorMessage: "Échec de la création de la devise.",
    }
};

// Détecter la langue du navigateur et assurer que c'est une des clés de messages
const browserLanguage = typeof navigator !== "undefined"
    ? (navigator.language.split('-')[0] as keyof typeof messages)
    : 'en';

// Sélectionner les messages en fonction de la langue détectée
const selectedMessages = messages[browserLanguage] || messages.en;

type ResponseType = InferResponseType<typeof client.api.currencies.$post>;
type RequestType = InferRequestType<typeof client.api.currencies.$post>["json"];

export const useCreateCurrency = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.currencies.$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success(selectedMessages.successMessage);
            queryClient.invalidateQueries({ queryKey: ["currencies"] });
        },
        onError: (error) => {
            toast.error(`${selectedMessages.errorMessage}: ${error.message}`);
        }
    });

    return mutation;
};
