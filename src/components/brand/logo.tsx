import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Islander Home Phuket brand badge (the client's real logo).
 * The circular emblem already contains the wordmark, so by default
 * we render the badge alone. Pass `withText` to add a wordmark beside it.
 */
export function Logo({
  className,
  tone = "dark",
  withText = false,
  markClassName,
}: {
  className?: string;
  tone?: "dark" | "light";
  withText?: boolean;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src="/logo.png"
        alt="Islander Home Phuket"
        width={512}
        height={512}
        priority
        className={cn("h-12 w-12 object-contain", markClassName)}
      />
      {withText && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-[1.3rem] font-semibold tracking-[0.04em]",
              tone === "light" ? "text-paper" : "text-ink",
            )}
          >
            Islander Home
          </span>
          <span className="kicker mt-1 text-[0.6rem] tracking-[0.42em] text-gold-dark">
            Phuket
          </span>
        </span>
      )}
    </span>
  );
}
