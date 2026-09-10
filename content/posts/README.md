# Blog posts

One JSON file per post. Publish or update with:

```
node scripts/publish-post.mjs content/posts/<file>.json
```

Add `--draft` to write it as unpublished. The script upserts on `slug`, so editing a file
and re-running updates the live post rather than creating a second one.

## Shape

```json
{
  "slug": "ascii-kebab-case",
  "title": "…",
  "excerpt": "One or two sentences — this is the meta description and the card blurb.",
  "cover_image": "https://…/property-media/<listing-slug>/1.jpg",
  "author": "Islander Home Team",
  "tags": ["Area guide", "Bang Tao"],
  "content": "<p>Raw HTML…</p>"
}
```

`content` is injected with `dangerouslySetInnerHTML`. Use `<p> <h2> <h3> <ul> <ol> <li>
<strong> <em> <a> <blockquote>`, and wrap tables in `<div class="table-scroll">` so they
scroll instead of breaking the layout on a phone.

## House rules

- **Slugs stay ASCII** even for Thai posts — the title and body carry the Thai.
  Thai is detected automatically and the page is marked `lang="th"`.
- **Link into the site.** Every post should link to at least three `/rent/<area>` or
  `/buy/<area>` pages. That is most of the SEO value of writing them.
- **Never put an owner's contact in a post.** `publish-post.mjs` refuses to publish if it
  finds a phone number, a `wa.me` link or a LINE link that is not the agency's own.
- **Numbers must come from the database**, not from memory — query `properties` and quote
  the real count, median and range, then say the month the figures are from. That is the
  part competitors cannot copy.
- **Alternate Thai and English** roughly day about.
