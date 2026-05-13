'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Pin, History } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAV_ITEMS = [
  { label: 'DISCOVER', href: '/solo', icon: Compass },
  { label: 'PIN', href: '/pin', icon: Pin },
  { label: 'HISTORY', href: '/history', icon: History },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-aya-muted/20 px-6 pb-safe pt-2 z-50">
      <div className="flex justify-between items-center max-w-sm mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link 
              key={item.label} 
              href={item.href}
              className="flex flex-col items-center gap-1 p-2 transition-all duration-200"
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-colors",
                isActive ? "bg-aya-primary/10 text-aya-primary" : "text-aya-muted"
              )}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-black tracking-widest",
                isActive ? "text-aya-primary" : "text-aya-muted"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
