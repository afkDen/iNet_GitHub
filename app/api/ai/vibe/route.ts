import { NextRequest, NextResponse } from 'next/server';
import { generateVibeTags } from '@/lib/nvidia/nim';
import { Establishment, SessionContext } from '@/types';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { establishment, context } = body;

        if (!establishment) {
            return NextResponse.json({ error: 'Establishment data is required' }, { status: 400 });
        }

        const tags = await generateVibeTags(establishment as Partial<Establishment>, context as SessionContext);

        return NextResponse.json({ tags });
    } catch (error) {
        console.error('[API Vibe Error]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
