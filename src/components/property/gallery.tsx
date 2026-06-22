"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import type { PropertyImage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Gallery({
  images,
  title,
}: {
  images: PropertyImage[];
  title: string;
}) {
  const pics = images.length
    ? images
    : [
        {
          id: "placeholder",
          property_id: "",
          url: "/properties/villa-1.png",
          alt: title,
          sort_order: 0,
          is_cover: true,
        },
      ];

  const [active, setActive] = useState(() =>
    Math.max(0, pics.findIndex((p) => p.is_cover)),
  );
  const [lightbox, setLightbox] = useState(false);

  const go = useCallback(
    (dir: number) => {
      setActive((i) => (i + dir + pics.length) % pics.length);
    },
    [pics.length],
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, go]);

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-charcoal">
        <Image
          src={pics[active].url}
          alt={pics[active].alt ?? title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />
        <button
          onClick={() => setLightbox(true)}
          aria-label="Expand gallery"
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink/60 text-paper backdrop-blur transition-colors hover:bg-gold hover:text-ink"
        >
          <Expand className="h-5 w-5" />
        </button>
        {pics.length > 1 && (
          <>
            <GalleryNav dir="left" onClick={() => go(-1)} />
            <GalleryNav dir="right" onClick={() => go(1)} />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink/60 px-3 py-1 text-xs text-paper backdrop-blur">
              {active + 1} / {pics.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {pics.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {pics.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-[4/3] overflow-hidden border transition-all",
                i === active
                  ? "border-gold opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              <Image
                src={p.url}
                alt={p.alt ?? `${title} ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95">
          <button
            onClick={() => setLightbox(false)}
            aria-label="Close"
            className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full text-paper hover:text-gold"
          >
            <X className="h-7 w-7" />
          </button>
          <div className="relative h-[78vh] w-[92vw] max-w-6xl">
            <Image
              src={pics[active].url}
              alt={pics[active].alt ?? title}
              fill
              sizes="92vw"
              className="object-contain"
            />
          </div>
          {pics.length > 1 && (
            <>
              <GalleryNav dir="left" onClick={() => go(-1)} light />
              <GalleryNav dir="right" onClick={() => go(1)} light />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-paper/80">
                {active + 1} / {pics.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function GalleryNav({
  dir,
  onClick,
  light,
}: {
  dir: "left" | "right";
  onClick: () => void;
  light?: boolean;
}) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={dir === "left" ? "Previous" : "Next"}
      className={cn(
        "absolute top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition-colors",
        dir === "left" ? "left-4" : "right-4",
        light
          ? "text-paper hover:bg-gold hover:text-ink"
          : "bg-ink/60 text-paper backdrop-blur hover:bg-gold hover:text-ink",
      )}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}
