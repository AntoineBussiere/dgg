import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const cookie = req.headers.get("cookie") || "";
    const sessionId = cookie.split("session=")[1];

    if (sessionId) {
        await redis.del(`session:${sessionId}`);
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set("session", "", { maxAge: 0 });

    return res;
}