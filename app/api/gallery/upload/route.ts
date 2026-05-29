import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { CreateMediaDTO, PendingMedia } from "@/types/media";
import { prisma } from "@/lib/prisma";
import { UploadApiResponse } from "cloudinary";

type SafeUploadResult =
    | { ok: true; result: UploadApiResponse }
    | { ok: false; error: unknown };

export async function POST(req: Request) {
    try {
        await requireAuth();
    } catch(e) {
        console.error(e);
        
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    try {
        const formData = await req.formData();

        const files = formData.getAll("files") as File[];
        const metadata: PendingMedia[] = JSON.parse(
            formData.get("metadata") as string
        );

        if (files.length === 0) {
            return NextResponse.json(
                { error: "No file" },
                { status: 400 }
            );
        }

        const promises = files.map(async (file, index) => {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            return new Promise<SafeUploadResult>((resolve) => {
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: getResourceType(file.type),
                        folder: metadata[index].folderPath,
                        public_id: metadata[index].id
                    },
                    (error, result) => {
                        if (error || !result) {
                            resolve({ ok: false, error });
                        } else {
                            resolve({ ok: true, result });
                        }
                    }
                ).end(buffer);
            });
        });

        const results = await Promise.all(promises);
        const successful = results.filter(r => r.ok);

        const medias: CreateMediaDTO[] = successful.map(r => {
            const result = r.result;
            const resultMetadata = metadata.find(x => x.id === result.display_name);
            const date = resultMetadata?.date;
            const caption = resultMetadata?.caption;
            return {
                public_id: result.public_id,
                url: result.secure_url,
                caption: caption ?? '',
                type: result.resource_type,
                width: result.width,
                height: result.height,
                format: result.format,
                bytes: result.bytes,
                date: date && date !== '' ? new Date(date) : undefined,
                folderPath: result.asset_folder,
                createdAt: new Date(),
            };
        });
        
        const createdMedias = await prisma.media.createManyAndReturn({
            data: medias
        });

        return NextResponse.json(createdMedias.map(media => ({
            ...media,
            status: 'saved',
        }), {status: 200}));
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: 'Une erreur est survenue pendant la création.'}, {status: 500});
    }

    
}

function getResourceType(mimeType: string): "image" | "video" | "raw" {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    return "raw";
}