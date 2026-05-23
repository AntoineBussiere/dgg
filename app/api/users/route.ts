import { requireAuth } from "@/lib/auth";
import { hash } from "@/lib/bcrypt";
import { redis, redisPrefix } from "@/lib/redis";
import { createUser } from "@/lib/users";
import { User } from "@/types/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await requireAuth();
    } catch(e) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const { username, password } = await req.json();
    try {
        const users = await createUser(username, password);
    
        return NextResponse.json(users);
    } catch(e) {
        console.log(e);
        
        return NextResponse.json({error: 'Username already exists'}, {status: 406})
    }
}