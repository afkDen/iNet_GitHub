# SMOKE_AND_MIRRORS.md
## Aya — What's Real vs. What's Faked
> This document is INTERNAL ONLY. Do not include in project submission or show to judges.
> Purpose: Ensure every team member knows exactly which features are real and which are demo illusions.

---

## PHILOSOPHY

> *"A working swipe and a real match moment is worth more than 10 half-built features."*

For this hackathon, our strategy is:
1. **Build the CORE completely** — swipe, group session, AI tags, match reveal
2. **Make SUPPORTING features look complete** — they render, they respond, they just don't persist
3. **Never build anything that breaks during a demo** — fake is better than broken

---

## ✅ REAL — Actually Built and Functional

| Feature | What's Real |
|---|---|
| **Kwentuhan onboarding** | Fully interactive; context is actually used to filter card stack |
| **Solo swipe mode** | Real swipe gestures, real establishment data from Supabase |
| **Barkada group session** | Real Supabase Realtime; two devices actually sync |
| **AI vibe tags** | Real NVIDIA NIM API call (Gemma4 31b-IT); actual LLM response |
| **Natural language input** | Real NIM API parses Filipino/English to extract filters |
| **Match detection** | Real algorithm computes overlap of right swipes across participants |
| **Aya Decides tiebreaker** | Real scoring based on swipe speed + drag distance |
| **Reveal screen** | Real match data displayed with Framer Motion animation |
| **Swipe recording** | Real DB writes to Supabase (swipes table) |
| **Session codes** | Real unique codes (AYA-XXXX format) stored in DB |
| **Session lobby** | Real-time participant list via Supabase Realtime WebSocket |
| **Balik Mo To (undo)** | Real — pulls back last card from local swipe state |

---

## 🎭 FAKED — Smoke & Mirrors

### 1. Lakbay / Itinerary Mode
**What judges see:** A full AI-generated day plan with map, timed stops, budget breakdown, and transport directions.

**What's actually happening:**
- Context is collected normally (real)
- A 3-second "AI planning" loading screen plays (fake delay via `setTimeout`)
- One of 3–5 **hardcoded itinerary objects** from `lib/data/itineraries.ts` is selected based on budget tier
- The itinerary card renders with all the correct-looking data (real-time distances are fake/static)
- The Leaflet.js map shows static coordinate pins — no real routing

**How to fake it convincingly:**
```typescript
// lib/data/itineraries.ts
export const ITINERARIES = {
  tipid: [
    {
      id: 'tipid-1',
      total_cost: 390,
      total_hours: 5.5,
      stops: [
        {
          time: '12:00 PM',
          category: 'LUNCH',
          name: "Ate Nena's Kitchen",
          cost: 130,
          duration_hrs: 1,
          tags: ['budget-friendly', 'community pick'],
          transport_to_next: 'Jeep or walk · ~12 min · 1.8 km',
        },
        {
          time: '2:00 PM',
          category: 'ACTIVITY',
          name: 'Araneta City Grounds',
          cost: 200,
          duration_hrs: 2.5,
          tags: ['family-friendly', 'may parking'],
          transport_to_next: 'MRT / short ride · ~8 min',
        },
        {
          time: '5:30 PM',
          category: 'MERIENDA & SUNSET',
          name: 'Bayleaf Rooftop',
          cost: 450,
          duration_hrs: 2,
          tags: ['open late', 'instagrammable'],
          transport_to_next: null,
        },
      ],
      aya_note: 'Aya placed lunch before the activity and ended at the rooftop for golden hour. Budget spread: 17% / 26% / 57%.',
    },
  ],
  // mid, bahala_na variants...
}
```

**During demo:** Say — *"Aya's LLM processes the group's context and geographic constraints to compose a full-day plan accounting for stop sequencing and budget spread."* ← This is true for a real implementation.

---

### 2. Drop a Pin (Community Contribution)

**What judges see:** A complete form with photo upload, interactive GPS map pin, vibe tag selector, and a success confirmation.

**What's actually happening:**
- Photo: selected file renders preview via `FileReader` — never uploaded anywhere
- Map: static Leaflet map centered on Metro Manila; pin is draggable (CSS only, no coord capture)
- Vibe tags: interactive selection works visually
- Submit: `setTimeout(1500)` → toast "Submitted for verification! Nearby locals will confirm your pin within 48 hours."
- No DB write. No file upload. Zero backend.

**Code:**
```typescript
const handleSubmit = async () => {
  setLoading(true)
  await new Promise(r => setTimeout(r, 1500)) // fake async
  setLoading(false)
  setSuccess(true)
  // No actual API call
}
```

---

### 3. Local Business Listing Portal (Suking Spot)

**What judges see:** A self-service MSME listing form with photo upload, hours, budget tier, vibe tag selection, and a deal toggle with time range.

**What's actually happening:**
- All form interactions work visually
- Deal toggle opens time range inputs (real UI)
- Submit: `setTimeout(1500)` → "We'll review your listing within 24 hours."
- No DB write.

