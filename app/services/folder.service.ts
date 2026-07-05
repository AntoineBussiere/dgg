import { prisma } from "@/lib/prisma";
import { SavedMedia } from "@/types/media";

export function renameFolder(media: SavedMedia, newFolderPath: string, oldFolderPath: string) {
    return prisma.media.update({
        where: {
            id: media.id,
        },
        data: {
            folderPath: newFolderPath,

            url: media.url.replace(
                oldFolderPath.split("/").map(encodeURIComponent).join("/"),
                newFolderPath.split("/").map(encodeURIComponent).join("/")
            ),

            public_id: media.public_id.replace(
                oldFolderPath,
                newFolderPath
            ),
        },
    })
}

export async function renameFolders(medias: SavedMedia[], newFolderPath: string, oldFolderPath: string) {
    await prisma.$transaction(
        medias.map(media =>
            renameFolder(media, newFolderPath, oldFolderPath)
        )
    );
}

export async function updateFolderName(newFolderPath: string, oldFolderPath: string) {
    await prisma.media.updateMany({
        where: {folderPath: oldFolderPath},
        data: {folderPath: newFolderPath}
    });
}