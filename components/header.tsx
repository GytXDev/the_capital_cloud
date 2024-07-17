// components/header.tsx
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import HeaderLogo from './header-logo';
import { Navigation } from './navigation';
import { UserButton, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';

// Import dynamique des composants WelcomeMsg et Filters
const WelcomeMsg = dynamic(() => import('./welcome-msg').then(mod => mod.WelcomeMsg), { ssr: false });
const Filters = dynamic(() => import('./filters').then(mod => mod.Filters), { ssr: false });

export const Header = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true); // Indique que le composant est monté côté client
    }, []);

    return (
        <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36">
            <div className="max-w-screen-2xl mx-auto">
                <div className="w-full flex items-center justify-between mb-14">
                    <div className="flex items-center lg:gap-x-16">
                        <HeaderLogo />
                        <Navigation />
                    </div>
                    {isMounted && (
                        <ClerkLoaded>
                            <UserButton afterSignOutUrl="/" />
                        </ClerkLoaded>
                    )}
                    {isMounted && (
                        <ClerkLoading>
                            <Loader2 className="size-8 animate-spin text-slate-400" />
                        </ClerkLoading>
                    )}
                </div>
                {isMounted && WelcomeMsg && <WelcomeMsg />}
                {isMounted && Filters && <Filters />}
            </div>
        </header>
    );
};
