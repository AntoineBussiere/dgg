export type FolderTreeNode = {
    name: string;
    path: string;
    nbNewMedias: number;
    nbMedias: number;
    children: FolderTreeNode[];
};