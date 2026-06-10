"use client"

import { useMemo } from "react";

type Props = {
    selectedFolder: string,
    onFolderSelection: (folder: string) => void
}

export default function FolderBreadcrumb({selectedFolder, onFolderSelection}: Props) {
    const splittedFolder = useMemo(() => {
        return selectedFolder.split('/');
    }, [selectedFolder]);

    function getFolderPathOfElement(index: number) {
        return splittedFolder.slice(0, index + 1).join('/');
    }

    return (
        <div className="flex px-4 gap-2">
            {splittedFolder.map((folder, index) => (
                <div key={index} className="
                    flex gap-2
                    overflow-x-auto py-2
                    text-sm
                    whitespace-nowrap
                    shrink-0
                ">
                    {index < splittedFolder.length - 1 && (
                        <>
                            <button
                                className="opacity-60 hover:opacity-100"
                                onClick={() => onFolderSelection(getFolderPathOfElement(index))}
                            >
                                {folder}
                            </button>
                            <span className="gap-2">/</span>
                        </>
                    )}
                    {index === splittedFolder.length -1 && (
                        <span className="font-medium">
                            {folder}
                        </span>
                    )}

                </div>
            ))}
        </div>
    );
}