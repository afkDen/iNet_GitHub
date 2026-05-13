# PROJECT INITIATION DOCUMENT (PID)
## Aya — A Mobile-First AI-Integrated Web Application for Dining-Driven Decision Fatigue
### Team: iNet | SIKAPTala 2026 | DLSU-D CICS {SG}

---

## 1. PROJECT OVERVIEW

| Field | Details |
|---|---|
| **Project Name** | Aya |
| **Team Name** | iNet |
| **Competition** | SIKAPTala 2026 — IDEATHON: Software Development |
| **Host Institution** | De La Salle University – Dasmariñas, CICS {SG} |
| **Project Type** | Mobile-First Web Application |
| **Primary Domain** | AI-Powered Local Discovery & Group Decision-Making |
| **Target Market** | Filipino individuals, barkadas, families, couples, and local MSMEs |
| **Dev Environment** | Roocode (Antigravity mode) |
| **AI Model** | NVIDIA NIM Free API — Google Gemma4 31b-IT |

---

## 2. PROBLEM STATEMENT

The question *"Saan tayo?"* is a deeply embedded cultural frustration in Filipino daily life. Decision fatigue — the deterioration of decision quality after prolonged deliberation (Baumeister et al., 1998) — is compounded in group settings by social pressure, conflicting preferences, and platforms not built for collective decisions.

Three failure modes of current tools:
1. **Option Overload** — Google Maps returns hundreds of unfiltered results with no group-narrowing mechanism.
2. **Single-User Design** — All major tools (Klook, TripAdvisor, delivery apps) are built for one person, not a group's convergence.
3. **Local MSME Invisibility** — Community-embedded businesses are systematically underserved. MSMEs account for 99.5% of Philippine business establishments (DTI, 2023) yet most have zero digital discovery presence.

---

## 3. PROPOSED SOLUTION

**Aya** is a mobile-first, no-download web application that eliminates dining and outing decision fatigue through a swipe-based interface, real-time group sessions, and AI-powered recommendations — built and demo-ready for hackathon presentation.

---

## 4. DEVELOPMENT STRATEGY — REAL vs SMOKE & MIRRORS

> This project is built for a hackathon. The strategy is to build the **core experience flawlessly** and **simulate peripheral features convincingly**. Judges evaluate concept, demo, and polish — not production completeness.

### ✅ ACTUALLY BUILT (Real Implementation)

| Feature | Justification |
|---|---|
| Swipe Deck (Solo Mode) | THE centerpiece — judges will interact with this directly |
| Kwentuhan Onboarding (tiles + NLP) | First impression; must feel polished |
| NVIDIA NIM — Vibe Tag Generation | Visible AI; differentiating in demo |
| NVIDIA NIM — NLP Filter Parsing | Powers the "type in Filipino" path |
| Supabase Realtime — Barkada Group Session | Live multi-device sync is the showstopper moment |
| Group Reveal + Aya Decides | Emotional payoff of the whole demo |
| Venue Data (Google Places or Mock JSON) | Cards need real-looking data |
| Match Detection Logic | Core algorithm — must be correct |
| Session Code Generate / Join | Required for live group demo |
| Framer Motion Swipe Animations | Makes or breaks first impression |
| Balik Mo To (undo) | Small but memorable UX detail |

### 🎭 SMOKE & MIRRORS (Faked / Simulated)

| Feature | Strategy |
|---|---|
| **Lakbay / Itinerary Mode** | 4 hardcoded JSON itinerary presets. AI "selects" the best one based on filter keywords. Renders full timeline UI with map. Looks generated; is a lookup. |
| **MSME / Suking Spot Portal** | Full form UI. On submit → writes row to `msme_listings` with `status: 'pending'`. Shows "Submitted for review! We'll be in touch." Never activates. |
| **Drop a Pin / Lokal Intel** | Full form UI + map. On submit → writes to `community_pins` with `status: 'pending'`. Never surfaces in deck. Demo deck has pre-seeded pins already marked approved. |
| **Aya Memory** | Saves liked venue IDs to `localStorage`. On next session, passes them as a "previously liked" hint string to the AI vibe tag prompt. Feels adaptive; is just localStorage. |
| **Admin Dashboard** | Static UI with 5 hardcoded fake pending pins + 3 fake MSME submissions. Approve/reject buttons fire toasts only. Not wired to real DB. |
| **Community Confirmation Count** | "47 locals confirmed this spot" badge on pre-seeded demo venues — hardcoded number in the seed data. |
| **Session Data Purge** | Cleanup function exists and can be triggered manually. Not automatically called in demo build. |

---

## 5. OBJECTIVES

### General Objective
Deliver a compelling, polished demo of Aya that convincingly demonstrates the core swipe loop, real-time group decision-making, and AI-powered local discovery — sufficient to score strongly across all four judging criteria.

### Specific Objectives

| # | Objective | Real/Faked | Metric |
|---|---|---|---|
| SO-01 | Swipe deck with AI vibe tags | ✅ Real | Cards swipe, tags visible, NVIDIA NIM called |
| SO-02 | Kwentuhan onboarding (tiles + NLP) | ✅ Real | Both paths produce filter set; NLP handles Filipino |
| SO-03 | Barkada Mode real-time sync | ✅ Real | 2+ devices in same session sync live |
| SO-04 | Group reveal + Aya Decides | ✅ Real | Correct match + animated reveal |
| SO-05 | Lakbay itinerary screen | 🎭 Faked | Preset renders convincingly as AI-generated plan |
| SO-06 | MSME portal submits without error | 🎭 Faked | Form completes; success state shows |
| SO-07 | Drop a Pin submits without error | 🎭 Faked | Form completes; success state shows |
| SO-08 | Deployed public URL | ✅ Real | Live on Vercel, accessible on mobile |

