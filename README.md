# Paradise Valley, October 2026

Phone-first planning page for four days on the Yellowstone outside Livingston, Montana.
Oct 15–18, 2026, four families, one house under Emigrant Peak.

Built to the `design_handoff_montana_trip` spec: the Land Finder / Trailhead palette extended
with the chunky 2px-outline and hard-shadow treatment, Public Sans and Spline Sans Mono.

## Tabs

| Tab | Contents |
| --- | --- |
| Days | One day at a time. Collapsed itinerary rows that open on tap, plus per-day ideas anyone can post and upvote |
| Map | Every known spot pinned, filterable by category. Anyone can drop their own |
| House | The listing, drive times from the front door, who lands when, and the weather reality check |
| Money | Receipt log and automatic settle-up across the four parties |

## Data

Trip content (itinerary, drive times, roster, seed pins) is transcribed from the planning
spreadsheet into `src/data/trip.ts`. It does not sync live: the sheet uses merged cells and
several stacked tables, so parsing it at runtime would be fragile. When the sheet changes,
update `src/data/trip.ts`.

Everything the group adds — pins, ideas, votes, expenses — does sync, to three tabs on the
same spreadsheet via a Google Apps Script Web App. See
[`apps-script/README.md`](apps-script/README.md) to connect it. Until that is set up the site
works, but additions save per browser and the page says so.

### Where the numbers come from

- **Coordinates** are either lifted from a Google Maps link in the sheet or geocoded against
  OpenStreetMap Nominatim. None are guessed. Note the handoff's seed pins put the house near
  Pray and several spots a few km off; the sheet's own coordinates won here.
- **Listing details** (12 guests, 4 bedrooms, 7 beds, 4 baths) and the photos were read off
  `airbnb.com/rooms/968919791124925451`. Photos are hotlinked from Airbnb's CDN, so if the
  carousel ever goes blank, re-read the listing for fresh URLs or download them into `public/`.
- **Money** splits four ways between the parties, not eight ways per head as the handoff's
  placeholder roster assumed. The seeded Airbnb rows are the $902.61 per-party shares from
  the sheet. Because the split is per party, the expense form makes you pick which party
  paid: a free-text payer who is not on the roster would break the settle-up, since balances
  have to sum to zero.

## Deliberate deviations from the handoff

- Roster, party size, prices and the itinerary are the real trip, not the prototype's
  placeholders. The handoff labels those as placeholder content.
- The add-a-spot form stacks under the map instead of floating over it at 288px. In a 460px
  column a floating panel covers most of the map you are trying to aim at.
- Tab icons are inline SVG rather than the prototype's text glyphs, which the handoff asks
  for.

## Development

```bash
npm install
npm run dev
```

## Deployment

Public repo, GitHub Pages, deployed with the `gh-pages` package. Same setup as `laurens-bach`.
Deploys are manual rather than on push:

```bash
npm run deploy
```

That builds to `dist` and pushes it to the `gh-pages` branch. The site lands at
https://hcsneden.github.io/paradise-valley-trip

The Vite `base` is hardcoded to `/paradise-valley-trip/` in `vite.config.ts`. Renaming the
repository means changing it there and in `homepage` in `package.json`.

## Stack

Vite, React 18, TypeScript, and Leaflet 1.9.4 with Esri World Topo tiles, falling back to
OpenStreetMap on tile errors. No API keys.
