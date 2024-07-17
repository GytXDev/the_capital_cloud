// pages/settings.tsx
"use client";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import ChangeCurrency from "./change-currency/change-currency";

const SettingsPage = () => {


    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">Settings Page</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                        <ChangeCurrency/>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SettingsPage;
