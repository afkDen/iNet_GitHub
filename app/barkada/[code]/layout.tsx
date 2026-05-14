'use client';

import { useParams } from 'next/navigation';
import { SessionProvider } from '@/components/providers/SessionProvider';
import type { ReactNode } from 'react';

export default function BarkadaLayout({
    children,
}: {
    children: ReactNode;
}) {
    const params = useParams<{ code: string }>();
    const sessionCode = params?.code ?? null;

    // participantId is stored in sessionStorage (survives page nav, not persisted)
    // It gets set when the user joins the session via the join API
    const participantId =
        typeof window !== 'undefined'
            ? sessionStorage.getItem('aya_participant_id')
            : null;

    return (
        <SessionProvider
            sessionCode={sessionCode}
            participantId={participantId}
        >
            {children}
        </SessionProvider>
    );
}
