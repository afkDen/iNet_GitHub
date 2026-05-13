# DESIGN DOCUMENT
## Aya — AI-Integrated Group Dining Decision App
**Version:** 1.0 (Hackathon Build)
**Last Updated:** Hackathon Day

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│  Next.js 14 App Router · TypeScript · Tailwind · Framer     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Kwentuhan   │  │  Swipe Deck  │  │  Group Lobby &   │  │
│  │  Onboarding  │  │  (Hain)      │  │  Reveal Screen   │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP / WebSocket
          ┌─────────────────┼─────────────────┐
          │                 │                 │
  ┌───────▼──────┐  ┌───────▼──────┐  ┌──────▼───────────┐
  │  Next.js     │  │   Supabase   │  │   NVIDIA NIM     │
  │  API Routes  │  │   Realtime   │  │   (Gemma4 31b)   │
  │  /api/ai     │  │   WebSocket  │  │   Vibe Engine    │
  │  /api/match  │  │   Channels   │  │                  │
  └───────┬──────┘  └───────┬──────┘  └──────────────────┘
          │                 │
  ┌───────▼─────────────────▼────────────────────────────┐
  │              Supabase (PostgreSQL)                    │
  │  sessions · participants · swipes · establishments   │
  └──────────────────────────────────────────────────────┘
```

---

## 2. FOLDER STRUCTURE

```
aya/
├── app/
│   ├── layout.tsx                  # Root layout, font, global styles
│   ├── page.tsx                    # Redirect → /onboarding
│   ├── onboarding/
│   │   └── page.tsx                # Kwentuhan — context collection
│   ├── solo/
│   │   └── page.tsx                # Solo swipe mode
│   ├── barkada/
│   │   ├── page.tsx                # Create barkada session
│   │   ├── [sessionCode]/
│   │   │   ├── lobby/page.tsx      # Waiting room
│   │   │   ├── swipe/page.tsx      # Barkada swipe deck
│   │   │   └── reveal/page.tsx     # Group reveal + Aya Decides
│   ├── lakbay/
│   │   └── page.tsx                # SMOKE & MIRRORS — hardcoded itinerary
│   ├── pin/
│   │   └── page.tsx                # SMOKE & MIRRORS — fake Drop a Pin
│   ├── business/
│   │   └── page.tsx                # SMOKE & MIRRORS — fake business portal
│   ├── history/
│   │   └── page.tsx                # SMOKE & MIRRORS — fake session history
│   └── api/
│       ├── ai/
│       │   └── route.ts            # NVIDIA NIM vibe tag generation
│       ├── session/
│       │   └── route.ts            # Create/get session
│       ├── swipe/
│       │   └── route.ts            # Record swipe
│       └── match/
│           └── route.ts            # Check for group match
├── components/
│   ├── ui/
│   │   ├── OutingTypeSelector.tsx  # NEW: Food/Activities/Explore tiles (Landing)
│   │   ├── SearchInput.tsx         # NEW: Natural language text input
│   │   ├── ModeSelector.tsx        # Solo / Barkada / Lakbay tiles
│   │   ├── SwipeCard.tsx           # Single establishment card + Framer
│   │   ├── SwipeDeck.tsx           # Stack of cards, swipe logic
│   │   ├── VibeBadge.tsx           # AI vibe tag pill component
│   │   ├── BottomNav.tsx           # DISCOVER · PIN · HISTORY nav
│   │   ├── ModeSelector.tsx        # Solo / Barkada / Lakbay tiles
│   │   ├── ContextCards.tsx        # Onboarding tap tiles
│   │   ├── SessionLobby.tsx        # Participant list + status dots
│   │   ├── RevealScreen.tsx        # Animated match reveal
│   │   ├── ItineraryCard.tsx       # Lakbay expanded itinerary card
│   │   └── LoadingSpinner.tsx      # Aya branded loading
│   └── providers/
│       ├── SessionProvider.tsx     # Supabase session context
│       └── SwipeProvider.tsx       # Swipe state context
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   ├── server.ts               # Server Supabase client
│   │   └── schema.sql              # Full DB schema
│   ├── nvidia/
│   │   └── nim.ts                  # NVIDIA NIM API wrapper
│   ├── session/
│   │   └── manager.ts              # Session code generation, logic
│   ├── swipe/
│   │   └── scorer.ts               # Aya Decides behavioral scoring
│   └── data/
│       ├── establishments.ts       # SEEDED mock data (30–40 spots)
│       └── itineraries.ts          # HARDCODED sample itineraries (Lakbay)
├── hooks/
│   ├── useSwipe.ts                 # Drag/swipe gesture hook
│   ├── useSession.ts               # Supabase realtime session hook
│   └── useVibeAI.ts                # NVIDIA NIM vibe tag hook
├── types/
│   └── index.ts                    # All shared TypeScript types
├── styles/
│   └── globals.css                 # Tailwind base + custom CSS vars
├── public/
│   └── images/                     # Placeholder venue photos
├── PROGRESS.md                     # Living progress tracker (update often)
├── DESIGN.md                       # This file
├── PID.md                          # Project initiation document
├── SMOKE_AND_MIRRORS.md            # What's faked and how
├── BUILD_GUIDE.md                  # Full Roocode prompt guide
├── .env.local                      # Environment variables (gitignored)
├── .env.example                    # Safe env template for GitHub
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 3. DATABASE SCHEMA

