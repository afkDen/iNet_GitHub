# DESIGN DOCUMENT
## Aya — Mobile-First AI-Integrated Web Application
### Team iNet | SIKAPTala 2026 | Built with Roocode + NVIDIA NIM

---

## 1. DESIGN PHILOSOPHY

Three principles that directly respond to the problem space:

**1. Reduce, Don't Present**
Every screen gives the user fewer decisions than they walked in with. No information architecture that adds cognitive load. Every tap eliminates options, never creates them.

**2. Filipino-First Language and Tone**
Labels, microcopy, and UX writing are in Filipino vernacular first. The app should feel like it was built *by* Filipinos *for* Filipinos — not a Western app with Tagalog sprinkled in. Budget tiers say "Grabe Tipid" not "Budget." Skip says "Presto" not "Pass."

**3. One Hand, One Thumb**
All primary interactions are reachable by a right thumb on a 375px screen. No two-handed gestures for core flows. Cards live in the middle two-thirds of the viewport. Bottom nav is always within thumb reach.

---

## 2. VISUAL DESIGN SYSTEM

### 2.1 Color Palette

```css
/* Base */
--color-bg:             #FAFAF8;   /* warm off-white, "papel" */
--color-surface:        #FFFFFF;
--color-surface-raised: #F5F3EF;
--color-border:         #E8E5DF;

/* Text */
--color-text-primary:   #1A1A1A;
--color-text-secondary: #6B6B6B;
--color-text-tertiary:  #9E9E9E;

/* Brand */
--color-brand:          #E8622A;   /* warm flame orange — Aya primary */
--color-brand-light:    #FDF0EA;   /* brand tint for selected states */

/* Swipe feedback */
--color-approve:        #2D7A4F;   /* deep green — swipe right glow */
--color-approve-light:  #EAF5EE;
--color-skip:           #C0392B;   /* muted red — swipe left glow */
--color-skip-light:     #FDECEA;

/* Badges */
--color-community:      #4A7FCB;   /* trustworthy blue */
--color-deal:           #D4A017;   /* warm gold */
--color-hidden-gem:     #7B4EA8;   /* discovery purple */

/* Tags */
--color-tag-bg:         #F0EDE8;
--color-tag-text:       #3D3D3D;
```

### 2.2 Typography

```css
/* Import in globals.css */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

--font-display: 'Plus Jakarta Sans', sans-serif;  /* headings, card titles, mode labels */
--font-body:    'Inter', sans-serif;               /* body, labels, descriptions */
--font-mono:    'DM Mono', monospace;              /* session codes only */

/* Scale */
--text-xs:      0.6875rem;  /* 11px */
--text-sm:      0.8125rem;  /* 13px */
--text-base:    0.9375rem;  /* 15px */
--text-lg:      1.0625rem;  /* 17px */
--text-xl:      1.25rem;    /* 20px */
--text-2xl:     1.5rem;     /* 24px */
--text-3xl:     1.875rem;   /* 30px */
--text-display: 2.25rem;    /* 36px */
```

### 2.3 Spacing (8pt Grid)

```css
--space-1:  4px;   --space-2:  8px;   --space-3:  12px;
--space-4:  16px;  --space-5:  20px;  --space-6:  24px;
--space-8:  32px;  --space-10: 40px;  --space-12: 48px;
--space-16: 64px;
```

### 2.4 Border Radius

```css
--radius-sm:   8px;     /* tags, chips */
--radius-md:   12px;    /* buttons, inputs */
--radius-lg:   20px;    /* cards, modals */
--radius-xl:   28px;    /* bottom sheets */
--radius-full: 9999px;  /* pill badges */
```

### 2.5 Shadows

```css
--shadow-card:        0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05);
--shadow-card-lifted: 0 8px 24px rgba(0,0,0,0.12);
--shadow-modal:       0 20px 60px rgba(0,0,0,0.15);
--shadow-swipe-right: 0 0 40px rgba(45,122,79,0.35);
--shadow-swipe-left:  0 0 40px rgba(192,57,43,0.35);
```

---

