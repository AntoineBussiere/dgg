import AuthForm from "./components/AuthForm";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";

export default async function Login() {
    const sessionId = (await cookies()).get("session")?.value;
    
    if (sessionId) {
        const session = await redis.get(`session:${sessionId}`);
        if (session) redirect("/admin");
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white">
                            Connexion
                        </h1>

                        <p className="text-slate-300 mt-2">
                            Connecte-toi à ton espace
                        </p>
                    </div>
                    <AuthForm></AuthForm>
                </div>
            </div>
        </main>
    );
}