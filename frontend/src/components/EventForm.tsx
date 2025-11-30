// frontend/src/components/EventForm.tsx
import {FormEvent, useEffect, useState} from "react";

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
}

interface ValidationErrors {
    [key: string]: string;
}

const CATEGORY_OPTIONS = [
    {value: "", label: "Select category"},
    {value: "music", label: "Music"},
    {value: "sports", label: "Sports"},
    {value: "family", label: "Family"},
    {value: "arts", label: "Arts & Culture"},
    {value: "food", label: "Food & Drinks"},
];

export default function EventForm({
                                      mode,
                                      initialValues,
                                      submitting,
                                      error,
                                      onSubmit,
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
            alert("Bitte geben Sie eine Adresse ein.");
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
                alert("Adresse nicht gefunden. Bitte versuchen Sie eine andere Adresse.");
            }
        } catch {
            alert("Fehler bei der Adressgeokodierung. Bitte versuchen Sie es später erneut.");
        } finally {
            setGeocodingLoading(false);
        }
    };

    const validate = (): boolean => {
        const errors: ValidationErrors = {};

        if (!values.title.trim()) errors.title = "Title is required";
        if (!values.description.trim())
            errors.description = "Description is required";
        if (!values.startDate) errors.startDate = "Start date & time is required";
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
                alert("Unable to detect your location.");
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

    const titleLabel = mode === "create" ? "Create event" : "Update event";

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl bg-white p-4 shadow-sm"
        >
            <h2 className="text-base font-semibold text-slate-900">{titleLabel}</h2>

            {submitError && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {submitError}
                </div>
            )}

            {/* Title */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                    Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={values.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="Event title"
                />
                {validationErrors.title && (
                    <p className="text-[11px] text-red-500">
                        {validationErrors.title}
                    </p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={values.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="min-h-[96px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="Describe your event, schedule, etc."
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
                    <label className="text-xs font-medium text-slate-700">
                        Start date &amp; time <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="datetime-local"
                        value={values.startDate}
                        onChange={(e) => handleChange("startDate", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    {validationErrors.startDate && (
                        <p className="text-[11px] text-red-500">
                            {validationErrors.startDate}
                        </p>
                    )}
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                        End date &amp; time
                    </label>
                    <input
                        type="datetime-local"
                        value={values.endDate}
                        onChange={(e) => handleChange("endDate", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                </div>
            </div>

            {/* Category + price */}
            <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={values.category}
                        onChange={(e) => handleChange("category", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                    <label className="text-xs font-medium text-slate-700">
                        Price info
                    </label>
                    <input
                        type="text"
                        value={values.priceInfo}
                        onChange={(e) => handleChange("priceInfo", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="e.g. Free, €15 entry, etc."
                    />
                </div>
            </div>

            {/* Location */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                    Location name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={values.locationName}
                    onChange={(e) => handleChange("locationName", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="Venue name, park, etc."
                />
                {validationErrors.locationName && (
                    <p className="text-[11px] text-red-500">
                        {validationErrors.locationName}
                    </p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                    Address <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={values.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="Street, number, city"
                    />
                    <button
                        type="button"
                        onClick={geocodeAddress}
                        disabled={geocodingLoading}
                        className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
                    >
                        {geocodingLoading ? "…" : "Find"}
                    </button>
                </div>
                {validationErrors.address && (
                    <p className="text-[11px] text-red-500">
                        {validationErrors.address}
                    </p>
                )}
            </div>

            {/* Coordinates */}
            <div className="space-y-1 rounded-2xl bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-700">
                        Coordinates (auto-filled)
                    </p>
                    <button
                        type="button"
                        onClick={handleUseMyLocation}
                        className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700"
                    >
                        Use my location
                    </button>
                </div>
                <div className="mt-2 grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-[11px] text-slate-600">
                            Latitude <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.000001"
                            value={values.latitude}
                            onChange={(e) => handleChange("latitude", e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        {validationErrors.latitude && (
                            <p className="text-[11px] text-red-500">
                                {validationErrors.latitude}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] text-slate-600">
                            Longitude <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.000001"
                            value={values.longitude}
                            onChange={(e) => handleChange("longitude", e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        {validationErrors.longitude && (
                            <p className="text-[11px] text-red-500">
                                {validationErrors.longitude}
                            </p>
                        )}
                    </div>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                    Coordinates werden automatisch aus der Adresse gefüllt oder können manuell angepasst werden.
                </p>
            </div>

            {/* Organizer name */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                    Organizer name
                </label>
                <input
                    type="text"
                    value={values.organizerName}
                    onChange={(e) => handleChange("organizerName", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="Your name or organization"
                />
            </div>

            {/* Website */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                    Website (optional)
                </label>
                <input
                    type="url"
                    value={values.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="https://example.com"
                />
            </div>

            {/* Images */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                    Image URLs (optional)
                </label>
                <p className="text-[11px] text-slate-500">
                    Paste links to images. First image will be used as the main cover.
                </p>
                <div className="space-y-2">
                    {values.images.map((img, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="url"
                                value={img}
                                onChange={(e) => handleImageChange(index, e.target.value)}
                                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                placeholder="https://…"
                            />
                            {values.images.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImageField(index)}
                                    className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500 hover:bg-slate-50"
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
                    className="mt-1 text-[11px] font-medium text-emerald-600 hover:text-emerald-700"
                >
                    + Add another image
                </button>
            </div>

            {/* Submit */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                    {submitting
                        ? mode === "create"
                            ? "Creating…"
                            : "Saving…"
                        : mode === "create"
                            ? "Create event"
                            : "Save changes"}
                </button>
            </div>
        </form>
    );
}
