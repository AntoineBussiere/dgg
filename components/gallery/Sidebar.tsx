"use client"

import { FolderTreeNode } from "@/types/folder-tree";
import { useEffect, useRef, useState } from "react";
import Modal from "../modal/Modal";

type Props = {
    selectedFolder: string,
    folderTree: FolderTreeNode[],
    onSelectedFolder: (name: string) => void,
    onFolderRenamed: (folderPath: string, newFolderName: string) => void,
    onFolderDelete: (folderPath: string) => void
}

export default function Sidebar({onSelectedFolder, selectedFolder, folderTree, onFolderRenamed, onFolderDelete}: Props) {
    function handleFolderSelection(name: string) {
        onSelectedFolder(name);
    }

    return (
        <aside className="w-72 h-screen overflow-y-auto border-r border-white/10 bg-white/5 backdrop-blur-xl p-4">
            <div className="text-xl font-bold mb-6">
                Galerie
            </div>

            <div className="space-y-1 text-sm">
                <FolderTree
                    folderTreeNode={folderTree}
                    selectedFolder={selectedFolder}
                    onFolderSelection={handleFolderSelection}
                    onFolderRenamed={onFolderRenamed}
                    onFolderDelete={onFolderDelete}
                />
            </div>
        </aside>
    );
}

type FolderItemProps = {
    name: string;
    nbNewFiles: number;
    active?: boolean;
    onClick: () => void,
    onFolderRenamed: (folderName: string) => void,
    onFolderDelete: () => void
}

