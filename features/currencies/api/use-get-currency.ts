// features/currencies/api/use-get-currency.ts
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetCurrency = () => {
    const query = useQuery({
        queryKey: ["currency"],
        queryFn: async () => {
            const response = await client.api.currencies.$get();

            if (!response.ok) {
                throw new Error("Failed to fetch currency");
            }

            const { data } = await response.json();
            return data;
        }
    }); 
    return query;
}
