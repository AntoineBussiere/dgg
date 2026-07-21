export const dynamic = "force-dynamic";

import GalleryViewerPage from "@/components/gallery-viewer/GalleryViewerPage";
import { getMedias } from "@/lib/medias";

export default async function GalleryViewerIFrame() {
    const medias = await getMedias();

    return (
        <div className="border border-gray-500/40 rounded-xl h-full overflow-hidden">
            <GalleryViewerPage medias={medias} theme="light" mode="embedded"></GalleryViewerPage>
        </div>
    );
}