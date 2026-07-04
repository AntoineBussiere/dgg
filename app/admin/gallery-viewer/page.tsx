export const dynamic = "force-dynamic";

import GalleryViewerPage from "@/components/gallery-viewer/GalleryViewerPage";
import { getMedias } from "@/lib/medias";

export default async function Page() {
    const medias = await getMedias();

    return (
        <GalleryViewerPage medias={medias} theme="dark" mode="fullscreen" />
    );
}