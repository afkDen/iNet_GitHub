import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { establishments } from '@/lib/data/establishments';

export async function GET(
    req: NextRequest,
    { params }: { params: { code: string } }
) {
    try {
        const { code } = params;
        const supabase = await createClient();

        // 1. Fetch session by code
        const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .select('*')
            .eq('code', code)
            .single();

        if (sessionError || !session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // 2. Fetch establishments matching card_stack IDs in order
        // The card_stack is stored as an array of IDs in the sessions table
        const cardStackIds = (session as any).card_stack || [];

        if (cardStackIds.length === 0) {
            return NextResponse.json({ session, cardStack: [] });
        }

        // Filter the seeded establishments list to match the IDs and maintain order
        const cardStack = cardStackIds
            .map((id: string) => establishments.find(e => e.id === id))
            .filter(Boolean);

        return NextResponse.json({
            session,
            cardStack
        });

    } catch (error) {
        console.error('[Session GET Error]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
