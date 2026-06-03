import { FolderTreeNode } from "@/types/folder-tree";
import { PendingMedia, SavedMedia } from "@/types/media";

export function buildFolderTree(
    medias: (SavedMedia | PendingMedia)[]
): FolderTreeNode[] {
    const root: FolderTreeNode[] = [];

    medias.forEach(media => {
        const parts = media.folderPath
            .split("/")
            .filter(Boolean);

        let currentLevel = root;
        let currentPath = "";

        parts.forEach((part, index) => {
            currentPath += (currentPath ? "/" : "") + part;

            let existing = currentLevel.find(
                node => node.name === part
            );

            if (!existing) {
                existing = {
                    name: part,
                    path: currentPath,
                    children: [],
                    nbNewMedias: 0
                };

                currentLevel.push(existing);
            }

            const isLastPart = index === parts.length - 1

            if (
                isLastPart &&
                media.status !== "saved"
            ) {
                existing.nbNewMedias += 1;
            }

            currentLevel = existing.children;
        });
    });

    return root;
}

export function buildEmptyFolderTree(): FolderTreeNode[] {
    return [{children: [], name: 'Discjonctés', path: 'Discjonctés', nbNewMedias: 0}]
}

export function renameFolder<T extends SavedMedia | PendingMedia>(medias: T[], oldFolderName: string, newFolderName: string) {
    return medias.map(media => {
        if(media.folderPath === oldFolderName) {
            media.folderPath = newFolderName;
        }
        return media;
    })
}