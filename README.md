# Tasti.io demos

Live at **[demo.tasti.io](https://demo.tasti.io)**.

The listing page for the Tasti.io demos: a short Avo walkthrough video, then one
card per demo with a screenshot, what it replaces, how long that job takes by hand,
and the point it makes. The demos run on invented data; the shared fictional group
is Harbour & Co ([harbour-data](https://github.com/Tasti-io/harbour-data)). The page
itself says that its money figures are arithmetic on stated assumptions, not
results measured at a client.

## How it is built

`build.mjs` reads `demos.json` and writes `public/index.html`. It is a generator
rather than a hand-written page so that adding the next demo is one object in a
JSON file and a thumbnail, not an afternoon of HTML. All text from `demos.json` is
HTML-escaped. No npm dependencies.

## Adding a demo

1. Add an object to `demos.json`:

   ```json
   {
     "slug": "invoices",
     "title": "The invoice reader",
     "url": "https://invoices.tasti.io",
     "host": "invoices.tasti.io",
     "shot": "/shots/invoices.jpg",
     "blurb": "What it does, in two sentences.",
     "replaces": "The manual job it replaces",
     "time": "How long that job takes by hand",
     "point": "The one concrete sentence the demo proves",
     "live": true
   }
   ```

   `host` is shown in the card's address bar; `live: true` adds the "live" badge.
   Cards appear in file order.

2. Put a 16:9 screenshot of the running demo at the `shot` path under
   `public/shots/`. The CSS assumes captures taken at 1920 wide with the content in a
   centre column, and zooms into the top centre so the card shows the product rather
   than the margins. Screenshots are real captures, not generated artwork, because
   the page's only claim is that these things run.

3. Rebuild:

   ```bash
   node build.mjs   # writes public/index.html
   ```

## Deploy

`public/` is static and `public/index.html` is committed, so there is no build step
on the server. `vercel.json` adds security headers and a one-day cache on
`/shots/`.

## Layout

```
build.mjs        generates public/index.html from demos.json
demos.json       one object per demo
public/shots/    one screenshot per card
public/media/    the Avo walkthrough video and its poster
vercel.json      headers and caching
```
