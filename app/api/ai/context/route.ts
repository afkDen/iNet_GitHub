import { NextRequest, NextResponse } from 'next/server';
import { parseNaturalLanguageContext } from '@/lib/nvidia/nim';
import { SessionContext } from '@/types';

export async function POST(req: NextRequest) {
    try {
        if (!process.env.NVIDIA_NIM_API_KEY && !process.env.NVIDIA_API_KEY) {
            return NextResponse.json({ error: 'NVIDIA API Key is missing in environment' }, { status: 500 });
        }
        
        const body = await req.json();
        const { input, base } = body;
        console.log('[API Context] Input:', input);

        if (!input) {
            return NextResponse.json({ error: 'Input text is required' }, { status: 400 });
        }

        const contextUpdates = await parseNaturalLanguageContext(input, base as SessionContext);
        console.log('[API Context] Updates:', contextUpdates);

        return NextResponse.json({ context: contextUpdates });
    } catch (error: any) {
        console.error('[API Context Error]:', error);
        return NextResponse.json({ 
            error: 'Internal Server Error', 
            details: error.message 
        }, { status: 500 });
    }
}
