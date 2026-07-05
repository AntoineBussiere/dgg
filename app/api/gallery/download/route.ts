import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { ZipArchive } from "archiver";
import { findAllWithPublicIds } from "@/app/services/media.service";
import { PassThrough, Readable } from "node:stream";
import type { ReadableStream as NodeReadableStream } from "node:stream/web";

export async function POST(req: Request) {
    try {
        await requireAuth();
    } catch(e) {
        console.error(e);
        
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    try {
        const savedSelectedMediasIds = await req.json();
        const selectedMedias = await findAllWithPublicIds(savedSelectedMediasIds);
        
        const archive = new ZipArchive({
            zlib: { level: 9 }
        });

        const stream = new PassThrough();
        archive.pipe(stream);

        for (const media of selectedMedias) {
            const response = await fetch(media.url);

            if (!response.ok || !response.body) {
                throw new Error(`Impossible de télécharger ${media.url}`);
            }

            archive.append(Readable.fromWeb(response.body as NodeReadableStream), {
                name: `${media.caption ?? media.public_id}.${media.format}`,
            });
        }

        await archive.finalize();

        return new Response(Readable.toWeb(stream) as ReadableStream, {
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": 'attachment; filename="galerie.zip"',
            },
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: 'Une erreur est survenue pendant la génération du zip.'}, {status: 500});
    }
}