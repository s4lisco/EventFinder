// frontend/src/components/EventImageGallery.tsx
interface EventImageGalleryProps {
  title: string;
  images: string[];
}

export default function EventImageGallery({
  title,
  images,
}: EventImageGalleryProps) {
  if (!images || images.length === 0) {
    return (
      <div className="h-52 w-full overflow-hidden rounded-2xl bg-slate-200" />
    );
  }

  const [primary, ...rest] = images;

  return (
    <div className="grid h-56 grid-cols-3 gap-2 overflow-hidden rounded-2xl">
      <div className="col-span-2 h-full">
        <img
          src={primary}
          alt={title}
          className="h-full w-full rounded-2xl object-cover"
        />
      </div>
      <div className="flex h-full flex-col gap-2">
        {rest.slice(0, 2).map((img, idx) => (
          <div key={img + idx} className="h-1/2">
            <img
              src={img}
              alt={`${title} image ${idx + 2}`}
              className="h-full w-full rounded-2xl object-cover"
            />
          </div>
        ))}
        {rest.length === 0 && (
          <div className="h-full rounded-2xl bg-slate-200" />
        )}
      </div>
    </div>
  );
}
