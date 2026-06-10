export default function SectionCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="
            rounded-2xl
            border
            border-white/10
            bg-white/5
            backdrop-blur-lg
            p-6
            shadow-xl
        ">
            {children}
        </div>
    );
}