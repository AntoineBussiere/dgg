import { PendingMedia, SavedMedia } from "@/types/media";
import MediaCard from "./MediaCard";

type Props = {
    importedFiles: PendingMedia[],
    allMedias: SavedMedia[],
    onUpdateFile: (file: PendingMedia) => void,
    onDeleteFile: (file: SavedMedia | PendingMedia) => void
}

export default function MediaGrid({importedFiles, onUpdateFile, onDeleteFile, allMedias}: Props) {
    return (
        <div className="space-y-8">
            {importedFiles.length > 0 && (
                <section className="space-y-4 @container">
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-white/10" />

                        <div className="
                            flex items-center gap-2
                            rounded-full
                            border border-emerald-500/20
                            bg-emerald-500/10
                            px-3 py-1
                            text-xs font-medium tracking-wide text-emerald-300
                            backdrop-blur-sm
                        ">
                            <div className="h-2 w-2 rounded-full bg-yellow-400" />
                            Nouveaux fichiers importés
                        </div>

                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 @lg:grid-cols-4 @2xl:grid-cols-6">
                        {importedFiles.map((file, index) => (
                            <MediaCard
                                file={file}
                                key={index}
                                onUpdateFile={onUpdateFile}
                                onDeleteFile={onDeleteFile}
                            />
                        ))}
                    </div>
                </section>
            )}

            <section className="space-y-4 @container">
                {importedFiles.length > 0 && allMedias.length > 0 && (
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-white/10" />

                        <div className="
                            flex items-center gap-2
                            rounded-full
                            border border-white/10
                            bg-white/5
                            px-3 py-1
                            text-xs font-medium tracking-wide text-white/70
                            backdrop-blur-sm
                        ">
                            <div className="h-2 w-2 rounded-full bg-emerald-400" />
                            Fichiers sauvegardés
                        </div>

                        <div className="h-px flex-1 bg-white/10" />
                    </div>
                )}

                <div className="grid grid-cols-3 gap-4 @lg:grid-cols-4 @2xl:grid-cols-6">
                    {allMedias.map((file, index) => (
                        <MediaCard
                            file={file}
                            key={index}
                            onUpdateFile={onUpdateFile}
                            onDeleteFile={onDeleteFile}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}