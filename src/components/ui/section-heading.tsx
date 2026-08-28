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
      {kicker && (
        <div
          className={cn(
            "flex items-center gap-3",
            align === "center" && "justify-center",
          )}
        >
          <span className="h-px w-8 bg-paper/25" />
          <p className="kicker">{kicker}</p>
        </div>
      )}
      <h2
        className={cn(
          "display-caps mt-5 text-[2rem] sm:text-[2.6rem] md:text-[3rem]",
          tone === "light" ? "text-paper" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed",
            tone === "light" ? "text-paper/60" : "text-ink/65",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
