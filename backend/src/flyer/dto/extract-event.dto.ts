// backend/src/flyer/dto/extract-event.dto.ts
export class ExtractedEventDto {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  priceInfo?: string;
  locationName?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  website?: string;
  organizerName?: string;
  needsManualReview!: boolean;
  extractedText?: string;
  confidence?: number;
}
