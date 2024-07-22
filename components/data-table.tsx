import React from "react";
import { Trash } from "lucide-react";
import {
    ColumnDef,
    ColumnFiltersState,
    Row,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/use-confirm";
import { Button } from "./ui/button";

// Tableaux de traductions
const translations = {
    fr: {
        filterPlaceholder: "Filtrer",
        delete: "Supprimer",
        deleteConfirmation: "Êtes-vous sûr ?",
        deleteBulkMessage: "Vous êtes sur le point de supprimer en masse.",
        noResults: "Aucun résultat.",
        selectedRows: "ligne(s) sélectionnée(s).",
        previous: "Précédent",
        next: "Suivant"
    },
    en: {
        filterPlaceholder: "Filter",
        delete: "Delete",
        deleteConfirmation: "Are you sure?",
        deleteBulkMessage: "You are about to perform a bulk delete.",
        noResults: "No results.",
        selectedRows: "row(s) selected.",
        previous: "Previous",
        next: "Next"
    },
};

const browserLanguage = typeof navigator !== "undefined"
    ? (navigator.language.split('-')[0] as keyof typeof translations)
    : 'en';

const selectedTranslations = translations[browserLanguage];


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filterKey: string; // Assurer que filterKey est une chaîne de caractères
    onDelete: (rows: Row<TData>[]) => void;
    disabled?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filterKey,
    onDelete,
    disabled,
}: DataTableProps<TData, TValue>) {
    const [ConfirmDialog, confirm] = useConfirm(
        selectedTranslations.deleteConfirmation,
        selectedTranslations.deleteBulkMessage
    );

    const [sorting, setSorting] = React.useState<SortingState>([]);

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );

    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        }
    });

    return (
        <div>
            <ConfirmDialog />
            <div className="flex items-center py-4">
                <Input
                    placeholder={`${selectedTranslations.filterPlaceholder}...`}
                    value={(table.getColumn(filterKey as string)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(filterKey as string)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <Button
                        disabled={disabled}
                        size="sm"
                        variant="outline"
                        className="ml-auto font-normal text-xs"
                        onClick={async () => {
                            const ok = await confirm();
                            if (ok) {
                                onDelete(table.getFilteredSelectedRowModel().rows);
                                table.resetRowSelection();
                            }
                        }}
                    >
                        <Trash className="size-4 mr-2" />
                        {selectedTranslations.delete} ({table.getFilteredSelectedRowModel().rows.length})
                    </Button>
                )}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {selectedTranslations.noResults}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} {selectedTranslations.selectedRows}{" "}
                    {table.getFilteredRowModel().rows.length}.
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {selectedTranslations.previous}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {selectedTranslations.next}
                </Button>
            </div>
        </div>
    )
}
