// features/accounts/components/new-account-sheet.tsx
import { z } from "zod";
import { useNewAccount } from "../hooks/use-new-account";
import { AccountForm } from "@/features/accounts/components/account-form";
import { useCreateAccount } from "../api/use-create-accounts";
import { insertAccountSchema } from "@/db/schema";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";

const formSchema = insertAccountSchema.pick({
    name: true
});

type FormValues = z.input<typeof formSchema>;

export const NewAccountSheet = () => {
    const { isOpen, onClose } = useNewAccount();
    const mutation = useCreateAccount();

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    // Messages traduits pour les étiquettes et placeholders
    const messages = {
        en: {
            newAccountTitle: "New Account",
            newAccountDescription: "Create a new account to track your transactions",
            createAccount: "Create account",
        },
        fr: {
            newAccountTitle: "Nouveau compte",
            newAccountDescription: "Créer un nouveau compte pour suivre vos transactions",
            createAccount: "Créer le compte",
        },
    };

    // Détecter la langue du navigateur et assurer que c'est une des clés de messages
    const browserLanguage = (navigator.language.split("-")[0] as keyof typeof messages);
    
    // Sélectionner les messages en fonction de la langue détectée
    const selectedMessages = messages[browserLanguage] || messages.en;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>{selectedMessages.newAccountTitle}</SheetTitle>
                    <SheetDescription>{selectedMessages.newAccountDescription}</SheetDescription>
                </SheetHeader>
                <AccountForm
                    onSubmit={onSubmit}
                    disabled={mutation.isPending}
                    defaultValues={{
                        name: "",
                    }}
                />
            </SheetContent>
        </Sheet>
    );
};
