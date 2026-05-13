import { createClient } from '@supabase/supabase-js';
import { establishments } from '../lib/data/establishments.js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seed() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing Supabase environment variables');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🚀 Starting database seed...');

    try {
        // 1. Truncate establishments
        console.log('Cleaning establishments table...');
        const { error: deleteError } = await supabase
            .from('establishments')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');

        if (deleteError) throw deleteError;

        // 2. Insert establishments
        console.log(`Inserting ${establishments.length} establishments...`);
        const { error: insertError } = await supabase
            .from('establishments')
            .insert(establishments);

        if (insertError) throw insertError;

        // 3. Create demo sessions
        console.log('Creating demo sessions...');
        const { error: sessionError } = await supabase
            .from('sessions')
            .insert([
                { code: 'AYA-DEMO', mode: 'solo', status: 'active', filters: {} },
                { code: 'AYA-TEST', mode: 'barkada', status: 'active', filters: {} }
            ]);

        if (sessionError) console.warn('Demo sessions might already exist, skipping...');

        console.log('✅ Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
