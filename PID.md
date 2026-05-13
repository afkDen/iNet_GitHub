# PROJECT INITIATION DOCUMENT (PID)
## Aya — AI-Integrated Group Dining Decision App
**Competition:** SIKAPTala 2026 — Ideathon: Software Development (Hackathon Track)
**Team:** iNet
**Institution:** De La Salle University – Dasmariñas
**Date:** 2026

---

## 1. PROJECT OVERVIEW

| Field | Detail |
|---|---|
| **Project Name** | Aya |
| **Tagline** | *"Bahala na si Aya."* — Your AI outing companion that ends the saan-tayo loop. |
| **Type** | Mobile-first AI-integrated Progressive Web App (PWA) |
| **Tech Classification** | Full-Stack Web App with Real-Time AI Recommendation Engine |
| **Target Hackathon Duration** | 1 day (approx. 8–10 hours of active dev) |
| **Demo Mode** | Yes — smoke & mirrors applied to complex/non-essential features |

---

## 2. PROBLEM STATEMENT

The question *"Saan tayo?"* triggers decision fatigue in Filipino group settings daily. Existing platforms (Google Maps, food delivery apps, Klook, TripAdvisor) are:

- Built for single users, not groups
- Designed for browsing, not deciding
- Blind to local MSMEs and hidden gems
- Incapable of reconciling multi-person preferences in real time

Decision fatigue (Baumeister et al., 1998) combined with the paradox of choice (Schwartz, 2004) creates a cycle where groups default to familiar chains — costing local businesses customers who were already nearby and already looking.

MSMEs represent **99.5% of all Philippine business establishments** (DTI, 2023) yet have near-zero digital discovery presence.

---

## 3. PROPOSED SOLUTION

**Aya** is a mobile-first web application that eliminates group dining decision fatigue through:

1. **Swipe-based discovery** — Tinder-style cards for restaurants/spots
2. **Real-time group sessions** — Everyone swipes independently; Aya finds the match
3. **AI vibe intelligence** — NVIDIA NIM (Gemma4 31b-IT) tags, filters, and resolves preferences
4. **Local-first data** — Community pins surface hidden gems beyond corporate listings
5. **Zero friction** — No download, no mandatory account, shareable session links

---

## 4. PROJECT SCOPE

### 4.1 In-Scope (Will Be Built)
| Feature | Priority | Notes |
|---|---|---|
| Kwentuhan onboarding flow | P0 | Core UX — context collection |
| Solo swipe mode | P0 | Core feature |
| Barkada group session (Supabase Realtime) | P0 | Core differentiator |
| AI vibe tag generation (NVIDIA NIM) | P0 | Key AI feature |
| Match/reveal screen with animation | P0 | Demo moment |
| Aya Decides tiebreaker | P1 | Behavioral scoring |
| Session lobby (waiting room) | P1 | Group UX |
| Balik Mo To (undo) | P1 | Simple UX |
| Basic session history | P2 | Nice-to-have |

### 4.2 Out-of-Scope / Smoke & Mirrors (Faked for Demo)
| Feature | Approach | Notes |
|---|---|---|
| Lakbay/Itinerary mode | Hardcoded itinerary cards | AI-composed look, static data |
| Local Business Listing Portal | Static UI only | Form renders, no backend save |
| Drop a Pin (community pin) | UI + fake success state | No real verification queue |
| Lokal Intel verification queue | Admin UI mockup only | Not wired |
| Aya Memory (adaptive learning) | Fake persistence via localStorage | No real ML |
| Real-time deals badge | Hardcoded deal data in seed | No business backend |
| MSME verification system | Not built | Not shown in demo |
| Admin dashboard | Not built | Not shown in demo |

> See `SMOKE_AND_MIRRORS.md` for full deception architecture.

---

## 5. TEAM ROLES & DELEGATION

| Role | Responsibility | Track in PROGRESS.md |
|---|---|---|
| **Frontend Lead** | Swipe UI, onboarding, animations (Framer Motion) | FRONTEND |
| **Backend Lead** | Supabase schema, API routes, session logic | BACKEND |
| **AI/Integration Lead** | NVIDIA NIM API, vibe tag engine, Aya Decides | AI |
| **Full Stack / Glue** | Connecting frontend to backend, realtime hooks | INTEGRATION |
| **Polish / Demo Lead** | Smoke & mirrors features, seed data, demo flow | DEMO |

> Adjust based on actual team size. In a 3-person team: Frontend Lead covers FRONTEND + DEMO, Backend Lead covers BACKEND + INTEGRATION, AI Lead covers AI.

---

## 6. TECH STACK

