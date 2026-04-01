import { useState, useRef, useEffect } from "react";
import { EventImage } from "@/types/event";

interface ImageUploadFieldProps {
  existingImages: EventImage[];
  onDelete: (imageId: string) => Promise<void>;
  selectedFiles: File[];
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
}

export default function ImageUploadField({
  existingImages,
  onDelete,
  selectedFiles,
  onFilesChange,
  disabled,
}: ImageUploadFieldProps) {
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalImageCount = existingImages.length + selectedFiles.length;
  const canAddMore = totalImageCount < 3;

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 3 - existingImages.length - selectedFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    // Validate file types and sizes
    const validFiles: File[] = [];
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of filesToAdd) {
      if (!allowedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported. Allowed types: JPEG, PNG, WebP, GIF`);
        continue;
      }
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size: 5MB`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      const newFiles = [...selectedFiles, ...validFiles];
      onFilesChange(newFiles);

      // Generate preview URLs
      const newUrls = [...previewUrls];
      validFiles.forEach((file) => {
        newUrls.push(URL.createObjectURL(file));
      });
      setPreviewUrls(newUrls);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);

    // Clean up preview URL
    const newUrls = [...previewUrls];
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
  };

  const handleDeleteExisting = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    setDeletingIds((prev) => new Set(prev).add(imageId));
    try {
      await onDelete(imageId);
    } catch (error) {
      console.error("Failed to delete image:", error);
      alert("Failed to delete image");
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(imageId);
        return next;
      });
    }
  };

  return (
    <div className="space-y-2">
      <label className="font-body text-xs font-medium text-text">
        Images (max. 3)
      </label>
      <p className="font-body text-[11px] text-text-muted">
        Upload up to 3 images (JPEG, PNG, WebP, GIF, max. 5MB each)
      </p>

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {existingImages.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.url}
                alt={`Image ${image.position + 1}`}
                className="h-24 w-full rounded-lg object-cover border-2 border-border"
              />
              <button
                type="button"
                onClick={() => handleDeleteExisting(image.id)}
                disabled={deletingIds.has(image.id) || disabled}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {deletingIds.has(image.id) && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                  <span className="font-body text-xs text-text-muted">Deleting…</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={previewUrls[index]}
                alt={file.name}
                className="h-24 w-full rounded-lg object-cover border-2 border-primary border-dashed"
              />
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                disabled={disabled}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-[10px] px-1 rounded">
                New
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {canAddMore && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="w-full border-2 border-dashed border-border rounded-lg py-8 px-4 text-center font-body text-sm text-text-muted hover:border-primary hover:text-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Upload Images ({totalImageCount}/3)
          </button>
        </div>
      )}

      {totalImageCount >= 3 && (
        <p className="font-body text-[11px] text-text-muted">
          Maximum of 3 images reached
        </p>
      )}
    </div>
  );
}
