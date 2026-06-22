import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "gold",
  className,
}: {
  children: React.ReactNode;
  tone?: "gold" | "dark" | "light" | "muted";
  className?: string;
}) {
  const tones = {
    gold: "bg-gold text-ink",
    dark: "bg-ink text-paper",
    light: "bg-paper/90 text-ink",
    muted: "bg-sand text-ink/70",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
