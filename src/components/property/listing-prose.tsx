/**
 * Listing copy, rendered with the structure its author already wrote in.
 *
 * Descriptions used to go out as one `<p>` with `whitespace-pre-line`, so a
 * 400-word listing arrived as an unbroken slab: paragraph breaks collapsed to a
 * single line feed, lists read as prose, and the sub-headings the copy was
 * organised around were invisible. On a phone that is a screen and a half of
 * grey text with no way in.
 *
 * The descriptions are plain text in the database and stay plain text — this
 * only reads the conventions already in them: blank lines between paragraphs
 * (715 of 804 listings), "- " or "•" bullets (180), and a short line ending in a
 * colon as the heading over a list (72). Nothing here invents structure that
 * isn't in the copy, so a listing written as flat prose simply gets real
 * paragraph spacing.
 */

type Block =
  | { kind: "heading"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "para"; text: string };

const BULLET = /^\s*[-•*]\s+(.*)$/;
const HASH_HEADING = /^\s*#{1,3}\s+(.*)$/;

/**
 * A heading is a short line that opens something, not a sentence: it ends in a
 * colon and carries no sentence-ending punctuation of its own. The length cap
 * keeps a long introductory clause ("...and that is what separates this from:")
 * out of the heading style.
 */
function headingText(line: string): string | null {
  const hash = HASH_HEADING.exec(line);
  if (hash) return hash[1].trim();
  const t = line.trim();
  if (t.length > 60 || !t.endsWith(":")) return null;
  const body = t.slice(0, -1);
  if (!body || /[.!?]/.test(body)) return null;
  return body;
}

export function parseListingProse(text: string): Block[] {
  const blocks: Block[] = [];

  for (const raw of (text ?? "").split(/\n\s*\n/)) {
    const lines = raw.split("\n").map((l) => l.trimEnd()).filter((l) => l.trim());
    if (!lines.length) continue;

    // A heading may sit on the first line of its own block, above the list or
    // paragraph it introduces, so peel it off before classifying the rest.
    const head = headingText(lines[0]);
    if (head !== null) {
      blocks.push({ kind: "heading", text: head });
      lines.shift();
      if (!lines.length) continue;
    }

    const bullets = lines.map((l) => BULLET.exec(l));
    if (bullets.every(Boolean)) {
      blocks.push({ kind: "list", items: bullets.map((m) => m![1].trim()) });
      continue;
    }

    blocks.push({ kind: "para", text: lines.join(" ") });
  }

  return blocks;
}

export function ListingProse({ text }: { text: string }) {
  const blocks = parseListingProse(text);
  if (!blocks.length) return null;

  return (
    <div className="mt-6 space-y-5 text-paper/75">
      {blocks.map((b, i) => {
        if (b.kind === "heading")
          return (
            <h3
              key={i}
              // Headings after the first get extra air, so a section reads as a
              // section rather than as a bolder line in the same slab.
              className={`font-display text-lg font-semibold text-paper ${i === 0 ? "" : "pt-3"}`}
            >
              {b.text}
            </h3>
          );

        if (b.kind === "list")
          return (
            <ul key={i} className="space-y-2.5">
              {b.items.map((item, j) => (
                <li key={j} className="flex gap-3 leading-relaxed">
                  <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-gold-dark" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );

        return (
          <p key={i} className="leading-relaxed">
            {b.text}
          </p>
        );
      })}
    </div>
  );
}
