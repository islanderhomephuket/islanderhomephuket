import { cn } from "@/lib/utils";

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  tone = "light",
  className,
}: {
  kicker?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {kicker && <p className="kicker">{kicker}</p>}
      <h2
        className={cn(
          "mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl md:text-[2.6rem]",
          tone === "light" ? "text-paper" : "text-ink",
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          "gold-rule mt-5",
          align === "center" && "mx-auto",
        )}
      />
      {description && (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed",
            tone === "light" ? "text-paper/70" : "text-ink/65",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
