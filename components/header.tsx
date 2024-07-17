// components/header.tsx
"use client";

import dynamic from 'next/dynamic';

// Importez votre composant WelcomeMsg avec dynamic
const WelcomeMsg = dynamic(() => import('./welcome-msg').then(mod => mod.WelcomeMsg), { ssr: false });
const Filters = dynamic(() => import('./filters').then(mod => mod.Filters), { ssr: false });

import { Loader2 } from 'lucide-react';
import HeaderLogo from './header-logo';
import { Navigation } from './navigation';
import { UserButton, ClerkLoading, ClerkLoaded } from '@clerk/nextjs';

export const Header = () => {
    return (
        <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36">
            <div className="max-w-screen-2xl mx-auto">
                <div className="w-full flex items-center justify-between mb-14">
                    <div className="flex items-center lg:gap-x-16">
                        <HeaderLogo />
                        <Navigation />
                    </div>
                    <ClerkLoaded>
                        <UserButton afterSignOutUrl="/" />
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className="size-8 animate-spin text-slate-400" />
                    </ClerkLoading>
                </div>
                <WelcomeMsg /> {/* Utilisation de WelcomeMsg dynamique */}
                <Filters /> {/* Utilisation de Filters dynamique */}
            </div>
        </header>
    );
};
