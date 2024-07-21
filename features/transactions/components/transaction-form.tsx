// features/transactions/components/transactions-form.tsx 
import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertTransactionSchema } from "@/db/schema";
import { AmountInput } from "@/components/amount-input";
import { Select } from "@/components/select";
import { DatePicker } from "@/components/date-picker";
import { convertAmountToMiliunits, convertAmountToUSD } from "@/lib/utils";
import { useGetCurrency } from "@/features/currencies/api/use-get-currency";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Currency } from "@/lib/currency-rates";

const messages = {
    en: {
        accountLabel: "Account",
        categoryLabel: "Category",
        payeeLabel: "Payee",
        amountLabel: "Amount",
        notesLabel: "Notes",
        accountPlaceholder: "Select an account",
        categoryPlaceholder: "Select a category",
        payeePlaceholder: "Add a payee",
        amountPlaceholder: "0.00",
        notesPlaceholder: "Optional notes",
        saveChangesButton: "Save changes",
        createTransactionButton: "Create transaction",
        deleteTransactionButton: "Delete transaction",
    },
    fr: {
        accountLabel: "Compte",
        categoryLabel: "Catégorie",
        payeeLabel: "Bénéficiaire",
        amountLabel: "Montant",
        notesLabel: "Notes",
        accountPlaceholder: "Sélectionnez un compte",
        categoryPlaceholder: "Sélectionnez une catégorie",
        payeePlaceholder: "Ajouter un bénéficiaire",
        amountPlaceholder: "0,00",
        notesPlaceholder: "Notes optionnelles",
        saveChangesButton: "Enregistrer les modifications",
        createTransactionButton: "Créer une transaction",
        deleteTransactionButton: "Supprimer la transaction",
    },
};

const formSchema = z.object({
    date: z.coerce.date(),
    accountId: z.string(),
    categoryId: z.string().nullable().optional(),
    payee: z.string(),
    amount: z.string(),
    notes: z.string().nullable().optional(),
});

const apiSchema = insertTransactionSchema.omit({}).extend({
    id: z.string().optional(),
});

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: ApiFormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    accountOptions: { label: string; value: string; }[];
    categoryOptions: { label: string; value: string; }[];
    onCreateAccount: (name: string) => void;
    onCreateCategory: (name: string) => void;
};

export const TransactionForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
    accountOptions,
    categoryOptions,
    onCreateAccount,
    onCreateCategory,
}: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const currencyQuery = useGetCurrency();
    // Définir la devise utilisateur avec une valeur par défaut
    const userCurrency: Currency = (currencyQuery.data?.[0]?.currency as Currency) || 'USD';

    const handleSubmit = (values: FormValues) => {
        const amount = parseFloat(values.amount.replace(',', '.')); // Remplacer les virgules par des points pour les nombres
        if (isNaN(amount)) {
            console.error("Invalid amount");
            return;
        }

        // Convertir le montant en dollars
        const amountInUSD = convertAmountToUSD(amount, userCurrency);

        // Convertir le montant en unités milli
        const amountInMiliunits = convertAmountToMiliunits(amountInUSD);

        // Soumettre les valeurs
        onSubmit({
            ...values,
            amount: amountInMiliunits,
            id: id || '',
        });
    };

    const handleDelete = () => {
        onDelete?.();
    };

    // Définir la langue actuelle
    const currentLanguage = typeof navigator !== "undefined"
        ? (navigator.language.split('-')[0] as 'en' | 'fr')
        : 'en';

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                <FormField
                    name="date"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <DatePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name="accountId"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {messages[currentLanguage]?.accountLabel || messages.en.accountLabel}
                            </FormLabel>
                            <FormControl>
                                <Select
                                    placeholder={messages[currentLanguage]?.accountPlaceholder || messages.en.accountPlaceholder}
                                    options={accountOptions}
                                    onCreate={onCreateAccount}
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name="categoryId"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {messages[currentLanguage]?.categoryLabel || messages.en.categoryLabel}
                            </FormLabel>
                            <FormControl>
                                <Select
                                    placeholder={messages[currentLanguage]?.categoryPlaceholder || messages.en.categoryPlaceholder}
                                    options={categoryOptions}
                                    onCreate={onCreateCategory}
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name="payee"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {messages[currentLanguage]?.payeeLabel || messages.en.payeeLabel}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={disabled}
                                    placeholder={messages[currentLanguage]?.payeePlaceholder || messages.en.payeePlaceholder}
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name="amount"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {messages[currentLanguage]?.amountLabel || messages.en.amountLabel}
                            </FormLabel>
                            <FormControl>
                                <AmountInput
                                    disabled={disabled}
                                    placeholder={messages[currentLanguage]?.amountPlaceholder || messages.en.amountPlaceholder}
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name="notes"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {messages[currentLanguage]?.notesLabel || messages.en.notesLabel}
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    value={field.value ?? ""}
                                    disabled={disabled}
                                    placeholder={messages[currentLanguage]?.notesPlaceholder || messages.en.notesPlaceholder}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button className="w-full" disabled={disabled}>
                    {id ? messages[currentLanguage]?.saveChangesButton || messages.en.saveChangesButton : messages[currentLanguage]?.createTransactionButton || messages.en.createTransactionButton}
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
                        {messages[currentLanguage]?.deleteTransactionButton || messages.en.deleteTransactionButton}
                    </Button>
                )}
            </form>
        </Form>
    );
};
