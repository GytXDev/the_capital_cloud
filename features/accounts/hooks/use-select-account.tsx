// hooks/use-select-account.tsx
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle
} from "@/components/ui/dialog";
import { useGetAccounts } from "../api/use-get-accounts";
import { useCreateAccount } from "../api/use-create-accounts";
import { Select } from "@/components/select";

// Messages traduits pour les dialogues
const messages = {
    en: {
        dialogTitle: "Select Account",
        dialogDescription: "Please select an account to continue.",
        cancelButton: "Cancel",
        confirmButton: "Confirm",
    },
    fr: {
        dialogTitle: "Sélectionner un compte",
        dialogDescription: "Veuillez sélectionner un compte pour continuer.",
        cancelButton: "Annuler",
        confirmButton: "Confirmer",
    }
};

const browserLanguage = typeof navigator !== "undefined"
    ? (navigator.language.split('-')[0] as keyof typeof messages)
    : 'en';

// Sélectionner les messages en fonction de la langue détectée
const selectedMessages = messages[browserLanguage] || messages.en;

export const useSelectAccount = (): [() => JSX.Element, () => Promise<string | undefined>] => {

    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();
    const onCreateAccount = (name: string) => accountMutation.mutate({
        name
    });

    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id,
    }));

    const [promise, setPromise] = useState<{
        resolve: (value: string | undefined) => void
    } | null>(null);
    const selectValue = useRef<string | undefined>(undefined);

    const confirm = () => new Promise<string | undefined>((resolve) => {
        setPromise({ resolve });
    });

    const handleClose = () => {
        setPromise(null);
    }

    const handleConfirm = () => {
        promise?.resolve(selectValue.current);
        handleClose();
    }

    const handleCancel = () => {
        promise?.resolve(undefined);
        handleClose();
    }

    const confirmationDialog = () => (
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selectedMessages.dialogTitle}</DialogTitle>
                    <DialogDescription>{selectedMessages.dialogDescription}</DialogDescription>
                </DialogHeader>
                <Select
                    placeholder="Select an account"
                    options={accountOptions}
                    onCreate={onCreateAccount}
                    onChange={(value) => selectValue.current = value}
                    disabled={accountQuery.isLoading || accountMutation.isPending}
                />
                <DialogFooter className="pt-2">
                    <Button onClick={handleCancel} variant="outline">
                        {selectedMessages.cancelButton}
                    </Button>
                    <Button onClick={handleConfirm}>
                        {selectedMessages.confirmButton}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    return [confirmationDialog, confirm];
};
