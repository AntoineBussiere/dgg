export const dynamic = "force-dynamic";

import GalleryViewerPage from "@/components/gallery-viewer/GalleryViewerPage";
import { getMedias } from "@/lib/medias";

export default async function GalleryViewerIFrame() {
    const medias = await getMedias();

    return (
        <div className="h-screen flex flex-col">
            <div className="min-h-0 flex-1 overflow-auto border border-gray-500/40 rounded-xl">
                <GalleryViewerPage
                    medias={medias}
                    theme="light"
                    mode="embedded"
                />
            </div>
        </div>
    );
}