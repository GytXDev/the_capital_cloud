// features/currencies/api/use-update-currency.ts
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Messages traduits pour les succès et erreurs
const messages = {
    en: {
        success: "Currency updated",
        error: "Failed to update currency"
    },
    fr: {
        success: "Devise mise à jour",
        error: "Échec de la mise à jour de la devise"
    }
};

const browserLanguage = typeof navigator !== "undefined"
    ? (navigator.language.split('-')[0] as keyof typeof messages)
    : 'en';

// Sélectionner les messages en fonction de la langue détectée
const selectedMessages = messages[browserLanguage] || messages.en;

type ResponseType = InferResponseType<typeof client.api.currencies[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.currencies[":id"]["$patch"]>["json"];

export const useUpdateCurrency = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.currencies[":id"]["$patch"]({
                param: { id },
                json,
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success(selectedMessages.success);
            queryClient.invalidateQueries({ queryKey: ["currency", { id }] });
            queryClient.invalidateQueries({ queryKey: ["currencies"] });
            // Invalidate other queries if necessary
        },
        onError: () => {
            toast.error(selectedMessages.error);
        }
    });

    return mutation;
};
