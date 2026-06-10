import GalleryPage from "@/components/gallery/GalleryPage";
import { getMedias } from "@/lib/medias";

export default async function Page() {
    const medias = await getMedias();

    return (
        <GalleryPage initialMedias={medias} />
    );
}