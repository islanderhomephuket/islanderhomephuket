/**
 * Google Maps embed. Uses an API key when provided
 * (NEXT_PUBLIC_GOOGLE_MAPS_KEY), otherwise falls back to the
 * keyless `?q=` embed which works without billing.
 */
export function MapEmbed({
  query,
  lat,
  lng,
  className,
  title = "Location map",
}: {
  query?: string;
  lat?: number | null;
  lng?: number | null;
  className?: string;
  title?: string;
}) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const q = query || (lat != null && lng != null ? `${lat},${lng}` : "Phuket, Thailand");

  const src = key
    ? `https://www.google.com/maps/embed/v1/place?key=${key}&q=${encodeURIComponent(q)}&zoom=13`
    : `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=13&output=embed`;

  return (
    <iframe
      title={title}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={className}
      style={{ border: 0, width: "100%", height: "100%" }}
      allowFullScreen
    />
  );
}
