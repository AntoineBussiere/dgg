import { PendingMedia, SavedMedia } from "@/types/media";

type Props = {
    importedFiles: PendingMedia[],
    selectedFolder: string,
    onFilesSaving: () => void,
    onFilesSaved: (medias: SavedMedia[]) => void,
    onFilesError: () => void
}

export default function Topbar({importedFiles, selectedFolder, onFilesSaving, onFilesSaved, onFilesError}: Props) {
    async function handleSave() {
        onFilesSaving();
        const formData = new FormData();

        const metadata = importedFiles.map(file => ({
            id: file.id,
            caption: file.caption,
            date: file.date,
            folderPath: file.folderPath,
            status: file.status,
        }));        

        formData.append("metadata", JSON.stringify(metadata));

        importedFiles.forEach(file => {
            formData.append("files", file.file, file.id);
        });

        const res = await fetch("/api/gallery/upload", {
            method: "POST",
            body: formData
        });

        if (res.status === 500) {
            onFilesError();
        } else {
            onFilesSaved(await res.json());
        }
        
    }

    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="text-sm text-slate-300">
                {selectedFolder.split('/').join(' / ')}
            </div>

            {importedFiles.length > 0 && (
                <div className="flex gap-3 items-center">
                    <div className="text-sm text-slate-300 px-3 flex">
                        <div className="px-3">
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
                                    stroke-width="2"
                                    stroke-linecap="round"
                                />
                                <circle
                                    cx="12"
                                    cy="16.5"
                                    r="1.2"
                                    fill="white"
                                />
                            </svg>
                        </div>
                        {importedFiles.length} fichier{importedFiles.length > 1 && 's'} en attente
                    </div>

                    <button className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-sm" onClick={handleSave}>
                        Sauvegarder
                    </button>
                </div>
            )} 
        </div>
    );
}