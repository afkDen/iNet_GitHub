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
    await runSql("ALTER TABLE participants ADD COLUMN IF NOT EXISTS display_name TEXT;", 'participants.display_name');
    await runSql("ALTER TABLE participants ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'joined';", 'participants.status');
    await runSql('ALTER TABLE participants ADD COLUMN IF NOT EXISTS is_done BOOLEAN DEFAULT FALSE;', 'participants.is_done');

    // Ensure establishments description
    console.log('3. Ensuring establishments columns...');
    await runSql("ALTER TABLE establishments ADD COLUMN IF NOT EXISTS description TEXT;", 'establishments.description');

    // 4. Create community_pins table if missing
    console.log('3. Ensuring community_pins table...');
    const createPinsSql = `
        CREATE TABLE IF NOT EXISTS community_pins (
            id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            place_name    TEXT NOT NULL,
            category      TEXT,
            address       TEXT,
            city          TEXT,
            lat           FLOAT,
            lng           FLOAT,
            photo_url     TEXT,
            description   TEXT,
            vibe_tags     TEXT[] DEFAULT '{}',
            is_msme       BOOLEAN DEFAULT FALSE,
            hours_open    TEXT,
            hours_close   TEXT,
            budget_tier   INT,
            deal_text     TEXT,
            status        TEXT DEFAULT 'pending',
            created_at    TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE community_pins ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow all on community_pins" ON community_pins;
        CREATE POLICY "Allow all on community_pins" ON community_pins FOR ALL USING (true) WITH CHECK (true);
    `;
    await runSql(createPinsSql, 'community_pins');

    console.log('\n🎉 Schema fix completed!');
}

fixSchema();
