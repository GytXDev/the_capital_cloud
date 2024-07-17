// features/transactions/components/edit-transaction-sheet.tsx
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TransactionForm } from "./transaction-form";
import { useOpenTransaction } from "../hooks/use-open-transactions";
import { useGetTransaction } from "../api/use-get-transaction";
import { insertTransactionSchema } from "@/db/schema";
import { useEditTransaction } from "../api/use-edit-transaction";
import { useDeleteTransaction } from "../api/use-delete-transaction";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-accounts";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";

const formSchema = insertTransactionSchema.omit({
    id: true,
});

type FormValues = z.input<typeof formSchema>;

// Définir les messages traduits
const messages = {
    en: {
        editSuccess: "Transaction updated successfully",
        editError: "Failed to update transaction",
        deleteTransactionTitle: "Delete Transaction",
        deleteConfirmation: "Are you sure?",
        deleteSuccess: "Transaction deleted successfully",
        deleteError: "Failed to delete transaction",
        editTransactionTitle: "Edit Transaction",
        editTransactionDescription: "Edit an existing Transaction"
    },
    fr: {
        editSuccess: "Transaction mise à jour avec succès",
        editError: "Échec de la mise à jour de la transaction",
        deleteTransactionTitle: "Supprimer la transaction",
        deleteConfirmation: "Êtes-vous sûr(e) ?",
        deleteSuccess: "Transaction supprimée avec succès",
        deleteError: "Échec de la suppression de la transaction",
        editTransactionTitle: "Modifier la transaction",
        editTransactionDescription: "Modifier une transaction existante"
    }
};

export const EditTransactionSheet = () => {
    // Utilisation d'une constante pour définir la langue actuelle
    const currentLanguage = navigator.language.split('-')[0] as 'en' | 'fr';

    const { isOpen, onClose, id } = useOpenTransaction();
    const [ConfirmDialog, confirm] = useConfirm(
        "Delete Transaction",
        messages[currentLanguage]?.deleteConfirmation || messages.en.deleteConfirmation
    );

    const categoryQuery = useGetCategories();
    const categoryMutation = useCreateCategory();
    const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id,
    }));

    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();
    const onCreateAccount = (name: string) => accountMutation.mutate({ name });
    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id,
    }));

    const transactionQuery = useGetTransaction(id);
    const editMutation = useEditTransaction(id);
    const deleteMutation = useDeleteTransaction(id);

    const isPending = editMutation.isPending || deleteMutation.isPending || transactionQuery.isLoading || categoryMutation.isPending || accountMutation.isPending;
    const isLoading = transactionQuery.isLoading || categoryQuery.isLoading || accountQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
                toast.success(messages[currentLanguage].editSuccess || messages.en.editSuccess);
            },
            onError: () => {
                toast.error(messages[currentLanguage].editError || messages.en.editError);
            }
        });
    };

    const onDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                    toast.success(messages[currentLanguage].deleteSuccess || messages.en.deleteSuccess);
                },
                onError: () => {
                    toast.error(messages[currentLanguage].deleteError || messages.en.deleteError);
                }
            });
        }
    };


    const defaultValues = transactionQuery.data ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
    } : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: "",
    };

    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            {messages[currentLanguage]?.editTransactionTitle || messages.en.editTransactionTitle}
                        </SheetTitle>
                        <SheetDescription>
                            {messages[currentLanguage]?.editTransactionDescription || messages.en.editTransactionDescription}
                        </SheetDescription>
                    </SheetHeader>

                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>
                    ) : (
                        <TransactionForm
                            id={id}
                            defaultValues={defaultValues}
                            onSubmit={onSubmit}
                            onDelete={onDelete}
                            disabled={isPending}
                            categoryOptions={categoryOptions}
                            onCreateCategory={onCreateCategory}
                            accountOptions={accountOptions}
                            onCreateAccount={onCreateAccount}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
};
