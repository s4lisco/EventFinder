// frontend/src/components/FlyerUpload.tsx
import { useState, useRef, useCallback } from "react";
import { EventFormValues } from "./EventForm";

interface ExtractedEventData {
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
  needsManualReview: boolean;
  extractedText?: string;
  confidence?: number;
}

interface FlyerUploadProps {
  onExtractedData: (data: Partial<EventFormValues>) => void;
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function FlyerUpload({ onExtractedData }: FlyerUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [needsReview, setNeedsReview] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type. Allowed: JPEG, PNG, GIF, WebP, PDF`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size: 10MB`;
    }
    return null;
  };

  const processFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);
    setNeedsReview(false);
    setConfidence(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

      const response = await fetch(`${baseUrl}/flyer/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Upload failed (${response.status})`);
      }

      const data: ExtractedEventData = await response.json();

      // Convert extracted data to form values
      const formValues: Partial<EventFormValues> = {};

      if (data.title) formValues.title = data.title;
      if (data.description) formValues.description = data.description;
      if (data.startDate) {
        // Convert ISO date to datetime-local format (YYYY-MM-DDTHH:mm)
        const date = new Date(data.startDate);
        if (!isNaN(date.getTime())) {
          formValues.startDate = date.toISOString().slice(0, 16);
        }
      }
      if (data.endDate) {
        const date = new Date(data.endDate);
        if (!isNaN(date.getTime())) {
          formValues.endDate = date.toISOString().slice(0, 16);
        }
      }
      if (data.category) formValues.category = data.category;
      if (data.priceInfo) formValues.priceInfo = data.priceInfo;
      if (data.locationName) formValues.locationName = data.locationName;
      if (data.address) formValues.address = data.address;
      if (data.latitude) formValues.latitude = data.latitude;
      if (data.longitude) formValues.longitude = data.longitude;
      if (data.website) formValues.website = data.website;
      if (data.organizerName) formValues.organizerName = data.organizerName;

      onExtractedData(formValues);

      setNeedsReview(data.needsManualReview);
      setConfidence(data.confidence ?? null);

      if (data.needsManualReview) {
        setSuccess(
          "Data extracted but requires manual review. Some fields may be missing or inaccurate."
        );
      } else {
        setSuccess(
          `Event data extracted successfully${data.confidence ? ` (${data.confidence}% confidence)` : ""}!`
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to process flyer: ${message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-700">
          Upload Event Flyer (Optional)
        </label>
        {confidence !== null && (
          <span
            className={`text-[11px] font-medium ${
              confidence >= 70
                ? "text-emerald-600"
                : confidence >= 40
                  ? "text-amber-600"
                  : "text-red-500"
            }`}
          >
            {confidence}% confidence
          </span>
        )}
      </div>

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors
          ${
            isDragging
              ? "border-emerald-500 bg-emerald-50"
              : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
          }
          ${uploading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            <p className="text-sm text-slate-600">Processing flyer...</p>
            <p className="text-[11px] text-slate-400">
              Extracting text and analyzing event details
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <svg
              className="h-8 w-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-slate-700">
                {isDragging ? "Drop file here" : "Drop flyer here or click to upload"}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                JPEG, PNG, GIF, WebP, or PDF (max 10MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div
          className={`rounded-xl border px-3 py-2 text-xs ${
            needsReview
              ? "border-amber-100 bg-amber-50 text-amber-700"
              : "border-emerald-100 bg-emerald-50 text-emerald-700"
          }`}
        >
          {success}
        </div>
      )}

      <p className="text-[11px] text-slate-500">
        Upload an event flyer to automatically extract event details using AI.
        The form below will be pre-filled with extracted information.
      </p>
    </div>
  );
}
