"use client";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transactions";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import { useConfirm } from "@/hooks/use-confirm";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type Props = {
    id: string;
};

const translations = {
    fr: {
        confirmDeleteTitle: "Êtes-vous sûr ?",
        confirmDeleteMessage: "Vous êtes sur le point de supprimer cette transaction",
        edit: "Modifier",
        delete: "Supprimer",
    },
    en: {
        confirmDeleteTitle: "Are you sure?",
        confirmDeleteMessage: "You are about to delete this transaction",
        edit: "Edit",
        delete: "Delete",
    },
};

// Détecter la langue du navigateur et s'assurer que c'est une des clés de messages
const browserLanguage = (navigator.language.split('-')[0] as keyof typeof translations) || 'en';

// Sélectionner les messages en fonction de la langue détectée
const selectedTranslations = translations[browserLanguage];


export const Actions = ({ id }: Props) => {
    const [ConfirmDialog, confirm] = useConfirm(
        (selectedTranslations.confirmDeleteTitle),
        (selectedTranslations.confirmDeleteMessage
        ));

    const deleteMutation = useDeleteTransaction(id);
    const { onOpen } = useOpenTransaction();

    const handleDelete = async () => {
        const ok = await confirm();
        if (ok) {
            deleteMutation.mutate();
        }
    };

    return (
        <>
            <ConfirmDialog />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        disabled={deleteMutation.isPending}
                        onClick={() => { onOpen(id); }}
                    >
                        <Edit className="size-4 mr-2" />
                        {selectedTranslations.edit}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={deleteMutation.isPending}
                        onClick={handleDelete}
                    >
                        <Trash className="size-4 mr-2" />
                        {selectedTranslations.delete}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default Actions;
