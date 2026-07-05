"use client"

import { deleteMedia, updateMedia } from "@/lib/medias";
import { PendingMedia, SavedMedia } from "@/types/media";
import { useCallback, useEffect, useRef, useState } from "react";
import Modal from "../modal/Modal";
import Image from "next/image";
import { Tooltip } from "../ui/Tooltip";
import { useToast } from "../ui/Toast/ToastProvider";
import { getISODate, getLocalDate } from "@/hooks/date";

type Props = {
    media: PendingMedia | SavedMedia,
    selected?: boolean,
    multipleSelection?: boolean,
    importedMedia: boolean,
    onUpdateMedia: (media: SavedMedia | PendingMedia) => void,
    onDeleteMedia: (media: SavedMedia | PendingMedia) => void,
    openLightbox: (id: string) => void,
    onSelectionChange?: (selected: boolean) => void
}

export default function MediaCard({media, selected, multipleSelection, importedMedia, onUpdateMedia, onDeleteMedia, openLightbox, onSelectionChange}: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [caption, setCaption] = useState(media.caption ?? '');
    const [date, setDate] = useState(media.date ? getISODate(media.date) : '');
    const [isTruncated, setIsTruncated] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const { showToast } = useToast();

    let originalCaption = media.caption;
    let originalDate = media.date ? getISODate(media.date) : '';

    const handleSave = useCallback(async () => {
        if (media.status === 'saved') {
            if (caption && caption !== '' && caption !== media.caption || date && date !== '' && (media.date ? date !== getISODate(media.date) : true)) {
                try {
                    const updatedMedia = await updateMedia(media.id, {
                        caption,
                        date: date ? new Date(date) : undefined
                    });
                    originalCaption = caption;
                    originalDate = date;

                    onUpdateMedia(updatedMedia);
                } catch(e) {
                    console.log(e);
                    
                    showToast('Une erreur est survenue lors de la sauvegarde du fichier. Veuillez contacter un administrateur.', 'error');
                }
            }            
            setIsEditing(false);
        } else {
            const newMedia: PendingMedia = {
                id: media.id,
                file: media.file,
                caption,
                date,
                folderPath: media.folderPath,
                status: media.status,
                url: media.url,
                width: media.width,
                height: media.height
            }
            onUpdateMedia(newMedia);
            originalCaption = caption;
            originalDate = date;
            setIsEditing(false);
        }
    }, [caption, date, media, onUpdateMedia]);

    useEffect(() => {
        if (multipleSelection) {
            cancelEdit();
            setIsModalOpen(false);
        }
    }, [multipleSelection]);

    useEffect(() => {
        if (!isEditing) return;

        function handleClickOutside(event: MouseEvent) {
            if (
                cardRef.current &&
                !cardRef.current.contains(event.target as Node)
            ) {
                handleSave();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isEditing, handleSave]);

    useEffect(() => {
        const el = tooltipRef.current;
        if (!el) return;

        const resizeObserver = new ResizeObserver(() => {
            setIsTruncated(el.scrollWidth > el.clientWidth);
        });

        resizeObserver.observe(el);

        return () => resizeObserver.disconnect();
    }, []);

    async function handleDelete() {
        if (media.status === 'saved') {
            await deleteMedia(media.public_id);           
        }
        onDeleteMedia(media);
        setIsModalOpen(false);
        showToast('Le fichier a bien été supprimé.', 'success');
    }

    function handleOpenMediaLightBox() {
        openLightbox(media.id);
    }

    function cancelEdit() {
        setIsEditing(false);
        setCaption(originalCaption);
        setDate(originalDate);
    }

    return (
        <div
            className={`
                relative rounded-xl overflow-hidden
                bg-white/5 transition
                ${selected
                    ? "ring-2 ring-blue-500"
                    : "border border-white/10 hover:bg-white/10"}
            `}
            ref={cardRef}
        >

            {/* Checkbox */}
            {!importedMedia && (
                <label
                    className="
                        absolute top-2 left-2
                        cursor-pointer z-10
                    "
                >
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => onSelectionChange?.(e.target.checked)}
                        className="sr-only"
                    />

                    <div
                        className={`
                            flex h-6 w-6 items-center justify-center rounded-md
                            border-2 transition-all duration-150
                            ${
                                selected
                                    ? "bg-blue-500 border-blue-500"
                                    : "bg-black/30 border-white backdrop-blur-sm"
                            }
                        `}
                    >
                        {selected && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 text-white"
                            >
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        )}
                    </div>
                </label>
            )}

            {/* Status badges */}
            {media.status !== 'saved' && (
                <MediaStatusBadge status={media.status} />
            )}
            {media.status === 'saved' && media.new && (
                <MediaStatusBadge status={'new'} />
            )}

            <div className="relative aspect-square bg-slate-700 overflow-hidden">
                <Image
                    alt={caption}
                    src={media.url}
                    className="object-cover"
                    sizes="
                        (max-width: 1024px) 33vw,
                        (max-width: 1536px) 25vw,
                        16vw
                    "
                    fill
                    onClick={handleOpenMediaLightBox} />
            </div>

            <div className="p-3 space-y-1">
                {!isEditing ? (
                    <div>
                        <Tooltip content={caption} disabled={!isTruncated}>
                            <div
                                ref={tooltipRef}
                                className="w-full truncate"
                            >
                                {caption}
                            </div>
                        </Tooltip>

                        <div className="text-xs text-slate-400">
                            {date && date !== '' ? getLocalDate(date) : 'Pas de date'}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <input
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Légende"
                            maxLength={255}
                            autoFocus
                            className="
                                w-full px-3 py-2 rounded-lg
                                bg-white/10 border border-white/10
                                text-xs text-white
                                outline-none
                                focus:border-blue-400
                            "
                        />
                        <input
                            type="date"
                            value={date && date !== '' ? getISODate(date) : ''}
                            onChange={(e) => setDate(e.target.value)}
                            className="
                                w-full px-3 py-2 rounded-lg
                                bg-white/10 border border-white/10
                                text-xs text-white
                                outline-none
                                focus:border-blue-400
                            "
                        />
                    </div>
                )}

                {!multipleSelection && (
                    <div className="flex flex-col 2xl:flex-row gap-2 mt-2 transition">
                        {!isEditing ? (
                            <>
                                <button className="flex-1 min-w-0 text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20" onClick={() => setIsEditing(true)}>
                                    Modifier
                                </button>

                                <button className="flex-1 min-w-0 text-xs px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/40" onClick={() => setIsModalOpen(true)}>
                                    Supprimer
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="flex-1 text-xs px-2 py-1 rounded bg-blue-500 hover:bg-blue-600" onClick={handleSave}>
                                    Sauvegarder
                                </button>

                                <button className="flex-1 text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20" onClick={cancelEdit}>
                                    Annuler
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
            <Modal
                open={isModalOpen}
                title="Supprimer un fichier"
                onClose={() => setIsModalOpen(false)}
            >
                <p>Êtes-vous sûr de vouloir supprimer le fichier suivant : </p>
                <p className="truncate">{media.caption}</p>
                <div className="flex mt-4">
                    <button
                        type="submit"
                        className="w-1/2 text-gray-200 bg-gray-500/10 border-gray-500/30 hover:bg-gray-500/20 hover:border-gray-400/40 py-2 rounded mx-2"
                        onClick={() => setIsModalOpen(false)}
                    >Annuler</button>
                    <button
                        type="submit"
                        className="w-1/2 text-red-200 bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:border-red-400/40 py-2 rounded mx-2"
                        onClick={handleDelete}
                    >Supprimer</button>
                </div>
            </Modal>
        </div>
    );
}


function MediaStatusBadge({
    status,
}: {
    status: "pending" | "saved" | "uploading" | "error" | "new";
}) {
    return (
        <div className="absolute top-2 right-2 z-10">
            <div
                className={`
                    w-6 h-6
                    flex items-center justify-center
                    rounded-full
                    backdrop-blur-md
                    bg-black/20
                    border border-white/10
                `}
            >
                <span
                    className={`
                        w-2 h-2 rounded-full
                        ${
                            status === "pending"
                                ? "bg-yellow-400"
                                : status === "saved" || status === "new"
                                ? "bg-emerald-400"
                                : status === "uploading"
                                ? "bg-blue-400 animate-pulse"
                                : "bg-red-400 animate-pulse"
                        }
                    `}
                />
            </div>
        </div>
    );
}