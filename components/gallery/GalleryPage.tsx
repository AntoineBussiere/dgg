'use client'

import Dropzone from "@/components/gallery/Dropzone";
import MediaGrid from "@/components/gallery/MediaGrid";
import Sidebar from "@/components/gallery/Sidebar/Sidebar";
import Topbar from "@/components/gallery/Topbar";
import { buildRootTreeNode, renameFolder } from "@/lib/gallery";
import { FolderTreeNode } from "@/types/folder-tree";
import { PendingMedia, SavedMedia } from "@/types/media";
import { useState } from "react";
import { useToast } from "../ui/Toast/ToastProvider";
import { sortMedias, updateAndSort } from "@/hooks/media";

type Props = {
    initialMedias: SavedMedia[]
}

export default function GalleryPage({initialMedias}: Props) {
    const [savedMedias, setSavedMedias] = useState<SavedMedia[]>(initialMedias);
    const [importedMedias, setImportedMedias] = useState<PendingMedia[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<FolderTreeNode>(buildRootTreeNode());
            
    const { showToast } = useToast();

    function handleMedias(medias: PendingMedia[]) {
        setImportedMedias(prev => [...prev, ...medias]);
    }

    function handleFolderSelection(treeNode: FolderTreeNode) {
        setSelectedFolder(treeNode);
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
        setSavedMedias(prev => sortMedias([...prev, ...savedMedias]));
    }

    function deleteMedia(media: SavedMedia | PendingMedia) {
        if (media.status === 'saved') {
            setSavedMedias(prev => prev.filter(x => x.id !== media.id));
        } else {
            setImportedMedias(prev => prev.filter(x => x.id !== media.id));
        }
    }

    function getSavedMediasOfSelectedFolder() {
        return savedMedias.filter(x => x.folderPath === selectedFolder.path);
    }

    function getImportedMediasOfSelectedFolder() {
        return importedMedias.filter(x => x.folderPath === selectedFolder.path);
    }

    async function handleFolderRename(oldFolderPath: string, newFolderName: string) {
        const newFolderPath = oldFolderPath.substring(0, oldFolderPath.lastIndexOf("/")) + '/' + newFolderName;

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
            } else {
                showToast('Le dossier a bien été renommé.', 'success');
            }
        }

        const renamedsavedMedias = renameFolder(savedMedias, oldFolderPath, newFolderPath);
        setSavedMedias(sortMedias(renamedsavedMedias));
        const renamedImportedMedias = renameFolder(importedMedias, oldFolderPath, newFolderPath);
        setImportedMedias(sortMedias(renamedImportedMedias));
        if (selectedFolder.path === oldFolderPath) {
            setSelectedFolder(prev => {
                prev.path = newFolderPath;
                prev.name = newFolderName;
                return prev;
            });
        }
    }

    function handleFolderDelete(folderPath: string) {
        setImportedMedias(prev => prev.filter(x => x.folderPath !== folderPath));
        setSavedMedias(prev => prev.filter(x => !x.public_id.startsWith(folderPath + '/')));
    }

    return (
        <main className="h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white flex">
            <Sidebar
                selectedFolder={selectedFolder}
                medias={[...savedMedias, ...importedMedias]}
                onSelectedFolder={handleFolderSelection}
                onFolderRenamed={handleFolderRename}
                onFolderDeleted={handleFolderDelete}
            />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Topbar
                    importedMedias={importedMedias}
                    selectedFolder={selectedFolder.path}
                    onMediasSaving={() => handleMediasStatus('uploading')}
                    onMediasSaved={handleMediasSaved}
                    onMediasError={() => handleMediasStatus('error')}
                />

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <Dropzone onMediasAdded={handleMedias} selectedFolder={selectedFolder.path} />

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