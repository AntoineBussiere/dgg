'use client'

import Dropzone from "@/components/gallery/Dropzone";
import MediaGrid from "@/components/gallery/MediaGrid";
import Sidebar from "@/components/gallery/Sidebar";
import Topbar from "@/components/gallery/Topbar";
import { buildFolderTree, renameFolder } from "@/lib/gallery";
import { deleteFolder } from "@/lib/medias";
import { FolderTreeNode } from "@/types/folder-tree";
import { PendingMedia, SavedMedia } from "@/types/media";
import { useState } from "react";
import { useToast } from "../ui/Toast/ToastProvider";
import { updateAndSort } from "@/hooks/media";

type Props = {
    initialMedias: SavedMedia[],
    initialFolderTree: FolderTreeNode[]
}

export default function GalleryPage({initialMedias, initialFolderTree}: Props) {
    const [savedMedias, setSavedMedias] = useState<SavedMedia[]>(initialMedias);
    const [folderTree, setFolderTree] = useState<FolderTreeNode[]>(initialFolderTree);
    const [importedMedias, setImportedMedias] = useState<PendingMedia[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<string>('Discjonctés');
            
    const { showToast } = useToast();

    function handleMedias(medias: PendingMedia[]) {
        setImportedMedias(prev => {
            const updated = [...prev, ...medias];

            setFolderTree(
                buildFolderTree([
                    ...savedMedias,
                    ...updated
                ])
            );

            return updated;
        });
    }

    function handleFolderSelection(name: string) {
        setSelectedFolder(name);
    }

    function updateMedia(updatedMedia: SavedMedia | PendingMedia) {
        if (updatedMedia.status === 'saved') {
            setSavedMedias(prev => updateAndSort(prev, updatedMedia));
        } else {
            setImportedMedias(prev => updateAndSort(prev, updatedMedia));
        }
    }

    function handleMediasStatus(status: 'uploading' | 'error') {
        setImportedMedias(prev =>
            prev.map(f => {
                f.status = status;
                return f;
            })
        );
    }

    function handleMediasSaved(savedMedias: SavedMedia[]) {
        setImportedMedias([]);
        setSavedMedias(prev => {
            const updated = [...prev, ...savedMedias];
            rebuildFolderTree(updated, []);
            return updated;
        });
    }

    function deleteMedia(media: SavedMedia | PendingMedia) {
        if (media.status === 'saved') {
            setSavedMedias(prev => {
                const filteredMedias = prev.filter(x => x.id !== media.id)
                rebuildFolderTree(filteredMedias, importedMedias);
                return filteredMedias;
            });
        } else {
            setImportedMedias(prev => {
                const filteredMedias = prev.filter(x => x.id !== media.id);
                rebuildFolderTree(savedMedias, filteredMedias);
                return filteredMedias;
            });
        }
    }

    function getSavedMediasOfSelectedFolder() {
        return savedMedias.filter(x => x.folderPath === selectedFolder);
    }

    function getImportedMediasOfSelectedFolder() {
        return importedMedias.filter(x => x.folderPath === selectedFolder);
    }

    async function handleFolderRename(oldFolderPath: string, newFolderName: string) {
        const newFolderPath = oldFolderPath.substring(0, oldFolderPath.lastIndexOf("/")) + '/' + newFolderName
        const renamedsavedMedias = renameFolder(savedMedias, oldFolderPath, newFolderPath);
        setSavedMedias(renamedsavedMedias);
        const renamedImportedMedias = renameFolder(importedMedias, oldFolderPath, newFolderPath);
        setImportedMedias(renamedImportedMedias);
        rebuildFolderTree(renamedsavedMedias, renamedImportedMedias);
        if (selectedFolder === oldFolderPath) {
            setSelectedFolder(newFolderPath);
        }

        // rename only if DB saved medias have folder path changed
        if (savedMedias.some(x => x.folderPath === oldFolderPath)) {
            const mediasToRename = savedMedias.filter(x => x.folderPath === newFolderPath);
    
            const res = await fetch('/api/gallery/folders', {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ oldFolderPath, newFolderPath, mediasToRename }),
            });

            if (res.status !== 200) {
                showToast('Une erreur est survenue lors de la sauvegarde. Veuillez contacter un administrateur.', 'error');
            }
        }
    }

    async function handleFolderDelete(folderPath: string) {
        try {
            await deleteFolder(folderPath);

            if (selectedFolder.includes(folderPath)) {
                setSelectedFolder(folderPath.substring(0, folderPath.lastIndexOf("/")));
            }
            rebuildFolderTree(savedMedias, importedMedias);
        } catch (e) {
            showToast('Une erreur est survenue lors de la suppression. Veuillez contacter un administrateur.', 'error')
        }
    }

    function rebuildFolderTree(medias: SavedMedia[], imported: PendingMedia[]) {
        setFolderTree(
            buildFolderTree([
                ...medias,
                ...imported
            ])
        );
    }

    return (
        <main className="h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white flex">
            <Sidebar
                selectedFolder={selectedFolder}
                folderTree={folderTree}
                onSelectedFolder={handleFolderSelection}
                onFolderRenamed={handleFolderRename}
                onFolderDelete={handleFolderDelete}
            />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Topbar
                    importedMedias={importedMedias}
                    selectedFolder={selectedFolder}
                    onMediasSaving={() => handleMediasStatus('uploading')}
                    onMediasSaved={handleMediasSaved}
                    onMediasError={() => handleMediasStatus('error')}
                />

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <Dropzone onMediasAdded={handleMedias} selectedFolder={selectedFolder} />

                    <MediaGrid
                        importedMedias={getImportedMediasOfSelectedFolder()}
                        savedMedias={getSavedMediasOfSelectedFolder()}
                        onUpdateMedia={updateMedia}
                        onDeleteMedia={deleteMedia}
                    />
                </div>
            </div>
        </main>
    );
}