---

## 6. SCOPE

### In-Scope (MVP)
- Kwentuhan onboarding (tappable cards + NLP)
- Solo Mode swipe deck with AI vibe tags
- Barkada Mode with Supabase Realtime sync
- Group reveal + Aya Decides tiebreaker
- Lakbay Mode (hardcoded itinerary presets)
- Drop a Pin UI (form → pending)
- Suking Spot / MSME Portal (form → pending)
- Session history (localStorage-based)
- Balik Mo To single undo
- Public Vercel deployment

### Out-of-Scope
- Real admin moderation workflows
- Native iOS/Android app
- In-app payments or reservations
- Real community pin verification pipeline
- Production-grade ML for Aya Memory

---

## 7. TECHNOLOGY STACK

| Layer | Technology | Notes |
|---|---|---|
| **IDE / AI Coding** | Roocode (Antigravity mode) | Primary dev tool; all prompts written for this context |
| **Framework** | Next.js 14 (App Router) | SSR + API Routes for server-side key isolation |
| **Language** | TypeScript | Type safety throughout |
| **Styling** | Tailwind CSS | Mobile-first utility styling |
| **Animations** | Framer Motion | Swipe gestures, card physics, reveal sequence |
| **Database** | Supabase (PostgreSQL) | Sessions, participants, venue cache, pins, MSME |
| **Realtime** | Supabase Realtime | WebSocket group session sync |
| **Auth** | Supabase Auth (Anonymous) | No account required for core flow |
| **AI** | NVIDIA NIM API (Free) — Gemma4 31b-IT | Vibe tags + NLP filter parsing |
| **Maps Data** | Google Places API + Mock JSON fallback | Venue cards; mock if quota hit |
| **Map Render** | Leaflet.js + OpenStreetMap | Itinerary map (Lakbay screen) |
| **Deployment** | Vercel | CI/CD from GitHub |
| **Version Control** | GitHub | Source control |

### NVIDIA NIM API Config

```
Base URL : https://integrate.api.nvidia.com/v1
Model    : google/gemma-4-31b-it
Auth     : Bearer ${NVIDIA_NIM_API_KEY}
Protocol : OpenAI-compatible (use openai npm package or direct fetch)
Tier     : Free — rate-limit aware; cache ALL responses aggressively
```

> **Critical for Demo:** Pre-generate and cache vibe tags for all demo venues before the presentation. Do not rely on live NVIDIA NIM calls during the demo — store results in Supabase `venues.vibe_tags` at seed time.

---

## 8. RISKS AND MITIGATIONS

| Risk | Impact | Mitigation |
|---|---|---|
| NVIDIA NIM rate limit during demo | High | Pre-cache all vibe tags at seed time; AI only called for NLP onboarding live |
| Google Places quota hit | High | `mock_venues.json` with 40 Metro Manila venues as fallback; swap by env flag |
| Supabase Realtime drops mid-demo | High | Auto-reconnect logic; `DEMO_SESSION` pre-created with known state |
| Smoke & mirrors features look broken | High | Prioritize UI completeness on fake features — they must look more finished than real ones |
| Scope creep | Medium | Feature freeze after Phase 4; extras only if Phase 6 time allows |

---

## 9. DEVELOPMENT PHASES

| Phase | Name | Key Deliverables | Type |
|---|---|---|---|
| **0** | Setup & Scaffolding | Repo, Next.js 14, Supabase, env, Tailwind, Framer Motion, mock data | Real |
| **1** | Data & AI Layer | DB schema, venue seed, Google Places wrapper, NVIDIA NIM client | Real |
| **2** | Onboarding | Kwentuhan tiles, NLP path, filter state | Real |
| **3** | Solo Mode | Card generation, swipe deck, vibe tags, match screen, undo | Real |
| **4** | Barkada Mode | Session create/join, Realtime sync, lobby, reveal, Aya Decides | Real |
| **5** | Smoke Features | Lakbay presets, MSME portal, Drop a Pin, Aya Memory localStorage | Smoke |
| **6** | Polish | Animations, mobile UX, toasts, demo data, loading states | Real |
| **7** | Deploy | Vercel, env vars, smoke test, PROGRESS.md final | Real |

---

## 10. SUCCESS CRITERIA (Competition-Ready)

- [ ] App loads < 3s on mobile browser
- [ ] Solo Mode swipe deck works end-to-end on 375px viewport
- [ ] Barkada Mode syncs live across 2+ real devices
- [ ] AI vibe tags appear on cards (NVIDIA NIM cached)
- [ ] NLP onboarding correctly parses a Filipino sentence live
- [ ] Group match reveal fires with full animation sequence
- [ ] Lakbay itinerary screen renders a convincing full-day plan
- [ ] MSME and Drop a Pin forms complete without errors
- [ ] Public Vercel URL accessible from any mobile browser
- [ ] All 8 mockup screens are represented in the live app

---

*Document Version: 2.0 | Roocode + NVIDIA NIM build | Team iNet — SIKAPTala 2026*
