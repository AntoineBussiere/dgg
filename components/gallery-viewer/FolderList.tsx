import { FolderTreeNode } from "@/types/folder-tree";

type Props = {
    folderTree: FolderTreeNode[],
    onFolderSelection: (node: FolderTreeNode) => void
}

export default function FolderList({folderTree, onFolderSelection}: Props) {
    return (
        <div
            className="
                flex gap-3
                overflow-x-auto
                px-4 pb-3
                shrink-0
            "
        >
            {folderTree.map(node => (
                <button
                    key={node.path}
                    className="
                        flex w-44 shrink-0 items-center gap-3
                        rounded-xl
                        border border-current/10
                        p-3
                        hover:bg-current/5
                    "
                    onClick={() => onFolderSelection(node)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="32"
                        height="32"
                    >
                        <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v1H3V7z" />
                        <path d="M3 10h18v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7z" />
                    </svg>

                    <div className="min-w-0 text-left">
                        <div className="truncate font-medium">
                            {node.name}
                        </div>

                        <div className="text-xs opacity-60">
                            {node.nbMedias} photos
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}