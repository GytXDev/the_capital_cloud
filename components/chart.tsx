// components/chart.tsx 
import { BarChart3, FileSearch, Loader } from "lucide-react";
import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "./ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectValue,
    SelectTrigger
} from "@/components/ui/select";
import { AreaVariant } from "./area-variant";
import { BarVariant } from "./bar-variant";
import { LineVariant } from "./line-variant";
import { AreaChart, LineChart, BarChart } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

// Tableaux de traductions
const translations = {
    fr: {
        transactions: "Transactions",
        chartType: "Type de graphique",
        areaChart: "Graphique en aires",
        lineChart: "Graphique en lignes",
        barChart: "Graphique en barres",
        noData: "Aucune donnée pour cette période"
    },
    en: {
        transactions: "Transactions",
        chartType: "Chart type",
        areaChart: "Area chart",
        lineChart: "Line chart",
        barChart: "Bar chart",
        noData: "No data for this period"
    },
};

// Détecter la langue du navigateur et s'assurer que c'est une des clés de messages
const browserLanguage = (navigator.language.split('-')[0] as keyof typeof translations) || 'en';

// Sélectionner les messages en fonction de la langue détectée
const selectedTranslations = translations[browserLanguage];

type Props = {
    data?: {
        date: string,
        income: number,
        expenses: number,
    }[];
};

export const Chart = ({ data = [] }: Props) => {
    const [chartType, setChartType] = useState("area");

    const onTypeChange = (type: string) => {
        setChartType(type);
    }

    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
                <CardTitle className="text-xl line-clamp-1">
                    {selectedTranslations.transactions}
                </CardTitle>
                <Select
                    defaultValue={chartType}
                    onValueChange={onTypeChange}
                >
                    <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
                        <SelectValue placeholder={selectedTranslations.chartType} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="area">
                            <div className="flex items-center">
                                <AreaChart className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">
                                    {selectedTranslations.areaChart}
                                </p>
                            </div>
                        </SelectItem>
                        <SelectItem value="line">
                            <div className="flex items-center">
                                <LineChart className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">
                                    {selectedTranslations.lineChart}
                                </p>
                            </div>
                        </SelectItem>
                        <SelectItem value="bar">
                            <div className="flex items-center">
                                <BarChart3 className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">
                                    {selectedTranslations.barChart}
                                </p>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="flex flex-col gap-y-4 items-center justify-center h-[350px} w-full">
                        <FileSearch className="size-6 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">
                            {selectedTranslations.noData}
                        </p>
                    </div>
                ) : (
                    <>
                        {chartType === "line" && <LineVariant data={data} />}
                        {chartType === "area" && <AreaVariant data={data} />}
                        {chartType === "bar" && <BarVariant data={data} />}
                    </>
                )}
            </CardContent>
        </Card>
    );
}

export const ChartLoading = () => {
    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 lg:w-[120px] w-full" />
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full flex items-center justify-center">
                    <Loader className="h-6 w-6 text-slate-300 animate-spin" />
                </div>
            </CardContent>
        </Card>
    );
}
