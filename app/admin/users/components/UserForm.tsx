'use client'

import { User } from "@/types/user";
import { useState } from "react";

type Props = {
    onAdd: (users: User[]) => void
};

export default function UserForm({onAdd}: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function createUser(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);

        const formData = new FormData(e.currentTarget);
        
        const password = formData.get("password") as string;
        const username = formData.get("username") as string;
        const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (res.status === 406) {
            setError(`Ce nom d'utilisateur est déjà utilisé.`);
        } else {
            const users = await res.json();
            onAdd(users);
        }

        setLoading(false);
    }
    return (
        <form className="space-y-4" onSubmit={createUser}>
            <input
                className="w-full p-2 rounded bg-white/10 border border-white/20"
                type="text"
                name="username"
                placeholder="Nom d'utilisateur"
            />
            <input
                className="w-full p-2 rounded bg-white/10 border border-white/20"
                name="password"
                placeholder="••••••••"
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 py-2 rounded"
            >
                Créer
            </button>
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3">
                    {error}
                </div>
            )}
        </form>
    );
}