import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-ink">
      <Container className="text-center">
        <p className="kicker text-gold-light">404</p>
        <h1 className="mt-4 font-display text-5xl font-semibold text-paper sm:text-6xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-paper/70">
          The page you&apos;re looking for has moved or no longer exists. Let&apos;s
          get you back home.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <ButtonLink href="/" variant="gold">
            Back home
          </ButtonLink>
          <ButtonLink href="/buy" variant="dark">
            Browse properties
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
