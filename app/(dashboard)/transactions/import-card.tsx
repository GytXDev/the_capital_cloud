// app/(dashboard)/transactions/import-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertAmountToMiliunits } from "@/lib/utils";
import { format, parse, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImportTable } from "./import-table";

const dateFormat1 = "dd/MM/yyyy";
const dateFormat2 = "yyyy-MM-dd";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = ["amount", "date", "payee"];

interface SelectedColumnsState {
    [key: string]: string | null;
}

type Props = {
    data: string[][];
    onCancel: () => void;
    onSubmit: (data: any) => void;
}

const translations = {
    fr: {
        importTransaction: "Importer transactions",
        cancel: "Annuler",
        continue: "Continuer",
    },
    en: {
        importTransaction: "Import Transaction",
        cancel: "Cancel",
        continue: "Continue",
    },
};

const browserLanguage = (navigator.language.split('-')[0] as keyof typeof translations) || 'en';

const selectedTranslations = translations[browserLanguage];

const parseDate = (dateString: string) => {
    let parsedDate = parse(dateString, dateFormat1, new Date());
    if (!isValid(parsedDate)) {
        parsedDate = parse(dateString, dateFormat2, new Date());
    }
    return isValid(parsedDate) ? format(parsedDate, outputFormat) : null;
}

export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
    const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>({});

    const headers = data[0];
    const body = data.slice(1);

    const onTableHeadSelectChange = (columnIndex: number, value: string | null) => {
        setSelectedColumns((prev) => {
            const newSelectedColumns = { ...prev };

            for (const key in newSelectedColumns) {
                if (newSelectedColumns[key] === value) {
                    newSelectedColumns[key] = null;
                }
            }

            if (value === "skip") {
                value = null;
            }

            newSelectedColumns[`column_${columnIndex}`] = value;
            return newSelectedColumns;
        });
    };

    const progress = Object.values(selectedColumns).filter(Boolean).length;

    const handleContinue = () => {
        const getColumnIndex = (column: string) => {
            return column.split("_")[1];
        };
        const mappedData = {
            headers: headers.map((_header, index) => {
                const columnIndex = getColumnIndex(`column_${index}`);
                return selectedColumns[`column_${columnIndex}`] || null;
            }),
            body: body.map((row) => {
                const transformedRow = row.map((cell, index) => {
                    const columnIndex = getColumnIndex(`column_${index}`);
                    return selectedColumns[`column_${columnIndex}`] ? cell : null;
                });

                return transformedRow.every((item) => item === null) ? [] : transformedRow;
            }).filter((row) => row.length > 0),
        };

        const arrayOfData = mappedData.body.map((row) => {
            return row.reduce((acc: any, cell, index) => {
                const header = mappedData.headers[index];
                if (header !== null) {
                    acc[header] = cell;
                }
                return acc;
            }, {});
        });

        const formattedData = arrayOfData.map((item) => {
            if (requiredOptions.every(option => item[option] !== undefined && item[option] !== null && item[option] !== '')) {
                return {
                    ...item,
                    amount: convertAmountToMiliunits(parseFloat(item.amount)),
                    date: parseDate(item.date)
                };
            } else {
                return null;
            }
        }).filter(item => item !== null);

        onSubmit(formattedData);
    };

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        {selectedTranslations.importTransaction}
                    </CardTitle>
                    <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                        <Button onClick={onCancel} size="sm" className="w-full lg:w-auto">{selectedTranslations.cancel}</Button>
                        <Button size="sm" disabled={progress < requiredOptions.length} onClick={handleContinue} className="w-full lg:w-auto">
                            {selectedTranslations.continue} ({progress} / {requiredOptions.length})
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ImportTable headers={headers} body={body} selectedColumns={selectedColumns} onTableHeadSelectChange={onTableHeadSelectChange} />
                </CardContent>
            </Card>
        </div>
    );
};
