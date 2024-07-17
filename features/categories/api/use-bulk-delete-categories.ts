// features/categories/api/use-bulk-delete.ts
// features/categories/api/use-bulk-delete.ts
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Messages traduits pour les succès et erreurs
const messages = {
    en: {
        success: "Categories deleted",
        error: "Failed to delete category"
    },
    fr: {
        success: "Catégories supprimées",
        error: "Échec de la suppression de la catégorie"
    }
};

// Détecter la langue du navigateur et assurer que c'est une des clés de messages
const browserLanguage = (navigator.language.split('-')[0] as keyof typeof messages);

// Sélectionner les messages en fonction de la langue détectée
const selectedMessages = messages[browserLanguage] || messages.en;

type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteCategories = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories["bulk-delete"]["$post"]({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success(selectedMessages.success);
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            // TODO: Also invalidate summary
        },
        onError: () => {
            toast.error(selectedMessages.error);
        }
    });

    return mutation;
};
