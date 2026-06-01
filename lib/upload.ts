import { UploadApiResponse } from "cloudinary";

export async function uploadToCloudinary(file: File, folder: string): Promise<UploadApiResponse> {
    const signRes = await fetch("/api/cloudinary/sign", {
        method: "POST",
        body: JSON.stringify({ folder }),
    });

    const signData = await signRes.json();

    const formData = new FormData();

    formData.append("file", file);
    formData.append("api_key", signData.apiKey);
    formData.append("timestamp", signData.timestamp);
    formData.append("signature", signData.signature);
    formData.append("folder", folder);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/auto/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    return await res.json();
}

export async function uploadMany(files: File[], folder: string) {
    const CHUNK_SIZE = 5;

    const results = [];

    for (let i = 0; i < files.length; i += CHUNK_SIZE) {
        const chunk = files.slice(i, i + CHUNK_SIZE);

        const uploaded = await Promise.all(
            chunk.map(file => uploadToCloudinary(file, folder))
        );

        results.push(...uploaded);
    }

    return results;
}