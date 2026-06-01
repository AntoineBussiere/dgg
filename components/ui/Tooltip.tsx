'use client';

import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
    content: ReactNode;
    children: ReactNode;
};

export function Tooltip({ content, children }: Props) {
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);

    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    const updatePosition = () => {
        if (!triggerRef.current || !tooltipRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        let left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;

        let top = triggerRect.top - tooltipRect.height - 8;

        const padding = 8;

        // Empêche de sortir de l'écran horizontalement
        left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));

        // Si pas assez de place au-dessus, on le met dessous
        if (top < padding) {
            top = triggerRect.bottom + 8;
        }

        setPosition({
            top: top + window.scrollY,
            left: left + window.scrollX,
        });
    };

    useLayoutEffect(() => {
        if (!open) return;

        updatePosition();

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [open]);

    return (
        <>
            <div
                ref={triggerRef}
                className="block min-w-0 w-full text-sm font-medium"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            >
                {children}
            </div>

            {mounted && open && createPortal(
                <div
                    ref={tooltipRef}
                    style={{
                        position: 'absolute',
                        top: position.top,
                        left: position.left,
                    }}
                    className="
                        z-[9999]
                        max-w-sm
                        rounded-md
                        bg-black
                        px-3
                        py-2
                        text-sm
                        text-white
                        shadow-lg
                        break-words
                    "
                >
                    {content}
                </div>,
                document.body
            )}
        </>
    );
}