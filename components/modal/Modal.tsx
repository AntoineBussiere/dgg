"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
    open: boolean;
    title?: string;
    children: React.ReactNode;
    onClose: () => void;
};

export default function Modal({
    open,
    title,
    children,
    onClose,
}: ModalProps) {
    useEffect(() => {
        function handleEscape(e: KeyboardEvent) {
            if (e.key === "Escape") {
                onClose();
            }
        }

        if (open) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open, onClose]);

    if (!open || typeof window === "undefined") {
        return null;
    }

    return createPortal(
        <div className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
        ">
            <div
                onClick={onClose}
                className="
                    absolute
                    inset-0
                    bg-black/60
                    backdrop-blur-sm
                "
            />

            <div className="
                relative
                w-full
                max-w-md
                rounded-2xl
                border
                border-white/10
                bg-slate-900/80
                backdrop-blur-xl
                shadow-2xl
                p-6
            ">
                {title && (
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-white">
                            {title}
                        </h2>
                    </div>
                )}

                <div className="text-slate-200">
                    {children}
                </div>
            </div>
        </div>
    , document.body);
}