## 3. COMPONENT LIBRARY

### 3.1 VenueCard

> Uses a single `venue: Venue` prop rather than flat fields — stays in sync with the Venue type automatically.

```typescript
interface VenueCardProps {
  venue: Venue               // all display data from the shared Venue type
  stackPosition: 0 | 1 | 2  // affects scale + opacity in stack
  isDraggable?: boolean      // true only for top card (stackPosition === 0)
  onSwipeRight?: () => void
  onSwipeLeft?: () => void
}

type BadgeType = 'DEAL' | 'COMMUNITY' | 'HIDDEN_GEM'
```

**Card anatomy (top → bottom):**
- Full-bleed photo — 58% card height, `object-cover`
- Top-left badge row: `DEAL` (gold) | `COMMUNITY` (blue)
- Venue name (Plus Jakarta Sans, 700, 18px)
- Category · District (secondary text, 13px)
- Info row: `📍 0.4km` · `~₱120/head` · `Open now` chip
- Vibe tags — horizontal scroll, pill chips, max 4 visible
- Deal text or community confirmation count (if applicable)

**Stack visual math:**
```typescript
// Applied via Framer Motion style prop
const stackStyles = {
  0: { scale: 1,    y: 0,    opacity: 1,    zIndex: 30 },
  1: { scale: 0.97, y: 10,   opacity: 0.92, zIndex: 20 },
  2: { scale: 0.94, y: 20,   opacity: 0.84, zIndex: 10 },
}
```

### 3.2 SwipeActions

```
[  ✕  ]    [  ↩  ]    [  ✓  ]
 Skip       Undo       Like
(red)      (gray)    (green)
```

All buttons 56×56px minimum. Undo disabled (opacity 0.35) when no undo is available.

### 3.3 OnboardingTile

```
┌─────────────────┐
│                 │
│    [Icon 48px]  │
│                 │
│  Category Name  │
│  Subtitle desc  │
│                 │
└─────────────────┘
```

Selected state: `--color-brand` border (2px), `--color-brand-light` background fill.
Grid: 2 columns, equal width, `gap-3`.

### 3.4 SessionCode

```
┌──────────────────────────┐
│  SESSION CODE            │
│                          │
│  AYA-4820               │
│  (DM Mono, 36px, white)  │
│                          │
│  [< Share link] [QR]     │
└──────────────────────────┘
```

Dark background (`#1A1A1A`), rounded-xl, padding-6.

### 3.5 ParticipantRow

```
[Avatar initials]  Name (you)           Done ●green
[Avatar initials]  Waiting for link...  Swiping ●amber
[Avatar initials]  Maricel R.           Done ●green
[Avatar initials]  Pending...           — ●gray
```

### 3.6 BudgetChip

```
[ ₱ Grabe Tipid ]  [ ₱₱ Kaya Naman ]  [ ₱₱₱ Bahala Na ]
```

Single-select. Selected: brand orange fill, white text.

### 3.7 VibeTag

```
[ budget-friendly ]  [ hidden gem ]  [ open late ]
```

Background: `--color-tag-bg`. Rounded-full. Font: Inter 12px. Non-interactive (display only on cards). Multi-select interactive version used in forms.

### 3.8 MatchRevealCard

Hero-size card for the top match on the reveal screen. Larger photo (65% height), enthusiasm bar below info row, "GROUP PICK" accent banner.

---

## 4. SCREEN SPECIFICATIONS

### Screen 1 — Kwentuhan (Onboarding)
**Route:** `/`

**Flow (5 steps, one per screen or stacked):**
1. Outing type — 4 tiles: Food & Drinks, Activities, Explore, Full Day
2. Group size — 4 tiles: Just Me → Malaking Grupo
3. Budget — 3 chips: Grabe Tipid / Kaya Naman / Bahala Na
4. Distance — slider or 5 preset chips
5. Time context — 5 chips: Ngayon, Lunch, Merienda, Dinner, Gabi

**At every step:** "Or just type it out" text field is visible at the bottom.
**Natural language submit** → POST `/api/ai/parse-filters` → NVIDIA NIM Gemma4 31b-IT → returns filter JSON.

