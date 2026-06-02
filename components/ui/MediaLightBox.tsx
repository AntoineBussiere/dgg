"use client";

import { getLocalDate } from "@/hooks/date";
import { PendingMedia, SavedMedia } from "@/types/media";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
    open: boolean;
    medias: (SavedMedia | PendingMedia)[];
    index: number;
    onClose: () => void;
};

export default function MediaLightBox({ open, medias, index, onClose }: ModalProps) {
    const [currentIndex, setCurrentIndex] = useState(index);

    useEffect(() => {
        if (open) {
            setCurrentIndex(index);
        }
    }, [open, index]);

    useEffect(() => {
        if (!open) return;

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") previous();
            if (e.key === "ArrowRight") next();
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    if (!open || typeof window === "undefined") {
        return null;
    }

    const previous = () => setCurrentIndex(i => i === 0 ? medias.length - 1 : i - 1);
    const next = () => setCurrentIndex(i => i === medias.length - 1 ? 0 : i + 1);

    return currentIndex > -1 && (createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/90"
                onClick={onClose}
            />
            <button
                onClick={previous}
                className="absolute left-6 z-20 text-white/80 hover:text-white transition p-6"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-12 h-12"
                >
                    <path d="M15 18L9 12L15 6" />
                </svg>
            </button>
            <div className="relative z-10">
                <Image
                    key={medias[currentIndex].id}
                    src={medias[currentIndex].url}
                    alt={medias[currentIndex].caption ?? ""}
                    style={{
                        width: 'auto'
                    }}
                    loading="eager"
                    width={medias[currentIndex].width}
                    height={medias[currentIndex].height}
                    className="max-h-[90vh] max-w-[90vw] object-contain"
                />
                <div className="
                    absolute bottom-0 left-0 right-0
                    px-3 py-2 flex items-center gap-2
                    bg-gradient-to-t from-black/70 via-black/40 to-transparent
                ">
                    <p className="
                        text-white text-sm
                        line-clamp-2 truncate
                        flex-1 min-w-0
                    ">
                        {medias[currentIndex].caption}
                    </p>
                    {medias[currentIndex].date && (
                        <p className="
                            text-white text-sm
                            line-clamp-2 truncate
                            shrink-0 whitespace-nowrap
                        ">
                            <i>le {getLocalDate(medias[currentIndex].date)}</i>
                        </p>
                    )}
                </div>
            </div>
            <button
                onClick={next}
                className="absolute right-6 z-20 text-white/80 hover:text-white transition p-6"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-12 h-12"
                >
                    <path d="M9 18L15 12L9 6" />
                </svg>
            </button>

        </div>,
        document.body
    ));
}