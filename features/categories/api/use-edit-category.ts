// features/categories/api/use-edit-category.ts
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Messages traduits pour les succès et erreurs
const messages = {
    en: {
        success: "Category updated",
        error: "Failed to edit category"
    },
    fr: {
        success: "Catégorie mise à jour",
        error: "Échec de la modification de la catégorie"
    }
};

const browserLanguage = typeof navigator !== "undefined"
    ? (navigator.language.split('-')[0] as keyof typeof messages)
    : 'en';

// Sélectionner les messages en fonction de la langue détectée
const selectedMessages = messages[browserLanguage] || messages.en;

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]>["json"];

export const useEditCategory = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories[":id"]["$patch"]({
                param: { id },
                json,
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success(selectedMessages.success);
            queryClient.invalidateQueries({ queryKey: ["category", { id }] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
            // TODO: Invalidate summary and transactions
        },
        onError: () => {
            toast.error(selectedMessages.error);
        }
    });

    return mutation;
};
