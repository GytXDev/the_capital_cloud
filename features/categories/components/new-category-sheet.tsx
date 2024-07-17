// features/categories/components/new-category-sheet.tsx
import { useNewCategory } from "../hooks/use-new-category";
import { z } from "zod";
import { CategoryForm } from "@/features/categories/components/category-form";
import { useCreateCategory } from "../api/use-create-category";
import { insertCategorySchema } from "@/db/schema";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";

// Messages traduits pour le titre et la description
const messages = {
    en: {
        title: "New Category",
        description: "Create a new category to organize your transactions",
    },
    fr: {
        title: "Nouvelle catégorie",
        description: "Créer une nouvelle catégorie pour organiser vos transactions",
    }
};

const browserLanguage = typeof navigator !== "undefined"
    ? (navigator.language.split('-')[0] as keyof typeof messages)
    : 'en';

// Sélectionner les messages en fonction de la langue détectée
const selectedMessages = messages[browserLanguage] || messages.en;

const formSchema = insertCategorySchema.pick({
    name: true
});

type FormValues = z.input<typeof formSchema>;

export const NewCategorySheet = () => {
    const { isOpen, onClose } = useNewCategory();

    const mutation = useCreateCategory();

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
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
                        {selectedMessages.title}
                    </SheetTitle>
                    <SheetDescription>
                        {selectedMessages.description}
                    </SheetDescription>
                </SheetHeader>
                <CategoryForm
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
