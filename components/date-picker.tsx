import * as React from "react";
import { format } from "date-fns";
import { fr, enUS, es, de } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { SelectSingleEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; 
import { Calendar } from "./ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
    value?: Date;
    onChange?: SelectSingleEventHandler;
    disabled?: boolean;
}

// Utilitaire pour obtenir la locale de l'utilisateur
const getUserLocale = () => {
    const language = navigator.language;
    switch (language) {
        case 'fr':
        case 'fr-FR':
            return fr;
        case 'es':
        case 'es-ES':
            return es;
        case 'de':
        case 'de-DE':
            return de;
        default:
            return enUS;
    }
};

export const DatePicker = ({
    value,
    onChange,
    disabled,
}: Props) => {
    const userLocale = getUserLocale();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant="outline" 
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                    )}
                >
                    <CalendarIcon className="size-4 mr-2" />
                    {value ? format(value, "PPP", { locale: userLocale }) : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    disabled={disabled}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};
