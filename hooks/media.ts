import { PendingMedia, SavedMedia } from "@/types/media";

export function sortMedias<T extends PendingMedia | SavedMedia>(medias: T[]): T[] {
    return [...medias].sort((a, b) => {
        // 1. folderPath ASC
        if (a.folderPath !== b.folderPath) {
            return a.folderPath.localeCompare(b.folderPath);
        }

        // 2. date DESC (si présente)
        const dateA = a.date ? new Date(a.date).getTime() : null;
        const dateB = b.date ? new Date(b.date).getTime() : null;

        if (dateA !== null && dateB !== null) {
            return dateB - dateA;
        }

        if (dateA !== null && dateB === null) return -1;
        if (dateA === null && dateB !== null) return 1;

        // 3. fallback uniquement pour saved
        if (a.status === "saved" && b.status === "saved") {
            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
        }

        // 4. fallback cross-status (stable order)
        if (a.status !== b.status) {
            return a.status === "saved" ? -1 : 1;
        }

        return 0;
    });
}

export function updateAndSort<T extends PendingMedia | SavedMedia>(prev: T[], updatedMedia: T): T[] {
    return sortMedias(
        prev.map(f => (f.id === updatedMedia.id ? updatedMedia : f))
    );
}