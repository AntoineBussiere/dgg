import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { User } from "@/types/user";
import bcrypt from 'bcrypt';
import { hash } from "@/lib/bcrypt";

export async function POST(req: Request) {
    const { username, password } = await req.json();

    const env =
        process.env.VERCEL_ENV ||
        process.env.NODE_ENV ||
        "development";

    const prefix = env !== 'production' ? 'DEV-' : '';

    const users = await redis.get(prefix + 'users') as User[];
    const user = users.find(x => x.username === username);
    console.log(username);
    

    if (!user) {
        return NextResponse.json({ error: "invalid" }, { status: 401 });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.hash);

    if (!isPasswordValid) {
        return NextResponse.json({ error: "invalid" }, { status: 401 });
    }

    const sessionId = randomUUID();

    await redis.set(`session:${sessionId}`, {
        username
    }, { ex: 60 * 60 * 24 }); // 24h

    const res = NextResponse.json({ ok: true });

    res.cookies.set("session", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
    });

    return res;
}