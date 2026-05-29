import { requireAuth } from "@/lib/auth";
import { createUser } from "@/lib/users";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await requireAuth();
    } catch(e) {
        console.error(e);
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const { username, password } = await req.json();
    try {
        const users = await createUser(username, password);
    
        return NextResponse.json(users);
    } catch(e) {
        console.error(e);
        return NextResponse.json({error: 'Username already exists'}, {status: 406})
    }
}