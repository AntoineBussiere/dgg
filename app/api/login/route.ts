import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { getUser } from "@/lib/users";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
    const { username, password } = await req.json();

    const user = await getUser(username);

    if (!user) {
        return NextResponse.json({ error: "invalid" }, { status: 401 });
    }

    const isPasswordValid = user.hash ? await bcrypt.compare(password, user.hash) : false;

    if (!isPasswordValid) {
        return NextResponse.json({ error: "invalid" }, { status: 401 });
    }

    const sessionId = await createSession(username);

    const res = NextResponse.json({ ok: true });

    res.cookies.set("session", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
    });

    return res;
}