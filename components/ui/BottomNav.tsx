'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ─── SVG Icons ────────────────────────────────────────────────────────

function GridIcon({ filled }: { filled: boolean }) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1.5"
                fill={filled ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1.5"
                fill={filled ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1.5"
                fill={filled ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="1.5"
                fill={filled ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
            />
        </svg>
    );
}

function MapPinIcon({ filled }: { filled: boolean }) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 21C12 21 19 14.5 19 9.5C19 5.63401 15.866 2.5 12 2.5C8.13401 2.5 5 5.63401 5 9.5C5 14.5 12 21 12 21Z"
                fill={filled ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <circle
                cx="12"
                cy="9.5"
                r="2.5"
                fill={filled ? 'white' : 'none'}
                stroke={filled ? 'none' : 'currentColor'}
                strokeWidth="1.5"
            />
        </svg>
    );
}

function ClockIcon({ filled }: { filled: boolean }) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="12"
                cy="12"
                r="9.5"
                fill={filled ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                d="M12 6.5V12L15.5 14"
                stroke={filled ? 'white' : 'currentColor'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// ─── Tab Definition ───────────────────────────────────────────────────

interface Tab {
    label: string;
    href: string;
    icon: (props: { filled: boolean }) => React.ReactNode;
}

const tabs: Tab[] = [
    {
        label: 'DISCOVER',
        href: '/',
        icon: (props) => <GridIcon {...props} />,
    },
    {
        label: 'PIN',
        href: '/pin',
        icon: (props) => <MapPinIcon {...props} />,
    },
    {
        label: 'HISTORY',
        href: '/history',
        icon: (props) => <ClockIcon {...props} />,
    },
];

// ─── Component ────────────────────────────────────────────────────────

export default function BottomNav() {
    const pathname = usePathname();

    // Hide on onboarding — the route group layout handles this,
    // but we also check here as a safety net.
    if (pathname.startsWith('/onboarding')) {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E8E5DF] pb-safe">
            <div className="flex items-center justify-around h-16 max-w-[430px] mx-auto">
                {tabs.map((tab) => {
                    const isActive =
                        tab.href === '/'
                            ? pathname === '/' || pathname.startsWith('/discover') || pathname.startsWith('/solo')
                            : pathname.startsWith(tab.href);

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className="flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] -mb-1"
                        >
                            <span
                                className={
                                    isActive
                                        ? 'text-[#E85D26]'
                                        : 'text-[#9E9E9E]'
                                }
                            >
                                <tab.icon filled={isActive} />
                            </span>
                            <span
                                className={`text-[10px] font-semibold tracking-wide ${isActive
                                        ? 'text-[#E85D26]'
                                        : 'text-[#9E9E9E]'
                                    }`}
                            >
                                {tab.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