**Shortcuts visible on landing screen:**
- "Surprise Me — skip all this" → random deck, Solo Mode
- "Mag-Barkada Mode" → shows group size step first, then jumps to session create

**State shape:**
```typescript
interface OnboardingState {
  outingType: 'food' | 'activities' | 'explore' | 'fullday' | null
  groupSize: 'solo' | 'small' | 'medium' | 'large' | null
  budget: 'tipid' | 'kaya' | 'bahala' | null
  maxDistanceKm: number      // default 3
  timeContext: 'now' | 'lunch' | 'merienda' | 'dinner' | 'late' | null
  nlpInput: string
  mode: 'solo' | 'barkada' | 'lakbay'
  parsedFilters: ParsedFilters | null   // populated after NLP parse or step completion
  sessionContext: {                     // populated when entering Barkada Mode
    sessionId: string
    sessionCode: string
    participantId: string
  } | null
}
```

---

### Screen 2 — Swipe Deck (Solo Mode)
**Route:** `/discover`

**Header:** `← aya` wordmark (left) + `SOLO` pill chip (right) + profile icon
**Card stack:** centered, fills ~65vh, cards are ~90% viewport width
**Footer:** `Card 4 of 18 · Solo Mode` counter (centered, small, gray)
**Action row:** Skip / Undo / Like buttons
**Bottom nav:** DISCOVER | PIN | HISTORY

**Swipe gesture implementation:**
```typescript
const SWIPE_THRESHOLD = 80        // px to commit a swipe
const VELOCITY_THRESHOLD = 400    // px/s for fast-flick detection

// dragX from Framer Motion useDragControls
// positive dragX = right = LIKE = green glow
// negative dragX = left  = SKIP = red glow

const glowOpacity = Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1)
// Apply to card box-shadow dynamically
```

**On commit right:** POST `/api/swipe` with `{ direction: 'right', venueId, speed, hesitation, dragDistance }` → card exits → next card scales up with spring
**On commit left:** same POST with `direction: 'left'` → card exits left
**Undo:** card re-enters from off-screen left with spring, previous swipe DELETE called

---

### Screen 3 — Barkada Create / Join
**Route:** `/barkada`

Two tabs:
- **Mag-imbita (Create):** Shows filter summary from Kwentuhan → "Generate Session" CTA → goes to Lobby
- **Sumali (Join):** Session code text input + "Sumali Na" button

---

### Screen 4 — Barkada Lobby
**Route:** `/session/[code]`

**Realtime subscription:** `supabase.channel('session:${code}')`

**Live updates:**
- Participant joins → row appears with "Joined just now" + amber dot
- Participant finishes deck → row updates to "Done" + green dot
- Circular progress ring per participant

**Notice at bottom (always visible):**
> "Results appear automatically once everyone finishes. No one sees anyone else's choices until then."

**State in Supabase Realtime channel:**
```typescript
// Broadcast events
'participant_joined'  → { participantId, displayName }
'participant_done'    → { participantId }
'all_done'            → triggers reveal page redirect for all
```

---

### Screen 5 — Group Reveal
**Route:** `/session/[code]/reveal`

**Triggered:** When Supabase detects all `participants.is_done = true` for the session

**Animation sequence (Framer Motion):**
```
0.0s  "EVERYONE AGREED" badge fades in
0.3s  "You found a match." headline scales up (spring, stiffness: 200)
0.6s  Top match card flies up from below (spring, stiffness: 150)
0.9s  Enthusiasm bar fills left to right (1s duration)
1.1s  Other matches stagger in (0.12s delay each)
1.6s  "Aya Decides — lock it in" button pulses (scale 1 → 1.04 → 1, loop)
```

**Aya Decides scoring formula:**
```typescript
const score = (rightSwipes / totalParticipants) * 0.5
            + (avgSwipeSpeed > 300 ? 0.3 : 0.1)   // fast swipe = enthusiastic
            + (1 - avgHesitation / 3000) * 0.2      // less hesitation = more confident
// Highest score wins
```

