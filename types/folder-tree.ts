export type FolderTreeNode = {
    name: string;
    path: string;
    nbNewMedias: number;
    children: FolderTreeNode[];
};