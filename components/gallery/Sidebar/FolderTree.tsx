import { createNode } from "@/lib/gallery";
import { FolderTreeNode } from "@/types/folder-tree";
import { FolderItem } from "./FolderItem";


type FolderTreeProps = {
    folderTreeNode: FolderTreeNode[],
    selectedFolder: FolderTreeNode,
    creatingFolder: newFolder | null,
    isCreatingFolder: boolean,
    onFolderSelection: (folderTree: FolderTreeNode) => void,
    onFolderRenamed: (folderPath: string, newFolderName: string, isNew: boolean) => void,
    onFolderDelete: (folderPath: string) => void,
    onRemoveNewFolder: () => void
}

type newFolder = {
    parentPath: string;
    name: string;
}

export function FolderTree({ folderTreeNode, selectedFolder, creatingFolder, isCreatingFolder, onFolderSelection, onFolderRenamed, onFolderDelete, onRemoveNewFolder }: FolderTreeProps) {
    return (
        <>
            {folderTreeNode.map(folder => (
                <div key={folder.path}>
                    <FolderItem
                        name={folder.name}
                        nbNewMedias={folder.nbNewMedias}
                        onClick={() => onFolderSelection(folder)}
                        onFolderRenamed={(newFolderName) => onFolderRenamed(folder.path, newFolderName, false)}
                        active={selectedFolder.path === folder.path}
                        onFolderDelete={() => onFolderDelete(folder.path)}
                        onRemoveNewFolder={onRemoveNewFolder}
                    />
                    <div className="pl-4 space-y-1">
                        <FolderTree
                            folderTreeNode={folder.children}
                            selectedFolder={selectedFolder}
                            isCreatingFolder={isCreatingFolder}
                            creatingFolder={creatingFolder}
                            onFolderSelection={onFolderSelection}
                            onFolderRenamed={onFolderRenamed}
                            onFolderDelete={onFolderDelete}
                            onRemoveNewFolder={onRemoveNewFolder}
                        />
                        { creatingFolder?.parentPath === folder.path && (
                            <FolderItem
                                name={creatingFolder.name}
                                onClick={() => onFolderSelection(createNode(creatingFolder.name, creatingFolder.parentPath + '/' + creatingFolder.name))}
                                onFolderRenamed={(newFolderName) => onFolderRenamed(folder.path, newFolderName, true)}
                                isCreatingFolder={isCreatingFolder}
                                active={selectedFolder.path === creatingFolder.parentPath + '/' + creatingFolder.name}
                                onRemoveNewFolder={onRemoveNewFolder}
                                isNew
                            />
                        )}
                    </div>
                </div>
            ))}
        </>
    );
}