### 3.1 Full SQL (Supabase)

```sql
-- ============================================================
-- ESTABLISHMENTS (seeded mock data — no Google Places API)
-- ============================================================
create table public.establishments (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  category     text not null,               -- 'restaurant' | 'cafe' | 'activity' | 'bar'
  address      text not null,
  barangay     text,
  city         text default 'Manila',
  lat          float,
  lng          float,
  cost_min     int,                          -- PHP per head
  cost_max     int,
  is_open      boolean default true,
  opens_at     time default '08:00',
  closes_at    time default '22:00',
  vibe_tags    text[] default '{}',          -- AI-generated or seeded
  photo_url    text,
  is_community_pin boolean default false,
  is_deal      boolean default false,
  deal_text    text,
  community_confirms int default 0,
  created_at   timestamptz default now()
);

-- ============================================================
-- SESSIONS
-- ============================================================
create table public.sessions (
  id           uuid primary key default gen_random_uuid(),
  code         text unique not null,         -- e.g. 'AYA-4820'
  mode         text not null default 'solo', -- 'solo' | 'barkada' | 'lakbay'
  status       text not null default 'active', -- 'active' | 'matched' | 'expired'
  context      jsonb,                        -- { budget, vibe, group_size, distance, time }
  matched_id   uuid references public.establishments(id),
  card_stack   uuid[],                       -- ordered list of establishment IDs for this session
  created_at   timestamptz default now(),
  expires_at   timestamptz default now() + interval '2 hours'
);

-- ============================================================
-- PARTICIPANTS (one per device in barkada mode)
-- ============================================================
create table public.participants (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid references public.sessions(id) on delete cascade,
  nickname     text default 'Anonymous',
  status       text default 'swiping',       -- 'joined' | 'swiping' | 'done'
  created_at   timestamptz default now()
);

-- ============================================================
-- SWIPES (individual swipe events)
-- ============================================================
create table public.swipes (
  id               uuid primary key default gen_random_uuid(),
  session_id       uuid references public.sessions(id) on delete cascade,
  participant_id   uuid references public.participants(id) on delete cascade,
  establishment_id uuid references public.establishments(id),
  direction        text not null,            -- 'left' | 'right'
  speed_ms         int,                      -- milliseconds from card appear to swipe
  drag_distance    float,                    -- for Aya Decides behavioral scoring
  created_at       timestamptz default now()
);

-- ============================================================
-- ENABLE REALTIME
-- ============================================================
alter publication supabase_realtime add table public.sessions;
alter publication supabase_realtime add table public.participants;
alter publication supabase_realtime add table public.swipes;

-- ============================================================
-- ROW LEVEL SECURITY (permissive for hackathon)
-- ============================================================
alter table public.establishments enable row level security;
alter table public.sessions enable row level security;
alter table public.participants enable row level security;
alter table public.swipes enable row level security;

create policy "public read establishments" on public.establishments for select using (true);
create policy "public read sessions" on public.sessions for select using (true);
create policy "public insert sessions" on public.sessions for insert with check (true);
create policy "public update sessions" on public.sessions for update using (true);
create policy "public read participants" on public.participants for select using (true);
create policy "public insert participants" on public.participants for insert with check (true);
create policy "public update participants" on public.participants for update using (true);
create policy "public insert swipes" on public.swipes for insert with check (true);
create policy "public read swipes" on public.swipes for select using (true);
```

