'use client';

import { motion } from 'framer-motion';

// ─── Flame SVG ────────────────────────────────────────────────────────

function FlameIcon() {
    return (
        <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 21.5C15.5899 21.5 18.5 18.5899 18.5 15C18.5 12.5 17 10.5 15.5 8.5C14.5 7.2 13.5 5.8 12.5 3.5C12.2 2.9 11.8 2.9 11.5 3.5C10.5 5.8 9.5 7.2 8.5 8.5C7 10.5 5.5 12.5 5.5 15C5.5 18.5899 8.41015 21.5 12 21.5Z"
                fill="#E85D26"
                stroke="#E85D26"
                strokeWidth="1"
                strokeLinejoin="round"
            />
            <path
                d="M12 18C13.6569 18 15 16.6569 15 15C15 13.8 14.2 12.8 13.5 11.8C13 11.1 12.5 10.3 12 9C11.5 10.3 11 11.1 10.5 11.8C9.8 12.8 9 13.8 9 15C9 16.6569 10.3431 18 12 18Z"
                fill="#FDF0EA"
            />
        </svg>
    );
}

// ─── Props ────────────────────────────────────────────────────────────

interface LoadingSpinnerProps {
    message?: string;
}

// ─── Component ────────────────────────────────────────────────────────

export default function LoadingSpinner({
    message = 'Hinahanap ni Aya...',
}: LoadingSpinnerProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
            <motion.div
                animate={{
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                <FlameIcon />
            </motion.div>
            <p className="text-[13px] text-[#6B6B6B] font-medium">{message}</p>
        </div>
    );
}
