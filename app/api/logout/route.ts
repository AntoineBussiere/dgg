import { deleteSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await deleteSession();

    return NextResponse.json({ ok: true });
}