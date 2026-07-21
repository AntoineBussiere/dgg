"use client"

import { SavedMedia } from "@/types/media";
import MediaLightBox from "../ui/MediaLightBox";
import { useState } from "react";

type Props = {
    medias: SavedMedia[]
}

export default function GalleryHeader({medias}: Props) {
    const [selectedIndex, setSelectedIndex] = useState(-1);

    function handleDiapo() {
        setSelectedIndex(Math.floor(Math.random() * medias.length));
        const el = document.documentElement;
        el.requestFullscreen?.().catch(() => {});
    }

    function handleDiapoClosure() {
        setSelectedIndex(-1);
        if (document.fullscreenElement) {
            document.exitFullscreen?.().catch(() => {});
        }
    }

    // https://stackoverflow.com/a/12646864
    function randomizeMedia(): SavedMedia[] {
        const array = [...medias];
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    return (
        <div>
            <div
                className="
                    flex items-center justify-between
                    border-b border-current/10
                    px-4 py-3
                    shrink-0
                "
            >
                <div>
                    <h1 className="text-lg font-semibold">
                        Galerie
                    </h1>

                    <p className="text-xs opacity-60">
                        {medias.length} médias
                    </p>
                </div>
                <button
                    disabled={medias.length === 0}
                    className="
                        rounded-lg
                        border border-current/10
                        px-3 py-2
                        text-sm
                        hover:bg-current/10
                        disabled:cursor-default
                        disabled:opacity-40
                    "
                    onClick={handleDiapo}
                >
                    Diaporama
                </button>
            </div>
            {selectedIndex >= 0 && (
                <MediaLightBox
                    index={selectedIndex}
                    medias={randomizeMedia()}
                    onClose={handleDiapoClosure}
                    diapo
                />
            )}
        </div>
    );
}