---

### Screen 6 — Lakbay Mode (Itinerary) 🎭 FAKED
**Route:** `/lakbay`

**How the fake works:**
1. User's filters from Kwentuhan are passed as a string to a preset selector function
2. Function matches keywords (budget, time, group type) to one of 4 hardcoded preset itineraries
3. The selected preset renders in the full Lakbay UI — looks AI-generated

**4 preset itineraries stored in `/data/itineraries.ts`:**
- `budget-friends-afternoon` — QC carinderia crawl, Eastwood evening, ~₱500/head
- `couple-date-evening` — BGC café, rooftop dinner, ~₱1,200/head
- `family-weekend` — SM Mall lunch, indoor playground, merienda, ~₱800/head
- `solo-explore-tipid` — Divisoria market, Binondo food walk, ~₱250/head

**UI elements (all real, data is fake):**
- Leaflet.js map with OpenStreetMap tiles showing route dots
- Vertical timeline: stop time, category, venue name, cost, transport to next stop
- Total cost + total hours
- "Use this plan →" and "Skip" buttons

---

### Screen 7 — Drop a Pin 🎭 FAKED (UI Real, Backend Shallow)
**Route:** `/pin`

Full UI per Mockup 6. On submit → INSERT into `community_pins` with `status: 'pending'` → success toast: "Salamat! Your pin is under review." Nothing else happens.

Demo deck has 3 pre-seeded community pins already in `approved` status with hardcoded `community_count` values.

---

### Screen 8 — MSME Portal 🎭 FAKED (UI Real, Backend Shallow)
**Route:** `/business`

Full UI per Mockup 7. On submit → INSERT into `msme_listings` with `status: 'pending'` → success screen: "Submitted for review! We'll verify your listing shortly." Nothing else.

---

### Screen 9 — Session History
**Route:** `/history`

**Stored in:** `localStorage` key `aya_history` (array of session summary objects)

**Structure:**
```typescript
interface SessionSummary {
  date: string
  mode: 'solo' | 'barkada' | 'lakbay'
  matchedVenueName: string
  matchedVenueCategory: string
  participantCount: number
  didVisit?: boolean
}
```

Renders as a scrollable timeline. "Did you go?" prompt for sessions from the last 48 hours.

---

### Screen 10 — Admin Dashboard 🎭 FAKED
**Route:** `/admin`

Static UI with hardcoded mock data. Approve/reject buttons fire success toasts only. No DB calls. Protected by a simple `?key=aya2026` query param check (not real auth — just enough to not show it publicly).

---

## 5. DATABASE SCHEMA

