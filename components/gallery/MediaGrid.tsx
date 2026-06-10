"use client"

import { PendingMedia, SavedMedia } from "@/types/media";
import MediaCard from "./MediaCard";
import MediaLightBox from "../ui/MediaLightBox";
import { useState } from "react";

type Props = {
    importedMedias: PendingMedia[],
    savedMedias: SavedMedia[],
    onUpdateMedia: (media: SavedMedia | PendingMedia) => void,
    onDeleteMedia: (media: SavedMedia | PendingMedia) => void
}

export default function MediaGrid({importedMedias, onUpdateMedia, onDeleteMedia, savedMedias}: Props) {
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const allMedias = [...importedMedias, ...savedMedias];

    function openLightBox(mediaId: string) {
        setSelectedIndex(allMedias.findIndex(x => x.id === mediaId)); 
    }

    function handleLightBoxClosure() {
        setSelectedIndex(-1);
    }

    return (
        <div className="space-y-8">
            {importedMedias.length > 0 && (
                <section className="space-y-4 @container">
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-white/10" />

                        <div className="
                            flex items-center gap-2
                            rounded-full
                            border border-emerald-500/20
                            bg-emerald-500/10
                            px-3 py-1
                            text-xs font-medium tracking-wide text-emerald-300
                            backdrop-blur-sm
                        ">
                            <div className="h-2 w-2 rounded-full bg-yellow-400" />
                            Nouveaux fichiers importés
                        </div>

                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 @lg:grid-cols-4 @2xl:grid-cols-6">
                        {importedMedias.map(media => (
                            <MediaCard
                                media={media}
                                key={media.id}
                                onUpdateMedia={onUpdateMedia}
                                onDeleteMedia={onDeleteMedia}
                                openLightbox={openLightBox}
                            />
                        ))}
                    </div>
                </section>
            )}

            <section className="space-y-4 @container">
                {importedMedias.length > 0 && savedMedias.length > 0 && (
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-white/10" />

                        <div className="
                            flex items-center gap-2
                            rounded-full
                            border border-white/10
                            bg-white/5
                            px-3 py-1
                            text-xs font-medium tracking-wide text-white/70
                            backdrop-blur-sm
                        ">
                            <div className="h-2 w-2 rounded-full bg-emerald-400" />
                            Fichiers sauvegardés
                        </div>

                        <div className="h-px flex-1 bg-white/10" />
                    </div>
                )}

                <div className="grid grid-cols-3 gap-4 @lg:grid-cols-4 @2xl:grid-cols-6">
                    {savedMedias.map(media => (
                        <MediaCard
                            media={media}
                            key={media.id}
                            onUpdateMedia={onUpdateMedia}
                            onDeleteMedia={onDeleteMedia}
                            openLightbox={openLightBox}
                        />
                    ))}
                </div>
            </section>
            {selectedIndex >= 0 && (
                <MediaLightBox
                    medias={allMedias}
                    index={selectedIndex}
                    onClose={handleLightBoxClosure}
                />
            )}
        </div>
    );
}