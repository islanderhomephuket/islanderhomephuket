import { cn } from "@/lib/utils";

/**
 * How wide the site is allowed to run, in one place.
 *
 * It was a flat 1280 px, which on a 2560 px monitor left a margin as wide as
 * the content on either side — the listings were squeezed into the middle half
 * of the screen. It now steps up twice, so a laptop is unchanged and a large
 * monitor is actually used:
 *
 *   under 1536 px : 1280 px  (unchanged — every laptop)
 *   1536 px and up: 1440 px
 *   1920 px and up: 1728 px
 *   2560 px and up: 2112 px
 *
 * It stops at 2112 px rather than filling the screen: the listing grid gains
 * from the width, but a paragraph set 2500 px wide is unreadable, and the
 * prose blocks keep their own max-widths inside this.
 *
 * The header, the footer and the CTA band carry the same classes so their
 * contents stay aligned with the page. Change it here and there together.
 */
export const SITE_WIDTH =
  "max-w-7xl 2xl:max-w-[90rem] 3xl:max-w-[108rem] 4xl:max-w-[132rem]";

export function Container({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  return (
    <Tag className={cn(SITE_WIDTH, "mx-auto w-full px-5 sm:px-8 lg:px-12", className)}>
      {children}
    </Tag>
  );
}
