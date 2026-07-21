"use server"

import { SavedMedia, UpdateMediaDTO } from "@/types/media";
import { deleteFromFolder, deletePrismaMedia, deletePrismaMedias, findAll, findWithFolder, updateMetadata } from "@/app/services/media.service";
import { deleteCloudinaryMedia, deleteCloudinaryMedias } from "@/app/services/cloudinary.service";
import { cloudinarySuffix } from "./env";

export async function getMedias(): Promise<SavedMedia[]> {
    const medias = await findAll();
    return medias.map(media => ({
        ...media,
        status: 'saved',
        new: false
    }));
}

export async function updateMedia(id: string, media: UpdateMediaDTO): Promise<SavedMedia> {
    const updatedMedia = await updateMetadata(id, media);

    return {
        ...updatedMedia,
        status: 'saved',
        new: false
    }
}

export async function deleteMedia(public_id: string): Promise<void> {
    await deletePrismaMedia(public_id);
    await deleteCloudinaryMedia(public_id);
}

export async function deleteMedias(public_ids: string[]): Promise<void> {
    await deletePrismaMedias(public_ids);
    await deleteCloudinaryMedias(public_ids);
}

export async function deleteFolder(folderPath: string): Promise<void> {
    if (folderPath !== "Discjonctés" + cloudinarySuffix) {
        const medias = await findWithFolder(folderPath);
    
        for(const media of medias) {
            await deleteCloudinaryMedia(media.public_id);
        }
    
        await deleteFromFolder(folderPath);
    }
}