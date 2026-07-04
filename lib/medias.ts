"use server"

import { SavedMedia, UpdateMediaDTO } from "@/types/media";
import { prisma } from "./prisma";
import cloudinary from "./cloudinary";

export async function getMedias(): Promise<SavedMedia[]> {
    const medias = await prisma.media.findMany({
        orderBy: [
            { folderPath: 'asc' },
            { date: { sort: 'desc', nulls: 'last'}},
            { createdAt: 'desc'}
        ]
    });
    return medias.map(media => ({
        ...media,
        status: 'saved',
        new: false
    }));
}

export async function updateMedia(id: string, media: UpdateMediaDTO): Promise<SavedMedia> {
    const updatedMedia = await prisma.media.update({
        where: { id },
        data: { caption: media.caption, date: media.date }
    });

    return {
        ...updatedMedia,
        status: 'saved',
        new: false
    }
}

export async function deleteMedia(public_id: string): Promise<void> {
    await prisma.media.deleteMany({
        where: { public_id }
    })

    await cloudinary.uploader.destroy(public_id);
}

export async function deleteFolder(folderPath: string): Promise<void> {
    if (folderPath !== 'Discjonctés') {
        const medias = await prisma.media.findMany({
            where: {
                public_id: {
                    startsWith: folderPath + '/'
                }
            }
        });
    
        for(const media of medias) {
            await cloudinary.uploader.destroy(media.public_id);
        }
    
        await prisma.media.deleteMany({
            where: {
                public_id: {
                    startsWith: folderPath + '/'
                }
            }
        });
    }
}