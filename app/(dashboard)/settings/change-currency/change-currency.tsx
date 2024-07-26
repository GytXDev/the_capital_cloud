// app/(dashboard)/settings/change-currency/change-currency.tsx
import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useGetCurrency } from "@/features/currencies/api/use-get-currency";
import { useCreateCurrency } from "@/features/currencies/api/use-create-currency";
import { useUpdateCurrency } from "@/features/currencies/api/use-update-currency";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

const defaultCurrency = "USD";
const availableCurrencies = ["USD", "XAF", "EUR"];

const ChangeCurrency = () => {
  const [selectedCurrency, setSelectedCurrency] = React.useState<string>(defaultCurrency);
  const [isChangingCurrency, setIsChangingCurrency] = React.useState<boolean>(false);
  const [buttonsVisible, setButtonsVisible] = React.useState<boolean>(true);


  // Tableaux de traductions
  const translations = {
    fr: {
      changeCurrency: "",
      applyChange: "",
      cancel: "",
    },
    en: {
      changeCurrency: "Change currency",
      applyChange: "Apply Change",
      cancel: "Cancel",
    },
  };

  const browserLanguage = typeof navigator !== "undefined"
    ? (navigator.language.split('-')[0] as keyof typeof translations)
    : 'en';

  const selectedTranslations = translations[browserLanguage];

  const queryClient = useQueryClient();

  const currencyQuery = useGetCurrency();
  const userCurrency = currencyQuery.data?.[0]?.currency || defaultCurrency;

  const createCurrency = useCreateCurrency();
  const updateCurrency = useUpdateCurrency(currencyQuery.data?.[0]?.id);

  useEffect(() => {
    // Update selected currency based on userCurrency
    setSelectedCurrency(userCurrency);
    // Make sure buttons are visible when currency is reset
    setButtonsVisible(true);
  }, [userCurrency]);

  useEffect(() => {
    // Show buttons if the selected currency changes and the operation is not in progress
    if (!isChangingCurrency && selectedCurrency !== userCurrency) {
      setButtonsVisible(true);
    }
  }, [selectedCurrency, userCurrency, isChangingCurrency]);

  const isDisabled = currencyQuery.isLoading || currencyQuery.isPending;

  const onChange = (newValue: string) => {
    setSelectedCurrency(newValue);
    setButtonsVisible(true); // Show buttons when a new currency is selected
  };

  const handleApplyChange = () => {
    setIsChangingCurrency(true);
    if (currencyQuery.data && currencyQuery.data.length > 0) {
      // Update existing currency
      updateCurrency.mutate(
        { currency: selectedCurrency },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["currency"] });
            setIsChangingCurrency(false);
            setButtonsVisible(false); // Hide buttons after successful change
          },
          onError: () => {
            setIsChangingCurrency(false);
          }
        }
      );
    } else {
      // Create new currency
      createCurrency.mutate(
        { currency: selectedCurrency },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["currency"] });
            setIsChangingCurrency(false);
            setButtonsVisible(false); // Hide buttons after successful change
          },
          onError: () => {
            setIsChangingCurrency(false);
          }
        }
      );
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 p-1">
      <span>Change currency</span>
      <Select value={selectedCurrency} onValueChange={onChange} disabled={isDisabled || isChangingCurrency}>
        <SelectTrigger
          className="lg:w-auto w-full h-10 rounded-md px-3 font-normal bg-white text-black border border-gray-300 focus:ring-offset-0 focus:ring-2 focus:ring-blur-500 outline-none transition"
        >
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          {availableCurrencies.map((currency) => (
            <SelectItem key={currency} value={currency}>
              {currency}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {buttonsVisible && selectedCurrency !== userCurrency && !isChangingCurrency && (
        <div className="flex gap-4 mt-4">
          <Button
            className="w-full bg-blue-500/100 hover:bg-blue-600 text-white"
            onClick={handleApplyChange}
            disabled={isChangingCurrency}
          >
            Apply Change
          </Button>
          <Button
            className="w-full border border-gray-300 text-black hover:bg-gray-200"
            variant="outline"
            onClick={() => setSelectedCurrency(userCurrency)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChangeCurrency;
