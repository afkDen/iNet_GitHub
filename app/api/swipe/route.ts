import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { session_id, participant_id, establishment_id, direction, speed_ms, drag_distance } = body;

        if (!session_id || !participant_id || !establishment_id || !direction) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('swipes')
            .insert({
                session_id,
                participant_id,
                venue_id: establishment_id, // Mapping establishment_id to venue_id in DB
                direction,
                swipe_speed_ms: speed_ms,
                drag_distance,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ swipe: data });
    } catch (error: any) {
        console.error('[SWIPE_API_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
