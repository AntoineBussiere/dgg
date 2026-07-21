'use client'

import { PendingMedia } from "@/types/media";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { useToast } from "../ui/Toast/ToastProvider";
import { getImageDimensions, getVideoDimensions } from "@/hooks/file";

type Props = {
    onMediasAdded: (medias: PendingMedia[]) => void,
    selectedFolder: string
}

export default function Dropzone({onMediasAdded, selectedFolder}: Props) {
    const [isDragging, setIsDragging] = useState(false);

    const inputMediaRef = useRef<HTMLInputElement>(null);
    const inputFolderRef = useRef<HTMLInputElement>(null);

    const { showToast } = useToast();

    useEffect(() => {
        const preventDefault = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
        };

        window.addEventListener("dragover", preventDefault);
        window.addEventListener("drop", preventDefault);

        return () => {
            window.removeEventListener("dragover", preventDefault);
            window.removeEventListener("drop", preventDefault);
        };
    }, []);

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleMediaTransfer(e.dataTransfer?.files);
    };

    const openMediaImport = () => {
        inputMediaRef.current?.click();
    }

    const openFolderImport = () => {
        inputFolderRef.current?.click();
    }

    const handleMediaImport = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        handleMediaTransfer(e.target.files);
    }

    const handleFolderImport = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        handleMediaTransfer(e.target.files);
    }

    const handleMediaTransfer = async (medias: FileList | null) => {
        if (medias && medias.length > 0) {
            const mediasArray = filterValidMedias(Array.from(medias));
            const filteredMediasArray = mediasArray.filter(x => x.size > 0);

            if (filteredMediasArray.length !== mediasArray.length) {
                const nbLostMedia = mediasArray.length - filteredMediasArray.length;
                showToast(`${nbLostMedia} fichier${nbLostMedia > 1 ? 's' : ''} n'${nbLostMedia > 1 ? 'ont' : 'a'} pas pu être importé${nbLostMedia > 1 ? 's' : ''}. Cela peut être dû à un nom de fichier trop long (30+ caractères)`, 'error');
            }

            const structuredArrayPromise = filteredMediasArray.map(async media => {
                const folder = media.webkitRelativePath;
                let width: number, height: number;
                if (media.type.startsWith('image/')) {
                    ({ width, height } = await getImageDimensions(media));
                } else {
                    ({ width, height } = await getVideoDimensions(media));
                }
                
                return {
                    id: crypto.randomUUID(),
                    file: media,
                    caption: media.name,
                    folderPath: folder ? selectedFolder + '/' + folder.substring(0, folder.lastIndexOf("/")) : selectedFolder,
                    status: 'pending',
                    url: URL.createObjectURL(media),
                    width,
                    height
                } as PendingMedia;
            })
            const structuredArray = await Promise.all(structuredArrayPromise);
            
            onMediasAdded(structuredArray);
        }
    }

    const filterValidMedias = (medias: File[]): File[] => {
        return medias.filter(media => /*media.type.includes('video') || */media.type.includes('image'));
    }

    return (
        <div>
            <div
                className={`
                    min-h-55
                    border
                    border-dashed
                    rounded-2xl
                    p-10
                    text-center
                    backdrop-blur-xl
                    hover:bg-white/10
                    transition-all duration-200
                    flex
                    items-center
                    justify-center
                    ${isDragging
                        ? "bg-white/10 border-cyan-400"
                        : "bg-white/5 border-white/20"
                    }
                `}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {!isDragging && 
                    <div>
                        <div className="text-lg font-semibold">
                            Drag & drop des fichiers ou dossiers
                        </div>

                        <div className="text-sm text-slate-300 mt-2">
                            ou clique sur un bouton pour importer
                        </div>

                        <div className="flex justify-center gap-3 mt-4">
                            <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm" onClick={openMediaImport}>
                                Fichier
                            </button>
                            <input type="file" className="hidden" ref={inputMediaRef} multiple onChange={handleMediaImport} accept="image/*, video/*" />

                            <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm" onClick={openFolderImport}>
                                Dossier
                            </button>
                            <input
                                type="file"
                                {...({
                                    webkitdirectory: "",
                                } as React.InputHTMLAttributes<HTMLInputElement> & {
                                    webkitdirectory?: string;
                                })}
                                className="hidden" ref={inputFolderRef} onChange={handleFolderImport} accept="image/*, video/*" />
                            {/* Linter doesn't want webkitdirectory */}
                        </div>
                    </div>
                }
                {isDragging && 
                    <div className="text-lg font-semibold pointer-events-none">
                        Dépose les fichiers ici
                    </div>
                }
            </div>
        </div>
    );
}