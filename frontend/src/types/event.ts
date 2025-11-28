// frontend/src/types/event.ts
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
  status?: "pending" | "approved" | "rejected";
  distanceKm?: number;
}
