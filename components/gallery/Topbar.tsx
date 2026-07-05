"use client"

import { uploadMany } from "@/lib/upload";
import { CreateMediaDTO, PendingMedia, SavedMedia } from "@/types/media";
import { useToast } from "../ui/Toast/ToastProvider";
import Loader from "../ui/Loader";
import { useState } from "react";
import { Tooltip } from "../ui/Tooltip";
import Modal from "../modal/Modal";
import { deleteMedias } from "@/lib/medias";

type Props = {
    importedMedias: PendingMedia[],
    selectedFolder: string,
    selectedMedias: SavedMedia[],
    onMediasSaving: () => void,
    onMediasSaved: (medias: SavedMedia[]) => void,
    onMediasError: () => void,
    onResetSelection: () => void
}

export default function Topbar({importedMedias, selectedFolder, selectedMedias, onMediasSaving, onMediasSaved, onMediasError, onResetSelection}: Props) {
    const { showToast } = useToast();

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    async function handleSave() {
        setLoading(true);
        setProgress(0);
        onMediasSaving();
        const uploadedData = await uploadMany(importedMedias.map(x => x.file), selectedFolder, setProgress);
        const medias: CreateMediaDTO[] = [];

        for(let i = 0; i < uploadedData.length; i++) {
            const date = importedMedias[i].date ?? null;
            medias.push({
                url: uploadedData[i].secure_url,
                bytes: uploadedData[i].bytes,
                caption: importedMedias[i].caption,
                date: date && date !== '' ? new Date(date) : undefined,
                folderPath: uploadedData[i].asset_folder as string,
                format: uploadedData[i].format,
                height: uploadedData[i].height,
                width: uploadedData[i].width,
                public_id: uploadedData[i].public_id,
                type: uploadedData[i].resource_type,
                createdAt: new Date()
            });
        }

        const res = await fetch("/api/gallery/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ medias }),
        });

        if (res.status === 500) {
            onMediasError();
            showToast('Une erreur est survenue lors de la sauvegarde. Veuillez contacter un administrateur.', 'error');
        } else {
            onMediasSaved(await res.json());
            showToast('Les fichiers ont bien été sauvegardés.', 'success');
        }

        setLoading(false);
    }

    async function downloadSelectedMedias() {
        const savedSelectedMediasIds = 
            selectedMedias.flatMap(m =>
                m.status === "saved" ? [m.public_id] : []
            );

        const res = await fetch("/api/gallery/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(savedSelectedMediasIds),
        });

        if (!res.ok) {
            showToast('Une erreur est survenue lors de la génération de l\'archive.', 'error');
        } else {
            const blob = await res.blob();
    
            const url = URL.createObjectURL(blob);
    
            const a = document.createElement("a");
            a.href = url;
            a.download = selectedFolder + ".zip";
            a.click();
    
            URL.revokeObjectURL(url);
            onResetSelection();
        }

    }

    async function deleteSelectedMedias() {
        await deleteMedias(selectedMedias.map(x => x.public_id));
    }

    return (
        <div className="flex items-center justify-between h-15 px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="text-sm text-slate-300">
                {selectedFolder.split('/').join(' / ')}
            </div>

            {importedMedias.length > 0 && selectedMedias.length === 0 && (
                <div className="flex gap-3 items-center">
                    <div className="text-sm text-slate-300 px-3 flex">
                        <div className="px-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5 text-orange-400"
                            >
                                <path d="
                                    M12 2
                                    C11.6 2 11.3 2.2 11.1 2.6
                                    L1.6 20.3
                                    C1.3 20.9 1.7 21.5 2.4 21.5
                                    H21.6
                                    C22.3 21.5 22.7 20.9 22.4 20.3
                                    L12.9 2.6
                                    C12.7 2.2 12.4 2 12 2
                                    Z
                                " />
                                <path
                                    d="M12 8v5"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <circle
                                    cx="12"
                                    cy="16.5"
                                    r="1.2"
                                    fill="white"
                                />
                            </svg>
                        </div>
                        {importedMedias.length} fichier{importedMedias.length > 1 && 's'} en attente
                    </div>

                    <button className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-sm" onClick={handleSave}>
                        Sauvegarder
                    </button>
                </div>
            )} 

            {selectedMedias.length > 0 && (
                <div className="flex gap-3 items-center">
                    <div className="text-sm text-slate-300 px-3 flex">
                        {selectedMedias.length} fichier{selectedMedias.length > 1 && 's'} sélectionné{selectedMedias.length > 1 && 's'}
                    </div>

                    <div>
                        <Tooltip content="Annuler la sélection">
                            <button
                                className="
                                    flex h-11 w-11 items-center justify-center
                                    rounded-full
                                    bg-slate-500/10
                                    text-slate-300
                                    transition
                                    hover:bg-slate-500/20
                                    hover:text-white
                                    active:scale-95
                                "
                                onClick={onResetSelection}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M15 9l-6 6" />
                                    <path d="M9 9l6 6" />
                                </svg>
                            </button>
                        </Tooltip>
                    </div>

                    <div>
                        <Tooltip content="Télécharger">
                            <button
                                className="
                                    flex h-11 w-11 items-center justify-center
                                    rounded-full
                                    bg-blue-500/10
                                    text-blue-300
                                    transition
                                    hover:bg-blue-500/20
                                    hover:text-blue-200
                                    active:scale-95
                                "
                                onClick={downloadSelectedMedias}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <path d="M12 3v12" />
                                    <path d="M7 10l5 5 5-5" />
                                    <path d="M5 21h14" />
                                </svg>
                            </button>
                        </Tooltip>
                    </div>

                    <div>
                        <Tooltip content="Supprimer">
                            <button
                                className="
                                    flex h-11 w-11 items-center justify-center
                                    rounded-full
                                    bg-red-500/10
                                    text-red-300
                                    transition
                                    hover:bg-red-500/20
                                    hover:text-red-200
                                    active:scale-95
                                "
                                onClick={() => setIsModalOpen(true)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <path d="M3 6h18" />
                                    <path d="M8 6V4h8v2" />
                                    <path d="M19 6l-1 14H6L5 6" />
                                    <path d="M10 11v6" />
                                    <path d="M14 11v6" />
                                </svg>
                            </button>
                        </Tooltip>
                    </div>
                </div>
            )} 
            <Loader show={loading} progress={progress} text="Upload en cours..." />
            <Modal
                open={isModalOpen}
                title="Supprimer des fichiers"
                onClose={() => setIsModalOpen(false)}
            >
                <p> Êtes-vous sûr de vouloir supprimer les {selectedMedias.length} médias sélectionnés ? </p>
                <p> Cette action est irréversible. </p>
                <div className="flex mt-4">
                    <button
                        type="submit"
                        className="w-1/2 text-gray-200 bg-gray-500/10 border-gray-500/30 hover:bg-gray-500/20 hover:border-gray-400/40 py-2 rounded mx-2"
                        onClick={() => setIsModalOpen(false)}
                    >Annuler</button>
                    <button
                        type="submit"
                        className="w-1/2 text-red-200 bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:border-red-400/40 py-2 rounded mx-2"
                        onClick={deleteSelectedMedias}
                    >Supprimer</button>
                </div>
            </Modal>
        </div>
    );
}