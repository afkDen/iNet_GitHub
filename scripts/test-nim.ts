import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local manually (Next.js only auto-loads in its own runtime)
function loadEnv() {
    const envPath = resolve(__dirname, '..', '.env.local');
    try {
        const content = readFileSync(envPath, 'utf-8');
        for (const line of content.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eqIdx = trimmed.indexOf('=');
            if (eqIdx === -1) continue;
            const key = trimmed.slice(0, eqIdx).trim();
            const value = trimmed.slice(eqIdx + 1).trim();
            if (!process.env[key]) {
                process.env[key] = value;
            }
        }
        console.log('✅ Loaded .env.local');
    } catch {
        console.warn('⚠️  Could not load .env.local — make sure NVIDIA_API_KEY is set');
    }
}

loadEnv();

// Dynamic import after env is loaded
async function main() {
    const { generateVibeTags, NIM_MODEL } = await import('../lib/nvidia/nim');

    console.log('🚀 Testing NVIDIA NIM Connectivity...');
    console.log(`Using Model: ${NIM_MODEL}`);
    console.log(`API Key present: ${process.env.NVIDIA_API_KEY ? '✅ Yes' : '❌ No'}`);

    const mockVenue = {
        id: 'test-1',
        name: 'Sample Cafe',
        category: 'cafe' as const,
        city: 'Manila',
        cost_min: 100,
        cost_max: 300
    };

    try {
        const tags = await generateVibeTags(mockVenue);
        console.log('✅ Success! Received vibe tags:', tags);
        process.exit(0);
    } catch (error) {
        console.error('❌ NIM Test Failed:', error);
        process.exit(1);
    }
}

main();
