// frontend/src/types/event.ts
export interface EventImage {
  id: string;
  eventId: string;
  storageKey: string;
  url: string;
  position: number;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  category: string;
  priceInfo?: string | null;
  locationName: string;
  address: string;
  latitude: number;
  longitude: number;
  organizerName: string;
  website?: string | null;
  images?: string[] | null;
  eventImages?: EventImage[];
  status?: "pending" | "approved" | "rejected";
  distanceKm?: number;
}
