import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "gold" | "dark";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "bg-gold text-ink hover:bg-gold-light border border-gold glow-gold",
  gold: "bg-gold text-ink hover:bg-gold-light border border-gold",
  outline:
    "border border-paper/30 text-paper hover:border-gold hover:text-gold bg-transparent",
  dark: "border border-paper/30 text-paper hover:border-gold hover:text-gold bg-transparent",
  ghost: "text-paper hover:text-gold",
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
