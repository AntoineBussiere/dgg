'use client';

import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
    content: ReactNode;
    children: ReactNode;
    disabled?: boolean;
};

export function Tooltip({ content, children, disabled = false }: Props) {
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);

    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });

    const updatePosition = () => {
        if (!triggerRef.current || !tooltipRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        let left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;

        let top = triggerRect.top - tooltipRect.height - 8;

        const padding = 8;

        left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));

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

            {open && !disabled && createPortal(
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