// features/categories/api/use-delete-categories.ts
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Messages traduits pour les succès et erreurs
const messages = {
    en: {
        success: "Category deleted",
        error: "Failed to delete category"
    },
    fr: {
        success: "Catégorie supprimée",
        error: "Échec de la suppression de la catégorie"
    }
};

// Détecter la langue du navigateur et assurer que c'est une des clés de messages
const browserLanguage = (navigator.language.split('-')[0] as keyof typeof messages);

// Sélectionner les messages en fonction de la langue détectée
const selectedMessages = messages[browserLanguage] || messages.en;

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>;

export const useDeleteCategory = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async () => {
            const response = await client.api.categories[":id"]["$delete"]({
                param: { id },
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
