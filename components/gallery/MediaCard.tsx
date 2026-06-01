"use client"

import { deleteMedia, updateMedia } from "@/lib/medias";
import { PendingMedia, SavedMedia } from "@/types/media";
import { useCallback, useEffect, useRef, useState } from "react";
import Modal from "../modal/Modal";
import Image from "next/image";
import { Tooltip } from "../ui/Tooltip";

type Props = {
    file: PendingMedia | SavedMedia,
    onUpdateFile: (file: PendingMedia) => void,
    onDeleteFile: (file: SavedMedia | PendingMedia) => void
}

export default function MediaCard({file, onUpdateFile, onDeleteFile}: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [caption, setCaption] = useState(file.caption ?? '');
    const [date, setDate] = useState(file.date ? getISODate(file.date) : undefined);

    const cardRef = useRef<HTMLDivElement>(null);

    function getISODate (date: string | Date)  {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const handleSave = useCallback(async () => {
        if (file.status === 'saved') {
            if (caption && caption !== '' && caption !== file.caption || date && date !== '' && (file.date ? date !== getISODate(file.date) : true)) {
                await updateMedia(file.id, {
                    caption,
                    date: date ? new Date(date) : undefined
                });
            }            
            setIsEditing(false);
        } else {
            const newFile: PendingMedia = {
                id: file.id,
                file: file.file,
                caption,
                date,
                folderPath: file.folderPath,
                status: file.status,
                url: file.url
            }
            onUpdateFile(newFile);
            setIsEditing(false);
        }
    }, [caption, date, file, onUpdateFile]);

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

    async function handleDelete() {
        if (file.status === 'saved') {
            await deleteMedia(file.public_id);           
        }
        onDeleteFile(file);
        setIsModalOpen(false);
    }

    function getLocalDate (date: string | Date)  {
        
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        return `${day}-${month}-${year}`;
    };

    return (
        <div className="relative rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition" ref={cardRef}>
            {file.status !== 'saved' && (
                <MediaStatusBadge status={file.status} />
            )}
            <div className="relative aspect-square bg-slate-700 overflow-hidden">
                <Image
                    alt={caption}
                    src={file.url}
                    className="object-cover"
                    sizes="
                        (max-width: 1024px) 33vw,
                        (max-width: 1536px) 25vw,
                        16vw
                    "
                    fill />
            </div>

            <div className="p-3 space-y-1">
                {!isEditing ? (
                    <div>
                        <Tooltip content={caption}>
                            <div className="w-full truncate">
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
                            value={date && date !== '' ? getISODate(date) : undefined}
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

                            <button className="flex-1 text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20" onClick={() => setIsEditing(false)}>
                                Annuler
                            </button>
                        </>
                    )}
                    
                </div>
            </div>
            <Modal
                open={isModalOpen}
                title="Supprimer un fichier"
                onClose={() => setIsModalOpen(false)}
            >
                <p>Êtes-vous sûr de vouloir supprimer le fichier suivant : </p>
                <p className="truncate">{file.caption}</p>
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
    status: "pending" | "saved" | "uploading" | "error";
}) {
    return (
        <div className="absolute top-2 right-2">
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
                                : status === "saved"
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