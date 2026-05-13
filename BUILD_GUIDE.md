# BUILD_GUIDE.md — Full Roocode Prompt Guide
## Aya — Step-by-Step Hackathon Build
> Use this as your primary build reference. Each phase has copy-paste Roocode prompts.
> Run prompts in order. Each prompt references files with @file notation.
> After each phase, update PROGRESS.md.

---

## PRE-REQUISITES (Do before first prompt)

1. **Install Roocode** in VS Code/Antigravity if not already done
2. **Create accounts:**
   - Supabase: https://supabase.com (free tier)
   - NVIDIA NIM: https://build.nvidia.com (get free API key)
   - Vercel: https://vercel.com (free tier)
3. **Get NVIDIA NIM model slug:**
   - Go to https://build.nvidia.com/explore/discover
   - Search "Gemma" — note the exact model ID for Gemma (closest to "Gemma4 31b-IT")
   - It may be `google/gemma-3-27b-it` or `nvidia/gemma-3n-e4b-it` — confirm on your dashboard
4. **Have your Supabase project credentials ready** (URL + anon key + service role key)

---

## PHASE 0 — PROJECT INITIALIZATION
**Time estimate:** 25–30 min
**Owner:** Backend Lead
**Goal:** Working Next.js project with all dependencies installed

### Step 0.1 — Create Next.js App
Run this in terminal (NOT a Roocode prompt):
```bash
npx create-next-app@latest aya \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd aya
```

### Step 0.2 — Install Dependencies
Run in terminal:
```bash
npm install \
  @supabase/supabase-js \
  @supabase/ssr \
  framer-motion \
  openai \
  leaflet \
  react-leaflet \
  lucide-react \
  clsx \
  tailwind-merge

npm install -D \
  @types/leaflet
```

### Step 0.3 — Create .env.local
Create `.env.local` manually in project root:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# NVIDIA NIM
NVIDIA_API_KEY=nvapi-your-key-here
NVIDIA_NIM_MODEL=google/gemma-3-27b-it

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 0.4 — Run Supabase Schema
1. Open Supabase dashboard → SQL Editor
2. Paste the FULL SQL from `DESIGN.md` Section 3.1
3. Click Run
4. Verify tables appear in Table Editor

### Step 0.5 — ROOCODE PROMPT: Project Foundation

