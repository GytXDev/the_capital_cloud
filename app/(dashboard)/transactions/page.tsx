// app/(dashboard)/transactions/page.tsx
"use client"
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";
import { insertTransactionSchema, transactions as transactionSchema } from "@/db/schema";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "@/app/(dashboard)/transactions/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { ImportCard } from "./import-card";
import { UploadButton } from "./upload-button";
import { toast } from "sonner";

enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT"
};

const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    meta: {},
};

const translations = {
    fr: {
        addNew: "Ajouter",
        selectAccountError: "Veuillez sélectionner un compte pour continuer.",
        transactionHistory: "Historique des transactions",
    },
    en: {
        addNew: "Add new",
        selectAccountError: "Please select an account to continue.",
        transactionHistory: "Transaction History",
    },
};

const browserLanguage = (navigator.language.split('-')[0] as keyof typeof translations) || 'en';
const selectedTranslations = translations[browserLanguage];


const TransactionsPage = () => {
    const [AccountDialog, confirm] = useSelectAccount();
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        console.log("Uploaded results:", results);
        setImportResults(results);
        setVariant(VARIANTS.IMPORT);
    }

    const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESULTS);
        setVariant(VARIANTS.LIST);
    }

    const newTransaction = useNewTransaction();
    const createTransactions = useBulkCreateTransactions();
    const deleteTransactions = useBulkDeleteTransactions();
    const transactionsQuery = useGetTransactions();

    const transactions = transactionsQuery.data || [];

    const isDisabled =
        transactionsQuery.isLoading ||
        deleteTransactions.isPending;

    const onSubmitImport = async (
        values: typeof transactionSchema.$inferInsert[],
    ) => {
        const accountId = await confirm();
        if (!accountId) {
            return toast.error(selectedTranslations.selectAccountError)
        }

        const data = values.map((value) => ({
            ...value,
            accountId: accountId as string,
        }));

        createTransactions.mutate(data, {
            onSuccess: () => {
                onCancelImport();
            }
        })
    };

    if (transactionsQuery.isLoading) {
        return (
            <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
                <Card className="border-none drop-shadow-sm">
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[500px] w-full flex items-center justify-center">
                            <Loader2 className="size-6 text-slate-300 animate-spin" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (variant === VARIANTS.IMPORT) {
        return (
            <div>
                <AccountDialog />
                <ImportCard
                    data={importResults.data}
                    onCancel={onCancelImport}
                    onSubmit={onSubmitImport}
                />
            </div>
        );
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        {selectedTranslations.transactionHistory}
                    </CardTitle>
                    <div className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:gap-x-2">
                        <Button onClick={newTransaction.onOpen}
                            size="sm"
                            className="flex items-center gap-x-2"
                        >
                            <Plus className="size-4 mr-2" />
                            {selectedTranslations.addNew}
                        </Button>
                        <UploadButton
                            onUpload={onUpload}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        filterKey={"payee"}
                        columns={columns}
                        data={transactions}
                        onDelete={(rows) => {
                            const ids = rows.map((r) => r.original.id);
                            deleteTransactions.mutate({ ids });
                        }}
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

export default TransactionsPage;
