import cloudinary from "@/lib/cloudinary";
import { SavedMedia } from "@/types/media";

export function renameCloudinaryFolder(media: SavedMedia, newFolderPath: string, oldFolderPath: string) {
    const newPublicId = media.public_id.replace(
        oldFolderPath,
        newFolderPath
    );

    return cloudinary.uploader.rename(
        media.public_id,
        newPublicId,
        {
            resource_type: media.type,
        }
    );
}

export async function deleteCloudinaryMedia(public_id: string) {
    await cloudinary.uploader.destroy(public_id);
}

export async function deleteCloudinaryMedias(public_ids: string[]) {
    await Promise.all(public_ids.map(public_id => cloudinary.uploader.destroy(public_id)));
}