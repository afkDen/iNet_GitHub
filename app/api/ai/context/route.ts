import { NextRequest, NextResponse } from 'next/server';
import { parseNaturalLanguageContext } from '@/lib/nvidia/nim';
import { SessionContext } from '@/types';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { input, base } = body;

        if (!input) {
            return NextResponse.json({ error: 'Input text is required' }, { status: 400 });
        }

        const contextUpdates = await parseNaturalLanguageContext(input, base as SessionContext);

        return NextResponse.json({ context: contextUpdates });
    } catch (error) {
        console.error('[API Context Error]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
