export type SessionMode = 'solo' | 'barkada' | 'lakbay';
export type OutingType = 'food' | 'activities' | 'explore' | 'full_day';
export type BudgetTier = 'tipid' | 'mid' | 'bahala_na';

export type Establishment = {
    id: string;
    name: string;
    category: 'restaurant' | 'cafe' | 'activity' | 'bar' | 'carinderia' | 'bakery';
    address: string;
    barangay?: string;
    city: string;
    lat: number;
    lng: number;
    cost_min: number;
    cost_max: number;
    is_open: boolean;
    opens_at: string;
    closes_at: string;
    vibe_tags: string[];
    photo_url: string;
    is_community_pin: boolean;
    is_deal: boolean;
    deal_text?: string;
    community_confirms: number;
    created_at?: string;
};

export type SessionContext = {
    mode: SessionMode;
    outing_type: OutingType;
    group_size: number;
    budget: BudgetTier;
    distance_km: number;
    time_of_day: 'lunch' | 'merienda' | 'dinner' | 'anytime';
    natural_language?: string;
};

export type Session = {
    id: string;
    code: string;
    mode: SessionMode;
    status: 'active' | 'matched' | 'expired';
    context: SessionContext;
    matched_id?: string;
    card_stack: string[];
    created_at: string;
    expires_at: string;
};

export type Participant = {
    id: string;
    session_id: string;
    nickname: string;
    status: 'joined' | 'swiping' | 'done';
    created_at: string;
};

export type SwipeRecord = {
    id: string;
    session_id: string;
    participant_id: string;
    establishment_id: string;
    direction: 'left' | 'right';
    speed_ms: number;
    drag_distance: number;
    created_at: string;
};

export type MatchResult = {
    establishment: Establishment;
    right_swipe_count: number;
    enthusiasm_score: number;
    participant_swipes: SwipeRecord[];
};

export type ItineraryStop = {
    time: string;
    category: string;
    name: string;
    cost_per_head: number;
    duration_hrs: number;
    tags: string[];
    transport_to_next: string;
    lat: number;
    lng: number;
};

export type Itinerary = {
    id: string;
    budget_tier: 'tipid' | 'mid' | 'bahala_na';
    total_cost_per_head: number;
    total_hours: number;
    aya_note: string;
    stops: ItineraryStop[];
};