function FolderItem({
    name,
    nbNewFiles,
    active = false,
    onClick,
    onFolderRenamed,
    onFolderDelete
}: FolderItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isMenuOpened, setIsMenuOpened] = useState(false);
    const [folderName, setFolderName] = useState(name);

    const menuRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isMenuOpened && !isEditing) return;

        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpened(false);
            }

            if (
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsEditing(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpened, isEditing]);

    function saveFolderEdit() {
        setIsEditing(false);
        onFolderRenamed(folderName);
    }
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div
            className={`
                group relative flex items-center justify-between
                rounded-lg px-3 my-1 transition
                hover:bg-white/10
                ${active ? "border border-white/20 bg-white/10" : ""}
            `}
        >
            <button
                className="
                    flex min-w-0 flex-1 items-center gap-2
                    text-left py-1
                "
                onClick={onClick}
            >
                <span className="text-sm opacity-80">📁</span>

                {!isEditing && (
                    <div className="flex text-sm text-white/90 py-1">
                        {name}
                        {nbNewFiles > 0 && (
                            <div className="px-3 relative group inline-flex">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-5 w-5 text-orange-400"
                                >
                                    <path d="
                                        M12 2
                                        C11.6 2 11.3 2.2 11.1 2.6
                                        L1.6 20.3
                                        C1.3 20.9 1.7 21.5 2.4 21.5
                                        H21.6
                                        C22.3 21.5 22.7 20.9 22.4 20.3
                                        L12.9 2.6
                                        C12.7 2.2 12.4 2 12 2
                                        Z
                                    " />
                                    <path
                                        d="M12 8v5"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                    <circle
                                        cx="12"
                                        cy="16.5"
                                        r="1.2"
                                        fill="white"
                                    />
                                </svg>
                                <div className="
                                    absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                                    opacity-0 translate-y-1
                                    group-hover:opacity-100 group-hover:translate-y-0
                                    transition
                                    pointer-events-none
                                    whitespace-nowrap
                                    rounded-md bg-black/90 px-2 py-1
                                    text-xs text-white
                                ">
                                    {nbNewFiles} fichier{nbNewFiles > 1 ? 's' : ''} en attente de sauvegarde
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {isEditing && (
                    <input
                        ref={inputRef}
                        type="text"
                        defaultValue={folderName}
                        name="folderName"
                        onKeyDown={(e) => {if(e.key === 'Enter') { saveFolderEdit() }}}
                        onChange={(e) => setFolderName(e.target.value)}
                        autoFocus
                        className="
                            w-full rounded-md
                            border border-white/10
                            bg-white/5
                            px-1 py-1
                            text-sm text-white
                            outline-none
                            transition
                            placeholder:text-white/30
                            focus:border-white/20
                            focus:bg-white/10
                        "
                    />
                )}
            </button>

            {folderName !== 'Discjonctés' && (
                <div className="relative ml-2 flex-shrink-0">
                    {!isEditing ? (
                        <button
                            className="
                                flex h-7 w-7 items-center justify-center
                                rounded-md
                                text-white/40
                                opacity-0 transition
                                hover:bg-white/10
                                hover:text-white/80
                                group-hover:opacity-100
                            "
                            onClick={() => setIsMenuOpened(true)}
                        >
                            ⋮
                        </button>
                    ) : (
                        <button
                            className="
                                flex h-7 w-7 items-center justify-center
                                rounded-md
                                text-white/40
                                opacity-0 transition
                                hover:bg-white/10
                                hover:text-white/80
                                group-hover:opacity-100
                            "
                            onClick={() => setIsEditing(false)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                            >
                                <path d="M18 6 6 18" />
                                <path d="M6 6l12 12" />
                            </svg>
                        </button>
                    )}

                    {isMenuOpened && (
                        <div
                            className="
                                absolute right-0 top-9 z-20
                                min-w-[140px]
                                overflow-hidden rounded-xl
                                border border-white/10
                                bg-[#161616]/95
                                shadow-2xl backdrop-blur-xl
                            "
                            ref={menuRef}
                        >
                            <button
                                className="
                                    flex w-full items-center gap-2
                                    px-3 py-2 text-sm text-white/80
                                    transition hover:bg-white/10
                                "
                                onClick={() => {setIsEditing(true); setIsMenuOpened(false); }}
                            >
                                Modifier
                            </button>

                            <button
                                className="
                                    flex w-full items-center gap-2
                                    px-3 py-2 text-sm text-red-300
                                    transition hover:bg-red-500/10
                                "
                                onClick={() => {setIsModalOpen(true); }}
                            >
                                Supprimer
                            </button>
                        </div>
                    )}
                </div>
            )}
            
            <Modal
                open={isModalOpen}
                title="Supprimer un dossier"
                onClose={() => setIsModalOpen(false)}
            >
                <span>Êtes-vous sûr de vouloir supprimer le dossier <i>{folderName}</i> ? Tous les fichiers et dossiers contenus dans ce dossier seront supprimés définitivement.</span>
                <div className="flex mt-4">
                    <button
                        type="submit"
                        className="w-50 text-gray-200 bg-gray-500/10 border-gray-500/30 hover:bg-gray-500/20 hover:border-gray-400/40 py-2 rounded mx-2"
                        onClick={() => setIsModalOpen(false)}
                    >Annuler</button>
                    <button
                        type="submit"
                        className="w-50 text-red-200 bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:border-red-400/40 py-2 rounded mx-2"
                        onClick={() => {onFolderDelete(); setIsModalOpen(false);}}
                    >Supprimer</button>
                </div>
            </Modal>
        </div>
    );
}

type FolderTreeProps = {
    folderTreeNode: FolderTreeNode[],
    selectedFolder: string,
    onFolderSelection: (name: string) => void,
    onFolderRenamed: (folderPath: string, newFolderName: string) => void,
    onFolderDelete: (folderPath: string) => void
}

function FolderTree({
    folderTreeNode,
    selectedFolder,
    onFolderSelection,
    onFolderRenamed,
    onFolderDelete
}: FolderTreeProps) {
    return (
        <>
            {folderTreeNode.map((folder, index) => (
                <div key={index}>
                    <FolderItem
                        name={folder.name}
                        nbNewFiles={folder.nbNewFiles}
                        onClick={() => onFolderSelection(folder.path)}
                        onFolderRenamed={(newFolderName) => onFolderRenamed(folder.path, newFolderName)}
                        active={selectedFolder === folder.path}
                        onFolderDelete={() => onFolderDelete(folder.path)}
                    />
                    <div className="pl-4 space-y-1">
                        <FolderTree
                            folderTreeNode={folder.children}
                            selectedFolder={selectedFolder}
                            onFolderSelection={onFolderSelection}
                            onFolderRenamed={onFolderRenamed}
                            onFolderDelete={onFolderDelete}
                        />
                    </div>
                </div>
            ))}
        </>
    );
}