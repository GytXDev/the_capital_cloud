// features/transactions/components/new-transaction-sheet.tsx
import { z } from "zod";

import { useNewTransaction } from "../hooks/use-new-transaction";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { insertTransactionSchema } from "@/db/schema";
import { useCreateTransaction } from "../api/use-create-transactions";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-accounts";

import { TransactionForm } from "./transaction-form";
import { Loader2 } from "lucide-react";

const messages = {
    en: {
        newTransactionTitle: "New Transaction",
        newTransactionDescription: "Add a new transaction",
    },
    fr: {
        newTransactionTitle: "Nouvelle transaction",
        newTransactionDescription: "Ajouter une nouvelle transaction",
    },
};


const formSchema = insertTransactionSchema.omit({
    id: true
});

type FormValues = z.input<typeof formSchema>;

export const NewTransactionSheet = () => {
    const currentLanguage = navigator.language.split('-')[0] as 'en' | 'fr';
    const { isOpen, onClose } = useNewTransaction();

    const createMutation = useCreateTransaction();

    const categoryQuery = useGetCategories();
    const categoryMutation = useCreateCategory();
    const onCreateCategory = (name: string) => categoryMutation.mutate({
        name
    });
    const categoryOptions = (categoryQuery.data ?? []).map((category: { name: any; id: any; }) => ({
        label: category.name,
        value: category.id,
    }));

    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();
    const onCreateAccount = (name: string) => accountMutation.mutate({
        name
    });
    const accountOptions = (accountQuery.data ?? []).map((account: { name: any; id: any; }) => ({
        label: account.name,
        value: account.id,
    }));

    const isPending = createMutation.isPending ||
        categoryMutation.isPending ||
        accountMutation.isPending;

    const isLoading = createMutation.isPending ||
        categoryMutation.isPending ||
        accountMutation.isPending

    const onSubmit = (values: FormValues) => {
        createMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });

    };
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        {messages[currentLanguage]?.newTransactionTitle || messages.en.newTransactionTitle }
                    </SheetTitle>
                    <SheetDescription>
                        {messages[currentLanguage]?.newTransactionDescription || messages.en.newTransactionDescription}
                    </SheetDescription>
                </SheetHeader>
                {isLoading
                    ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>

                    ) : (
                        <TransactionForm
                            onSubmit={onSubmit}
                            disabled={isPending}
                            categoryOptions={categoryOptions}
                            onCreateCategory={onCreateCategory}
                            accountOptions={accountOptions}
                            onCreateAccount={onCreateAccount}
                        />
                    )}

            </SheetContent>
        </Sheet>
    );
};