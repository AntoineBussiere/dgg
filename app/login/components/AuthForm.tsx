'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        
        const password = formData.get("password") as string;
        const username = formData.get("username") as string;
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        setLoading(false);

        if (res.ok) {
            router.push("/admin");
        } else {
            setError("Mot de passe incorrect");
        }
    }

    return (
        <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                    Nom d&apos;utilisateur
                </label>

                <input
                    type="text"
                    name="username"
                    placeholder="Ton nom d'utilisateur"
                    autoComplete="off"
                    className="
                        w-full
                        rounded-xl
                        bg-white/10
                        border border-white/20
                        px-4 py-3
                        text-white
                        placeholder-slate-400
                        outline-none
                        transition
                        focus:border-blue-400
                        focus:ring-2
                        focus:ring-blue-500/30
                    "
                    required
                />
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                    Mot de passe
                </label>

                <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    autoComplete="off"
                    className="
                        w-full
                        rounded-xl
                        bg-white/10
                        border border-white/20
                        px-4 py-3
                        text-white
                        placeholder-slate-400
                        outline-none
                        transition
                        focus:border-blue-400
                        focus:ring-2
                        focus:ring-blue-500/30
                    "
                    required
                />
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3">
                    {error}
                </div>
            )}

            {/* Button */}
            <button
                type="submit"
                disabled={loading}
                className="
                    w-full
                    rounded-xl
                    bg-blue-500
                    hover:bg-blue-600
                    active:scale-[0.98]
                    transition-all
                    py-3
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-blue-500/30
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                "
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />

                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                        </svg>

                        Connexion...
                    </span>
                ) : (
                    "Valider"
                )}
            </button>
        </form>
    );
}