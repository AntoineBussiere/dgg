import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
    const { folder } = await req.json();

    const timestamp = Math.round(Date.now() / 1000);

    const apiSecret = process.env.CLOUDINARY_API_SECRET!;
    const apiKey = process.env.CLOUDINARY_API_KEY!;

    const paramsToSign = {
        folder,
        timestamp,
    };

    const signature = crypto
        .createHash("sha1")
        .update(
            Object.entries(paramsToSign)
                .map(([k, v]) => `${k}=${v}`)
                .join("&") + apiSecret
        )
        .digest("hex");

    return NextResponse.json({
        timestamp,
        signature,
        apiKey,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME
    });
}