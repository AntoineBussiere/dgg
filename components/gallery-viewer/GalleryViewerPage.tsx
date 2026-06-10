"use client"

import { SavedMedia } from "@/types/media"
import FolderBreadcrumb from "./FolderBreadcrumb";
import FolderList from "./FolderList";
import GalleryHeader from "./GalleryHeader";
import MediaGrid from "./MediaGrid";
import { buildFolderTree, findTreeNode } from "@/lib/gallery";
import { useMemo, useState } from "react";
import { FolderTreeNode } from "@/types/folder-tree";

type Props = {
    medias: SavedMedia[],
    theme: "dark" | "light",
    mode: "fullscreen" | "embedded"
}

export default function GalleryViewerPage({medias, theme, mode}: Props) {
    const folderTree = buildFolderTree(medias);
    const [selectedTreeNode, setSelectedTreeNode] = useState(folderTree[0]);

    const selectedMedias = useMemo(() => {
        return medias.filter(media => media.folderPath === selectedTreeNode.path);
    }, [selectedTreeNode]);

    function handleBreadcrumbSelection(folder: string) {
        const selectedNode = findTreeNode(folderTree, folder);
        if (selectedNode) {
            setSelectedTreeNode(selectedNode);
        }
    }

    function handleFolderSelection(node: FolderTreeNode) {
        setSelectedTreeNode(node);
    }

    return (
        <div className={`flex ${mode === "fullscreen" ? "h-screen" : "h-full"} flex-col overflow-hidden rounded-xl`} data-theme={theme}>
            <GalleryHeader
                medias={medias}
            />
            <FolderBreadcrumb
                selectedFolder={selectedTreeNode.path}
                onFolderSelection={handleBreadcrumbSelection}
            />
            <FolderList
                folderTree={selectedTreeNode.children}
                onFolderSelection={handleFolderSelection}
            />
            <MediaGrid
                medias={selectedMedias}
            />
        </div>
    );
}