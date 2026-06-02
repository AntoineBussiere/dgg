export function getVideoDimensions(file: File) {
    return new Promise<{ width: number; height: number }>((resolve, reject) => {
        const video = document.createElement("video");
        const url = URL.createObjectURL(file);

        video.preload = "metadata";

        video.onloadedmetadata = () => {
            resolve({
                width: video.videoWidth,
                height: video.videoHeight,
            });

            URL.revokeObjectURL(url);
        };

        video.onerror = reject;

        video.src = url;
    });
}

export async function getImageDimensions(file: File) {
    const bitmap = await createImageBitmap(file);

    return {
        width: bitmap.width,
        height: bitmap.height,
    };
}