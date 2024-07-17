// components/spending-pie.tsx 
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
import { PieChart, Radar, Target, FileSearch, Loader } from "lucide-react";
import { PieVariant } from "./pie-variant";
import { RadarVariant } from "./radar-variant";
import { RadialVariant } from "./radial-variant";
import { Skeleton } from "./ui/skeleton";


type Props = {
    data?: {
        name: string;
        value: number;
    }[];
};


// Tableaux de traductions
const translations = {
    fr: {
        categories: "Catégories",
        chartType: "Type de graphique",
        pieChart: "Diagramme circulaire",
        radarChart: "Diagramme radar",
        radialChart: "Diagramme radial",
        noData: "Pas de données pour cette période",
    },
    en: {
        categories: "Categories",
        chartType: "Chart type",
        pieChart: "Pie chart",
        radarChart: "Radar chart",
        radialChart: "Radial chart",
        noData: "No data for this period",
    },
};

// Détecter la langue du navigateur et s'assurer que c'est une des clés de messages
const browserLanguage = (navigator.language.split('-')[0] as keyof typeof translations);

// Sélectionner les messages en fonction de la langue détectée
const selectedTranslations = translations[browserLanguage] || translations.en;

export const SpendingPie = ({ data = [] }: Props) => {
    const [chartType, setChartType] = useState("pie");

    const onTypeChange = (type: string) => {
        setChartType(type);
    }

    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
                <CardTitle className="text-xl line-clamp-1">
                    {selectedTranslations.categories}
                </CardTitle>
                <Select
                    defaultValue={chartType}
                    onValueChange={onTypeChange}
                >
                    <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
                        <SelectValue placeholder="Chart type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pie">
                            <div className="flex items-center">
                                <PieChart className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">
                                {selectedTranslations.pieChart}
                                </p>
                            </div>
                        </SelectItem>
                        <SelectItem value="radar">
                            <div className="flex items-center">
                                <Radar className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">
                                    {selectedTranslations.radarChart}
                                </p>
                            </div>
                        </SelectItem>
                        <SelectItem value="radial">
                            <div className="flex items-center">
                                <Target className="size-4 mr-2 shrink-0" />
                                <p className="line-clamp-1">
                                    {selectedTranslations.radialChart}
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
                        {chartType === "pie" && <PieVariant data={data} />}
                        {chartType === "radar" && <RadarVariant data={data} />}
                        {chartType === "radial" && <RadialVariant data={data} />}
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export const SpendingPieLoading = () => {
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