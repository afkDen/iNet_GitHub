import { createClient } from '@supabase/supabase-js';
import { establishments } from '../lib/data/establishments.js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function fixAndSeed() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing Supabase environment variables');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🔧 Fixing schema and seeding database...\n');

    // Step 1: Drop existing establishments table (cascade to remove dependencies)
    console.log('1. Dropping existing establishments table...');
    const { error: dropError } = await supabase.rpc('drop_establishments_table');
    if (dropError) {
        console.log('   (no existing table or RPC not available, trying direct approach)');
        // Try to delete all rows first, then we'll handle the type mismatch
    }

    // Step 2: Delete all existing rows from establishments
    console.log('2. Clearing establishments...');
    const { error: deleteError } = await supabase
        .from('establishments')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
        console.log('   Delete error (may be OK if table is empty or different schema):', deleteError.message);
    }

    // Step 3: Try to insert with the TEXT ids
    console.log(`3. Inserting ${establishments.length} establishments...`);
    const { data, error: insertError } = await supabase
        .from('establishments')
        .upsert(establishments, { onConflict: 'id' })
        .select();

    if (insertError) {
        console.error('❌ Insert failed:', insertError.message);
        console.log('\nThe live database has UUID type for establishments.id.');
        console.log('You need to run the full schema.sql in the Supabase SQL Editor:');
        console.log('https://supabase.com/dashboard/project/qafyayulkmlixodjnnbc/sql/new');
        console.log('\nCopy the contents of lib/supabase/schema.sql and run it there.');
        process.exit(1);
    }

    console.log(`✅ Successfully inserted ${data?.length || 0} establishments!`);

    // Step 4: Create demo sessions
    console.log('4. Creating demo sessions...');
    const { error: sessionError } = await supabase
        .from('sessions')
        .upsert([
            { code: 'AYA-DEMO', mode: 'solo', status: 'active', filters: {} },
            { code: 'AYA-TEST', mode: 'barkada', status: 'active', filters: {} }
        ], { onConflict: 'code' });

    if (sessionError) {
        console.warn('   Demo sessions warning:', sessionError.message);
    } else {
        console.log('   Demo sessions ready.');
    }

    console.log('\n🎉 Fix and seed completed!');
}

fixAndSeed();
