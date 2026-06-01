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

type Props = {
    initialMedias: SavedMedia[],
    initialFolderTree: FolderTreeNode[]
}

export default function GalleryPage({initialMedias, initialFolderTree}: Props) {
    const [allMedias, setAllMedias] = useState<SavedMedia[]>(initialMedias);
    const [folderTree, setFolderTree] = useState<FolderTreeNode[]>(initialFolderTree);
    const [importedFiles, setImportedFiles] = useState<PendingMedia[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<string>('Discjonctés');
            
    const { showToast } = useToast();

    function handleFiles(files: PendingMedia[]) {
        setImportedFiles(prev => {
            const updated = [...prev, ...files];

            setFolderTree(
                buildFolderTree([
                    ...allMedias,
                    ...updated
                ])
            );

            return updated;
        });
    }

    function handleFolderSelection(name: string) {
        setSelectedFolder(name);
    }

    function updateFile(updated: PendingMedia) {
        setImportedFiles(prev =>
            prev.map(f =>
                f.id === updated.id ? updated : f
            )
        );
    }

    function handleFilesStatus(status: 'uploading' | 'error') {
        setImportedFiles(prev =>
            prev.map(f => {
                f.status = status;
                return f;
            })
        );
    }

    function handleFilesSaved(savedMedias: SavedMedia[]) {
        setImportedFiles([]);
        setAllMedias(prev => {
            const updated = [...prev, ...savedMedias];
            rebuildFolderTree(updated, []);
            return updated;
        });
    }

    function deleteFile(file: SavedMedia | PendingMedia) {
        if (file.status === 'saved') {
            setAllMedias(prev => prev.filter(x => x.id !== file.id));
        } else {
            setImportedFiles(prev => prev.filter(x => x.id !== file.id));
        }
    }

    function getAllMediasOfSelectedFolder() {
        return allMedias.filter(x => x.folderPath === selectedFolder);
    }

    function getImportedMediasOfSelectedFolder() {
        return importedFiles.filter(x => x.folderPath === selectedFolder);
    }

    async function handleFolderRename(oldFolderPath: string, newFolderName: string) {
        const newFolderPath = oldFolderPath.substring(0, oldFolderPath.lastIndexOf("/")) + '/' + newFolderName
        const renamedAllMedias = renameFolder(allMedias, oldFolderPath, newFolderPath);
        setAllMedias(renamedAllMedias);
        const renamedImportedFiles = renameFolder(importedFiles, oldFolderPath, newFolderPath);
        setImportedFiles(renamedImportedFiles);
        rebuildFolderTree(renamedAllMedias, renamedImportedFiles);
        if (selectedFolder === oldFolderPath) {
            setSelectedFolder(newFolderPath);
        }

        // rename only if DB saved medias have folder path changed
        if (allMedias.some(x => x.folderPath === oldFolderPath)) {
            const mediasToRename = allMedias.filter(x => x.folderPath === newFolderPath);
    
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
            rebuildFolderTree(allMedias, importedFiles);
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
                    importedFiles={importedFiles}
                    selectedFolder={selectedFolder}
                    onFilesSaving={() => handleFilesStatus('uploading')}
                    onFilesSaved={handleFilesSaved}
                    onFilesError={() => handleFilesStatus('error')}
                />

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <Dropzone onFilesAdded={handleFiles} selectedFolder={selectedFolder} />

                    <MediaGrid
                        importedFiles={getImportedMediasOfSelectedFolder()}
                        allMedias={getAllMediasOfSelectedFolder()}
                        onUpdateFile={updateFile}
                        onDeleteFile={deleteFile}
                    />
                </div>
            </div>
        </main>
    );
}