import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="
            min-h-screen
            bg-gradient-to-br
            from-slate-900
            via-slate-800
            to-slate-950
            text-white
        ">
            <div className="flex">
                <Sidebar />

                <main className="
                    flex-1
                    min-h-screen
                    p-8
                ">
                    {children}
                </main>
            </div>
        </div>
    );
}