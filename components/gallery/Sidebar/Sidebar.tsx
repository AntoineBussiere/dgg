"use client"

import { FolderTreeNode } from "@/types/folder-tree";
import { useMemo, useState } from "react";
import { Tooltip } from "../../ui/Tooltip";
import { PendingMedia, SavedMedia } from "@/types/media";
import { buildFolderTree, createNode, folderPathExists } from "@/lib/gallery";
import { deleteFolder } from "@/lib/medias";
import { useToast } from "../../ui/Toast/ToastProvider";
import { FolderTree } from "./FolderTree";

type Props = {
    selectedFolder: FolderTreeNode,
    medias: (PendingMedia | SavedMedia)[],
    onSelectedFolder: (selectedFolder: FolderTreeNode) => void,
    onFolderRenamed: (folderPath: string, newFolderName: string) => void,
    onFolderDeleted: (folderPath: string) => void
}

type newFolder = {
    parentPath: string;
    name: string;
}

export default function Sidebar({selectedFolder, medias, onSelectedFolder, onFolderRenamed, onFolderDeleted}: Props) {
    const { showToast } = useToast();
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [creatingFolder, setCreatingFolder] = useState<newFolder | null>(null);

    const folderTree = useMemo(
        () => {
            const builtFolderTree = buildFolderTree(medias);
            if (creatingFolder && folderPathExists(builtFolderTree, creatingFolder?.parentPath + '/' + creatingFolder?.name)) {
                setCreatingFolder(null);
            }
            return builtFolderTree;
        },
        [medias]
    );

    function handleFolderSelection(folderTree: FolderTreeNode) {
        onSelectedFolder(folderTree);
    }
    
    async function handleFolderDelete(folderPath: string) {
        try {
            await deleteFolder(folderPath);

            if (selectedFolder.path.includes(folderPath)) {
                onSelectedFolder(folderTree[0]);
            }
            onFolderDeleted(folderPath);
            showToast('Le dossier a bien été supprimé.', 'success');
        } catch (e) {
            showToast('Une erreur est survenue lors de la suppression. Veuillez contacter un administrateur.', 'error');
        }
    }

    function handleFolderRename(folderPath: string, newFolderName: string, isNew: boolean) {
        if (isNew) {
            if (creatingFolder) {
                if (selectedFolder.path === folderPath + '/' + creatingFolder.name) {
                    onSelectedFolder(createNode(newFolderName, folderPath + '/' + newFolderName))
                }
                setCreatedFolderNodeValues(newFolderName, folderPath);
                setIsCreatingFolder(false);
            }
        } else {
            onFolderRenamed(folderPath, newFolderName);
        }
    }

    function setCreatedFolderNodeValues(name: string, parentPath: string) {
        return setCreatingFolder({
            name,
            parentPath
        });
    }

    return (
        <aside className="w-72 h-screen overflow-y-auto border-r border-white/10 bg-white/5 backdrop-blur-xl p-4">
            <div className="text-xl font-bold mb-6 flex items-center justify-between">
                Galerie
                <div>
                    <Tooltip content={'Créer un dossier dans ' + selectedFolder.name}>
                        <button
                            className="rounded-xl bg-white/10 hover:bg-white/20 p-2"
                            onClick={() => {setIsCreatingFolder(true); setCreatedFolderNodeValues('', selectedFolder.path)}}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M12 5v14" />
                                <path d="M5 12h14" />
                            </svg>
                        </button>
                    </Tooltip>
                </div>
                
            </div>

            <div className="space-y-1 text-sm">
                <FolderTree
                    folderTreeNode={folderTree}
                    selectedFolder={selectedFolder}
                    isCreatingFolder={isCreatingFolder}
                    creatingFolder={creatingFolder}
                    onFolderSelection={handleFolderSelection}
                    onFolderRenamed={handleFolderRename}
                    onFolderDelete={handleFolderDelete}
                    onRemoveNewFolder={() => {setIsCreatingFolder(false); setCreatingFolder(null);}}
                />
            </div>
        </aside>
    );
}

