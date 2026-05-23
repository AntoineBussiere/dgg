import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";
import GalleriesPage from "./galerie/page";

export default async function AdminPage() {
    const sessionId = (await cookies()).get("session")?.value;

    if (!sessionId) redirect("/login");

    const session = await redis.get(`session:${sessionId}`);

    if (!session) redirect("/login");

    return (
        <GalleriesPage></GalleriesPage>
    );
}