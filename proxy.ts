import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
    const session = req.cookies.get("session");

    if (req.nextUrl.pathname.startsWith('/admin')) {
        const isLoginPage = req.nextUrl.pathname === "/login";

        if (!session && !isLoginPage) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        if (session && isLoginPage) {
            return NextResponse.redirect(new URL("/admin", req.url));
        }
    }

    if (req.nextUrl.pathname.startsWith("/api/admin") && !session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }    

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/api/admin/:path*"
    ],
};