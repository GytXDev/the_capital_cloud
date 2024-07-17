// components/welcome-msg.tsx
"use client";

import { useUser } from "@clerk/nextjs";

export const WelcomeMsg = () => {
    const { user, isLoaded } = useUser();
    const browserLanguage = navigator.language.substring(0, 2); 
    // Fonction pour obtenir le texte traduit en fonction de la langue détectée
    const getTranslatedText = (language: string) => {
        switch (language) {
            case 'fr':
                return {
                    welcomeBack: `Bienvenue ${isLoaded ? "," : ""} ${user?.firstName} 👋🏼`,
                    overviewReport: 'Ceci est votre rapport de synthèse financière',
                };
            default:
                return {
                    welcomeBack: `Welcome Back ${isLoaded ? "," : ""} ${user?.firstName} 👋🏼`,
                    overviewReport: 'This is your financial Overview Report',
                };
        }
    };

    // Sélectionne les textes traduits en fonction de la langue du navigateur
    const { welcomeBack, overviewReport } = getTranslatedText(browserLanguage);

    return (
        <div className="space-y-2 mb-4">
            <h2 className="text-2xl lg:text-3xl text-white font-medium">
                {welcomeBack}
            </h2>
            <p className="text-sm lg:text-base text-[#89b6fd]">
                {overviewReport}
            </p>
        </div>
    );
};