| Layer | Technology | Reason |
|---|---|---|
| **Framework** | Next.js 14 (App Router) + TypeScript | Fast SSR, API routes, Vercel-native |
| **Styling** | Tailwind CSS | Rapid mobile-first UI |
| **Animations** | Framer Motion | Swipe gestures, card transitions |
| **Backend/DB** | Supabase (PostgreSQL + Realtime) | WebSocket sessions, anonymous auth |
| **AI Engine** | NVIDIA NIM API (Gemma4 31b-IT model) | Free tier, OpenAI-compatible |
| **Maps (fake)** | Leaflet.js + OpenStreetMap | Used in Lakbay mockup only |
| **Places Data** | Seeded mock data (Google Places shape) | Avoids API billing during hackathon |
| **Deployment** | Vercel | Instant deploy, Next.js native |
| **Version Control** | GitHub | Collaboration |

### NVIDIA NIM API Details
```
Base URL:  https://integrate.api.nvidia.com/v1
Endpoint:  /chat/completions
Model:     google/gemma-3-27b-it  (check NIM dashboard for exact Gemma4 31b slug)
Auth:      Bearer {NVIDIA_API_KEY}
Format:    OpenAI-compatible
```
> Check https://build.nvidia.com/explore/discover for current model slugs. The proposal references "Gemma4 31b-IT" — map to the closest available on your NIM account.

---

## 7. ENVIRONMENT VARIABLES REQUIRED

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# NVIDIA NIM
NVIDIA_API_KEY=
NVIDIA_NIM_MODEL=google/gemma-3-27b-it

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 8. SUCCESS CRITERIA (HACKATHON)

The project is considered demo-ready when:

- [ ] A judge can open the app on their phone via a shared URL
- [ ] Solo mode shows swipeable cards with AI vibe tags
- [ ] Barkada mode creates a session, shares a code, and two devices can swipe independently
- [ ] A match screen appears with animation after both devices finish
- [ ] "Aya Decides" button resolves a tie
- [ ] Lakbay (itinerary) mode shows a convincing hardcoded full-day plan
- [ ] Drop a Pin shows a form with a fake success state
- [ ] App does not crash during a 5-minute demo

---

## 9. RISK REGISTER

| Risk | Likelihood | Mitigation |
|---|---|---|
| NVIDIA NIM rate limit during demo | Medium | Cache responses, pre-generate tags at seed time |
| Supabase Realtime drops connection | Low | Add reconnection logic, test on mobile data |
| WebSocket sync fails across different networks | Medium | Demo on same WiFi; fallback to polling |
| Swipe animations jank on judge's device | Medium | Test on mid-range Android, reduce particle effects |
| Google Places API billing | High | Use seeded mock data instead — not real API |
| Time runs out before group mode is wired | Medium | Solo mode must always be fully working |

---

## 10. JUDGING CRITERIA ALIGNMENT

| Criterion | Weight | Our Strategy |
|---|---|---|
| **Concept** (depth, originality, system structure) | 40% | Stress real-time multi-user swipe sync + AI tiebreaker in pitch |
| **Societal & Practical Impact** | 20% | DTI MSME stat (99.5%), SDG 11 alignment, local gem discovery angle |
| **Theme Alignment** | 20% | Directly addresses hackathon innovation theme via AI + community |
| **Presentation & Communication** | 20% | Clean demo flow, Filipino-language UI copy, polished mockups |

---

## 11. TIMELINE (HACKATHON DAY)

| Time Block | Tasks | Owner |
|---|---|---|
| 00:00 – 00:30 | Project setup, env vars, Supabase project, GitHub init | Backend Lead |
| 00:30 – 01:00 | DB schema + seed data, NVIDIA NIM test call | AI Lead |
| 01:00 – 02:30 | Kwentuhan onboarding + Solo swipe deck | Frontend Lead |
| 02:30 – 04:00 | Barkada session manager + Supabase Realtime | Backend + Integration |
| 04:00 – 05:00 | AI vibe tag API route + card integration | AI Lead |
| 05:00 – 06:00 | Match/reveal screen + Aya Decides | Frontend + Integration |
| 06:00 – 07:00 | Smoke & mirrors: Lakbay, Drop a Pin, History | Demo Lead |
| 07:00 – 08:00 | Polish, Framer Motion, mobile testing, seed data | All |
| 08:00 – 09:00 | Buffer / deployment / demo rehearsal | All |

---

## 12. REFERENCES

- Baumeister et al. (1998). Ego depletion. *Journal of Personality and Social Psychology.*
- Chu et al. (2024). Decision fatigue in food/leisure markets. *Sustainability.*
- DTI (2023). *2023 Philippine MSME Statistics.*
- Lubos et al. (2025). LLM-Enhanced group recommender systems. *arXiv.*
- Schwartz (2004). *The Paradox of Choice.*
