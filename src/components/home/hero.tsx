"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HeroSearch } from "./hero-search";

export interface HeroSlide {
  image: string;
  title: string;
  /** Caption fields are optional so a hand-picked hero photo can carry no listing data. */
  location?: string;
  price?: string;
  href?: string;
}

const AUTOPLAY_MS = 6500;

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const count = slides.length;

  const next = useCallback(() => {
    setActive((i) => (count ? (i + 1) % count : 0));
  }, [count]);

  // Slow crossfade between the featured properties. Pauses if the tab is hidden.
  useEffect(() => {
    if (count < 2) return;
    const id = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [count, next]);

  const current = slides[active];

  return (
    <section className="relative bg-ink px-2 pt-2 sm:px-3 sm:pt-3">
      <div className="relative h-[94svh] min-h-[620px] w-full overflow-hidden rounded-[var(--radius-frame)] bg-charcoal">
        {/* Stacked, crossfading photography */}
        {slides.map((slide, i) => (
          <div
            key={(slide.href ?? slide.image) + i}
            className="absolute inset-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ opacity: i === active ? 1 : 0 }}
            aria-hidden={i !== active}
          >
            <Image
              src={slide.image}
              alt={i === active ? slide.title : ""}
              fill
              priority={i === 0}
              sizes="100vw"
              className="animate-slow-zoom object-cover"
            />
          </div>
        ))}

        {/* Cinematic grading — dark at the bottom so type always holds up */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative flex h-full flex-col justify-end px-5 pb-8 pt-28 sm:px-10 sm:pb-10 lg:px-14 lg:pb-12">
          <div className="max-w-4xl animate-fade-up">
            <p className="kicker text-paper/70">
              Luxury Real Estate · Phuket, Thailand
            </p>

            <h1 className="display-caps mt-5 text-[2.7rem] text-paper sm:text-[4.4rem] lg:text-[5.6rem]">
              Live where the
              <br />
              island begins
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/75 sm:text-lg">
              Curated villas, condominiums and land across Phuket&apos;s most
              sought-after addresses — with trusted local expertise from first
              viewing to keys in hand.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/buy"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-paper px-7 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-ink transition-transform duration-300 hover:-translate-y-0.5"
              >
                Browse properties
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-paper/35 px-7 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-paper transition-colors duration-300 hover:border-paper hover:bg-paper/10"
              >
                Schedule a viewing
              </Link>
            </div>
          </div>

          {/* Bottom rail: search on the left, featured thumbnails on the right */}
          <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <HeroSearch />

            {count > 0 && (
              <div className="hidden shrink-0 flex-col items-end gap-3 lg:flex">
                {current?.href && (current.location || current.price) && (
                  <Link
                    href={current.href}
                    className="group flex items-center gap-3 text-right"
                  >
                    <span>
                      {current.location && (
                        <span className="block text-[0.65rem] uppercase tracking-[0.22em] text-paper/55">
                          {current.location}
                        </span>
                      )}
                      {current.price && (
                        <span className="mt-1 block text-sm font-medium text-paper">
                          {current.price}
                        </span>
                      )}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/35 text-paper transition-colors group-hover:border-paper group-hover:bg-paper group-hover:text-ink">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                )}

                <div className="flex gap-2.5">
                  {slides.map((slide, i) => (
                    <button
                      key={(slide.href ?? slide.image) + i}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`Show ${slide.title}`}
                      aria-current={i === active}
                      className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition-all duration-500 ${
                        i === active
                          ? "border-paper opacity-100"
                          : "border-paper/25 opacity-55 hover:opacity-90"
                      }`}
                    >
                      <Image
                        src={slide.image}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
