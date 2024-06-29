"use client";

import { useMountedState } from "react-use";

import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";
import { useEffect, useState } from "react";

export const SheetProvider = () => {
    //const isMounted = useMountedState();

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;
    return (
        <>
            <NewAccountSheet />
        </>
    )
}