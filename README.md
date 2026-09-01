# Paradise Valley, October 2026

Trip site for four days on the Yellowstone outside Livingston, Montana. Built from the
group planning spreadsheet, styled with the Trailhead ("Land Finder") variant of
[`@hcsneden/design-library`](https://www.npmjs.com/package/@hcsneden/design-library).

## Sections

| Section | Contents |
| --- | --- |
| The plan | Day by day shape for Thu Oct 15 to Sun Oct 18, with the questions still open under each day |
| The map | Every place from the sheet, pinned. Anyone can click to add hikes, fishing spots and anything else |
| Eat and supply | Restaurants and the one nearby general store, with price and drive time |
| Things to do | Split by drive time: close to the house, or a full Yellowstone day |
| Logistics | Flight times per party, the expense split, and loose ends |

## Data

Trip content (itinerary, restaurants, activities, flights, expenses) is transcribed from the
planning spreadsheet into `src/data/trip.ts`. It does not sync live. The sheet uses merged
cells and several stacked tables, so parsing it at runtime would be fragile. When the sheet
changes, update `src/data/trip.ts`.

Map points people add do sync, to a `Map Points` tab on the same spreadsheet, through a
Google Apps Script Web App. See [`apps-script/README.md`](apps-script/README.md) to connect it.
Until that is set up the site still works, but added points save per browser and nobody else
sees them.

## Listing

`listing` in `src/data/trip.ts` holds the Airbnb details for the house, in the same shape as
the `AIRBNB_LISTING` constant in `laurens-bach`. Title, capacity and photo URLs were read off
the listing page at `airbnb.com/rooms/968919791124925451`.

Photos are hotlinked from Airbnb's `a0.muscache.com` CDN rather than checked into the repo.
Those URLs are stable in practice but are not guaranteed. If the carousel ever goes blank,
the fix is to re-read the listing page for fresh URLs, or to download the photos into
`public/` and point `listing.images` at local paths.

## Coordinates

Every pin's latitude and longitude is either lifted from a Google Maps link in the sheet or
geocoded against OpenStreetMap's Nominatim. None are guessed.

## Development

```bash
npm install
npm run dev
```

## Deployment

Public repo, GitHub Pages, deployed with the `gh-pages` package. Same setup as
`laurens-bach`. Deploys are manual rather than on push:

```bash
npm run deploy
```

That builds to `dist` and pushes it to the `gh-pages` branch. The site lands at
https://hcsneden.github.io/paradise-valley-trip

The Vite `base` is hardcoded to `/paradise-valley-trip/` in `vite.config.ts`. Renaming the
repository means changing it there and in `homepage` in `package.json`.

Note that `"private": true` in `package.json` only stops accidental publishing to the npm
registry. It has nothing to do with repository visibility.

## Stack

Vite, React 18, TypeScript, and MapLibre GL with the CARTO Voyager basemap (no API key).
