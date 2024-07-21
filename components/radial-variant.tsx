// components/radial-variant.tsx
import {
    RadialBar,
    RadialBarChart,
    Legend,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

import { formatCurrency } from "@/lib/utils";
import { CategoryTooltip } from "./category-tooltip";
import { useGetCurrency } from "@/features/currencies/api/use-get-currency";
import { Currency } from "@/lib/currency-rates";

const COLORS = ["#0062FF", "#12C6FF", "#FF647F", "#FF9354"];

type Props = {
    data: {
        name: string,
        value: number,
    }[];
}

export const RadialVariant = ({ data }: Props) => {
    const { data: currencyData, isLoading, isError } = useGetCurrency();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !currencyData || currencyData.length === 0) {
        return <div>Error fetching currency</div>;
    }

    // Récupérez la devise à partir des données de la réponse API
    const userCurrency: Currency = currencyData?.[0]?.currency as Currency || "USD";

    return (
        <ResponsiveContainer width="100%" height={350}>
            <RadialBarChart
                cx="50%"
                cy="30%"
                barSize={10}
                innerRadius="90%"
                outerRadius="40%"
                data={data.map((item, index) => ({
                    ...item,
                    fill: COLORS[index % COLORS.length]
                }))}
            >
                <RadialBar
                    label={{
                        position: "insideStart",
                        fill: "#fff",
                        fontSize: "12px"
                    }}
                    background
                    dataKey="value"
                />
                <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="right"
                    iconType="circle"
                    content={({ payload }: any) => (
                        <ul className="flex flex-col space-y-2">
                            {payload.map((entry: any, index: number) => (
                                <li
                                    key={`item-${index}`}
                                    className="flex items-center space-x-2"
                                >
                                    <span
                                        className="size-2 rounded-full"
                                        style={{ backgroundColor: entry.color }}
                                    />
                                    <div className="space-x-1">
                                        <span className="text-sm text-muted-foreground">
                                            {entry.value}
                                        </span>
                                        <span className="text-sm">
                                            {formatCurrency(entry.payload.value, userCurrency)}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                />
                <Tooltip content={<CategoryTooltip />} />
            </RadialBarChart>
        </ResponsiveContainer>
    );
};
