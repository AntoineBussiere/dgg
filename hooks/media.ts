import { PendingMedia, SavedMedia } from "@/types/media";

export function sortMedias<T extends PendingMedia | SavedMedia>(medias: T[]): T[] {
    return [...medias].sort((a, b) => {
        if (a.date && b.date) {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }

        if (!a.date && b.date) return 1;
        if (a.date && !b.date) return -1;

        if (a.status === 'saved' && b.status === 'saved') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
            return 1;
        }

    });
}

export function updateAndSort<T extends PendingMedia | SavedMedia>(prev: T[], updatedMedia: T): T[] {
    return sortMedias(
        prev.map(f => (f.id === updatedMedia.id ? updatedMedia : f))
    );
}