```sql
-- Sessions (ephemeral)
CREATE TABLE sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT UNIQUE NOT NULL,       -- "AYA-4820"
  mode        TEXT NOT NULL,              -- 'solo' | 'barkada' | 'lakbay'
  filters     JSONB NOT NULL DEFAULT '{}',
  status      TEXT DEFAULT 'active',      -- 'active' | 'completed' | 'expired'
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at  TIMESTAMPTZ DEFAULT NOW() + INTERVAL '2 hours'
);

-- Participants
CREATE TABLE participants (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID REFERENCES sessions(id) ON DELETE CASCADE,
  display_name TEXT,
  is_done      BOOLEAN DEFAULT FALSE,
  joined_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Swipes (ephemeral — never read by client)
CREATE TABLE swipes (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id     UUID REFERENCES sessions(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  venue_id       TEXT NOT NULL,           -- Google Places place_id or mock ID
  direction      TEXT NOT NULL,           -- 'right' | 'left'
  swipe_speed_ms INT DEFAULT 0,
  hesitation_ms  INT DEFAULT 0,
  drag_distance  FLOAT DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Venues (cached/seeded — never fetched live during demo)
CREATE TABLE venues (
  id            TEXT PRIMARY KEY,         -- place_id or 'mock_001'
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,
  district      TEXT NOT NULL,
  cost_tier     INT NOT NULL,             -- 1 | 2 | 3
  cost_min      INT,
  cost_max      INT,
  photo_url     TEXT,
  is_open_now   BOOLEAN DEFAULT TRUE,
  closing_time  TEXT,
  latitude      FLOAT,
  longitude     FLOAT,
  vibe_tags     TEXT[] DEFAULT '{}',      -- pre-generated by NVIDIA NIM at seed time
  is_msme       BOOLEAN DEFAULT FALSE,
  is_community  BOOLEAN DEFAULT FALSE,
  community_count INT DEFAULT 0,          -- hardcoded for demo
  deal_text     TEXT,
  rating        FLOAT
);

-- Community pins (shallow — UI only)
CREATE TABLE community_pins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_name    TEXT NOT NULL,
  lat           FLOAT,
  lng           FLOAT,
  photo_url     TEXT,
  description   TEXT,
  vibe_tags     TEXT[] DEFAULT '{}',
  status        TEXT DEFAULT 'pending',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- MSME listings (shallow — UI only)
CREATE TABLE msme_listings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  hours_open    TEXT,
  hours_close   TEXT,
  budget_tier   INT,
  vibe_tags     TEXT[] DEFAULT '{}',
  deal_text     TEXT,
  deal_start    TIMESTAMPTZ,
  deal_end      TIMESTAMPTZ,
  status        TEXT DEFAULT 'pending',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. API ROUTES

```
POST  /api/ai/parse-filters      NLP: Filipino/English text → filter JSON (NVIDIA NIM)
POST  /api/ai/generate-tags      Venue data → vibe tags array (NVIDIA NIM, used at seed time only)

GET   /api/venues                Get card deck — accepts ?budget=1|2|3&limit=18

POST  /api/session/create        Create group session → returns session code
GET   /api/session/[code]        Get session state + participant list
POST  /api/session/[code]/join   Add participant to session
POST  /api/session/[code]/done   Mark participant done; triggers session completion if all done
GET   /api/session/[code]/reveal Compute match results + purge swipes (only if session completed)

POST  /api/swipe                 Record a swipe (server-side only, never read by client)

POST  /api/pin/submit            Insert community pin (status: pending — UI only)
POST  /api/business/submit       Insert MSME listing (status: pending — UI only)
```

---

## 7. NVIDIA NIM INTEGRATION

### Client Setup

> Uses the `openai` npm package (NVIDIA NIM is OpenAI-API-compatible). Do NOT use raw `fetch` here.

```typescript
// lib/nvidia-nim.ts
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.NVIDIA_NIM_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
})

export async function nimComplete(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 512
): Promise<string> {
  try {
    const completion = await client.chat.completions.create({
      model: 'google/gemma-4-31b-it',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: maxTokens,
      temperature: 0.4,
    })
    return completion.choices[0]?.message?.content ?? ''
  } catch (err) {
    console.error('[NVIDIA NIM Error]', err)
    return ''
  }
}
```

### Filter Parsing System Prompt

```typescript
export const FILTER_PARSE_PROMPT = `
You are a context parser for Aya, a Filipino dining and outing recommendation app.
Extract structured filters from natural language input in Filipino, Taglish, or English.

Return ONLY valid JSON with no explanation, no markdown, no backticks:
{
  "outingType": "food" | "activities" | "explore" | "fullday",
  "groupSize": "solo" | "small" | "medium" | "large",
  "budget": "tipid" | "kaya" | "bahala",
  "maxDistanceKm": 1 | 3 | 5 | 10,
  "timeContext": "now" | "lunch" | "merienda" | "dinner" | "late",
  "restrictions": [],
  "vibeKeywords": []
}

Filipino budget hints: "tipid/mura/wala masyadong budget" → "tipid", "kaya naman/ok lang" → "kaya", "ok kahit mahal/bahala na" → "bahala"
Group size hints: "kami dalawa/tatlo" → "small", "grupo/barkada" → "medium", "pamilya" → "medium", "solo/ako lang" → "solo"
Dietary: "walang baboy" → restrictions: ["no pork"], "halal" → restrictions: ["halal"]
`
```

### Vibe Tag System Prompt

```typescript
export const VIBE_TAG_PROMPT = `
You are a vibe tag generator for a local Filipino discovery app called Aya.
Given a venue name, category, district, and cost tier, generate exactly 3-4 concise vibe tags.

Choose ONLY from this list:
budget-friendly, hidden gem, open late, family-friendly, instagrammable, chill,
may parking, kid-friendly, date spot, barkada favorite, good for solo, quick service,
community pick, outdoor seating, pet-friendly, live music, late night, near commute

Return ONLY a JSON array of strings. No explanation. No markdown. Example:
["budget-friendly", "hidden gem", "chill"]
`
```

### Itinerary Selector (Fake AI — Actually a Lookup)

```typescript
// lib/itinerary-selector.ts
// This LOOKS like AI but is actually a smart preset lookup
export function selectItinerary(filters: OnboardingFilters): Itinerary {
  if (filters.groupSize === 'solo' && filters.budget === 'tipid') {
    return ITINERARY_PRESETS['solo-explore-tipid']
  }
  if (filters.groupSize === 'small' && filters.budget !== 'tipid') {
    return ITINERARY_PRESETS['couple-date-evening']
  }
  if (filters.groupSize === 'medium') {
    return ITINERARY_PRESETS['budget-friends-afternoon']
  }
  return ITINERARY_PRESETS['family-weekend']  // default
}
```

---

## 8. ANIMATION SPECS (Framer Motion)

### Card Swipe Physics

```typescript
// components/VenueCard.tsx
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'

