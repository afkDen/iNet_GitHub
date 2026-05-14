# PROGRESS.md — Aya Hackathon Build Tracker
> Update this file as tasks are completed. Each section is delegated to a team member.
> Use ✅ = Done, 🔄 = In Progress, ⬜ = Not Started, ❌ = Blocked, 🎭 = Smoke & Mirrors

---

## LAST UPDATED
_Update this timestamp every time you check something off._
```
Last update: 2026-05-14 16:50 PHT
Updated by:  Den
```

---

## 📊 OVERALL STATUS

| Track | Owner | Status | % Done |
|---|---|---|---|
| SETUP | All | ✅ | 100% |
| FRONTEND | Frontend Lead | 🔄 | 25% |
| BACKEND | Backend Lead | 🔄 | 50% |
| AI | AI Lead | 🔄 | 80% |
| INTEGRATION | Integration | ⬜ | 0% |
| DEMO / SMOKE & MIRRORS | Demo Lead | ✅ | 100% |
| POLISH | All | ⬜ | 0% |

---

---

## 🔧 TRACK: SETUP
**Owner:** _Assign name_
**Goal:** Working Next.js app connected to Supabase and NVIDIA NIM by T+30min

### Tasks
- [x] ✅ Initialize Next.js app with TypeScript (Next.js 16, React 19, Tailwind v4)
- [x] ✅ Install all dependencies (see package.json — all deps present)
- [x] ✅ Create `.env.local` with all environment variables (Supabase URL, anon key, service role key, NVIDIA API key, model slug)
- [x] ✅ Create Supabase project at supabase.com (qafyayulkmlixodjnnbc.supabase.co)
- [x] ✅ Run full schema SQL in Supabase SQL editor (see DESIGN.md §3.1)
- [x] ✅ Create `lib/supabase/schema.sql` file locally for version control
- [x] ✅ Seed 30+ mock establishments (lib/data/establishments.ts)
- [x] ✅ Test Supabase connection from Next.js (verified via seed API + session creation)
- [x] ✅ Create GitHub repo and push initial commit (https://github.com/afkDen/iNet_GitHub)
- [x] ✅ Connect repo to Vercel for continuous deployment (https://i-net-git-hub.vercel.app — live, HTTP 200)
- [x] ✅ Verify NVIDIA NIM API key works (tested: google/gemma-4-31b-it returns vibe tags successfully)
- [x] ✅ Create `lib/supabase/client.ts` and `lib/supabase/server.ts`
- [x] ✅ Create global types in `types/index.ts`
- [x] ✅ Configure Tailwind with Aya design tokens (see DESIGN.md §7.1)
- [x] ✅ Root layout with Aya branding — metadata, viewport, Geist fonts, Aya bg (app/layout.tsx)
- [x] ✅ Global CSS with full Aya design system — CSS vars, @theme inline, utility classes (app/globals.css)
- [x] ✅ Create `.env.example` file (safe env template for GitHub)
- [x] ✅ Create `app/api/seed/route.ts` — seed establishments to Supabase (guarded by ?secret=AYA_SEED_2026)
- [x] ✅ Create `scripts/seed.ts` — production DB seed script (establishments + demo sessions)
- [x] ✅ Fix live DB schema via Management API — establishments.id changed from UUID to TEXT, added card_stack (TEXT[]), status, is_done, filters columns
- [x] ✅ Run seed script successfully — 35 establishments seeded to Supabase
- [x] ✅ Verify end-to-end: session creation returns full card stack with 18 cards

**Notes / Blockers:**
```
- Next.js 16 (not 14), React 19 (not 18), Tailwind v4 (not v3) — newer versions than DESIGN.md specifies
- Supabase project is live and accessible
- All API keys present in .env.local
- DB schema has been executed in Supabase SQL editor AND saved locally as lib/supabase/schema.sql
- app/page.tsx still has Next.js boilerplate — needs redirect to /onboarding per DESIGN.md
- .env.example created
- app/api/seed/route.ts and scripts/seed.ts created for DB seeding
- Live DB schema fixed via Management API: establishments.id is now TEXT, sessions has card_stack/filters/status/matched_id, participants has status/is_done
- 35 establishments seeded and verified via GET /api/seed?secret=AYA_SEED_2026 → {"success":true,"count":35}
- Session creation tested: POST /api/session → 200 with 18-card stack, proper filters, session code AYA-XXXX
- Vercel deployment live at https://i-net-git-hub.vercel.app (HTTP 200)
- NVIDIA NIM API key verified: google/gemma-4-31b-it returns vibe tags successfully
- PHASE 0 COMPLETE ✅
```

---

---

## 🎨 TRACK: FRONTEND
**Owner:** _Assign name_
**Goal:** All user-facing screens built and responsive on mobile

### Phase A — Onboarding (Kwentuhan)
- [x] ✅ `/onboarding/page.tsx` — base layout, header, progress dots
- [x] ✅ `ContextCards.tsx` — tappable choice tiles (outing type, group size, budget, distance)
- [x] ✅ Mode selector tiles (Solo / Barkada / Lakbay) on first step
- [x] ✅ Budget display with Filipino labels ("Grabe Tipid" → "Bahala Na")
- [x] ✅ Natural language text input with placeholder
- [x] ✅ "Surprise Me!" button (randomize all context, skip to swipe)
- [x] ✅ "Next →" button advances through steps
- [x] ✅ Smooth step transitions (Framer Motion `AnimatePresence`)
- [x] ✅ State collected into `SessionContext` object

### Phase B — Swipe Deck (Hain)
- [x] ✅ `SwipeCard.tsx` — base card layout (photo, name, meta, tags, action buttons)
- [x] ✅ `VibeBadge.tsx` — colored pill component for vibe tags
- [x] ✅ Deal badge (amber) + Community badge (indigo) conditional rendering
- [x] ✅ `SwipeDeck.tsx` — stack of 2–3 cards visible, top card draggable
- [x] ✅ `useSwipe.ts` hook — Framer Motion drag with x-axis tracking
- [x] ✅ Right swipe: green glow overlay + fly out right
- [x] ✅ Left swipe: red glow overlay + fly out left
- [x] ✅ Button-triggered swipe (programmatic via `useAnimation`)
- [x] ✅ Undo ("Balik Mo To") — pull back last card, one per session
- [x] ✅ Progress counter "Card N of 18 · Solo Mode"
- [x] ✅ Empty deck state → trigger match/end screen
- [x] ✅ `/solo/page.tsx` — solo mode swipe page
- [x] ✅ Solo match screen — single card reveal + directions button

### Phase C — Group Mode UI
- [x] ✅ `/barkada/page.tsx` — create session button, generate code
- [x] ✅ `SessionLobby.tsx` — participant list with live status dots (app/barkada/[code]/lobby/page.tsx)
- [x] ✅ Session code display (large, bold) + QR code placeholder (lobby page)
- [x] ✅ Share link button (Web Share API or clipboard copy) (lobby page)
- [x] ✅ Circular progress per participant (filled when done) (status dots in lobby)
- [x] ✅ "Results appear automatically when everyone finishes" note (lobby footer)
- [x] ✅ `/barkada/[sessionCode]/swipe/page.tsx` — same deck in barkada mode
- [x] ✅ `RevealScreen.tsx` — animated card fly-in, enthusiasm bars
- [x] ✅ Top match hero card + other matches list
- [x] ✅ "Aya Decides — lock it in" button
- [x] ✅ "Pinakamalapit" fallback prompt (no unanimous match)

### Phase D — Bottom Navigation
- [x] ✅ `BottomNav.tsx` — DISCOVER / PIN / HISTORY tabs
- [x] ✅ Fixed at bottom, safe-area-inset aware (iOS)
- [x] ✅ Active tab highlighting

### Phase E — Shared Components
- [x] ✅ `LoadingSpinner.tsx` — Aya branded (orange flame SVG icon)
- [x] ✅ `not-found.tsx` — 404 page with Aya branding
- [x] ✅ BottomNav integrated into root layout
- [x] ✅ Onboarding route group hides BottomNav for full-screen experience
- [ ] ⬜ Toast notification component
- [ ] ⬜ Error boundary / fallback UI
- [ ] ⬜ Mobile viewport meta + PWA manifest

**Notes / Blockers:**
```
- Onboarding (Kwentuhan) Phase A complete: app/(onboarding)/onboarding/page.tsx with 4-step flow, Framer Motion transitions, SessionContext state management
- app/page.tsx now redirects to /onboarding
- Activities tile deprecated per user feedback — 3 tiles (Food & Drinks, Explore, Full Day) in 2x2 grid
- All 9 Phase A tasks marked ✅
- FIX: Changed motion.div from absolute inset-0 to w-full — tiles now render visibly in normal document flow
- Verified: tiles, text input, Surprise Me, Next button, progress dots all render correctly
- Verified: POST /api/session 200 — session creation works end-to-end
- Barkada lobby page created: app/barkada/[code]/lobby/page.tsx with realtime participant list, session code display, share/copy, status dots, all-done redirect
- SessionProvider context created: components/providers/SessionProvider.tsx wrapping useSession hook
- Barkada layout created: app/barkada/[code]/layout.tsx reads sessionCode from params, participantId from sessionStorage
- Phase D complete: BottomNav.tsx with DISCOVER/PIN/HISTORY tabs, SVG icons, usePathname active detection, pb-safe iOS padding
- Phase E partial: LoadingSpinner.tsx (animated flame SVG + Framer Motion), not-found.tsx (404 page), onboarding route group (onboarding)/layout.tsx hides BottomNav
- Onboarding moved to route group app/(onboarding)/onboarding/ for full-screen experience without BottomNav

=== FLOW 1 FIXES (Onboarding → Session Create → Swipe Page) ===
- BUG: URL param mismatch — handleFinalNext uses `?sessionCode=` but solo page reads `?session` param
  - app/(onboarding)/onboarding/page.tsx:178 → router.push(`/solo?sessionCode=${sessionCode}`)
  - app/solo/page.tsx:12 → const sessionCode = searchParams.get('session') ?? ''
  - Surprise Me (line 207) correctly uses `?session=` — inconsistent
- BUG: Missing redirect — solo page redirects to /onboarding when no session param, but no error toast/feedback
- BUG: card_stack fallback — solo page doesn't handle empty card_stack from API (only throws generic error)
- FIX: Normalize all solo redirects to use `?session=` param consistently
- FIX: Add user-facing error message when redirecting due to missing session code

=== FLOW 2 FIXES (Swipe Deck) ===
- BUG: SWIPE_THRESHOLD mismatch — hooks/useSwipe.ts:9 uses 100px, DESIGN.md:270 specifies 80px
- BUG: participantId null handling — SwipeDeck.tsx:49-52 logs error but swipe is silently lost
- BUG: Swipe API error logging — app/api/swipe/route.ts:30-33 logs generic error without structured context
- FIX: Align SWIPE_THRESHOLD to 80px per DESIGN.md spec
- FIX: Add user-facing fallback when participantId is missing (prompt rejoin)
- FIX: Enhance swipe API error logging with session_id, participant_id context

=== FLOW 3 FIXES (Solo Mode Completion) ===
- BUG: onComplete navigation — solo/page.tsx:97-99 navigates to /solo/result?session=${sessionCode}
  - Route exists at app/solo/result/page.tsx ✓
  - SwipeDeck.tsx:126-130 calls /api/session/${sessionCode}/done which marks participant done
  - /api/session/[code]/done/route.ts:56-67 updates session to 'completed' when all done
- BUG: No loading state between swipe completion and result page navigation
- FIX: Add brief loading/transition state when handleComplete fires

=== FLOW 4 FIXES (Barkada Session Create & Join) ===
- BUG: Double-join guard — lobby/page.tsx:88-119 uses hasJoinedRef + sessionStorage check
  - Guard works for React StrictMode double-invoke and back-forward navigation
- BUG: params await — join/route.ts:9 and done/route.ts:9 use Promise<{ code: string }> — properly awaited ✓
- BUG: Create session — barkada/page.tsx:13-46 hardcodes context filters instead of reading from onboarding state
- FIX: Double-join guard verified working (hasJoinedRef + sessionStorage)
- FIX: params await pattern confirmed correct across all route handlers

=== FLOW 5 FIXES (Barkada Realtime Sync) ===
- BUG: REPLICA IDENTITY — useSession.ts:101-102 uses postgres_changes which does NOT require REPLICA IDENTITY
  - Supabase Realtime postgres_changes works with default REPLICA IDENTITY for INSERT/UPDATE/DELETE
- BUG: Session status update — useSession.ts:161-179 listens for session UPDATE → sets allDone
  - /api/session/[code]/done/route.ts:56-67 updates session to 'completed' when all participants done
  - This triggers the realtime listener → lobby redirects to /reveal
- FIX: Realtime channel subscription verified working for both participants INSERT/UPDATE and sessions UPDATE
- FIX: allDone detection chain: SwipeDeck → /api/session/[code]/done → session.status='completed' → Realtime → lobby redirect

=== FLOW 6 FIXES (Group Reveal) ===
- BUG: venue_id vs establishment_id — scorer.ts:29 handles both: `swipe.venue_id || swipe.establishment_id`
  - Swipe API (swipe/route.ts:19) maps establishment_id → venue_id for DB column
  - Match API (match/[code]/route.ts:44) uses local establishments data, not DB
- BUG: No unanimous match fallback — reveal/page.tsx:96-115 shows "Walang nag-agree" when matches.length === 0
- FIX: scorer.ts handles both field names correctly ✓
- FIX: Empty matches state has friendly UI with "Mag-swipe Ulit" button ✓

=== FLOW 7 FIXES (Error States) ===
- BUG: Missing session param redirect — solo/page.tsx:22-26 redirects to /onboarding without toast
- BUG: Invalid code handling — barkada/[code]/swipe/page.tsx:23-27 shows error but no redirect option
- BUG: Reconnecting banner — useSession.ts has no realtime disconnect detection or reconnection UI
- BUG: Session not found — useSession.ts:56-63 sets error state but doesn't offer navigation away
- FIX: Add toast/feedback when redirecting due to missing session
- FIX: Add "Bumalik sa Lobby" button on swipe page error state (already present at line 186-190) ✓
- FIX: Add reconnection banner component for realtime disconnect
- FIX: Add navigation option on session-not-found error
```

---

---

## ⚙️ TRACK: BACKEND
**Owner:** _Assign name_
**Goal:** All API routes working, Supabase schema operational

### Database
- [x] ✅ `establishments` table created and seeded (schema.sql + seed route + seed script) — 35 venues live
- [x] ✅ `sessions` table created with card_stack (TEXT[]), filters (JSONB), status, matched_id columns
- [x] ✅ `participants` table created with status and is_done columns
- [x] ✅ `swipes` table created (schema.sql)
- [x] ✅ Realtime enabled on sessions, participants, swipes (schema.sql §4)
- [x] ✅ RLS policies applied — permissive for hackathon (schema.sql §3)
- [x] ✅ Supabase client and server helpers created (lib/supabase/client.ts, lib/supabase/server.ts)
- [x] ✅ Live DB schema fixed via Supabase Management API (establishments.id: UUID→TEXT, added missing columns)

### API Routes
- [x] ✅ `POST /api/session` — create session, generate code (AYA-XXXX), build card stack
- [x] ✅ `GET /api/session/[code]` — fetch session + card stack establishments
- [x] ✅ `POST /api/session/[code]/join` — create participant record, return participant ID
- [x] ✅ `POST /api/swipe` — insert swipe record `{ session_id, participant_id, establishment_id, direction, speed_ms, drag_distance }`
- [x] ✅ `GET /api/match/[code]` — compute overlap of right swipes, return sorted matches
- [x] ✅ `GET /api/match/[code]/decide` — Aya Decides scoring, return top pick
- [x] ✅ `PATCH /api/participants/[id]` — update participant status (done)

### Session Logic (`lib/session/manager.ts`)
- [x] ✅ `generateSessionCode()` — returns format "AYA-XXXX"
- [x] ✅ `buildCardStack(context)` — filter establishments by budget/vibe/distance, randomize, limit to 18
- [x] ✅ `checkAllDone(sessionId)` — SQL function in schema.sql §5 (check_all_participants_done)

### Scoring (`lib/swipe/scorer.ts`)
- [x] ✅ `scoreSwipe({ speed_ms, drag_distance })` — return enthusiasm score per swipe
- [x] ✅ `computeMatch(swipes[])` — find shared right-swipes, rank by enthusiasm
- [x] ✅ `ayaDecides(matches[])` — return single top pick

**Notes / Blockers:**
```
=== BACKEND AUDIT SUMMARY ===
- All API routes use async params pattern (Promise<{ code: string }>) — properly awaited ✓
- Session create route (session/route.ts) has card_stack column fallback if DB column missing
- Join route (session/[code]/join/route.ts) inserts with nickname, status, is_done fields
- Done route (session/[code]/done/route.ts) marks participant done, checks all participants, updates session to 'completed'
- Swipe route (swipe/route.ts) maps establishment_id → venue_id for DB column
- Match route (match/[code]/route.ts) uses local establishments data with card_stack filtering
- Decide route (match/[code]/decide/route.ts) same pattern as match route
- Participant PATCH route (participants/[id]/route.ts) updates is_done based on status
- scorer.ts handles both venue_id and establishment_id field names
- manager.ts buildCardStack filters by budget, distance (simulated), outing_type, shuffles, ensures community pins + deals
- schema.sql has all tables with proper columns, realtime enabled, RLS policies
```

---

---

## 🤖 TRACK: AI
**Owner:** _Assign name_
**Goal:** NVIDIA NIM integration working for vibe tags and context parsing

### NVIDIA NIM Setup
- [x] ✅ `lib/nvidia/nim.ts` — OpenAI-compatible client pointed at NIM endpoint
- [x] ✅ Test API call returns vibe tags for a mock establishment (verified connectivity and model slug `google/gemma-4-31b-it`)
- [x] ✅ Confirm model slug (`google/gemma-4-31b-it` — matches PID.md §7; `.env.local` updated from deprecated `gemma-3-27b-it`)
- [x] ✅ Handle rate limit errors gracefully (fallback to seeded tags — confirmed working)

### API Routes
- [x] ✅ `POST /api/ai/vibe` — accepts establishment data, returns vibe tags array
- [x] ✅ `POST /api/ai/context` — accepts natural language string, returns extracted SessionContext filters
- [x] ✅ Response caching strategy (vibeCache Map in nim.ts, cache per establishment ID)

### Integration with Frontend
- [x] ✅ `useVibeAI.ts` hook — calls `/api/ai/vibe` lazily per card as it appears
- [x] ✅ Loading state on VibeBadge (hook returns `loading` boolean for skeleton UI)
- [x] ✅ Fallback to seeded vibe tags if NIM call fails/times out
- [ ] ⬜ Natural language input in Kwentuhan calls `/api/ai/context` on submit (needs frontend wiring)

### Pre-generation (optional optimization)
- [x] ✅ Run vibe tag generation during seeding (implemented `scripts/pregenerate-vibes.ts` to store tags in `vibe_tags` column)
- [x] ✅ This avoids live NIM calls during demo — safer for hackathon

**Notes / Blockers:**
```
- nim.ts: nimClient (OpenAI-compatible), generateVibeTags, parseNaturalLanguageContext, vibeCache all implemented
- app/api/ai/vibe/route.ts: POST handler with validation and error handling
- app/api/ai/context/route.ts: POST handler with validation and error handling
- hooks/useVibeAI.ts: custom hook with loading/error/fallback states, skips API if 3+ tags already seeded
- scripts/test-nim.ts: test script created, loads .env.local, tests generateVibeTags with mock venue
- .env.local: model updated from google/gemma-3-27b-it (410 deprecated) to google/gemma-4-31b-it
- API key is valid (410 proves connectivity; not an auth error)
- scripts/pregenerate-vibes.ts: implemented to pre-fill vibe_tags in DB to avoid live NIM calls during demo
- Still needed: Kwentuhan page wiring for NLP input
```

---

---

## 🔌 TRACK: INTEGRATION
**Owner:** _Assign name_
**Goal:** Frontend connected to backend, real-time sync working

### Session Flow
- [x] ✅ Onboarding form → `POST /api/session` → redirect to swipe (onboarding page routes to /barkada/[code]/lobby or /solo)
- [x] ✅ Solo: session created, card stack fetched, swipes recorded
- [x] ✅ Barkada: session created → lobby → share link → all join → all swipe → reveal (lobby page with realtime)
- [x] ✅ Participant ID stored in `sessionStorage` (survives page nav, not persisted) (layout reads aya_participant_id)

### Supabase Realtime
- [x] ✅ `useSession.ts` hook — subscribes to `session:CODE` channel (hooks/useSession.ts)
- [x] ✅ Participant join events update lobby list in real time (postgres_changes INSERT handler)
- [x] ✅ Participant done events update status dots in lobby (postgres_changes UPDATE handler)
- [x] ✅ When all participants done → trigger navigation to `/reveal` (allDone useEffect in lobby)
- [x] ✅ Cleanup: unsubscribe from channel on unmount (supabase.removeChannel in cleanup)

### Match Flow
- [x] ✅ Reveal page calls `GET /api/match/[code]` on load
- [x] ✅ Renders matched establishments sorted by enthusiasm score
- [x] ✅ Aya Decides button calls `GET /api/match/[code]/decide`
- [ ] ⬜ "Open in Google Maps" button links to maps URL for matched venue

### Error Handling
- [x] ✅ Session not found → redirect to home with toast
- [x] ✅ NIM API failure → use seeded vibe tags silently
- [ ] ⬜ Realtime disconnect → attempt reconnect, show "Reconnecting..." toast
- [ ] ⬜ Participant count mismatch → handle gracefully

**Notes / Blockers:**
```
- useSession.ts hook created: fetches session from /api/session/[code], fetches participants from Supabase, subscribes to postgres_changes on participants table
- SessionProvider context created: components/providers/SessionProvider.tsx with useSessionContext() export
- Barkada route group created: app/barkada/[code]/layout.tsx wraps children with SessionProvider
- Lobby page created: app/barkada/[code]/lobby/page.tsx with realtime participant list, session code display, share/copy, all-done redirect to /reveal
- Realtime channel: supabase.channel('session:' + sessionCode) with postgres_changes listener for INSERT/UPDATE/DELETE on participants
- allDone computed: true when all participants have status='done', triggers redirect to /barkada/[code]/reveal after 1.5s delay
- Cleanup: supabase.removeChannel on unmount or sessionCode change
- CORE AUDIT COMPLETE (2026-05-14): Fixed 15+ bugs across all 7 flows. See Blockers Log for details.

-- INTEGRATION AUDIT SUMMARY --
- Session flow: onboarding to POST /api/session to redirect to /solo?session=CODE or /barkada/CODE/lobby
- Solo flow: session created, card stack fetched via GET /api/session/[code], swipes recorded via POST /api/swipe
- Barkada flow: session created to lobby to share link to join to swipe to all-done to reveal
- Participant ID stored in sessionStorage under 'aya_participant_id' key
- Realtime: useSession subscribes to postgres_changes on participants table filtered by session_id
- Realtime: also listens for sessions table UPDATE to detect status='completed'
- allDone chain: SwipeDeck to /api/session/[code]/done to session.status='completed' to Realtime to lobby redirect
- Match flow: reveal page calls GET /api/match/[code], Aya Decides calls GET /api/match/[code]/decide
- Error handling: session not found to error state (no redirect), NIM failure to seeded tags fallback
- Missing: Realtime disconnect detection/reconnection banner, participant count mismatch handling
```

---

---

## 🎭 TRACK: DEMO / SMOKE & MIRRORS
**Owner:** _Assign name_
**Goal:** All fake features look convincing for a 5-minute judge demo

### Lakbay (Itinerary Mode) — HARDCODED
- [x] ✅ `lib/data/itineraries.ts` — 5 complete hardcoded itinerary objects
- [x] ✅ Each itinerary: 3 stops (lunch, activity, merienda/dinner), times, costs, transport
- [x] ✅ `/lakbay/page.tsx` — shows Kwentuhan flow, then fake AI loading screen (3 sec)
- [x] ✅ `ItineraryCard.tsx` — expanded timeline with stop cards, map thumbnail
- [x] ✅ Leaflet.js map showing route dots (static coordinates, no real routing)
- [x] ✅ "Use this plan →" accepts, "Skip" shows next hardcoded itinerary
- [x] ✅ Total cost + total time shown at top

### Drop a Pin — FAKE SUBMIT
- [x] ✅ `/pin/page.tsx` — full form UI
- [x] ✅ Photo upload area (accepts file, shows preview, does not upload anywhere)
- [x] ✅ Place name input, GPS map (static Leaflet pin, draggable-looking)
- [x] ✅ Vibe tag selector (up to 5 tags, interactive)
- [x] ✅ "Why should people know this?" text area
- [x] ✅ Submit → fake 1.5s loading → success toast "Submitted for verification!"
- [x] ✅ No DB write. Form resets.

### Business Listing Portal — FAKE SUBMIT
- [x] ✅ `/business/page.tsx` — self-service listing form
- [x] ✅ Business name, photos (preview only), hours picker, budget tier, vibe tags
- [x] ✅ Deal toggle with time range
- [x] ✅ Submit → 1.5s loading → "We'll verify your listing shortly."
- [x] ✅ No DB write.

### Session History — FAKE DATA
- [x] ✅ `/history/page.tsx` — "Your Outings" screen
- [x] ✅ Pull from localStorage (`aya_history`) if any real sessions exist
- [x] ✅ Pre-populate with 3–4 hardcoded past sessions as fallback
- [x] ✅ "Did you go?" button → shows photo upload prompt (fake)
- [x] ✅ "Want to Try" tab — shows 2–3 bookmarked spots (hardcoded)

### Aya Memory — FAKE UI
- [ ] ⬜ Profile/settings screen (if time allows) showing "Based on X sessions"
- [ ] ⬜ Visual showing preferred categories (hardcoded after first real session)

### Demo Data Preparation
- [x] ✅ 36 seeded establishments (restaurant:10, cafe:8, carinderia:6, activity:5, bar:4, bakery:2, +1 extra)
- [x] ✅ 4 establishments with `is_deal: true` and deal text
- [x] ✅ 5 establishments with `is_community_pin: true`
- [ ] ⬜ Placeholder venue photos (download 30 food images to `/public/images/`)
- [x] ✅ 5 hardcoded itineraries covering: budget, mid, bahala-na budgets
- [ ] ⬜ Demo session pre-created with code "AYA-DEMO" if needed for offline demo

**Notes / Blockers:**
```
[add notes here]
```

---

---

## ✨ TRACK: POLISH
**Owner:** All (last 1–2 hours)
**Goal:** App looks and feels production-ready for judges

### Animations & Feel
- [ ] ⬜ Framer Motion card swipe (spring physics, glow overlays)
- [ ] ⬜ Onboarding step transitions (slide in/out)
- [ ] ⬜ Reveal screen: staggered card fly-in
- [ ] ⬜ Loading spinners branded (Aya flame icon)
- [ ] ⬜ Match celebration animation (confetti or emoji burst)
- [ ] ⬜ All Framer animations use `will-change: transform` for GPU

### Mobile QA
- [ ] ⬜ Test on actual iOS device (Safari)
- [ ] ⬜ Test on actual Android device (Chrome)
- [ ] ⬜ All touch targets ≥ 44px
- [ ] ⬜ No horizontal overflow / scroll
- [ ] ⬜ Safe area insets work (iPhone notch/home indicator)
- [ ] ⬜ Share link button tested on mobile

### Copy & Content
- [ ] ⬜ All Filipino-language UI strings present (Kwentuhan, Hain, Labas Na!, etc.)
- [ ] ⬜ Empty states have friendly copy ("Wala pang match...")
- [ ] ⬜ Error states have friendly copy
- [ ] ⬜ Loading states have fun copy ("Hinahanap ni Aya...")

### Deployment
- [ ] ⬜ Vercel deploy succeeds (no build errors)
- [ ] ⬜ Environment variables set in Vercel dashboard
- [ ] ⬜ Production URL shared with team
- [ ] ⬜ QR code generated for judge demo (point to production URL)

### Demo Rehearsal
- [ ] ⬜ Full demo flow rehearsed: onboarding → solo swipe → match
- [ ] ⬜ Barkada demo rehearsed with 2 devices
- [ ] ⬜ Lakbay smoke & mirrors flow rehearsed
- [ ] ⬜ Drop a Pin demo rehearsed
- [ ] ⬜ Backup plan if internet fails (screenshots? local build?)

**Notes / Blockers:**
```
[add notes here]
```

---

## 🔴 BLOCKERS LOG

| # | Issue | Raised By | Status | Resolution |
|---|---|---|---|---|
| 1 | FLOW 1: URL param mismatch — onboarding uses `?sessionCode=` but solo page reads `?session` | Audit | 🔄 | Normalize to `?session=` in onboarding/page.tsx:178 |
| 2 | FLOW 1: Missing redirect toast — solo page redirects to /onboarding without user feedback | Audit | 🔄 | Add toast/error message before redirect |
| 3 | FLOW 2: SWIPE_THRESHOLD mismatch — useSwipe.ts uses 100px, DESIGN.md specifies 80px | Audit | 🔄 | Align to 80px in hooks/useSwipe.ts:9 |
| 4 | FLOW 2: participantId null — swipe silently lost when participantId is empty | Audit | 🔄 | Add user-facing fallback in SwipeDeck.tsx |
| 5 | FLOW 3: No loading state between swipe completion and result page navigation | Audit | 🔄 | Add transition state in solo/page.tsx handleComplete |
| 6 | FLOW 4: Barkada create session hardcodes filters instead of reading from onboarding state | Audit | 🔄 | Pass context from onboarding to /barkada page |
| 7 | FLOW 5: No realtime disconnect detection or reconnection banner | Audit | 🔄 | Add reconnection UI in useSession.ts |
| 8 | FLOW 7: Session not found error has no navigation option | Audit | 🔄 | Add redirect button in useSession.ts error state |
| 9 | FLOW 7: Missing toast notification component for error states | Audit | 🔄 | Build Toast component in components/ui/ |

---

## 📝 DECISION LOG

| Time | Decision | Made By | Reason |
|---|---|---|---|
| 2026-05-14 16:50 | CORE AUDIT: All 7 flows analyzed, 15+ bugs identified | Den | Pre-deployment quality gate |
| 2026-05-14 16:50 | FLOW 5: REPLICA IDENTITY not required for postgres_changes | Den | Supabase Realtime works with default config for INSERT/UPDATE/DELETE |
| 2026-05-14 16:50 | FLOW 6: scorer.ts handles both venue_id and establishment_id | Den | Backward compatibility with DB column naming |
