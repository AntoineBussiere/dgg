'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarLogoutButton from "./SidebarLogoutButton";

const links = [
    {
        href: "/admin/gallery",
        label: "Galerie",
    },
    {
        href: "/admin/users",
        label: "Utilisateurs",
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="
            flex
            flex-col
            w-64
            min-h-screen
            border-r
            border-white/10
            bg-black/20
            backdrop-blur-xl
            p-6
        ">
            <div className="mb-10">
                <h1 className="
                    text-2xl
                    font-bold
                    text-white
                ">
                    Admin
                </h1>

                <p className="
                    mt-1
                    text-sm
                    text-slate-400
                ">
                    Gestion galerie
                </p>
            </div>

            <nav className="space-y-2">
                {links.map((link) => {
                    const active = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`
                                block
                                rounded-xl
                                px-4
                                py-3
                                transition-all
                                ${
                                    active
                                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                                }
                            `}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
            <SidebarLogoutButton></SidebarLogoutButton>
        </aside>
    );
}