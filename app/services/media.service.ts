import { prisma } from "@/lib/prisma";
import { CreateMediaDTO, UpdateMediaDTO } from "@/types/media";

export async function findAll() {
    return prisma.media.findMany({
        orderBy: [
            { folderPath: 'asc' },
            { date: { sort: 'desc', nulls: 'last'}},
            { createdAt: 'desc'}
        ]
    });
}

export async function findWithFolder(folderPath: string) {
    return prisma.media.findMany({
        where: {
            public_id: {
                startsWith: folderPath + '/'
            }
        }
    });
}

export async function findAllWithPublicIds(publicIds: string[]) {
    return prisma.media.findMany({
        where: {
            public_id: {
                in: publicIds
            }
        }
    })
}

export async function createMany(medias: CreateMediaDTO[]) {
    return prisma.media.createManyAndReturn({
        data: medias
    });
}

export async function updateMetadata(id: string, media: UpdateMediaDTO) {
    return prisma.media.update({
        where: { id },
        data: { caption: media.caption, date: media.date }
    });
}

export async function deletePrismaMedia(public_id: string) {
    return prisma.media.deleteMany({
        where: { public_id }
    })
}

export async function deletePrismaMedias(public_id: string[]) {
    return prisma.media.deleteMany({
        where: {
            public_id: {
                in: public_id
            }
        }
    })
}

export async function deleteFromFolder(folderPath: string) {
    return prisma.media.deleteMany({
        where: {
            public_id: {
                startsWith: folderPath + '/'
            }
        }
    });
}