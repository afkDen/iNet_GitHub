import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSessionCode, buildCardStack } from '@/lib/session/manager';
import { establishments } from '@/lib/data/establishments';
import { SessionContext } from '@/types';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const context: SessionContext = body.context;

        if (!context) {
            return NextResponse.json({ error: 'Missing session context' }, { status: 400 });
        }

        const supabase = await createClient();
        const code = generateSessionCode();
        const cardStack = buildCardStack(context, establishments);
        const cardStackIds = cardStack.map(e => e.id);

        const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .insert({
                code,
                mode: context.mode,
                filters: context,
                status: 'active',
                card_stack: cardStackIds,
            })
            .select()
            .single();

        if (sessionError) {
            console.error('[Session Create Error]', sessionError);
            // If card_stack column doesn't exist, try without it
            if (sessionError.message?.includes('card_stack')) {
                const { data: session2, error: sessionError2 } = await supabase
                    .from('sessions')
                    .insert({
                        code,
                        mode: context.mode,
                        filters: context,
                        status: 'active',
                    })
                    .select()
                    .single();

                if (sessionError2) {
                    console.error('[Session Create Error - fallback]', sessionError2);
                    return NextResponse.json({ error: 'Database error creating session' }, { status: 500 });
                }

                // Store card_stack in filters JSONB as fallback
                await supabase
                    .from('sessions')
                    .update({ filters: { ...context, _card_stack: cardStackIds } })
                    .eq('id', session2.id);

                return NextResponse.json({
                    session: session2,
                    cardStack
                });
            }
            return NextResponse.json({ error: 'Database error creating session' }, { status: 500 });
        }

        return NextResponse.json({
            session,
            cardStack
        });

    } catch (error) {
        console.error('[Session API Error]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
