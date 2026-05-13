# PROGRESS.md — Aya Hackathon Build Tracker
> Update this file as tasks are completed. Each section is delegated to a team member.
> Use ✅ = Done, 🔄 = In Progress, ⬜ = Not Started, ❌ = Blocked, 🎭 = Smoke & Mirrors

---

## LAST UPDATED
_Update this timestamp every time you check something off._
```
Last update: 2026-05-14 03:32 PHT
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
| DEMO / SMOKE & MIRRORS | Demo Lead | ⬜ | 0% |
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
- [ ] ⬜ `SwipeCard.tsx` — base card layout (photo, name, meta, tags, action buttons)
- [ ] ⬜ `VibeBadge.tsx` — colored pill component for vibe tags
- [ ] ⬜ Deal badge (amber) + Community badge (indigo) conditional rendering
- [ ] ⬜ `SwipeDeck.tsx` — stack of 2–3 cards visible, top card draggable
- [ ] ⬜ `useSwipe.ts` hook — Framer Motion drag with x-axis tracking
- [ ] ⬜ Right swipe: green glow overlay + fly out right
- [ ] ⬜ Left swipe: red glow overlay + fly out left
- [ ] ⬜ Button-triggered swipe (programmatic via `useAnimation`)
- [ ] ⬜ Undo ("Balik Mo To") — pull back last card, one per session
- [ ] ⬜ Progress counter "Card N of 18 · Solo Mode"
- [ ] ⬜ Empty deck state → trigger match/end screen
- [ ] ⬜ `/solo/page.tsx` — solo mode swipe page
- [ ] ⬜ Solo match screen — single card reveal + directions button

### Phase C — Group Mode UI
- [ ] ⬜ `/barkada/page.tsx` — create session button, generate code
- [ ] ⬜ `SessionLobby.tsx` — participant list with live status dots
- [ ] ⬜ Session code display (large, bold) + QR code placeholder
- [ ] ⬜ Share link button (Web Share API or clipboard copy)
- [ ] ⬜ Circular progress per participant (filled when done)
- [ ] ⬜ "Results appear automatically when everyone finishes" note
- [ ] ⬜ `/barkada/[sessionCode]/swipe/page.tsx` — same deck in barkada mode
- [ ] ⬜ `RevealScreen.tsx` — animated card fly-in, enthusiasm bars
- [ ] ⬜ Top match hero card + other matches list
- [ ] ⬜ "Aya Decides — lock it in" button
- [ ] ⬜ "Pinakamalapit" fallback prompt (no unanimous match)

### Phase D — Bottom Navigation
- [ ] ⬜ `BottomNav.tsx` — DISCOVER / PIN / HISTORY tabs
- [ ] ⬜ Fixed at bottom, safe-area-inset aware (iOS)
- [ ] ⬜ Active tab highlighting

### Phase E — Shared Components
- [ ] ⬜ `LoadingSpinner.tsx` — Aya branded (orange flame icon)
- [ ] ⬜ Toast notification component
- [ ] ⬜ Error boundary / fallback UI
- [ ] ⬜ Mobile viewport meta + PWA manifest

**Notes / Blockers:**
```
- Onboarding (Kwentuhan) Phase A complete: app/onboarding/page.tsx with 4-step flow, Framer Motion transitions, SessionContext state management
- app/page.tsx now redirects to /onboarding
- Activities tile deprecated per user feedback — 3 tiles (Food & Drinks, Explore, Full Day) in 2x2 grid
- All 9 Phase A tasks marked ✅
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
[add notes here]
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
- [ ] ⬜ Onboarding form → `POST /api/session` → redirect to swipe
- [ ] ⬜ Solo: session created, card stack fetched, swipes recorded
- [ ] ⬜ Barkada: session created → lobby → share link → all join → all swipe → reveal
- [ ] ⬜ Participant ID stored in `sessionStorage` (survives page nav, not persisted)

### Supabase Realtime
- [ ] ⬜ `useSession.ts` hook — subscribes to `session:CODE` channel
- [ ] ⬜ Participant join events update lobby list in real time
- [ ] ⬜ Participant done events update status dots in lobby
- [ ] ⬜ When all participants done → trigger navigation to `/reveal`
- [ ] ⬜ Cleanup: unsubscribe from channel on unmount

### Match Flow
- [ ] ⬜ Reveal page calls `GET /api/match/[code]` on load
- [ ] ⬜ Renders matched establishments sorted by enthusiasm score
- [ ] ⬜ Aya Decides button calls `GET /api/match/[code]/decide`
- [ ] ⬜ "Open in Google Maps" button links to maps URL for matched venue

### Error Handling
- [ ] ⬜ Session not found → redirect to home with toast
- [ ] ⬜ NIM API failure → use seeded vibe tags silently
- [ ] ⬜ Realtime disconnect → attempt reconnect, show "Reconnecting..." toast
- [ ] ⬜ Participant count mismatch → handle gracefully

**Notes / Blockers:**
```
[add notes here]
```

---

---

## 🎭 TRACK: DEMO / SMOKE & MIRRORS
**Owner:** _Assign name_
**Goal:** All fake features look convincing for a 5-minute judge demo

### Lakbay (Itinerary Mode) — HARDCODED
- [x] ✅ `lib/data/itineraries.ts` — 5 complete hardcoded itinerary objects
- [ ] ⬜ Each itinerary: 3 stops (lunch, activity, merienda/dinner), times, costs, transport
- [ ] ⬜ `/lakbay/page.tsx` — shows Kwentuhan flow, then fake AI loading screen (3 sec)
- [ ] ⬜ `ItineraryCard.tsx` — expanded timeline with stop cards, map thumbnail
- [ ] ⬜ Leaflet.js map showing route dots (static coordinates, no real routing)
- [ ] ⬜ "Use this plan →" accepts, "Skip" shows next hardcoded itinerary
- [ ] ⬜ Total cost + total time shown at top

### Drop a Pin — FAKE SUBMIT
- [ ] ⬜ `/pin/page.tsx` — full form UI
- [ ] ⬜ Photo upload area (accepts file, shows preview, does not upload anywhere)
- [ ] ⬜ Place name input, GPS map (static Leaflet pin, draggable-looking)
- [ ] ⬜ Vibe tag selector (up to 5 tags, interactive)
- [ ] ⬜ "Why should people know this?" text area
- [ ] ⬜ Submit → fake 1.5s loading → success toast "Submitted for verification!"
- [ ] ⬜ No DB write. Form resets.

### Business Listing Portal — FAKE SUBMIT
- [ ] ⬜ `/business/page.tsx` — self-service listing form
- [ ] ⬜ Business name, photos (preview only), hours picker, budget tier, vibe tags
- [ ] ⬜ Deal toggle with time range
- [ ] ⬜ Submit → 1.5s loading → "We'll verify your listing shortly."
- [ ] ⬜ No DB write.

### Session History — FAKE DATA
- [ ] ⬜ `/history/page.tsx` — "Your Outings" screen
- [ ] ⬜ Pull from localStorage (`aya_history`) if any real sessions exist
- [ ] ⬜ Pre-populate with 3–4 hardcoded past sessions as fallback
- [ ] ⬜ "Did you go?" button → shows photo upload prompt (fake)
- [ ] ⬜ "Want to Try" tab — shows 2–3 bookmarked spots (hardcoded)

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
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

---

## 📝 DECISION LOG

| Time | Decision | Made By | Reason |
|---|---|---|---|
| | | | |
