// frontend/src/components/EventForm.tsx
import {FormEvent, useEffect, useState} from "react";
import { EventImage } from "@/types/event";
import ImageUploadField from "./ImageUploadField";

export interface EventFormValues {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    category: string;
    priceInfo: string;
    locationName: string;
    address: string;
    latitude: string;
    longitude: string;
    website: string;
    images: string[];
    organizerName: string;
}

interface EventFormProps {
    mode: "create" | "edit";
    initialValues: EventFormValues;
    submitting: boolean;
    error: string | null;
    onSubmit: (values: EventFormValues) => Promise<void> | void;
    // New props for image upload
    eventId?: string;
    existingImages?: EventImage[];
    selectedFiles?: File[];
    onFilesChange?: (files: File[]) => void;
    onDeleteImage?: (imageId: string) => Promise<void>;
    showImageUpload?: boolean;
}

interface ValidationErrors {
    [key: string]: string;
}

const CATEGORY_OPTIONS = [
    {value: "", label: "Select a category"},
    {value: "music", label: "Music"},
    {value: "sports", label: "Sports"},
    {value: "family", label: "Family"},
    {value: "arts", label: "Arts & Culture"},
    {value: "food", label: "Food & Drink"},
];

export default function EventForm({
                                      mode,
                                      initialValues,
                                      submitting,
                                      error,
                                      onSubmit,
                                      eventId,
                                      existingImages = [],
                                      selectedFiles = [],
                                      onFilesChange = () => {},
                                      onDeleteImage = async () => {},
                                      showImageUpload = false,
                                  }: EventFormProps) {
    const [values, setValues] = useState<EventFormValues>(initialValues);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [geocodingLoading, setGeocodingLoading] = useState(false);

    useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    useEffect(() => {
        setSubmitError(error);
    }, [error]);

    const handleChange = (
        field: keyof EventFormValues,
        value: string | string[],
    ) => {
        setValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleImageChange = (index: number, value: string) => {
        setValues((prev) => {
            const next = [...prev.images];
            next[index] = value;
            return {...prev, images: next};
        });
    };

    const handleAddImageField = () => {
        setValues((prev) => ({
            ...prev,
            images: [...prev.images, ""],
        }));
    };

    const handleRemoveImageField = (index: number) => {
        setValues((prev) => {
            const next = [...prev.images];
            next.splice(index, 1);
            return {...prev, images: next.length ? next : [""]};
        });
    };

    const geocodeAddress = async () => {
        if (!values.address.trim()) {
            alert("Please enter an address.");
            return;
        }

        setGeocodingLoading(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(values.address)}`
            );
            const data = await response.json();

            if (data.length > 0) {
                const {lat, lon} = data[0];
                handleChange("latitude", lat);
                handleChange("longitude", lon);
            } else {
                alert("Address not found. Please try a different address.");
            }
        } catch {
            alert("Geocoding error. Please try again later.");
        } finally {
            setGeocodingLoading(false);
        }
    };

    const validate = (): boolean => {
        const errors: ValidationErrors = {};

        if (!values.title.trim()) errors.title = "Title is required";
        if (!values.description.trim())
            errors.description = "Description is required";
        if (!values.startDate) errors.startDate = "Start date and time are required";
        if (!values.category) errors.category = "Category is required";
        if (!values.locationName.trim())
            errors.locationName = "Location name is required";
        if (!values.address.trim()) errors.address = "Address is required";
        if (!values.latitude) errors.latitude = "Latitude is required";
        if (!values.longitude) errors.longitude = "Longitude is required";

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by this browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                handleChange("latitude", String(pos.coords.latitude));
                handleChange("longitude", String(pos.coords.longitude));
            },
            () => {
                alert("Unable to determine your location.");
            },
        );
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        if (!validate()) return;

        try {
            await onSubmit(values);
        } catch (err: any) {
            setSubmitError(err.message || "Failed to save event");
        }
    };

    const titleLabel = mode === "create" ? "Create Event" : "Update Event";

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-card bg-white p-4 shadow-soft"
        >
            <h2 className="text-base font-semibold text-text">{titleLabel}</h2>

            {submitError && (
                <div className="rounded-card border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-700">
                    {submitError}
                </div>
            )}

            {/* Title */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-text">
                    Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={values.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="input"
                    placeholder="Event Title"
                />
                {validationErrors.title && (
                    <p className="text-[11px] text-red-500">
                        {validationErrors.title}
                    </p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-text">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={values.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="min-h-[96px] w-full rounded-card border-2 border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-muted transition-all duration-150 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                    placeholder="Describe your event, what to expect, etc."
                />
                {validationErrors.description && (
                    <p className="text-[11px] text-red-500">
                        {validationErrors.description}
                    </p>
                )}
            </div>

            {/* Dates */}
            <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-text">
                        Start Date &amp; Time <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="datetime-local"
                        value={values.startDate}
                        onChange={(e) => handleChange("startDate", e.target.value)}
                        className="input"
                    />
                    {validationErrors.startDate && (
                        <p className="text-[11px] text-red-500">
                            {validationErrors.startDate}
                        </p>
                    )}
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-text">
                        End Date &amp; Time
                    </label>
                    <input
                        type="datetime-local"
                        value={values.endDate}
                        onChange={(e) => handleChange("endDate", e.target.value)}
                        className="input"
                    />
                </div>
            </div>

            {/* Category + price */}
            <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-text">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={values.category}
                        onChange={(e) => handleChange("category", e.target.value)}
                        className="input"
                    >
                        {CATEGORY_OPTIONS.map((opt) => (
                            <option key={opt.value || "all"} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    {validationErrors.category && (
                        <p className="text-[11px] text-red-500">
                            {validationErrors.category}
                        </p>
                    )}
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-text">
                        Price Info
                    </label>
                    <input
                        type="text"
                        value={values.priceInfo}
                        onChange={(e) => handleChange("priceInfo", e.target.value)}
                        className="input"
                        placeholder="e.g. Free, $15 entry, etc."
                    />
                </div>
            </div>

            {/* Location */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-text">
                    Location Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={values.locationName}
                    onChange={(e) => handleChange("locationName", e.target.value)}
                    className="input"
                    placeholder="Venue, Park, etc."
                />
                {validationErrors.locationName && (
                    <p className="text-[11px] text-red-500">
                        {validationErrors.locationName}
                    </p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-xs font-medium text-text">
                    Address <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={values.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        className="input flex-1"
                        placeholder="Street, number, city"
                    />
                    <button
                        type="button"
                        onClick={geocodeAddress}
                        disabled={geocodingLoading}
                        className="btn-primary px-4 py-2"
                    >
                        {geocodingLoading ? "…" : "Lookup"}
                    </button>
                </div>
                {validationErrors.address && (
                    <p className="text-[11px] text-red-500">
                        {validationErrors.address}
                    </p>
                )}
            </div>

            {/* Coordinates */}
            <div className="space-y-1 rounded-card bg-surface p-3">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-text">
                        Coordinates (auto-filled from address)
                    </p>
                    <button
                        type="button"
                        onClick={handleUseMyLocation}
                        className="text-[11px] font-medium text-primary hover:opacity-80"
                    >
                        Use my location
                    </button>
                </div>
                <div className="mt-2 grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-[11px] text-text-muted">
                            Latitude <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.000001"
                            value={values.latitude}
                            onChange={(e) => handleChange("latitude", e.target.value)}
                            className="input"
                        />
                        {validationErrors.latitude && (
                            <p className="text-[11px] text-red-500">
                                {validationErrors.latitude}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] text-text-muted">
                            Longitude <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.000001"
                            value={values.longitude}
                            onChange={(e) => handleChange("longitude", e.target.value)}
                            className="input"
                        />
                        {validationErrors.longitude && (
                            <p className="text-[11px] text-red-500">
                                {validationErrors.longitude}
                            </p>
                        )}
                    </div>
                </div>
                <p className="mt-1 text-[11px] text-text-muted">
                    Coordinates are auto-filled from the address or can be adjusted manually.
                </p>
            </div>

            {/* Organizer name */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-text">
                    Organizer Name
                </label>
                <input
                    type="text"
                    value={values.organizerName}
                    onChange={(e) => handleChange("organizerName", e.target.value)}
                    className="input"
                    placeholder="Your name or organization"
                />
            </div>

            {/* Website */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-text">
                    Website (optional)
                </label>
                <input
                    type="url"
                    value={values.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    className="input"
                    placeholder="https://example.com"
                />
            </div>

            {/* Images - Use new upload component if enabled, otherwise fallback to URL inputs */}
            {showImageUpload ? (
                <ImageUploadField
                    existingImages={existingImages}
                    onDelete={onDeleteImage}
                    selectedFiles={selectedFiles}
                    onFilesChange={onFilesChange}
                    disabled={submitting}
                />
            ) : (
                <div className="space-y-1">
                    <label className="text-xs font-medium text-text">
                        Image URLs (optional)
                    </label>
                    <p className="text-[11px] text-text-muted">
                        Add links to images. The first image will be used as the cover.
                    </p>
                    <div className="space-y-2">
                        {values.images.map((img, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="url"
                                    value={img}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                    className="input flex-1"
                                    placeholder="https://…"
                                />
                                {values.images.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImageField(index)}
                                        className="rounded-full border-2 border-border bg-white px-2 py-1 text-xs text-text-muted hover:bg-surface"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleAddImageField}
                        className="mt-1 text-[11px] font-medium text-primary hover:opacity-80"
                    >
                        + Add another image
                    </button>
                </div>
            )}

            {/* Submit */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full"
                >
                    {submitting
                        ? mode === "create"
                            ? "Creating…"
                            : "Saving…"
                        : mode === "create"
                            ? "Create Event"
                            : "Save Changes"}
                </button>
            </div>
        </form>
    );
}
