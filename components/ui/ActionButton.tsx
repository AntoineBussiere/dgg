type Props = {
    children: React.ReactNode;
    variant: "warning" | "danger" | "success";
    onClick: () => void;
    disabled?: boolean
};

export function ActionButton({
    children,
    variant,
    onClick,
    disabled = false
}: Props) {
    let styles;
    switch(variant) {
        case "danger": styles = "text-red-200 bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:border-red-400/40"; break;
        case "warning": styles = "text-amber-200 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-400/40"; break;
        case "success": styles = "text-green-200 bg-green-500/10 border-green-500/30 hover:bg-green-500/20 hover:border-green-400/40"; break;
    }

    return (
        <button
            onClick={onClick}
            className={`
                px-3
                py-1.5
                rounded-lg
                text-sm
                font-medium
                border
                transition-all
                active:scale-[0.97]
                ${styles}
            `}
            disabled={disabled}
        >
            {children}
        </button>
    );
}