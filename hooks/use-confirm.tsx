// hooks/use-confirm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle
} from "@/components/ui/dialog";

const messages = {
    en: {
        confirmMessage: "Confirm",
        cancelMessage: "Cancel",
    },
    fr: {
        confirmMessage: "Confirmer",
        cancelMessage: "Annuler",
    },
};


export const useConfirm = (
    title: string,
    message: string,
): [() => JSX.Element, () => Promise<unknown>] => {
    const currentLanguage = navigator.language.split('-')[0] as 'en' | 'fr';

    const [promise, setPromise] = useState<{
        resolve: (value: boolean) => void
    } | null>(null);

    const confirm = () => new Promise<boolean>((resolve) => {
        setPromise({ resolve });
    });

    const handleClose = () => {
        setPromise(null);
    }

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    }

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    }

    const confirmationDialog = () => (
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-2">
                    <Button onClick={handleCancel} variant="outline">
                        {messages[currentLanguage]?.cancelMessage || messages.en.cancelMessage}
                    </Button>
                    <Button onClick={handleConfirm} >
                        {messages[currentLanguage]?.confirmMessage || messages.en.confirmMessage}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    return [confirmationDialog, confirm];
};