const x = useMotionValue(0)
const rotate = useTransform(x, [-200, 0, 200], [-18, 0, 18])
const approveOpacity = useTransform(x, [0, 80], [0, 1])
const skipOpacity = useTransform(x, [-80, 0], [1, 0])

// On drag end:
const handleDragEnd = (_, info) => {
  const { offset, velocity } = info
  if (offset.x > 80 || velocity.x > 400) onSwipeRight()
  else if (offset.x < -80 || velocity.x < -400) onSwipeLeft()
  // else snap back to center (spring)
}
```

### Reveal Sequence

```typescript
// All coordinated via Framer Motion variants + staggerChildren
const container = { hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.6 }}}
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200 }}}
```

### Page Transitions

```typescript
// Wrap routes in this in layout.tsx
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' }},
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 }}
}
```

---

## 9. MOBILE VIEWPORT BEHAVIOR

```
375px  iPhone SE — minimum supported, all layouts tested here first
390px  iPhone 14 — primary design target
412px  Pixel / Android
768px+ Tablet — mobile frame centered (max-w-[430px] mx-auto)
1024px+ Desktop — same mobile frame, decorative bg pattern behind it
```

**Critical rules:**
- Never use `vh` for card heights on mobile — use `dvh` or fixed pixel values (iOS Safari `100vh` bug)
- Bottom nav uses `pb-safe` (Tailwind safe area inset for notched phones)
- Swipe cards use `touch-none` to prevent scroll interference

---

## 10. DEMO DATA STRATEGY

Pre-seed the `venues` table with **30 Metro Manila venues** at project initialization:

| Category | Count | Districts |
|---|---|---|
| Carinderia / Turo-turo | 8 | QC, Marikina, Pasay |
| Café | 7 | BGC, Makati, Katipunan |
| Restaurant (casual) | 6 | Eastwood, Ortigas, Mandaluyong |
| Street Food / Market | 5 | Divisoria, Quiapo, Pasig |
| Activity Spots | 4 | BGC, Intramuros, QC |

All 30 venues have:
- Realistic Filipino names
- Pre-generated vibe tags (NVIDIA NIM called **once at seed time**)
- `photo_url` pointing to Unsplash food/venue images (static, no API call)
- Hardcoded `community_count` for 5 venues marked `is_community: true`

> **Do not call NVIDIA NIM or Google Places live during the demo.** All venue data comes from the pre-seeded `venues` table.

---

*Document Version: 2.0 | Roocode + NVIDIA NIM | Team iNet — SIKAPTala 2026*
