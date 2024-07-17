// components/navigation.tsx
"use client";
import { useState } from "react";
import { useMedia } from "react-use"
import { usePathname, useRouter } from "next/navigation";
import { NavButton } from "./nav-button";
import { Menu } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

// Définition des routes avec les labels traduits
const routes = [
    {
        href: "/",
        label: {
            en: "Overview",
            fr: "Vue d'ensemble",
        },
    },
    {
        href: "/transactions",
        label: {
            en: "Transactions",
            fr: "Transactions",
        }
    },
    {
        href: "/accounts",
        label: {
            en: "Accounts",
            fr: "Comptes",
        }
    },
    {
        href: "/categories",
        label: {
            en: "Categories",
            fr: "Catégories",
        }
    },
    {
        href: "/settings",
        label: {
            en: "Settings",
            fr: "Paramètres",
        }
    }
];

export const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const isMobile = useMedia("(max-width: 1024px)", false);
    const pathname = usePathname();
    const browserLanguage = navigator.language.split('-')[0]; // Obtenir la langue principale du navigateur

    const onClick = (href: string) => {
        router.push(href);
        setIsOpen(false);
    };

    // Fonction pour obtenir le label dans la langue du navigateur
    const getLabel = (labels: { [key: string]: string }) => {
        return labels[browserLanguage] || labels.en; // Priorité à la langue du navigateur, sinon anglais par défaut
    };

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger>
                    <Button
                        variant="outline"
                        size="sm"
                        className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
                    >
                        <Menu className="size-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="px-2">
                    <nav className="flex flex-col gap-y-2 pt-6">
                        {routes.map((route) => (
                            <Button
                                key={route.href}
                                variant={route.href === pathname ? "secondary" : "ghost"}
                                onClick={() => onClick(route.href)}
                                className="w-full justify-start"
                            >
                                {getLabel(route.label)}
                            </Button>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <nav className="hidden lg:flex items-center gap-x- overflow-x-auto">
            {routes.map((route) => (
                <NavButton
                    key={route.href}
                    href={route.href}
                    label={getLabel(route.label)}
                    isActive={pathname === route.href}
                />
            ))}
        </nav>
    )
}
