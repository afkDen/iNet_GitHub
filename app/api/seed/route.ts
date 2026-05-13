import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { establishments } from '@/lib/data/establishments';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');

    // Guard: Only allow seeding if secret is correct or running on localhost
    if (secret !== 'AYA_SEED_2026' && !process.env.NEXT_PUBLIC_APP_URL?.includes('localhost')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const supabase = await createClient();

        // 1. Clear existing establishments to avoid duplicates
        const { error: deleteError } = await supabase
            .from('establishments')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (deleteError) throw deleteError;

        // 2. Insert all seeded establishments from local data
        const { data, error: insertError } = await supabase
            .from('establishments')
            .insert(establishments)
            .select();

        if (insertError) throw insertError;

        return NextResponse.json({
            success: true,
            count: data?.length || 0,
            message: `Successfully seeded ${data?.length || 0} establishments.`
        });

    } catch (error: any) {
        console.error('[SEED_API_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
