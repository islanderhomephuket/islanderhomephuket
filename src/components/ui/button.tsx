import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "gold" | "dark";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-paper/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

const variants: Record<Variant, string> = {
  primary:
    "bg-paper text-ink border border-paper hover:-translate-y-0.5 glow-gold",
  gold: "bg-paper text-ink border border-paper hover:-translate-y-0.5",
  outline:
    "border border-paper/30 text-paper hover:border-paper hover:bg-paper/10 bg-transparent",
  dark: "border border-paper/30 text-paper hover:border-paper hover:bg-paper/10 bg-transparent",
  ghost: "text-paper/70 hover:text-paper",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs uppercase tracking-[0.15em]",
  md: "h-11 px-6 text-[0.8rem] uppercase tracking-[0.18em]",
  lg: "h-14 px-9 text-sm uppercase tracking-[0.2em]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  external,
  ...props
}: CommonProps & {
  href: string;
  external?: boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...props}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
