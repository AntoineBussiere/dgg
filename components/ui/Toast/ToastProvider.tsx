"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ToastContainer, { Toast, ToastType } from "./ToastContainer";

type ToastContextType = {
    showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({children}: {children: React.ReactNode;}) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(current => current.filter(toast => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = "info") => {
        const id = crypto.randomUUID();

        setToasts(current => [
            ...current,
            {
                id,
                message,
                type,
            },
        ]);

        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, [removeToast]);

    const value = useMemo(
        () => ({ showToast }),
        [showToast]
    );

    return (
        <ToastContext.Provider value={value}>
            {children}

            <ToastContainer
                toasts={toasts}
                onClose={removeToast}
            />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToast must be used inside ToastProvider"
        );
    }

    return context;
}