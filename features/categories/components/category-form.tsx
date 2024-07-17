// features/categories/components/category-form.tsx 
import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertCategorySchema } from "@/db/schema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";

// Messages traduits pour les actions et les libellés
const messages = {
    en: {
        create: "Create category",
        update: "Save changes",
        delete: "Delete category",
        nameLabel: "Name",
        namePlaceholder: "e.g. Food, Transport, Salary, etc."
    },
    fr: {
        create: "Créer catégorie",
        update: "Enregistrer les changements",
        delete: "Supprimer catégorie",
        nameLabel: "Nom",
        namePlaceholder: "ex. Nourriture, Transport, Salaire, etc."
    }
};

// Détecter la langue du navigateur et assurer que c'est une des clés de messages
const browserLanguage = (navigator.language.split('-')[0] as keyof typeof messages);

// Sélectionner les messages en fonction de la langue détectée
const selectedMessages = messages[browserLanguage] || messages.en;

const formSchema = insertCategorySchema.pick({
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

export const CategoryForm = ({
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
                    {id ? selectedMessages.update : selectedMessages.create}
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
                        {selectedMessages.delete}
                    </Button>
                )}
            </form>
        </Form>
    );
};
