"use server"

import { SavedMedia, UpdateMediaDTO } from "@/types/media";
import { prisma } from "./prisma";
import cloudinary from "./cloudinary";

export async function getMedias(): Promise<SavedMedia[]> {
    const medias = await prisma.media.findMany();
    return medias.map(media => ({
        ...media,
        status: 'saved',
    }));
}

export async function updateMedia(id: string, media: UpdateMediaDTO) {
    await prisma.media.update({
        where: { id },
        data: { caption: media.caption, date: media.date }
    })
}

export async function deleteMedia(public_id: string) {
    await prisma.media.deleteMany({
        where: { public_id }
    })

    await cloudinary.uploader.destroy(public_id);
}

export async function deleteFolder(folderPath: string) {
    if (folderPath !== 'Discjonctés') {
        const medias = await prisma.media.findMany({
            where: {
                folderPath: {
                    startsWith: folderPath
                }
            }
        });
    
        for(const media of medias) {
            await cloudinary.uploader.destroy(media.public_id);
        }
    
        await prisma.media.deleteMany({
            where: {
                folderPath: {
                    startsWith: folderPath
                }
            }
        });
    }
}