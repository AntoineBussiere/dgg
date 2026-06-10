import { FolderTreeNode } from "@/types/folder-tree";
import { PendingMedia, SavedMedia } from "@/types/media";

export function buildFolderTree(
    medias: (SavedMedia | PendingMedia)[]
): FolderTreeNode[] {

    if (medias.length === 0) {
        return buildEmptyFolderTree();
    } else {
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
                        nbNewMedias: 0,
                        nbMedias: medias.filter(x => x.folderPath === currentPath).length
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
}

export function buildEmptyFolderTree(): FolderTreeNode[] {
    return [buildRootTreeNode()];
}

export function buildRootTreeNode(): FolderTreeNode {
    return {children: [], name: 'Discjonctés', path: 'Discjonctés', nbNewMedias: 0, nbMedias: 0};
}

export function createNode(name: string, path: string): FolderTreeNode {
    return {children: [], name, path, nbNewMedias: 0, nbMedias: 0};
}

export function renameFolder<T extends SavedMedia | PendingMedia>(medias: T[], oldFolderName: string, newFolderName: string) {
    return medias.map(media => {
        if(media.folderPath === oldFolderName) {
            media.folderPath = newFolderName;
        }
        return media;
    })
}

export function folderPathExists(nodes: FolderTreeNode[], searchedPath: string): boolean {
    for (const node of nodes) {
        if (node.path === searchedPath) {
            return true;
        }

        if (folderPathExists(node.children, searchedPath)) {
            return true;
        }
    }

    return false;
}

export function findTreeNode(nodes: FolderTreeNode[], searchedPath: string): FolderTreeNode | null {
    for (const node of nodes) {
        if (node.path === searchedPath) return node;

        const child = findTreeNode(node.children, searchedPath);
        if (child) return child;
    }
    return null;
}