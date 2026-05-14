# FRONTEND UPDATE: OUTING TYPE SELECTOR (LANDING PAGE)

## 1. Architectural Pivot
* [cite_start]Instead of creating standalone files, the "Outing Type Selector" is moved directly into the `app/onboarding/page.tsx` file[cite: 23]. 
* [cite_start]The `app/onboarding/page.tsx` file acts as a stateful controller for the Kwentuhan flow[cite: 25].
* [cite_start]It manages a step state (e.g., `step === 1` for Outing Type, `step === 2` for Mode Selector)[cite: 26].
* [cite_start]This approach eliminates the need to build `components/ui/OutingTypeSelector.tsx` and `components/ui/SearchInput.tsx` as separate component files[cite: 29].

## 2. Updated Flow and Views
* [cite_start]**Step 1 View (Inside `page.tsx`):** This is the first screen the user sees at `/onboarding`[cite: 14]. [cite_start]It features the four main category tiles (Food & Drinks, Activities, Explore, Full Day), the natural language search bar, and the skip button[cite: 11, 27].
* [cite_start]**Step 2 View (Inside `page.tsx`):** If the user selects "Food & Drinks" and clicks Next, the state updates to render the existing `ModeSelector.tsx` (Solo/Barkada/Lakbay)[cite: 12, 15, 28].

## 3. Interaction Logic
* [cite_start]Selecting "Food & Drinks" and clicking "Next" transitions the UI to the ModeSelector[cite: 15].
* [cite_start]Selecting other options can either trigger a "Coming Soon" toast for the hackathon or route directly to the Lakbay smoke-and-mirrors flow[cite: 16].
* [cite_start]Selecting "Surprise Me" bypasses the onboarding entirely and jumps straight to a randomized Solo swipe deck[cite: 17].

## 4. Context Processing (Kwentuhan → AI Filter)
* [cite_start]The onboarding flow collects data in a strict, two-step sequence[cite: 18].

## 5. Design
``
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
``