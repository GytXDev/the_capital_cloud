// features/transactions/hooks/use-new-transaction.ts

import { create } from "zustand";

type NewTransactionState = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useNewTransaction = create<NewTransactionState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
})); 