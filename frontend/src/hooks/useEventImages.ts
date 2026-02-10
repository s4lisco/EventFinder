// frontend/src/hooks/useEventImages.ts
import { useState } from "react";
import { EventImage } from "@/types/event";

interface UseEventImagesResult {
  uploadImages: (eventId: string, files: File[]) => Promise<EventImage[] | null>;
  deleteImage: (eventId: string, imageId: string) => Promise<boolean>;
  uploading: boolean;
  error: string | null;
}

export function useEventImages(token?: string): UseEventImagesResult {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  const uploadImages = async (
    eventId: string,
    files: File[],
  ): Promise<EventImage[] | null> => {
    if (!token) {
      setError("Not authenticated");
      return null;
    }

    if (files.length === 0) {
      return [];
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch(`${baseUrl}/events/${eventId}/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to upload images (${res.status})`);
      }

      const data = await res.json();
      return data as EventImage[];
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (
    eventId: string,
    imageId: string,
  ): Promise<boolean> => {
    if (!token) {
      setError("Not authenticated");
      return false;
    }

    setError(null);

    try {
      const res = await fetch(`${baseUrl}/events/${eventId}/images/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to delete image (${res.status})`);
      }

      return true;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      return false;
    }
  };

  return { uploadImages, deleteImage, uploading, error };
}