### 3.2 Seed Data Shape

The `establishments` table will be seeded with **30–40 mock spots** that represent real-feeling Manila/NCR venues. Each has:

- Realistic Filipino names (Ate Nena's Kitchen, Florinda's Panciteria, etc.)
- Pre-generated vibe tags (AI can also re-generate these live)
- Placeholder photo URLs (use Unsplash-style URLs or `/images/venue-N.jpg`)
- Geo coordinates within Metro Manila
- Mix of categories: carinderia, cafe, bar, activity, restaurant

---

## 4. COMPONENT DESIGN

### 4.1 SwipeCard

```
┌─────────────────────────────────┐
│  [DEAL]              [COMMUNITY]│  ← badge row (conditional)
│                                 │
│         VENUE PHOTO             │  ← full-bleed, aspect-video
│      (placeholder / URL)        │
│                                 │
├─────────────────────────────────┤
│ GARENDERIA · QC                 │  ← category · city
│ Ate Nena's Kitchen              │  ← name (large, bold)
│                                 │
│ 📍 0.4 km  ~₱120/head  🟢 Open │  ← meta row
│                                 │
│ [budget-friendly] [family] ...  │  ← VibeBadge pills
│                                 │
│ "47 locals confirmed · Unli     │  ← community note (if pin)
│  rice until 3PM today"          │
│                                 │
│   [✕]     [↩]     [✓]          │  ← action buttons
│  left    undo    right          │
│                                 │
│    Card 4 of 18 · Solo Mode     │  ← footer
└─────────────────────────────────┘
```

**Framer Motion behavior:**
- Drag on x-axis → card rotates slightly
- x > threshold (100px) → right swipe, green glow overlay
- x < -threshold → left swipe, red glow overlay
- Release beyond threshold → animates off screen, next card rises
- `useAnimation` controls the programmatic swipe for button presses

### 4.2 Session Lobby

```
┌─────────────────────────────────┐
│ aya                             │
│ Waiting for your group          │
│ Share the code below.           │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  SESSION CODE               │ │
│ │  AYA-4820          [QR]     │ │
│ └─────────────────────────────┘ │
│ [< Share link]                  │
│                                 │
│ PARTICIPANTS (4)                │
│ ● Jan Louise (you)     Done     │
│ ● Anonymous            Swiping  │
│ ● Maricel R.           Done     │
│ ● —                   Pending  │
│                                 │
│ ℹ Results appear when everyone  │
│   finishes. No one sees anyone  │
│   else's choices until then.    │
└─────────────────────────────────┘
```

### 4.3 Reveal Screen

```
┌─────────────────────────────────┐
│ EVERYONE AGREED                 │
│ You found a match.              │
│ 4 of 4 swiped right on this.    │
│                                 │
│ ┌─ TOP MATCH ──────────────────┐│
│ │  [VENUE PHOTO]               ││
│ │  CAFE · MAKATI               ││
│ │  Lito's Brew & Bites         ││
│ │  1.2 km · ~₱250/head · Open  ││
│ │  Enthusiasm ▓▓▓▓▓▓▓▓░░      ││
│ │  [chill] [instagrammable]    ││
│ └──────────────────────────────┘│
│                                 │
│ OTHER MATCHES (2)               │
│ ○ Florinda's Panciteria         │
│ ○ Bayleaf Rooftop               │
│                                 │
│ [☆ Aya Decides — lock it in]   │
└─────────────────────────────────┘
```
4.4 Outing Type Selector (New Landing Page)
┌─────────────────────────────────┐
│ aya                             │
│                                 │
│ Where are you headed            │
│ today?                          │
│ Pick your outing type to start. │
│                                 │
│ ┌────────────┐ ┌──────────────┐ │
│ │ 🍲         │ │ 🏛️          │ │
│ │ Food &     │ │ Activities   │ │
│ │ Drinks     │ │              │ │
│ └────────────┘ └──────────────┘ │
│ ┌────────────┐ ┌──────────────┐ │
│ │ 🕒         │ │ 📈          │ │
│ │ Explore    │ │ Full Day     │ │
│ │            │ │              │ │
│ └────────────┘ └──────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🔍 Or just type it out      │ │
│ │   "Budget-friendly na..."   │ │
│ └─────────────────────────────┘ │
│                                 │
│ [          Next →             ] │
│                                 │
│    Surprise Me — skip all this  │
└─────────────────────────────────┘
---

