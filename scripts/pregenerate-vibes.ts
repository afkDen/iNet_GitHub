
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local manually
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
        console.warn('⚠️  Could not load .env.local');
    }
}

loadEnv();

async function pregenerateVibes() {
    const { generateVibeTags } = await import('../lib/nvidia/nim');
    const { establishments } = await import('../lib/data/establishments');

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log(`🚀 Starting pre-generation for ${establishments.length} venues...`);
    let successCount = 0;
    let failCount = 0;

    for (const venue of establishments) {
        try {
            console.log(`Generating tags for: ${venue.name}...`);
            const tags = await generateVibeTags(venue);

            if (tags && tags.length > 0) {
                const { error } = await supabase
                    .from('establishments')
                    .update({ vibe_tags: tags })
                    .eq('id', venue.id);

                if (error) throw error;
                successCount++;
            } else {
                console.warn(`⚠️  No tags generated for ${venue.name}, skipping.`);
                failCount++;
            }

            // Rate limit mitigation: small delay between calls
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`❌ Failed to process ${venue.name}:`, error);
            failCount++;
        }
    }

    console.log(`\n✨ Pre-generation complete!`);
    console.log(`✅ Successfully updated: ${successCount}`);
    console.log(`❌ Failed/Skipped: ${failCount}`);
}

pregenerateVibes().catch(console.error);
