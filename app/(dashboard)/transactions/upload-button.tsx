// app/(dashboard)/transactions/upload-button.tsx
import { Upload } from "lucide-react";
import { useCSVReader } from "react-papaparse";
import { Button } from "@/components/ui/button";

type Props = {
    onUpload: (result: any) => void;
};

const translations = {
    fr: {
        import: "Importer"
    },
    en: {
        import: "Import"
    },
};

const browserLanguage = (navigator.language.split('-')[0] as keyof typeof translations) || 'en';
const selectedTranslations = translations[browserLanguage];

export const UploadButton = ({ onUpload }: Props) => {
    const { CSVReader } = useCSVReader();

    return (
        <CSVReader
            onUploadAccepted={(results: any) => {
                console.log("CSV results:", results);
                onUpload(results);
            }}
        >
            {({ getRootProps }: any) => (
                <Button
                    size="sm"
                    className="w-full lg:w-auto"
                    {...getRootProps()}
                >
                    <Upload className="size-4 mr-2" />
                    {selectedTranslations.import}
                </Button>
            )}
        </CSVReader>
    );
}
