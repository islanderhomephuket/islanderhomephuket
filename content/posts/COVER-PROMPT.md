# Blog cover prompt (image-generation)

Covers for the daily blog are generated as images, not rendered from HTML. The user
reviewed HTML-rendered covers on 2026-09-24 and preferred an image-model cover; this
prompt was written by the user's own ChatGPT and approved as the house template.

**How to use:** paste the template below into an image model, replacing `{KICKER}`,
`{HEADLINE}` and `{SUBLINE}`. Keep every other line identical so the whole series looks
like one publication. Output goes to Supabase Storage under
`property-media/blog-covers/<slug>.jpg` and becomes the post's `cover_image`.

**Rules that still apply**
- Target 1200x630 (the blog hero and cards both use that ratio and show the image whole).
- The headline text on the cover must match the post's real angle; never let the model
  invent a number. Numbers come from a live Supabase query, as always.
- The villa in the photo is AI-generated and is NOT a real listing. The user approved
  this on 2026-09-24. Never put a price, a listing name or a reference code on an
  AI-generated photo, and never reuse a cover photo as a listing photo.

---

Create a premium editorial cover image for "Islander Home Phuket"
(islanderhomephuket.com), designed as a recurring Thai luxury real-estate
business-news publication.

CANVAS
- Exact size: 1200 x 630 px
- Aspect ratio: 1.91:1
- Horizontal editorial composition

BRAND SYSTEM
- Brand: Islander Home Phuket
- Website: islanderhomephuket.com
- Overall aesthetic: dark, cinematic, monochrome luxury
- Primary colours: ink black #08090a, bone/off-white #e6e2d9, paper white #f6f5f2
- NO gold
- NO blue
- NO coloured graphic accents
- The PHOTOGRAPH itself may contain natural photographic colour, especially warm
  architectural lighting and sunset tones.
- Typography: Archivo Heavy / Black for display headlines, Inter for supporting text.
- Crisp geometry, generous margins, immaculate kerning, high contrast, sophisticated
  luxury-magazine finish.

EDITORIAL STYLE
Think premium Thai business-news thumbnail / financial publication cover, similar in
visual language to Business Watch or Positioning, but substantially more refined and
luxurious. Use a bold typographic banner system over a high-end architectural
photograph. The graphic should feel like one consistent publication series, not a
generic real-estate advertisement.

PHOTOGRAPH
Use a photorealistic modern luxury Phuket villa at dusk:
- infinity pool
- contemporary architecture
- warm interior illumination
- sophisticated tropical landscaping
- sea, bay, or mountain/lake view in the background
- wide architectural photography
- slightly darkened exposure behind typography
- cinematic dusk atmosphere
- premium property-editorial photography
- no people, no cars, no logos, no watermark, no cheesy real-estate effects

LAYOUT - KEEP THIS STRUCTURE IDENTICAL FOR EVERY ARTICLE

TOP LEFT:
Place {KICKER} inside a solid bone/off-white rectangular block. Uppercase Archivo Bold,
dark ink-black text, generous horizontal and vertical padding.

MAIN HEADLINE:
Place {HEADLINE} beneath the kicker. Very large Archivo Heavy/Black, paper-white or
bone-white text, strong editorial line breaks. The headline should occupy approximately
the left 55-65% of the composition while allowing the property photograph to remain
visible. Do NOT shrink the headline excessively. Maintain generous margins.

SUBLINE:
Place {SUBLINE} underneath the headline. Inter Regular/Medium, bone/off-white, smaller
than the headline but clearly readable, aligned with the headline's left edge.

FOOTER:
At the bottom-left, place ISLANDERHOMEPHUKET.COM in small uppercase Inter Medium with
generous letter spacing. Keep it subtle and premium.

GRAPHIC TREATMENT
- Solid rectangular colour blocks only.
- No gradients in the typography panels, no gold lines, no decorative icons, no
  excessive borders, no drop shadows around text, no clutter.
- No generic "FOR SALE" badges, no fake UI elements, no excessive logos.
- Keep the photograph as the only visual source of colour.
- Preserve the same hierarchy, spacing, proportions and typography across every article.

TEXT - MUST BE REPRODUCED EXACTLY
KICKER: {KICKER}
HEADLINE: {HEADLINE}
SUBLINE: {SUBLINE}
FOOTER: ISLANDERHOMEPHUKET.COM

TEXT ACCURACY IS CRITICAL:
Render every character exactly as supplied. Do not paraphrase, rewrite, autocorrect,
abbreviate, or invent words. Ensure every text element is perfectly legible and
correctly spelled.

QUALITY
Photorealistic architectural photography, premium magazine art direction, sharp details,
realistic materials, sophisticated exposure, cinematic dusk, luxury international
property publication, clean editorial composition, high-end typography, perfect
alignment, excellent kerning, no distortion.

The final result should look like an established luxury property-market publication with
a consistent visual identity that can be reused every weekday simply by changing
{KICKER}, {HEADLINE}, and {SUBLINE}.
