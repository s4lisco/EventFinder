// Kanonische Kategorie-Liste — muss mit dem Frontend (EventForm.tsx) synchron gehalten werden.
export const EVENT_CATEGORIES = [
  'music',
  'sports',
  'family',
  'arts',
  'food',
  'culture',
  'outdoor',
  'education',
  'community',
  'other',
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];
