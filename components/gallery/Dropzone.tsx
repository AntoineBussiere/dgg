'use client'

import { PendingMedia } from "@/types/media";
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

type Props = {
    onFilesAdded: (files: PendingMedia[]) => void,
    selectedFolder: string
}

export default function Dropzone({onFilesAdded, selectedFolder}: Props) {
    const [isDragging, setIsDragging] = useState(false);

    const inputFileRef = useRef<HTMLInputElement>(null);
    const inputFolderRef = useRef<HTMLInputElement>(null);

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
        handleFileTransfer(e.dataTransfer?.files);
    };

    const openFileImport = () => {
        inputFileRef.current?.click();
    }

    const openFolderImport = () => {
        inputFolderRef.current?.click();
    }

    const handleFileImport = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        handleFileTransfer(e.target.files);
    }

    const handleFolderImport = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        handleFileTransfer(e.target.files);
    }

    const handleFileTransfer = (files: FileList | null): void => {
        if (files && files.length > 0) {
            const filesArray = filterValidFiles(Array.from(files));
            
            onFilesAdded(filesArray.map(file => {
                const folder = file.webkitRelativePath;
                
                return {
                    id: crypto.randomUUID(),
                    file,
                    caption: file.name,
                    folderPath: folder ? selectedFolder + '/' + folder.substring(0, folder.lastIndexOf("/")) : selectedFolder,
                    status: 'pending'
                }
            }));
        }
    }

    const filterValidFiles = (files: File[]): File[] => {
        return files.filter(file => file.type.includes('video') || file.type.includes('image'));
    }

    return (
        <div>
            <div
                className={`
                    min-h-[220px]
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
                            <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm" onClick={openFileImport}>
                                Fichier
                            </button>
                            <input type="file" className="hidden" ref={inputFileRef} multiple onChange={handleFileImport} accept="image/*, video/*" />

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