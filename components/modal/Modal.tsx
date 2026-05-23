"use client";

import { useEffect, useState } from "react";
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
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
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

    if (!open || !mounted) return null;

    return createPortal(
        <div className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
        ">
            {/* Overlay */}
            <div
                onClick={onClose}
                className="
                    absolute
                    inset-0
                    bg-black/60
                    backdrop-blur-sm
                "
            />

            {/* Modal */}
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
                {/* Header */}
                {title && (
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-white">
                            {title}
                        </h2>
                    </div>
                )}

                {/* Content */}
                <div className="text-slate-200">
                    {children}
                </div>
            </div>
        </div>
    , document.body);
}