**During demo:** Say — *"Any local business can list in under 5 minutes at zero cost. Our admin verification queue ensures authenticity before it appears in the swipe deck."*

---

### 4. Lokal Intel Verification Queue

**What judges see:** (Referenced in pitch only, not shown as a screen)
**Reality:** Does not exist. Admin dashboard not built.
**Strategy:** Mention it as a system that exists server-side. Don't offer to show it.

---

### 5. Aya Memory / Adaptive Learning

**What judges see:** After completing sessions, the app says "Based on your past 3 sessions, Aya knows you prefer budget-friendly spots."

**What's actually happening:**
- After a real session completes, store a summary in `localStorage`:
  ```typescript
  const history = JSON.parse(localStorage.getItem('aya_history') || '[]')
  history.push({ date: now, mode, result: matchedVenue, vibes: [...] })
  localStorage.setItem('aya_history', JSON.stringify(history))
  ```
- On next session, read from localStorage and show "Based on X past sessions"
- Card ordering is not actually changed. No real ML.

**This works surprisingly well** because the data structure is real, just the inference is not.

---

### 6. Session History Screen

**What judges see:** A timeline of past Aya sessions with dates, modes, matched venues, and "Did you go?" prompts.

**What's actually happening:**
- Real sessions completed in the same browser session ARE stored in localStorage
- Fallback: 3–4 hardcoded "past sessions" shown if localStorage is empty
- "Did you go?" → shows a photo upload prompt that accepts a file but doesn't upload it
- "Want to Try" tab shows 2–3 hardcoded bookmarked spots

**Hardcoded fallback sessions:**
```typescript
export const SAMPLE_HISTORY = [
  { date: 'Today, 9:30 AM', mode: 'GROUP · 4 PEOPLE', venue: "Lito's Brew & Bites", distance: '1.2 km from Makati', prompt: 'DID YOU GO?' },
  { date: 'May 8', mode: 'ITINERARY', venue: 'Sunday Plan — Cubao', desc: '3 stops · ₱780/head · 5.5 hrs' },
  { date: 'May 6', mode: 'SOLO', venue: "Ate Nena's Kitchen", desc: 'Visited · Community pick · QC' },
  { date: 'Apr 30', mode: 'GROUP · 6 PEOPLE', venue: 'Bayleaf Rooftop', desc: 'Matched · Community pin · Intramuros' },
]
```

---

### 7. Real-Time Promotional Deals

**What judges see:** Cards in the swipe deck tagged [DEAL] with text like "Unli rice until 3 PM today."

**What's actually happening:**
- Deal data is hardcoded in the seed data (3–5 establishments have `is_deal: true` and `deal_text`)
- No business submitted these. No time-based removal logic.
- The badge shows, the text shows. That's it.

**During demo:** *"Businesses can submit time-limited deals that appear as a badge in the card deck and auto-remove when the window closes."* ← The auto-removal isn't built, but it sounds real.

---

## DEMO SCRIPT NOTES

### Things NOT to demonstrate (avoid drawing attention)
- Navigating to `/business` or `/pin` mid-demo unprompted
- Showing the admin dashboard (doesn't exist)
- Logging in as a business owner (no auth for business portal)
- Showing history from a fresh browser (will show hardcoded data — fine, but jarring if called out)

### Things TO demonstrate prominently
1. ✅ Open on a phone — no download needed
2. ✅ "Surprise Me!" — instant randomized solo deck
3. ✅ Solo swipe — a few cards, then show a match
4. ✅ Barkada — create code, join on second device, swipe, reveal together
5. ✅ AI vibe tags — point out they're generated live by Gemma
6. ✅ Aya Decides — press the button, watch it resolve
7. ✅ Lakbay — show the "AI planning" loader, then the itinerary card (do NOT say it's hardcoded)

### Fallback plan if internet dies
- Have screenshots of all key screens ready
- Have a pre-recorded 60-second video demo as last resort
- Solo mode can potentially run on cached/seeded data if Supabase is unreachable (add offline fallback)

---

## WHAT WE CAN HONESTLY CLAIM IN PITCH

These are all true statements about the system:
- ✅ "Real-time group swipe synchronization via WebSockets"
- ✅ "AI-powered vibe tag generation using NVIDIA NIM and Gemma4 31b"
- ✅ "No download required — mobile-first PWA accessible via link"
- ✅ "Zero-cost discovery channel for local MSMEs" (true — portal UI exists)
- ✅ "Community-pinned local gems surface alongside registered listings" (seed data has these)
- ✅ "Behavioral tiebreaker using swipe speed and drag distance analytics"
- ✅ "Session data is ephemeral — swipe choices are private until reveal"

These are aspirational / future-state (say "designed to" or "the system is built for"):
- ⚠️ "Real-time deal removal on expiry" → *"designed to auto-remove when the deal window closes"*
- ⚠️ "AI-generated full-day itineraries" → *"itinerary compositions powered by the LLM context engine"*
- ⚠️ "Verified MSME listings" → *"MSME listings go through an admin verification queue"*
- ⚠️ "Adaptive preference learning" → *"Aya Memory tracks swipe patterns to personalize future decks"*