## 5. AI INTEGRATION DESIGN

### 5.1 NVIDIA NIM Vibe Tag Engine

**Trigger:** Called once per session when context is set, or per card if not pre-tagged.

**Prompt Template:**
```
You are Aya, a Filipino dining and outing recommendation AI.

Given this establishment data:
Name: {name}
Category: {category}
Address: {address}
Cost per head: ₱{cost_min}–{cost_max}
Hours: {opens_at}–{closes_at}
User context: {vibe}, {group_size} people, budget: {budget}

Generate exactly 3–5 short vibe tags (2–3 words max each) in lowercase.
Tags should be from: budget-friendly, hidden gem, family-friendly, date spot,
instagrammable, chill, open late, may parking, barkada vibes, solo friendly,
quick service, unlimited rice, sea view, rooftop, artsy, community pick, hot spot.

Respond ONLY with a JSON array of strings. No explanation. No markdown.
Example: ["hidden gem", "chill", "budget-friendly"]
```

**Implementation:** `lib/nvidia/nim.ts` wraps the OpenAI-compatible endpoint.

### 5.2 Aya Decides Scoring (`lib/swipe/scorer.ts`)

For each establishment, compute an **enthusiasm score**:

```
score = (right_swipes × 100) 
      + (avg_speed_bonus)        // faster swipe = more enthusiastic
      + (avg_drag_bonus)         // longer drag = more enthusiasm
      - (undo_penalty × 50)      // if undone, slight penalty

speed_bonus = max(0, (5000 - speed_ms) / 50)   // faster than 5s = bonus
drag_bonus  = min(50, drag_distance / 3)
```

In barkada mode: aggregate across all participants, pick highest score.

### 5.3 Context Processing (Kwentuhan → AI Filter)

The onboarding flow collects:
```typescript
type SessionContext = {
  mode: 'solo' | 'barkada' | 'lakbay'
  outing_type: 'food' | 'activities' | 'explore' | 'full_day'
  group_size: number
  budget: 'tipid' | 'mid' | 'bahala_na'    // ₱<150 | ₱150–350 | ₱350+
  distance_km: number                        // 1 | 3 | 5 | 10
  time_of_day: 'lunch' | 'merienda' | 'dinner' | 'anytime'
  natural_language?: string                  // free text input
}
```

AI also processes `natural_language` input to extract implicit filters:
- *"may allergy sa seafood"* → exclude seafood establishments
- *"gusto namin ng hindi masyadong maingay"* → filter for "chill" vibe

---

## 6. REAL-TIME SESSION FLOW (BARKADA MODE)

```
Host Device                    Supabase Realtime           Guest Device
    │                               │                           │
    │── POST /api/session ─────────►│                           │
    │◄─ { code: "AYA-4820" } ───────│                           │
    │                               │                           │
    │── Subscribe channel ─────────►│                           │
    │   "session:AYA-4820"          │                           │
    │                               │                           │
    │ [Share link to guest]         │                           │
    │                               │◄── Join session link ─────│
    │                               │◄── INSERT participant ─────│
    │◄─ participant joined event ───│                           │
    │                               │──► participant confirmed ─►│
    │                               │                           │
    │ [Both swipe independently]    │                           │
    │── INSERT swipe (right) ──────►│                           │
    │                               │──► swipe event ──────────►│
    │                               │                           │
    │── UPDATE participant done ───►│                           │
    │                               │◄── UPDATE participant done │
    │◄─ all_done trigger ───────────│──► all_done trigger ──────►│
    │                               │                           │
    │ [Both redirect to /reveal]    │        [Both redirect]    │
    │── GET /api/match ────────────►│                           │
    │◄─ { matched: [...], top: {} } │                           │
```

**Supabase channel setup:**
```typescript
const channel = supabase.channel(`session:${sessionCode}`)
  .on('postgres_changes', { 
    event: '*', schema: 'public', table: 'participants',
    filter: `session_id=eq.${sessionId}` 
  }, handleParticipantUpdate)
  .on('postgres_changes', {
    event: 'INSERT', schema: 'public', table: 'swipes',
    filter: `session_id=eq.${sessionId}`
  }, handleSwipeEvent)
  .subscribe()
```

