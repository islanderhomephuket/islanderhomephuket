import { HeroSearch } from "./hero-search";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center bg-ink">
      <div className="relative mx-auto w-full max-w-7xl px-5 pt-28 sm:px-8 lg:px-12">
        <div className="max-w-3xl animate-fade-up">
          <p className="kicker text-paper/70">
            Luxury Real Estate · Phuket, Thailand
          </p>

          {/* Framed headline */}
          <div className="mt-6 inline-block">
            <div className="frame-box">
              <h1 className="font-display text-4xl font-semibold leading-[1.05] text-paper sm:text-6xl lg:text-7xl">
                Find your place
                <br />
                <span className="text-paper">on the island.</span>
              </h1>
            </div>
          </div>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-paper/80">
            Curated villas, condominiums and land across Phuket&apos;s most
            sought-after addresses — with trusted local expertise from first
            viewing to keys in hand.
          </p>

          <div className="mt-10">
            <HeroSearch />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-paper/60 lg:flex">
        <span className="text-[0.65rem] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-paper/60 to-transparent" />
      </div>
    </section>
  );
}
