import { clsx } from 'clsx';

type VibeBadgeVariant = 'default' | 'deal' | 'community' | 'ai';

interface VibeBadgeProps {
    tag: string;
    variant?: VibeBadgeVariant;
}

const variantStyles: Record<VibeBadgeVariant, string> = {
    default: 'bg-gray-100 text-gray-700',
    deal: 'bg-amber-100 text-amber-800',
    community: 'bg-indigo-100 text-indigo-800',
    ai: 'bg-orange-50 text-orange-700',
};

export default function VibeBadge({ tag, variant = 'default' }: VibeBadgeProps) {
    return (
        <span
            className={clsx(
                'inline-block rounded-full px-2 py-0.5 text-xs font-medium truncate max-w-[120px]',
                variantStyles[variant]
            )}
        >
            {tag}
        </span>
    );
}
