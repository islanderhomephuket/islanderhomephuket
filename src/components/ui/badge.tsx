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
    gold: "bg-paper text-ink",
    dark: "bg-black/55 text-paper backdrop-blur-md border border-paper/20",
    light: "bg-paper/90 text-ink",
    muted: "bg-paper/10 text-paper/70 border border-paper/15",
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
