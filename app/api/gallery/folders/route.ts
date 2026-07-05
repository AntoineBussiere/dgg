import { renameCloudinaryFolder } from "@/app/services/cloudinary.service";
import { renameFolders, updateFolderName } from "@/app/services/folder.service";
import { requireAuth } from "@/lib/auth";
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
        
        await renameFolders(mediasToRename, newFolderPath, oldFolderPath);
        await updateFolderName(newFolderPath, oldFolderPath);

        await Promise.all(
            mediasToRename.map(media => renameCloudinaryFolder(media, newFolderPath, oldFolderPath))
        )

        return NextResponse.json({}, {status: 200});
    } catch(e) {
        console.log(e);
        
        return NextResponse.json({error: 'Une erreur est survenue.'}, {status: 500});
    }
}