---

## 7. DESIGN SYSTEM

### 7.1 Color Palette
```css
:root {
  --aya-bg:        #F5F0E8;   /* warm off-white, like manila paper */
  --aya-surface:   #FFFFFF;
  --aya-primary:   #E85D26;   /* warm orange-red, like a flame */
  --aya-secondary: #1A1A1A;   /* near black */
  --aya-accent:    #F4A261;   /* muted amber */
  --aya-muted:     #9B9082;   /* warm gray */
  --aya-swipe-yes: #22C55E;   /* green glow on right swipe */
  --aya-swipe-no:  #EF4444;   /* red glow on left swipe */
  --aya-community: #6366F1;   /* indigo for community badges */
  --aya-deal:      #F59E0B;   /* amber for deal badges */
}
```

### 7.2 Typography
```css
/* Primary: Geist (Next.js default) */
/* Display: Use font-black weight for headings */
/* Body: font-normal, text-base */
/* Filipino-language copy: Tagalog UI strings throughout */
```

### 7.3 Motion Guidelines
- Card entry: `spring({ stiffness: 300, damping: 30 })`
- Card exit (swipe): `tween({ duration: 0.3 })`
- Reveal entrance: staggered fly-in, 0.1s delay per card
- Lobby status: pulse animation on "Swiping" state
- Avoid heavy blur/shadow effects (mobile GPU friendly)

---

## 8. SMOKE & MIRRORS PAGES

### 8.1 Lakbay (Itinerary Mode)
- Show Kwentuhan flow normally (context collection)
- On submit: show a **loading screen** ("Aya is planning your day... 3–5 seconds with fake progress")
- Display hardcoded itinerary from `lib/data/itineraries.ts` based on selected budget/vibe
- Itinerary cards look AI-composed (they are seeded with realistic data)
- Include Leaflet.js map thumbnail showing route dots

### 8.2 Drop a Pin
- Full form UI (photo upload area, place name, GPS marker, vibe tags)
- On submit: show success toast "Thanks! Your pin is in the verification queue."
- Data goes nowhere. No DB write.

### 8.3 Business Listing Portal
- Full form UI (business name, photos, hours, budget tier, vibe tags, deal toggle)
- On submit: show success state "We'll review your listing within 24 hours."
- Data goes nowhere.

### 8.4 Session History
- Pull from localStorage if available, else show hardcoded sample history
- Shows 3–4 past "sessions" with realistic dates and venue names
- "Did you go?" prompt is interactive but non-functional

---

## 9. MOBILE-FIRST CONSTRAINTS

- All layouts designed for 390px wide (iPhone 14 width)
- Max content width: 440px, centered on desktop
- Touch targets: minimum 44×44px
- Bottom navigation always fixed
- Swipe zone: full-screen drag, not limited to card
- No hover states as primary interactions (touch-first)
- Avoid `position: fixed` nesting issues on iOS Safari

---

## 10. API ROUTES

| Route | Method | Description |
|---|---|---|
| `/api/ai/vibe` | POST | Generate vibe tags for an establishment |
| `/api/ai/context` | POST | Parse natural language context input |
| `/api/session` | POST | Create a new session |
| `/api/session/[code]` | GET | Get session details + card stack |
| `/api/session/[code]/join` | POST | Join session as participant |
| `/api/swipe` | POST | Record a swipe event |
| `/api/match/[code]` | GET | Compute match from all swipes |
| `/api/match/[code]/decide` | GET | Aya Decides — behavioral tiebreaker |

---

## 11. DEPENDENCIES (package.json)

```json
{
  "dependencies": {
    "next": "14.2.x",
    "react": "^18",
    "react-dom": "^18",
    "typescript": "^5",
    "@supabase/supabase-js": "^2",
    "@supabase/ssr": "^0.1",
    "framer-motion": "^11",
    "tailwindcss": "^3",
    "openai": "^4",
    "leaflet": "^1.9",
    "react-leaflet": "^4",
    "lucide-react": "^0.400",
    "clsx": "^2",
    "tailwind-merge": "^2"
  },
  "devDependencies": {
    "@types/react": "^18",
    "@types/node": "^20",
    "@types/leaflet": "^1.9",
    "autoprefixer": "^10",
    "postcss": "^8"
  }
}
```
