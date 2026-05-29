export type FolderTreeNode = {
    name: string;
    path: string;
    nbNewFiles: number;
    children: FolderTreeNode[];
};