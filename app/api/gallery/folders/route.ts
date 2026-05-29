import { requireAuth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { SavedMedia } from "@/types/media";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        await requireAuth();
    } catch(e) {
        console.error(e);
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    try {
        const {oldFolderPath, newFolderPath, mediasToRename}: {oldFolderPath: string, newFolderPath: string, mediasToRename: SavedMedia[]} = await req.json();

        await prisma.$transaction(
            mediasToRename.map(media =>
                prisma.media.update({
                    where: {
                        id: media.id,
                    },
                    data: {
                        folderPath: newFolderPath,

                        url: media.url.replace(
                            oldFolderPath,
                            newFolderPath
                        ),

                        public_id: media.public_id.replace(
                            oldFolderPath,
                            newFolderPath
                        ),
                    },
                })
            )
        );

        await prisma.media.updateMany({
            where: {folderPath: oldFolderPath},
            data: {folderPath: newFolderPath}
        });

        await Promise.all(
            mediasToRename.map(media => {
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
            })
        )        

        return NextResponse.json({}, {status: 200});
    } catch(e) {
        console.log(e);
        
        return NextResponse.json({error: 'Une erreur est survenue.'}, {status: 500});
    }
}