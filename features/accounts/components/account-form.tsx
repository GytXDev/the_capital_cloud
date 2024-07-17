// features/accounts/components/account-form.tsx 
import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertAccountSchema } from "@/db/schema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

// Messages traduits pour les étiquettes et placeholders
const messages = {
    en: {
        nameLabel: "Name",
        namePlaceholder: "e.g. Cash, Bank, Credit Card",
        saveChanges: "Save changes",
        createAccount: "Create account",
        deleteAccount: "Delete account",
    },
    fr: {
        nameLabel: "Nom",
        namePlaceholder: "ex. Espèces, Banque, Carte de crédit",
        saveChanges: "Enregistrer les modifications",
        createAccount: "Créer un compte",
        deleteAccount: "Supprimer le compte",
    }
};

const browserLanguage = typeof navigator !== "undefined" 
    ? (navigator.language.split('-')[0] as keyof typeof messages) 
    : 'en'; 

const selectedMessages = messages[browserLanguage] || messages.en;

const formSchema = insertAccountSchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
};

export const AccountForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
}: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = (values: FormValues) => {
        console.log({ values });
        onSubmit(values);
    };

    const handleDelete = () => {
        onDelete?.();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {selectedMessages.nameLabel}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={disabled}
                                    placeholder={selectedMessages.namePlaceholder}
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button className="w-full" disabled={disabled}>
                    {id ? selectedMessages.saveChanges : selectedMessages.createAccount}
                </Button>
                {!!id && (
                    <Button
                        type="button"
                        disabled={disabled}
                        onClick={handleDelete}
                        className="w-full"
                        variant="outline"
                    >
                        <Trash className="size-4 mr-2" />
                        {selectedMessages.deleteAccount}
                    </Button>
                )}
            </form>
        </Form>
    );
};
