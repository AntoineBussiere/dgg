import { requireAuth } from "@/lib/auth";
import { hash } from "@/lib/bcrypt";
import { redis, redisPrefix } from "@/lib/redis";
import { deleteUser, resetPassword } from "@/lib/users";
import { User } from "@/types/user";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        await requireAuth();
    } catch(e) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const { username, password } = await req.json();
    const users = await resetPassword(username, password);

    return NextResponse.json(users);
}

export async function DELETE(req: Request, context: { params: Promise<{ username: string }> }) {
    const { username } = await context.params;

    const users = await deleteUser(username);

    return NextResponse.json(users);
}