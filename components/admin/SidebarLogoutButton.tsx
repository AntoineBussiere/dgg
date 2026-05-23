"use client";

import { useRouter } from "next/navigation";

export default function SidebarLogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await fetch("/api/logout", {
            method: "POST",
        });

        router.replace("/login");
    }

    return (
        <div className="mt-auto pt-4 border-t border-white/10">
            <button
                onClick={handleLogout}
                className="
                    w-full
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-red-300
                    bg-red-500/10
                    border
                    border-red-500/20
                    transition-all
                    hover:bg-red-500/20
                    hover:border-red-500/30
                    active:scale-[0.98]
                "
            >
                {/* Icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10v1"
                    />
                </svg>

                Déconnexion
            </button>
        </div>
    );
}