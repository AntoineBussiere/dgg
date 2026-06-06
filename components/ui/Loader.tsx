"use client";

import { createPortal } from "react-dom";

type LoaderProps = {
    show: boolean;
    progress?: number; // 0 → 100
    text?: string;
};

export default function Loader({ show, progress, text = "Chargement..." }: LoaderProps) {
    if (!show) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-72 rounded-xl border border-white/10 bg-black/40 p-5 shadow-2xl">
                
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />

                    <p className="text-sm text-white/80">{text}</p>

                    {typeof progress === "number" && (
                        <div className="w-full">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                                <div
                                    className="h-full bg-white transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <p className="mt-1 text-center text-xs text-white/60">
                                {Math.round(progress)}%
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}