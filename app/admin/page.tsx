import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { redis } from "@/lib/redis"

export default async function AdminPage() {
    const sessionId = (await cookies()).get("session")?.value;

    if (!sessionId) redirect("/login");

    const session = await redis.get(`session:${sessionId}`);

    if (!session) redirect("/login");

    return <div>Admin OK 👌</div>
}