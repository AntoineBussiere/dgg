"use client";

import { getLocalDate } from "@/hooks/date";
import { PendingMedia, SavedMedia } from "@/types/media";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
    medias: (SavedMedia | PendingMedia)[];
    index: number;
    diapo?: boolean;
    onClose: () => void;
};

export default function MediaLightBox({ medias, index, onClose, diapo = false }: ModalProps) {
    const [currentIndex, setCurrentIndex] = useState(index);
    const [controlsVisible, setControlsVisible] = useState(true);

    const hideTimerRef = useRef<number | null>(null);
    const intervalRef = useRef<number | null>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const previous = () => {
        setCurrentIndex(i => i === 0 ? medias.length - 1 : i - 1);
        if (diapo) {
            stopSlideshow();
            startSlideshow();
        }
    }
    const next = () => {
        setCurrentIndex(i => i === medias.length - 1 ? 0 : i + 1);
        if (diapo) {
            stopSlideshow();
            startSlideshow();
        }
    }

    function startSlideshow() {
        if (!diapo || intervalRef.current) return;

        intervalRef.current = window.setInterval(() => {
            next();
        }, 5000);
    }

    function stopSlideshow() {
        if (!diapo || !intervalRef.current) return;

        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }

    function handleMouseMove() {
        if (!diapo) return;

        setControlsVisible(true);

        if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
        }

        hideTimerRef.current = window.setTimeout(() => {
            setControlsVisible(false);
        }, 1000);
    }

    useEffect(() => {
        setCurrentIndex(index);
    }, [index]);

    /**
     * Handles the closure of the fullscreen
     */
    useEffect(() => {
        function handleFullscreenChange() {
            if (!document.fullscreenElement) {
                onClose();
                stopSlideshow();
            }
        }

        document.addEventListener(
            "fullscreenchange",
            handleFullscreenChange
        );

        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
        };
    }, [onClose]);

    /**
     * Handles the keyboard event listener
     */
    useEffect(() => {
        if (currentIndex === -1) return;

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") previous();
            if (e.key === "ArrowRight") next();
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [currentIndex, onClose]);

    /**
     * Starts the diapo
     */
    useEffect(() => {
        if (!diapo) return;

        startSlideshow();
    }, [diapo]);

    /**
     * Preload the next image
     */
    useEffect(() => {
        const next = medias[(currentIndex + 1) % medias.length];
        const img = new window.Image();
        img.src = next.url;
    }, [medias, currentIndex]);

    if (currentIndex === -1 || typeof window === "undefined") {
        return null;
    }

    return currentIndex !== -1 && (createPortal(
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center ${
                diapo && !controlsVisible ? "cursor-none" : "cursor-default"
            }`}
            ref={overlayRef}
            onMouseMove={handleMouseMove}
        >
            <div
                className={`
                    absolute inset-0
                    ${diapo ? "bg-black" : "bg-black/90"}
                `}
                onClick={onClose}
            />
            <div
                className={`transition-opacity duration-300 ${controlsVisible ? "opacity-100" : "opacity-0"}`}
            >
                {(!diapo || controlsVisible) && (
                    <div>
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
                    </div>
                )}
            </div>
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
                    <p className={`
                        text-white
                        line-clamp-2 truncate
                        flex-1 min-w-0
                        ${diapo ? "text:lg" : "text:sm"}
                    `}>
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

        </div>,
        document.body
    ));
}