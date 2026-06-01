export type ToastType =
    | "success"
    | "error"
    | "info";

export type Toast = {
    id: string;
    message: string;
    type: ToastType;
};

export default function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
    return (
        <div
            className="
                fixed top-4 right-4 z-50
                flex flex-col gap-2
            "
        >
            {toasts.map(toast => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onClose={onClose}
                />
            ))}
        </div>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
    const styles = {
        success: "border-green-500/30 bg-green-500/10 text-green-200",
        error: "border-red-500/30 bg-red-500/10 text-red-200",
        info: "border-blue-500/30 bg-blue-500/10 text-blue-200"
    };

    return (
        <div
            className={`
                min-w-72 max-w-sm p-4
                rounded-xl border
                shadow-xl backdrop-blur
                ${styles[toast.type]}
            `}
        >
            <div className="flex items-start justify-between gap-4">
                <p className="text-sm">
                    {toast.message}
                </p>

                <button
                    onClick={() => onClose(toast.id)}
                    className="text-slate-400 hover:text-white"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}