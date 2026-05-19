import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const sessionId = (await cookies()).get("session")?.value;

    if (!sessionId) {
        return NextResponse.json(null, { status: 401 });
    }

    const session = await redis.get(`session:${sessionId}`);

    if (!session) {
        return NextResponse.json(null, { status: 401 });
    }

    return NextResponse.json(session);
}