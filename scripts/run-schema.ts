import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const PROJECT_REF = 'qafyayulkmlixodjnnbc';

async function runSql(query: string, label: string) {
    if (!ACCESS_TOKEN) {
        console.error('  ❌ SUPABASE_ACCESS_TOKEN not set in .env.local');
        return false;
    }
    const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    });

    const text = await response.text();

    if (!response.ok) {
        console.error(`  ❌ ${label} (${response.status}):`, text.substring(0, 300));
        return false;
    }
    console.log(`  ✅ ${label}`);
    return true;
}

async function fixSchema() {
    console.log('🔧 Fixing remaining schema issues...\n');

    // The sessions table is missing the filters column (JSONB)
    console.log('1. Adding filters column to sessions...');
    await runSql("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS filters JSONB NOT NULL DEFAULT '{}';", 'sessions.filters');

    // Also ensure card_stack, status, matched_id exist (may have been lost if sessions was recreated)
    await runSql("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS card_stack TEXT[] DEFAULT '{}';", 'sessions.card_stack');
    await runSql("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';", 'sessions.status');
    await runSql('ALTER TABLE sessions ADD COLUMN IF NOT EXISTS matched_id TEXT;', 'sessions.matched_id');

    // Ensure participants columns
    console.log('2. Ensuring participants columns...');
    await runSql("ALTER TABLE participants ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'joined';", 'participants.status');
    await runSql('ALTER TABLE participants ADD COLUMN IF NOT EXISTS is_done BOOLEAN DEFAULT FALSE;', 'participants.is_done');

    console.log('\n🎉 Schema fix completed!');
}

fixSchema();
