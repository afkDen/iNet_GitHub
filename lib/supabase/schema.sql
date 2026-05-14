-- ============================================================================
-- AYA — Database Schema
-- Supabase PostgreSQL
-- Run this in Supabase SQL Editor (Phase 0, Step 0.4)
-- ============================================================================

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- Sessions (ephemeral — expire after 2 hours)
CREATE TABLE IF NOT EXISTS sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT UNIQUE NOT NULL,       -- "AYA-4820"
  mode        TEXT NOT NULL,              -- 'solo' | 'barkada' | 'lakbay'
  filters     JSONB NOT NULL DEFAULT '{}',
  card_stack  TEXT[] DEFAULT '{}',        -- array of establishment IDs in swipe order
  status      TEXT DEFAULT 'active',      -- 'active' | 'completed' | 'expired'
  matched_id  TEXT,                       -- winning establishment ID after reveal
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at  TIMESTAMPTZ DEFAULT NOW() + INTERVAL '2 hours'
);

-- Participants
CREATE TABLE IF NOT EXISTS participants (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID REFERENCES sessions(id) ON DELETE CASCADE,
  display_name TEXT,
  status       TEXT DEFAULT 'joined',     -- 'joined' | 'swiping' | 'done'
  is_done      BOOLEAN DEFAULT FALSE,
  joined_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Swipes (ephemeral — never read by client, only used for match computation)
CREATE TABLE IF NOT EXISTS swipes (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id     UUID REFERENCES sessions(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  venue_id       TEXT NOT NULL,           -- establishment ID
  direction      TEXT NOT NULL,           -- 'right' | 'left'
  swipe_speed_ms INT DEFAULT 0,
  hesitation_ms  INT DEFAULT 0,
  drag_distance  FLOAT DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Venues / Establishments (cached/seeded — never fetched live during demo)
CREATE TABLE IF NOT EXISTS establishments (
  id              TEXT PRIMARY KEY,       -- 'est-1' etc.
  name            TEXT NOT NULL,
  category        TEXT NOT NULL,
  address         TEXT,
  barangay        TEXT,
  city            TEXT NOT NULL,
  lat             FLOAT,
  lng             FLOAT,
  cost_min        INT,
  cost_max        INT,
  is_open         BOOLEAN DEFAULT TRUE,
  opens_at        TEXT,
  closes_at       TEXT,
  photo_url       TEXT,
  vibe_tags       TEXT[] DEFAULT '{}',
  is_community_pin BOOLEAN DEFAULT FALSE,
  is_deal         BOOLEAN DEFAULT FALSE,
  deal_text       TEXT,
  community_confirms INT DEFAULT 0,
  rating          FLOAT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Community pins (shallow — UI only, fake submit)
CREATE TABLE IF NOT EXISTS community_pins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_name    TEXT NOT NULL,
  lat           FLOAT,
  lng           FLOAT,
  photo_url     TEXT,
  description   TEXT,
  vibe_tags     TEXT[] DEFAULT '{}',
  status        TEXT DEFAULT 'pending',   -- 'pending' | 'approved' | 'rejected'
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- MSME listings (shallow — UI only, fake submit)
CREATE TABLE IF NOT EXISTS msme_listings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  hours_open    TEXT,
  hours_close   TEXT,
  budget_tier   INT,
  vibe_tags     TEXT[] DEFAULT '{}',
  deal_text     TEXT,
  deal_start    TIMESTAMPTZ,
  deal_end      TIMESTAMPTZ,
  status        TEXT DEFAULT 'pending',   -- 'pending' | 'approved' | 'rejected'
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_sessions_code ON sessions(code);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_participants_session ON participants(session_id);
CREATE INDEX IF NOT EXISTS idx_swipes_session ON swipes(session_id);
CREATE INDEX IF NOT EXISTS idx_swipes_participant ON swipes(participant_id);
CREATE INDEX IF NOT EXISTS idx_establishments_category ON establishments(category);
CREATE INDEX IF NOT EXISTS idx_establishments_city ON establishments(city);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (Permissive for Hackathon)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE msme_listings ENABLE ROW LEVEL SECURITY;

-- Sessions: allow all operations (hackathon-permissive)
CREATE POLICY "Allow all on sessions" ON sessions
  FOR ALL USING (true) WITH CHECK (true);

-- Participants: allow all operations
CREATE POLICY "Allow all on participants" ON participants
  FOR ALL USING (true) WITH CHECK (true);

-- Swipes: allow all operations
CREATE POLICY "Allow all on swipes" ON swipes
  FOR ALL USING (true) WITH CHECK (true);

-- Establishments: allow SELECT for everyone, INSERT/UPDATE/DELETE for service role only
CREATE POLICY "Allow select on establishments" ON establishments
  FOR SELECT USING (true);

CREATE POLICY "Allow insert on establishments" ON establishments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update on establishments" ON establishments
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete on establishments" ON establishments
  FOR DELETE USING (true);

-- Community pins: allow all operations
CREATE POLICY "Allow all on community_pins" ON community_pins
  FOR ALL USING (true) WITH CHECK (true);

-- MSME listings: allow all operations
CREATE POLICY "Allow all on msme_listings" ON msme_listings
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- 4. REALTIME (Supabase WebSocket)
-- ============================================================================

-- Enable Realtime on tables that need live sync
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE participants;
ALTER PUBLICATION supabase_realtime ADD TABLE swipes;

-- REPLICA IDENTITY FULL is required for Postgres Changes to include old row data in UPDATE events.
-- Without this, UPDATE payloads will have empty old data and the client won't detect changes correctly.
ALTER TABLE participants REPLICA IDENTITY FULL;
ALTER TABLE sessions REPLICA IDENTITY FULL;

-- ============================================================================
-- 5. HELPER FUNCTIONS
-- ============================================================================

-- Function to check if all participants in a session are done
CREATE OR REPLACE FUNCTION check_all_participants_done(session_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  total INT;
  done_count INT;
BEGIN
  SELECT COUNT(*) INTO total FROM participants WHERE session_id = session_uuid;
  SELECT COUNT(*) INTO done_count FROM participants WHERE session_id = session_uuid AND is_done = TRUE;
  RETURN total > 0 AND total = done_count;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-expire old sessions
CREATE OR REPLACE FUNCTION expire_old_sessions()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE sessions SET status = 'expired' WHERE expires_at < NOW() AND status = 'active';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
