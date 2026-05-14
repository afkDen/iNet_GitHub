import Link from 'next/link';

// ─── Search SVG Icon ──────────────────────────────────────────────────

function SearchIcon() {
    return (
        <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="11"
                cy="11"
                r="7"
                stroke="#E85D26"
                strokeWidth="1.5"
            />
            <path
                d="M16.5 16.5L21 21"
                stroke="#E85D26"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-[#FAFAF8]">
            <div className="mb-6">
                <SearchIcon />
            </div>
            <h1 className="text-[24px] font-bold text-[#1A1A1A] mb-2">
                Ay, nasan na tayo?
            </h1>
            <p className="text-[15px] text-[#6B6B6B] mb-8 max-w-xs">
                Mukhang naligaw ka. Hindi namin mahanap ang hinahanap mong pahina.
            </p>
            <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E85D26] text-white text-[15px] font-semibold hover:bg-[#d14d1a] transition-colors"
            >
                Back to Home
            </Link>
        </div>
    );
}
