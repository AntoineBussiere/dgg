import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { CreateMediaDTO } from "@/types/media";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        await requireAuth();
    } catch(e) {
        console.error(e);
        
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    try {
        const reqMedia = await req.json();

        const medias: CreateMediaDTO[] = reqMedia.medias;
        
        const createdMedias = await prisma.media.createManyAndReturn({
            data: medias
        });

        return NextResponse.json(createdMedias.map(media => ({
            ...media,
            status: 'saved',
            new: true
        })), {status: 200});
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: 'Une erreur est survenue pendant la création.'}, {status: 500});
    }
}