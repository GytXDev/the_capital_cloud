// app/(dashboard)/transactions/columns.tsx
"use client";
import { InferResponseType } from "hono";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { client } from "@/lib/hono";
import { Actions } from "./actions";
import { formatCurrency } from "@/lib/utils";
import { Currency } from "@/lib/currency-rates";
import { Badge } from "@/components/ui/badge";
import { AccountColumn } from "./account-column";
import { CategoryColumn } from "./category-column";
import { useGetCurrency } from "@/features/currencies/api/use-get-currency";
import { useMemo } from "react";

// Type pour les données de réponse
export type ResponseType = InferResponseType<typeof client.api.transactions.$get, 200>["data"][0];

const translations = {
  fr: {
    selectAll: "Sélectionner tout",
    date: "Date",
    category: "Catégorie",
    payee: "Bénéficiaire",
    amount: "Montant",
    account: "Compte",
  },
  en: {
    selectAll: "Select all",
    date: "Date",
    category: "Category",
    payee: "Payee",
    amount: "Amount",
    account: "Account",
  },
};

const browserLanguage = typeof navigator !== "undefined"
  ? (navigator.language.split('-')[0] as keyof typeof translations)
  : 'en';

const selectedTranslations = translations[browserLanguage];

// Composant fonctionnel pour afficher le montant formaté
const AmountCell = ({ amount }: { amount: number }) => {
  const { data: currencyData } = useGetCurrency();
  const userCurrency: Currency = currencyData?.[0]?.currency as Currency || "USD";
  // Détermine le nombre de décimales en fonction de la devise
  const minimumFractionDigits = userCurrency === "XAF" ? 0 : 2;
  return (
    <Badge
      variant={amount < 0 ? "destructive" : "primary"}
      className="text-xs font-medium px-3.5 py-2.5"
    >
      {formatCurrency(amount, userCurrency, minimumFractionDigits)}
    </Badge>
  );
};

// Composant fonctionnel pour afficher la date formatée
const DateCell = ({ date }: { date: string }) => {
  const formattedDate = useMemo(() => {
    const d = new Date(date);
    const formatted = d.toLocaleDateString(navigator.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Capitalize the first letter of the month
    return formatted.split(' ').map((word, index) => {
      if (index === 1) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    }).join(' ');
  }, [date]);

  return <span>{formattedDate}</span>;
};

export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {selectedTranslations.date}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <DateCell date={row.getValue("date") as string} />,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {selectedTranslations.category}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <CategoryColumn
        id={row.original.id}
        category={row.original.category}
        categoryId={row.original.categoryId}
      />
    ),
  },
  {
    accessorKey: "payee",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {selectedTranslations.payee}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {selectedTranslations.amount}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <AmountCell amount={parseFloat(row.getValue("amount"))} />,
  },
  {
    accessorKey: "account",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {selectedTranslations.account}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <AccountColumn
        account={row.original.account}
        accountId={row.original.accountId}
      />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />
  }
];