```
@DESIGN.md @PROGRESS.md

Set up the Aya project foundation. Read DESIGN.md sections 2 (Folder Structure), 7 (Design System), and 11 (Dependencies) carefully before proceeding.

Create the following files:

1. `types/index.ts` — All shared TypeScript types for the project:
   - Establishment (id, name, category, address, city, lat, lng, cost_min, cost_max, is_open, opens_at, closes_at, vibe_tags, photo_url, is_community_pin, is_deal, deal_text, community_confirms)
   - Session (id, code, mode: 'solo'|'barkada'|'lakbay', status: 'active'|'matched'|'expired', context: SessionContext, matched_id, card_stack, created_at)
   - SessionContext (mode, outing_type: 'food'|'activities'|'explore'|'full_day', group_size, budget: 'tipid'|'mid'|'bahala_na', distance_km, time_of_day: 'lunch'|'merienda'|'dinner'|'anytime', natural_language?)
   - Participant (id, session_id, nickname, status: 'joined'|'swiping'|'done')
   - SwipeRecord (id, session_id, participant_id, establishment_id, direction: 'left'|'right', speed_ms, drag_distance)
   - MatchResult (establishment: Establishment, right_swipe_count: number, enthusiasm_score: number, participant_swipes: SwipeRecord[])

2. `lib/supabase/client.ts` — Browser Supabase client using @supabase/ssr createBrowserClient. Export a singleton `supabase` client using NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.

3. `lib/supabase/server.ts` — Server Supabase client using @supabase/ssr createServerClient. Returns a server-side client for use in API routes and Server Components.

4. `styles/globals.css` — Add to the existing Tailwind globals:
   - CSS custom properties from DESIGN.md Section 7.1 (all --aya-* variables)
   - A `.aya-card` class with rounded-2xl, shadow-lg, bg-white, overflow-hidden
   - A `.aya-badge` class for pill-shaped vibe tags
   - A safe area padding utility `.pb-safe` using env(safe-area-inset-bottom)

5. `tailwind.config.ts` — Extend with the Aya color palette from DESIGN.md Section 7.1:
   - colors.aya.bg, colors.aya.primary, colors.aya.secondary, colors.aya.accent, colors.aya.muted
   - colors.aya.swipeYes, colors.aya.swipeNo, colors.aya.community, colors.aya.deal

6. `app/layout.tsx` — Root layout with:
   - Inter or Geist font from next/font
   - Viewport meta tag (width=device-width, initial-scale=1, viewport-fit=cover)
   - Mobile PWA theme color meta tag (color: #E85D26)
   - Dark background fallback
   - `bg-[#F5F0E8]` body background
   - Min height full screen

After creating all files, update PROGRESS.md:
- Mark "Create global types in types/index.ts" as ✅
- Mark "Configure Tailwind with Aya design tokens" as ✅
- Mark "Create lib/supabase/client.ts and lib/supabase/server.ts" as ✅
```

---

## PHASE 1 — SEED DATA + AI WRAPPER
**Time estimate:** 30–40 min
**Owner:** AI Lead + Backend Lead
**Goal:** Mock establishment data + NVIDIA NIM working

### Step 1.1 — ROOCODE PROMPT: Seed Data

```
@DESIGN.md @types/index.ts @PROGRESS.md

Create `lib/data/establishments.ts` with 35 seeded mock Philippine food and leisure establishments. These should look realistic and be diverse. Follow the Establishment type from types/index.ts exactly.

Requirements:
- 35 total establishments
- Mix of categories: 'restaurant' (10), 'cafe' (8), 'carinderia' (6), 'activity' (5), 'bar' (4), 'bakery' (2)
- All in Metro Manila — mix of cities: QC, Makati, Taguig, Pasig, Manila, Mandaluyong, Marikina
- Cost ranges:
  - tipid (budget): 8 establishments with cost_min: 80, cost_max: 150
  - mid: 18 establishments with cost_min: 150, cost_max: 400
  - bahala_na (splurge): 9 establishments with cost_min: 400, cost_max: 1200
- 5 establishments with is_community_pin: true (these are "hidden gems" — give them Filipino grassroots names like "Manong Eddie's Fishball Cart", "Aling Cora's Palabok")
- 4 establishments with is_deal: true and a realistic deal_text (e.g., "Unli rice until 3PM · dine-in only", "Buy 1 get 1 on all drinks until 5PM")
- Realistic Filipino business names (mix of Filipino and English names)
- lat/lng coordinates within Metro Manila bounding box (lat: 14.4–14.8, lng: 120.9–121.2)
- photo_url: use format '/images/venue-{1-35}.jpg' (we'll add real photos later)
- vibe_tags: pre-seed with 3–5 realistic tags per establishment from this list: ["budget-friendly", "hidden gem", "family-friendly", "date spot", "instagrammable", "chill", "open late", "may parking", "barkada vibes", "solo friendly", "quick service", "unlimited rice", "sea view", "rooftop", "artsy", "community pick", "hot spot"]
- is_open: true for 28 establishments, false for 7 (simulate closed ones)
- community_confirms: 0 for most, 12–89 for is_community_pin ones

Also create `lib/data/itineraries.ts` with 5 hardcoded itinerary objects (for Lakbay smoke & mirrors). Each itinerary has:
- id, budget_tier ('tipid'|'mid'|'bahala_na'), total_cost_per_head, total_hours
- stops: array of { time, category, name, cost_per_head, duration_hrs, tags, transport_to_next, lat, lng }
- aya_note: a 1-sentence explanation of why Aya composed this sequence (make it sound AI-generated)
- Create at least 2 for tipid, 2 for mid, 1 for bahala_na

Make itinerary stop names match actual seeded establishments where possible.

After creating, update PROGRESS.md:
- Mark seed data tasks as ✅ in DEMO track
- Mark hardcoded itineraries as ✅
```

### Step 1.2 — ROOCODE PROMPT: NVIDIA NIM Wrapper

```
@DESIGN.md @types/index.ts @PROGRESS.md

Create the NVIDIA NIM AI integration. Read DESIGN.md Section 5 (AI Integration Design) carefully.

1. Create `lib/nvidia/nim.ts`:
   - Import OpenAI from 'openai' (we use it as OpenAI-compatible client)
   - Create and export a `nimClient` configured with:
     - baseURL: 'https://integrate.api.nvidia.com/v1'
     - apiKey: process.env.NVIDIA_API_KEY
   - Export `NIM_MODEL = process.env.NVIDIA_NIM_MODEL || 'google/gemma-3-27b-it'`
   - Export async function `generateVibeTags(establishment: Partial<Establishment>, context?: SessionContext): Promise<string[]>`
     - Builds the prompt from DESIGN.md Section 5.1 (vibe tag prompt template)
     - Calls nimClient.chat.completions.create with the model, max_tokens: 150, temperature: 0.7
     - Parses the JSON array response
     - Falls back to establishment.vibe_tags if parsing fails or API errors
     - Includes try/catch — NEVER throw to caller, always return a string[]
   - Export async function `parseNaturalLanguageContext(input: string, base: SessionContext): Promise<Partial<SessionContext>>`
     - Sends a prompt asking the model to extract filter adjustments from natural language
     - Returns partial context updates (exclude_categories, prefer_vibe_tags, etc.)
     - Falls back to empty object {} on error
   - Add a response cache using a simple Map<string, string[]> keyed by establishment ID to avoid redundant NIM calls

2. Create `app/api/ai/vibe/route.ts`:
   - POST handler
   - Accepts body: { establishment: Partial<Establishment>, context?: SessionContext }
   - Returns: { tags: string[] }
   - Calls generateVibeTags from nim.ts
   - Include proper error handling and JSON response

3. Create `app/api/ai/context/route.ts`:
   - POST handler
   - Accepts body: { input: string, base: SessionContext }
   - Returns: { context: Partial<SessionContext> }
   - Calls parseNaturalLanguageContext

4. Create `hooks/useVibeAI.ts`:
   - Custom hook: useVibeAI(establishment: Establishment | null, context: SessionContext | null)
   - State: tags (string[]), loading (boolean), error (string | null)
   - On establishment change: if establishment.vibe_tags has 3+ items, use them directly (no API call)
   - Otherwise: POST to /api/ai/vibe, update tags state
   - Returns { tags, loading }

After creating, update PROGRESS.md:
- Mark all AI track setup tasks as ✅
- Mark NIM wrapper tasks as ✅
```

---

## PHASE 2 — BACKEND API ROUTES
**Time estimate:** 45–60 min
**Owner:** Backend Lead
**Goal:** All session, swipe, and match API routes working

### Step 2.1 — ROOCODE PROMPT: Session Manager + API

```
@DESIGN.md @types/index.ts @lib/supabase/server.ts @lib/data/establishments.ts @PROGRESS.md

Create the session management system. Read DESIGN.md Sections 3 (Database Schema) and 10 (API Routes).

1. Create `lib/session/manager.ts`:
   - `generateSessionCode(): string` — returns format "AYA-XXXX" where XXXX is 4 random uppercase letters/digits. Avoid offensive combos.
   - `buildCardStack(context: SessionContext, allEstablishments: Establishment[]): Establishment[]` — filters and returns 18 establishments:
     - Filter by budget: tipid → cost_max ≤ 150, mid → cost_max ≤ 400, bahala_na → no filter
     - Filter by distance: Use distance_km from context as a rough filter (establishments with a random simulated distance ≤ context.distance_km). Since we don't have real distance calc, assign each establishment a random pre-computed distance in range 0.3–8km when building stack, filtered by context.distance_km
     - Filter by outing_type: 'food' → exclude category='activity', 'activities' → prioritize activity category, 'explore' → mix all, 'full_day' → all categories
     - Shuffle the filtered results, take first 18
     - Always include at least 2 is_community_pin establishments if available
     - Always include at least 1 is_deal establishment if available
     - Return array of Establishment objects

2. Create `app/api/session/route.ts` (POST):
   - Accepts body: { context: SessionContext }
   - Generates session code using generateSessionCode()
   - Builds card stack using buildCardStack() with seeded establishments
   - Inserts into sessions table: { code, mode: context.mode, status: 'active', context, card_stack: [array of IDs] }
   - Returns: { session: Session, cardStack: Establishment[] }
   - Error handling: return 500 with message on DB error

3. Create `app/api/session/[code]/route.ts` (GET):
   - Fetches session by code from Supabase
   - Fetches establishments matching card_stack IDs (in order)
   - Returns: { session: Session, cardStack: Establishment[] }
   - 404 if session not found

4. Create `app/api/session/[code]/join/route.ts` (POST):
   - Accepts body: { nickname?: string }
   - Fetches session by code, 404 if not found
   - Inserts participant: { session_id, nickname: body.nickname || 'Anonymous', status: 'joined' }
   - Returns: { participant: Participant }

5. Create `app/api/participants/[id]/route.ts` (PATCH):
   - Accepts body: { status: 'swiping' | 'done' }
   - Updates participant status
   - Returns: { participant: Participant }

After creating, update PROGRESS.md:
- Mark all backend session API tasks as ✅
- Mark session manager functions as ✅
```

### Step 2.2 — ROOCODE PROMPT: Swipe + Match API

```
@DESIGN.md @types/index.ts @lib/supabase/server.ts @lib/session/manager.ts @PROGRESS.md

Create the swipe recording and match computation system.

1. Create `lib/swipe/scorer.ts`:
   - `scoreSwipe(speedMs: number, dragDistance: number): number`:
     - speedBonus = Math.max(0, (5000 - speedMs) / 50)
     - dragBonus = Math.min(50, dragDistance / 3)
     - Return speedBonus + dragBonus
   - `computeMatches(swipes: SwipeRecord[], participants: Participant[]): MatchResult[]`:
     - Group right swipes by establishment_id
     - For each establishment with ≥1 right swipe, compute:
       - right_swipe_count: number of participants who swiped right
       - enthusiasm_score: sum of scoreSwipe() for all right swipes on this establishment
     - Sort by (right_swipe_count DESC, enthusiasm_score DESC)
     - Return array of MatchResult (include full Establishment object — caller must pass establishments too)
   - Update signature: `computeMatches(swipes: SwipeRecord[], participants: Participant[], establishments: Establishment[]): MatchResult[]`
   - `ayaDecides(matches: MatchResult[]): MatchResult | null`:
     - Return matches[0] (highest scored) or null if empty

2. Create `app/api/swipe/route.ts` (POST):
   - Accepts body: { session_id, participant_id, establishment_id, direction, speed_ms, drag_distance }
   - Inserts into swipes table
   - Returns: { swipe: SwipeRecord }

3. Create `app/api/match/[code]/route.ts` (GET):
   - Fetches session by code
   - Fetches all participants for session
   - Fetches all swipes for session
   - Fetches all establishments in card_stack
   - Calls computeMatches()
   - Returns: { matches: MatchResult[], unanimous: boolean, top: MatchResult | null }
   - `unanimous` = true if top match has right_swipe_count === participants.length

4. Create `app/api/match/[code]/decide/route.ts` (GET):
   - Calls the match route logic
   - Calls ayaDecides() on results
   - Returns: { decision: MatchResult | null, message: string }
   - message should be: "Pinili ng grupo si Aya. You all decided together — Aya just counted." if unanimous,
     else "Based on collective swipe behavior across all participants."

After creating, update PROGRESS.md:
- Mark all backend swipe/match API tasks as ✅
- Mark scorer functions as ✅
```

---

## PHASE 3 — ONBOARDING UI (KWENTUHAN)
**Time estimate:** 45–60 min
**Owner:** Frontend Lead
**Goal:** Complete onboarding flow with context collection

### Step 3.1 — ROOCODE PROMPT: Onboarding Screen

```
@DESIGN.md @types/index.ts @PROGRESS.md

Create the Kwentuhan onboarding screen. Read DESIGN.md Section 4 (Component Design) and Section 7 (Design System) carefully. This is the FIRST screen users see — it must be polished and feel native.

Create `app/onboarding/page.tsx` as a client component with a multi-step flow:

STEP 1 — Mode Selection (Which type of session?)
- Title: "Where are you headed today?"
- Subtitle: "Pick your outing type to get started."
- 4 large illustrated choice tiles in a 2x2 grid:
  - 🍽️ Food & Drinks — "Restaurants, cafes, carinderias"
  - 🎯 Activities — "Things to do, sports, arts"
  - 🔍 Explore — "Parks, markets, hidden spots"
  - 📅 Full Day — "Itinerary from lunch to dinner"
- Below grid: A text input "Or just type it out" with placeholder 'Budget-friendly na pwede pang dalhini lola...'
- Bottom: "Next →" button (disabled until selection or text entered)
- Below Next: "Surprise Me — skip all this" link text

STEP 2 — Group Setup
- Title: "Who's coming?"
- Mode tiles (3): Solo (person icon), Barkada (group icon), Lakbay (map icon)
- Below: "How many?" number stepper (1–12, default 2)
- Show/hide stepper based on Solo vs group selection

STEP 3 — Budget
- Title: "Magkano ang budget?"
- 3 large budget tiles (full width each, stacked):
  - ₱ Tipid — "Under ₱150/head · Sikat sa masa"
  - ₱₱ Mid — "₱150–₱400/head · Pwede na"  
  - ₱₱₱ Bahala Na — "₱400+/head · Wag nang isipin"
- Visual: each tile has a different warm color tint

STEP 4 — Distance + Time
- Title: "Gaano kalayo? Kailan?"
- Distance: horizontal row of 4 pill buttons: Within 1km | 3km | 5km | Anywhere
- Time of day: 4 pill buttons: Lunch | Merienda | Dinner | Anytime
- "Next →" navigates to final action

State: Maintain a `SessionContext` object through all steps. Each step updates the relevant field.

Progress dots at top (4 dots, filled based on current step) — use Framer Motion for smooth step transitions (slide left/right).

On final Next →:
- If mode is 'lakbay': navigate to /lakbay
- If mode is 'barkada': POST to /api/session, navigate to /barkada/[code]/lobby
- If mode is 'solo': POST to /api/session, navigate to /solo with sessionCode in query param

Also create `app/page.tsx` that immediately redirects to /onboarding.

Style everything with Tailwind using the --aya-* CSS variables. Background: bg-[#F5F0E8]. Use rounded-2xl cards, warm shadows. Typography: large headings (font-black), body text (text-sm text-gray-600).

After creating, update PROGRESS.md:
- Mark all Phase A onboarding frontend tasks as ✅
```

---

## PHASE 4 — SWIPE DECK (HAIN)
**Time estimate:** 60–90 min
**Owner:** Frontend Lead
**Goal:** Core swipe UI with drag gestures, Framer Motion animations

### Step 4.1 — ROOCODE PROMPT: Swipe Card Components

```
@DESIGN.md @types/index.ts @hooks/useVibeAI.ts @PROGRESS.md

Create the swipe deck UI components. Read DESIGN.md Section 4.1 (SwipeCard design spec) and Section 7.3 (Motion Guidelines) carefully.

1. Create `components/ui/VibeBadge.tsx`:
   - Props: tag (string), variant?: 'default' | 'deal' | 'community' | 'ai'
   - Pill-shaped span with appropriate colors:
     - default: bg-gray-100 text-gray-700
     - deal: bg-amber-100 text-amber-800 
     - community: bg-indigo-100 text-indigo-800
     - ai: bg-orange-50 text-orange-700
   - Small font, truncated if too long, rounded-full, px-2 py-0.5

2. Create `components/ui/SwipeCard.tsx`:
   - Props: establishment (Establishment), context (SessionContext), cardIndex (number), totalCards (number), onSwipe (direction: 'left'|'right', speedMs: number, dragDistance: number) => void, onUndo?: () => void, isTop (boolean)
   - Uses useVibeAI hook to get/display vibe tags
   - Layout exactly as DESIGN.md Section 4.1 wireframe:
     - Absolute badges row (DEAL badge amber, COMMUNITY badge indigo) top-left, top-right
     - Full-bleed photo (Next.js Image or img tag with object-cover, aspect-video)
     - Photo placeholder: warm gray bg with 🍽️ emoji centered if no photo
     - Info section: category · city (small caps), venue name (large bold), meta row (distance · cost · open status), vibe badges (flex-wrap), community note if is_community_pin
     - Action buttons row: ✕ (red) · ↩ (gray, disabled if no undo available) · ✓ (primary orange-red)
     - Footer: "Card N of M · [Mode] Mode"
   - isTop controls whether Framer Motion drag is enabled
   - Track swipe start time with useRef(Date.now()) on drag start
   - Record speed_ms = Date.now() - startTime on drag end

3. Create `hooks/useSwipe.ts`:
   - Accepts: onSwipeLeft, onSwipeRight (callbacks)
   - Returns: Framer Motion `dragProps` (drag, dragConstraints, onDragEnd, animate, style)
   - Drag threshold: 100px on x-axis
   - On drag: compute rotation (x / 20 degrees, max ±15deg), set CSS transform
   - Overlay: show green (#22C55E) at 30% opacity on x > 50, red (#EF4444) at 30% opacity on x < -50
   - onDragEnd: if |x| > 100, call appropriate callback and animate off screen; else spring back
   - Export also: `swipeLeft(controls)` and `swipeRight(controls)` for programmatic swipe from buttons

4. Create `components/ui/SwipeDeck.tsx`:
   - Props: establishments (Establishment[]), context (SessionContext), sessionId (string), participantId (string), onComplete () => void
   - State: currentIndex (number), undoStack (last swiped card), swipeHistory (SwipeRecord[])
   - Renders top 2–3 cards as a visible stack (offset/scale for cards below top)
   - Top card gets drag enabled + full color overlays
   - Cards below: scale 0.95 / 0.90, translateY +8px/+16px, opacity 0.8/0.6
   - On swipe: POST to /api/swipe, advance currentIndex, Framer AnimatePresence exit
   - Undo: pop last from undoStack, decrement currentIndex, animate card back in from direction
   - When currentIndex reaches establishments.length: call onComplete() and PATCH participant to 'done'
   - Include a hidden "Aya Decides" button that appears after 3+ swipes for solo mode

After creating, update PROGRESS.md:
- Mark Phase B swipe deck frontend tasks as ✅
```

### Step 4.2 — ROOCODE PROMPT: Solo Mode Page

```
@DESIGN.md @types/index.ts @components/ui/SwipeDeck.tsx @lib/supabase/client.ts @PROGRESS.md

Create the Solo mode swipe page.

1. Create `app/solo/page.tsx`:
   - Client component
   - Reads sessionCode from URL query params (?session=AYA-XXXX)
   - On mount: GET /api/session/[code] to fetch session + card stack
   - Also: POST /api/session/[code]/join to create a participant, store participantId in sessionStorage('aya_participant_id')
   - Loading state: "Hinahanap ni Aya... 🔥" centered with spinner
   - Renders SwipeDeck with fetched establishments
   - onComplete → navigate to /solo/result?session=[code]

2. Create `app/solo/result/page.tsx`:
   - Client component
   - Reads sessionCode from URL
   - On mount: GET /api/match/[code] to get top result
   - Displays single match card (top match)
   - Framer Motion: card flies in from bottom with spring animation
   - "Labas Na! 🎉" heading
   - Match card shows: photo, name, category, cost, vibe tags, distance
   - Two buttons:
     - "Buksan sa Maps 🗺️" → opens Google Maps URL: `https://maps.google.com/?q=${name}+${address}`
     - "Mag-swipe Ulit" → back to /onboarding
   - If no match: show "Wala pang match... Subukan ulit?" with retry button
   - Save session to localStorage for history

After creating, update PROGRESS.md:
- Mark solo mode page tasks as ✅
```

---

## PHASE 5 — BARKADA / GROUP MODE
**Time estimate:** 60–90 min
**Owner:** Backend Lead + Integration Lead
**Goal:** Real-time multi-device group session with Supabase WebSockets

### Step 5.1 — ROOCODE PROMPT: Real-time Session Hook

```
@DESIGN.md @types/index.ts @lib/supabase/client.ts @PROGRESS.md

Create the Supabase Realtime session synchronization system. Read DESIGN.md Section 6 (Real-Time Session Flow) carefully — the sequence diagram shows exactly what needs to happen.

Create `hooks/useSession.ts`:
- Props: sessionCode (string | null), participantId (string | null)
- State:
  - session: Session | null
  - participants: Participant[]
  - allDone: boolean (true when all participants have status='done')
  - loading: boolean
  - error: string | null
- On sessionCode change:
  - Fetch initial session data from /api/session/[code]
  - Fetch initial participants from Supabase (select * from participants where session_id=session.id)
  - Set up Supabase Realtime channel: `supabase.channel('session:' + sessionCode)`
  - Listen for postgres_changes on `participants` table (event: '*', filter: session_id=eq.SESSION_ID):
    - On INSERT: add to participants array
    - On UPDATE: update matching participant in array
  - After setting up listeners: check if allDone (all participants status='done') → set allDone=true
  - Cleanup: unsubscribe channel on unmount or sessionCode change
- Returns: { session, participants, allDone, loading, error }

Also create `components/providers/SessionProvider.tsx`:
- React context provider wrapping useSession
- Export useSessionContext() hook
- Wrap the barkada route group layout with this provider
```

### Step 5.2 — ROOCODE PROMPT: Group Mode Pages

```
@DESIGN.md @types/index.ts @hooks/useSession.ts @components/ui/SwipeDeck.tsx @PROGRESS.md

Create all Barkada group mode pages. Read DESIGN.md Section 4.2 (Session Lobby wireframe) and 4.3 (Reveal Screen wireframe).

1. Create `app/barkada/page.tsx`:
   - Client component — the "Create Session" landing
   - Shows: large "Barkada Mode" heading, description "Everyone swipes. Aya finds the match."
   - "Gumawa ng Session" primary button → POST /api/session with mode:'barkada', navigate to /barkada/[code]/lobby
   - Also: "Join a Session" with a code input field (4 char + Enter/Join) → navigate to /barkada/[code]/lobby
   - Loading state during POST
   - Aya flame logo at top

2. Create `app/barkada/[sessionCode]/lobby/page.tsx`:
   - Client component
   - Reads sessionCode from params
   - On mount: POST /api/session/[code]/join (with optional nickname), store participantId in sessionStorage
   - Uses useSession hook to get live participant list
   - Show session code LARGE: "AYA-4820" style
   - QR code: show a static placeholder div with "QR" text (real QR generation is out of scope, use a border-dashed box)
   - "Share link" button: navigator.share() if supported, else navigator.clipboard.writeText()
   - Participant list: each participant shows avatar circle (initials), nickname, status dot:
     - Gray dot: 'joined'
     - Pulsing orange dot: 'swiping'  
     - Green dot with checkmark: 'done'
   - "Results appear automatically when everyone finishes. No one sees anyone else's choices until then." notice
   - Bottom CTA: "Magsimula" (Start Swiping) button — PATCH own participant to 'swiping', navigate to .../swipe
   - When allDone becomes true (from useSession): show "lahat tapos na! 🎉" toast, auto-navigate to .../reveal after 1.5s

3. Create `app/barkada/[sessionCode]/swipe/page.tsx`:
   - Client component
   - Same as solo swipe page but reads participantId from sessionStorage
   - Fetches session+cardStack, renders SwipeDeck
   - onComplete: PATCH participant to 'done', stay on page with "Naghihintay sa mga kasama... ⏳" overlay (useSession will trigger redirect when allDone)

4. Create `app/barkada/[sessionCode]/reveal/page.tsx`:
   - Client component — the GROUP REVEAL
   - On mount: GET /api/match/[code]
   - Framer Motion staggered reveal: "EVERYONE AGREED" header fades in, then cards fly in with 0.15s stagger between each
   - Top match: large hero card with enthusiasm bar (animated fill, right_swipe_count/participants.length × 100%)
   - Other matches below: smaller list items with participant count and distance
   - "Aya Decides — lock it in ☆" button: GET /api/match/[code]/decide, highlight that card with golden border
   - If no unanimous match: show "Pinakamalapit — ituloy ba?" and suggest top match

After creating, update PROGRESS.md:
- Mark all Phase C group mode frontend tasks as ✅
- Mark all integration tasks as ✅
```

---

## PHASE 6 — SHARED UI COMPONENTS + NAVIGATION
**Time estimate:** 30 min
**Owner:** Frontend Lead

### Step 6.1 — ROOCODE PROMPT: Bottom Navigation + Shared Components

```
@DESIGN.md @types/index.ts @PROGRESS.md

Create shared UI components used across all pages.

1. Create `components/ui/BottomNav.tsx`:
   - Fixed bottom navigation bar
   - 3 tabs: DISCOVER (grid icon), PIN (map-pin icon), HISTORY (clock icon)
   - Active tab: text shows, icon filled, --aya-primary color
   - Inactive: gray icon + label
   - Uses Next.js usePathname() to determine active tab
   - pb-safe padding for iOS safe area
   - Tabs link to: / (discover/onboarding), /pin, /history

2. Create `components/ui/LoadingSpinner.tsx`:
   - Centered flex container
   - Animated flame emoji 🔥 with Framer Motion pulse/scale animation
   - Accepts message prop (default: "Hinahanap ni Aya...")
   - Text in small Filipino copy below

3. Add BottomNav to `app/layout.tsx` — rendered below children, outside main content area.

4. Create `app/not-found.tsx`:
   - 404 page with Aya branding
   - "Ay, nasan na tayo? 🔍" heading
   - "Back to Home" button

5. Update `app/onboarding/page.tsx` to NOT show BottomNav (full-screen onboarding).
   - Add a layout wrapper for onboarding that hides the nav. Use a route group `(onboarding)` layout if needed, or conditionally hide in BottomNav using pathname check.

After creating, update PROGRESS.md:
- Mark Phase D bottom navigation as ✅
- Mark Phase E shared components as ✅
```

---

## PHASE 7 — SMOKE & MIRRORS FEATURES
**Time estimate:** 60–75 min
**Owner:** Demo Lead
**Goal:** All fake features looking polished for judge demo

### Step 7.1 — ROOCODE PROMPT: Lakbay Itinerary Mode

```
@DESIGN.md @SMOKE_AND_MIRRORS.md @lib/data/itineraries.ts @types/index.ts @PROGRESS.md

Create the Lakbay (Itinerary) mode — this is a smoke & mirrors feature. Read SMOKE_AND_MIRRORS.md Section 1 (Lakbay) for the deception architecture.

1. Create `components/ui/ItineraryCard.tsx`:
   - Props: itinerary (from lib/data/itineraries.ts), onAccept () => void, onSkip () => void
   - Layout as DESIGN.md Section 4 / Mockup 5 wireframe:
     - Top: "Est. total: ~₱{total_cost}/head · About {total_hours} hrs" in small caps
     - Map thumbnail: a colored div with a simple SVG showing dot-dash-dot route (3 static dots connected by dashed line) — NO real Leaflet required, just visual representation
     - Timeline: vertical list of stops:
       - Each stop: time chip, category label, place name (bold), cost · duration, tags, transport note to next stop
       - Circle checkbox left of each stop (empty circles, unfilled)
     - Aya note at bottom (italic, warm gray)
     - Two buttons: "Skip" (ghost) and "Use this plan →" (primary)
   - Framer Motion: card slides in from right

2. Create `app/lakbay/page.tsx`:
   - Client component
   - Step 1: Show simplified Kwentuhan (just budget + time, 2 steps max)
   - On submit: show LoadingSpinner for 3 seconds with rotating messages:
     - "Pinaplano ni Aya ang inyong araw... 🗺️"
     - "Ine-optimize ang sequencing at budget..."
     - "Halos tapos na..."
   - After 3s: select matching itinerary from lib/data/itineraries.ts based on budget selection
   - Show ItineraryCard
   - "Skip" cycles through available itineraries for same budget
   - "Use this plan →" navigates to /lakbay/result showing same card in "accepted" state with a "Buksan sa Maps" button

After creating, update PROGRESS.md:
- Mark Lakbay smoke & mirrors tasks as ✅
```

### Step 7.2 — ROOCODE PROMPT: Drop a Pin + Business Portal + History

```
@DESIGN.md @SMOKE_AND_MIRRORS.md @lib/data/establishments.ts @PROGRESS.md

Create the remaining smoke & mirrors pages. Read SMOKE_AND_MIRRORS.md Sections 2, 3, and 4 for exactly how each fake feature works.

1. Create `app/pin/page.tsx` — "Drop a Pin" community contribution:
   - Header: "Drop a Pin" · "Add a spot that doesn't show up anywhere else."
   - Form fields (all visual, no real validation except presence):
     - Photo upload area: dashed border box, tap to open file picker, show image preview using FileReader (NOT uploaded anywhere)
     - Place name text input
     - Location: a static div styled as a map with a centered red pin marker SVG — add text "Tap to place pin on map" (fake interactive map, just visual)
     - "Why should people know this?" textarea (100 char limit, show counter)
     - Vibe tags: grid of 8 selectable pill buttons (multi-select, up to 5)
   - Submit button "Submit for verification →"
   - On submit: show loading 1.5s, then replace form with success screen:
     - ✅ icon (large green)
     - "Salamat! Your pin is in the verification queue."
     - "Nearby locals will confirm your spot within 48 hours."
     - "Pin another spot" → reset form | "Back to Discover" → /onboarding
   - NO backend call. Pure fake.

2. Create `app/business/page.tsx` — Local Business Listing Portal:
   - Header: "List your place on Aya" · "Free. No tech skills needed. Takes under 5 minutes."
   - Form fields:
     - Business name input
     - Photos: row of 3 upload boxes (same FileReader preview trick)
     - Operating hours: two time inputs (open / close)
     - Budget range: 3-option radio (₱ Tipid / ₱₱ Mid / ₱₱₱ High) as styled tiles
     - Vibe tags: same multi-select pill grid
     - Deal toggle (boolean): when on, show deal description textarea + time range inputs
   - Submit button "Submit for review →"
   - On submit: loading 1.5s → success screen:
     - "We'll review your listing within 24 hours."
     - "Once verified, Aya will surface your spot to users whose context matches your profile."
   - NO backend call.

3. Create `app/history/page.tsx` — Session History:
   - Import SAMPLE_HISTORY from a new `lib/data/history.ts` file (create 4 hardcoded history entries)
   - On mount: read from localStorage('aya_history') — if exists, merge with SAMPLE_HISTORY
   - Two tabs: "History" (past sessions) | "Want to Try" (bookmarked)
   - History tab: scrollable timeline list, each entry:
     - Mode badge (GROUP·4 PEOPLE, SOLO, ITINERARY) colored pill
     - Date/time
     - Venue name (bold)
     - Distance or description
     - "DID YOU GO?" button (recent entries only) → opens fake photo upload prompt → success toast
   - "Want to Try" tab: 3 hardcoded spots from seeded data, with distance from current location (fake static distances)
   - Groups can share recap: "Share Recap" button → navigator.share() with text summary

After creating, update PROGRESS.md:
- Mark all DEMO track smoke & mirrors tasks as ✅
```

---

## PHASE 8 — POLISH + ANIMATIONS
**Time estimate:** 45–60 min
**Owner:** All

### Step 8.1 — ROOCODE PROMPT: Framer Motion Polish Pass

```
@DESIGN.md @components/ui/SwipeCard.tsx @components/ui/RevealScreen.tsx @app/barkada/[sessionCode]/reveal/page.tsx @PROGRESS.md

Do a full Framer Motion animation polish pass on the most important screens. Read DESIGN.md Section 7.3 (Motion Guidelines).

1. In `SwipeCard.tsx`:
   - Ensure drag uses spring physics: stiffness: 300, damping: 30
   - Color overlay: div absolutely positioned over photo area
     - Background: linear-gradient from transparent to green (right swipe) or red (left swipe)
     - Opacity tied to drag x position: 0 at center, 0.6 at threshold
     - Show ✓ emoji large white centered when going right, ✕ when going left
   - Card stack below top card: scale transform 0.95 → 0.90 for cards 2 and 3

2. In `app/barkada/[sessionCode]/reveal/page.tsx`:
   - Stagger children animation: parent variants with staggerChildren: 0.1
   - Each card child: initial {opacity:0, y:50} → animate {opacity:1, y:0} with spring
   - "EVERYONE AGREED" header: initial {scale:0.8, opacity:0} → {scale:1, opacity:1}
   - Enthusiasm bar: animate width from 0 to final % over 0.8s on mount
   - Confetti on mount: use CSS keyframe animation (no library) — 8 colored squares falling from top

3. In `app/onboarding/page.tsx`:
   - Step transitions: AnimatePresence with mode="wait"
   - Each step: initial {x:50, opacity:0} → animate {x:0, opacity:1} → exit {x:-50, opacity:0}
   - Tween duration: 0.25s

4. In `app/lakbay/page.tsx`:
   - Loading messages cycle with AnimatePresence, fading in/out every 1s
   - ItineraryCard: slides in from right with spring

5. Global: ensure all Framer Motion elements use `layout` prop on card stacks to animate layout changes smoothly.

6. Add a `components/ui/MatchCelebration.tsx` — confetti burst component:
   - Pure CSS/Framer Motion: 12 small colored divs (use Aya palette colors)
   - On mount: animate outward in all directions from center, then fade out
   - Used on reveal page and solo result page

After creating, update PROGRESS.md:
- Mark all polish animation tasks as ✅
```

### Step 8.2 — ROOCODE PROMPT: Mobile QA + Error Handling

```
@DESIGN.md @PROGRESS.md @app/layout.tsx

Do a mobile optimization and error handling pass across the entire app.

1. In `app/layout.tsx`:
   - Add to <head>: <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
   - Add: <meta name="theme-color" content="#E85D26">
   - Add: <meta name="apple-mobile-web-app-capable" content="yes">
   - Add: <meta name="apple-mobile-web-app-status-bar-style" content="default">
   - Add a <link rel="manifest" href="/manifest.json"> tag

2. Create `public/manifest.json` — PWA manifest:
   - name: "Aya", short_name: "Aya"
   - theme_color: "#E85D26", background_color: "#F5F0E8"
   - display: "standalone", start_url: "/"
   - icons: array with placeholder paths (just include the structure, no actual icons needed for demo)

3. Audit all pages for these mobile issues and fix:
   - Any element using `hover:` styles as primary interaction → add `active:` equivalent
   - Any fixed positioning that doesn't account for iOS safe areas → add pb-[env(safe-area-inset-bottom)]
   - Any text smaller than 14px (text-xs) that's interactive → increase to text-sm minimum
   - Form inputs on mobile: ensure they don't cause zoom on focus (font-size ≥ 16px on all inputs)
   - Swipe deck: ensure overflow-hidden on outer container prevents page scroll during card drag

4. Add error boundaries:
   - Wrap SwipeDeck in an error boundary that shows "May problema sa card deck. I-refresh ang page." with a retry button
   - Wrap reveal page in an error boundary that shows "Hindi ma-compute ang match. Subukan ulit." with retry

5. Toast notification system: Create `components/ui/Toast.tsx`:
   - Simple fixed top-center toast
   - Props: message, type ('success'|'error'|'info'), onDismiss
   - Auto-dismisses after 3s
   - Framer Motion: slides in from top, slides out

After completing, update PROGRESS.md:
- Mark all Polish track tasks as ✅
```

---

## PHASE 9 — DEPLOYMENT + DEMO PREP
**Time estimate:** 30–45 min
**Owner:** All

### Step 9.1 — ROOCODE PROMPT: Environment + Deployment Check

```
@PROGRESS.md @DESIGN.md

Create deployment configuration and verify environment setup.

1. Create `.env.example` (safe for GitHub):
   - Same keys as .env.local but with placeholder values
   - Add comments explaining where to get each value

2. Update `next.config.js`:
   - Add image domains for any external image sources
   - Ensure no server-only code reaches client bundle
   - Add: images.remotePatterns for any placeholder image services used

3. Create a health check endpoint `app/api/health/route.ts`:
   - GET handler
   - Checks Supabase connection (simple select 1 from establishments limit 1)
   - Returns: { status: 'ok'|'error', supabase: boolean, timestamp: string }
   - Used to verify deployment is working

4. Create `app/api/seed/route.ts` (development only, add guard):
   - GET handler with a secret key guard: query param ?secret=AYA_SEED_2026
   - Inserts all establishments from lib/data/establishments.ts into Supabase
   - Only runs if NEXT_PUBLIC_APP_URL includes 'localhost' OR if secret is correct
   - Returns count of seeded establishments
   - Use this to seed production Supabase database after deployment

5. Verify and list any missing pieces by checking each TODO in PROGRESS.md.

After completing:
- Mark deployment tasks in PROGRESS.md as ✅
- Ensure Vercel deployment succeeds with all env vars set
```

### Step 9.2 — DEMO SEED SCRIPT PROMPT

```
@lib/data/establishments.ts @PROGRESS.md

We need to seed the production Supabase database. 

Create a Node.js seed script `scripts/seed.ts`:
- Imports establishments from lib/data/establishments.ts
- Uses @supabase/supabase-js with service role key (from env)
- Deletes existing establishments (truncate)
- Inserts all 35 mock establishments
- Logs success/failure for each
- Also inserts 2 demo sessions:
  - code: 'AYA-DEMO', mode: 'solo', status: 'active'
  - code: 'AYA-TEST', mode: 'barkada', status: 'active'

Add to package.json scripts:
  "seed": "npx ts-node --project tsconfig.json scripts/seed.ts"

Run instructions (put in a comment at top of file):
  SUPABASE_URL=xxx SUPABASE_SERVICE_ROLE_KEY=xxx npm run seed

After creating, update PROGRESS.md:
- Mark "Demo data preparation" tasks as ✅
```

---

## PHASE 10 — FINAL INTEGRATION CHECK
**Owner:** Integration Lead
**Time:** 30 min — run through complete demo flows

### Step 10.1 — ROOCODE PROMPT: Final Wiring Check

```
@DESIGN.md @PROGRESS.md @SMOKE_AND_MIRRORS.md

Do a final integration audit of the complete app. Check each of these flows works end-to-end and fix any broken connections:

FLOW 1 — Solo Mode:
/ → /onboarding (step 1: Food & Drinks) → (step 2: Solo, 1 person) → (step 3: Tipid) → (step 4: Within 3km, Lunch) → POST /api/session → /solo?session=AYA-XXXX → SwipeDeck renders cards → swipe 5 right, 5 left → deck exhausts → /solo/result → match card shown

FLOW 2 — Barkada Mode:
Device A: /onboarding → Barkada → POST /api/session → /barkada/AYA-XXXX/lobby (shows as host)
Device B: /barkada/AYA-XXXX/lobby (joins) → both shown in participant list
Both press Start → swipe independently → both finish → both auto-navigate to /reveal → reveal shows matches → Aya Decides button works

FLOW 3 — Lakbay (Smoke & Mirrors):
/onboarding → Full Day → Lakbay mode → /lakbay → budget/time selection → fake loader 3s → itinerary card shows → Use this plan

FLOW 4 — Drop a Pin:
/pin → fill form, select photo → Submit → success state (no backend)

FLOW 5 — History:
/history → shows sample past sessions → Did You Go? → fake photo prompt

For any broken connections found, fix them. Specifically check:
- SessionContext passes correctly from onboarding to API call
- participantId stored in sessionStorage and read in swipe page
- Supabase Realtime subscription actually updates lobby participant list
- Match API returns correct data after all swipes recorded
- All navigation paths work (no dead ends, no broken links)
- Error states render instead of blank screens

Update PROGRESS.md with final status of all tracks.
```

---

## QUICK REFERENCE — KEY FILES

| File | Purpose |
|---|---|
| `types/index.ts` | All TypeScript types |
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/nvidia/nim.ts` | NVIDIA NIM wrapper |
| `lib/session/manager.ts` | Session code gen + card stack builder |
| `lib/swipe/scorer.ts` | Aya Decides behavioral scoring |
| `lib/data/establishments.ts` | 35 seeded mock venues |
| `lib/data/itineraries.ts` | Hardcoded Lakbay itineraries |
| `hooks/useSwipe.ts` | Framer Motion drag logic |
| `hooks/useSession.ts` | Supabase Realtime sync |
| `hooks/useVibeAI.ts` | NVIDIA NIM vibe tag fetcher |
| `components/ui/SwipeDeck.tsx` | Core swipe stack |
| `components/ui/SwipeCard.tsx` | Individual card |
| `app/api/session/route.ts` | Create session |
| `app/api/swipe/route.ts` | Record swipe |
| `app/api/match/[code]/route.ts` | Compute matches |
| `app/api/ai/vibe/route.ts` | AI vibe tags |
| `PROGRESS.md` | Living task tracker — update often! |
| `SMOKE_AND_MIRRORS.md` | Internal: what's faked |

---

## DEMO SCRIPT (Memorize This)

```
1. "Aya solves the 'Saan tayo?' problem — the #1 group friction point."

2. [Open on phone] "No download needed — just open the link."

3. [Onboarding] "One context-setting flow. Aya then picks the right card deck."

4. [Solo swipe] "Each card is powered by NVIDIA NIM — Gemma generates these vibe tags 
   live from the establishment data."

5. [Barkada] "Now the real magic — Barkada mode. Join on your phone."
   [Both devices swipe] "Everyone swipes independently. Nobody sees anyone else's choices."
   [Reveal] "LABAS NA! — Aya found the match. Ranked by enthusiasm score."

6. [Aya Decides] "If there's a tie, one tap. Aya scores based on how fast and 
   how far each participant swiped — 'You all decided together. Aya just counted.'"

7. [Lakbay] "For full-day outings, Aya composes a sequenced itinerary accounting 
   for budget spread and geographic flow."

8. "For local MSMEs — free listing, zero tech skills required. 99.5% of Philippine 
   businesses have no digital discovery presence. Aya changes that."
```
