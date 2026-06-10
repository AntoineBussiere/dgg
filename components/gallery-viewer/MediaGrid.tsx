"use client"

import { SavedMedia } from "@/types/media";
import Image from "next/image";
import MediaLightBox from "../ui/MediaLightBox";
import { useState } from "react";

type Props = {
    medias: SavedMedia[]
}

export default function MediaGrid({medias}: Props) {
    const [selectedIndex, setSelectedIndex] = useState(-1);

    function openLightBox(index: number) {
        setSelectedIndex(index); 
    }

    function handleLightBoxClosure() {
        setSelectedIndex(-1);
    }

    return (
        <div
            className="
                flex-1 overflow-y-auto
                px-4 pb-4 @container
            "
        >
            <div
                className="
                    grid
                    grid-cols-2
                    gap-3
                    @sm:grid-cols-3
                    @md:grid-cols-4
                    @2xl:grid-cols-6
                "
            >
                {medias.map((media, index) => (
                    <div
                        key={media.id}
                        className="
                            group relative
                            aspect-square
                            overflow-hidden
                            rounded-xl
                        "
                    >
                        <Image
                            alt={media.caption}
                            src={media.url}
                            className="object-cover cursor-pointer"
                            sizes="
                                (max-width: 1024px) 33vw,
                                (max-width: 1536px) 25vw,
                                16vw
                            "
                            fill
                            onClick={() => openLightBox(index)}
                        /> 
                        <div
                            className="
                                absolute inset-x-0 bottom-0
                                bg-gradient-to-t
                                from-black/80
                                to-transparent
                                p-2
                                text-left
                                text-xs
                                text-white
                                truncate
                            "
                        >
                            {media.caption}
                        </div>
                    </div>
                ))}
            </div>
            {selectedIndex >= 0 && (
                <MediaLightBox
                    index={selectedIndex}
                    medias={medias}
                    onClose={handleLightBoxClosure}
                />
            )}
        </div>
    );
}