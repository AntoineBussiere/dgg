import { cookies } from "next/headers";
import { redis } from "@/lib/redis";
import { randomUUID } from "crypto";

export async function getSession() {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
        return null;
    }

    const session = await redis.get(
        `session:${sessionCookie.value}`
    );

    return session;
}

export async function getSessionId() {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get("session");

    return sessionCookie?.value;
}

export async function createSession(username: string) {
    const sessionId = randomUUID();
    
    await redis.set(`session:${sessionId}`, {
        username
    }, { ex: 60 * 60 * 24 }); // 24h

    return sessionId;
}

export async function deleteSession() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    const sessionId = sessionCookie?.value;
    
    if (sessionId) {
        await redis.del(`session:${sessionId}`);
    }

    cookieStore.delete("session");
}

export async function requireAuth() {
    const session = await getSession();

    if (!session) {
        throw new Error("Unauthorized");
    }

    return session;
}