// features/categories/api/use-create-categories.ts
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Messages traduits pour les succès et erreurs
const messages = {
    en: {
        success: "Category created",
        error: "Failed to create category"
    },
    fr: {
        success: "Catégorie créée",
        error: "Échec de la création de la catégorie"
    }
};

// Détecter la langue du navigateur et assurer que c'est une des clés de messages
const browserLanguage = typeof navigator !== "undefined"
    ? (navigator.language.split('-')[0] as keyof typeof messages)
    : 'en';

// Sélectionner les messages en fonction de la langue détectée
const selectedMessages = messages[browserLanguage] || messages.en;

type ResponseType = InferResponseType<typeof client.api.categories.$post>;
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"];

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories.$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success(selectedMessages.success);
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: () => {
            toast.error(selectedMessages.error);
        }
    });

    return mutation;
};