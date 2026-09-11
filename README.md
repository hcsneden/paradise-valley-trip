# Paradise Valley, October 2026

Phone-first planning page for four days on the Yellowstone outside Livingston, Montana.
Oct 15–18, 2026, four families, one house under Emigrant Peak.

Built to the `design_handoff_montana_trip` spec: the Land Finder / Trailhead palette extended
with the chunky 2px-outline and hard-shadow treatment, Public Sans and Spline Sans Mono.

## Tabs

| Tab | Contents |
| --- | --- |
| Days | One day at a time. Collapsed itinerary rows that open on tap, each with an up/down vote and its own notes thread, plus per-day ideas anyone can post with a time and vote on |
| Map | Every known spot pinned, filterable by category. Anyone can drop their own |
| House | The listing, drive times from the front door, who lands when, and the weather reality check |
| Money | Receipt log and automatic settle-up across the four parties |

## Data

Trip content (itinerary, drive times, roster, seed pins) is transcribed from the planning
spreadsheet into `src/data/trip.ts`. It does not sync live: the sheet uses merged cells and
several stacked tables, so parsing it at runtime would be fragile. When the sheet changes,
update `src/data/trip.ts`.

Every known spot lives once, in `places`. The map pins (`seedPins`) and the House tab's drive
list (`driveTimes`) are both derived from it, so adding, editing or dropping a spot is one edit
instead of three. A place with no `lat`/`lng` is drive-list only, which is how Livingston gets a
line without putting a second marker on top of the Oktoberfest pin. A place with no `drive` is
map only, which is how the restaurants stay off a list meant for landmarks. `drive.minutes`
orders that list and nothing else.

Everything the group adds — pins, ideas, notes, votes, expenses — does sync, to five tabs on
the same spreadsheet via a Google Apps Script Web App. See
[`apps-script/README.md`](apps-script/README.md) to connect it. Until that is set up the site
works, but additions save per browser and the page says so.

### Where the numbers come from

- **Coordinates** are either lifted from a Google Maps link in the sheet or geocoded against
  OpenStreetMap Nominatim. None are guessed. Note the handoff's seed pins put the house near
  Pray and several spots a few km off; the sheet's own coordinates won here.
- **Listing details** (12 guests, 4 bedrooms, 7 beds, 4 baths) and the photos were read off
  `airbnb.com/rooms/968919791124925451`. Photos are hotlinked from Airbnb's CDN, so if the
  carousel ever goes blank, re-read the listing for fresh URLs or download them into `public/`.
- **Money** splits four ways between the parties. The seeded Airbnb rows are the $902.61
  per-party shares from the sheet, so everyone starts even. The payer is derived from the
  member picker rather than typed, because a free-text payer who is not on the roster breaks
  the settle-up: their credit vanishes and balances stop summing to zero.
- The four Airbnb rows are **seeds, like the map's seed pins**: always present, never
  deletable, and prepended to whatever the sheet holds rather than replaced by it. They have
  no sheet row behind them, so a delete would no-op server-side and the row would return on
  the next load.

## Identity

The revised handoff removes the header's free-text "You are ___" field and says production
should attribute everything to a signed-in user. There is no auth here and building it is out
of scope, so attribution comes from a **member picker** instead: pick which of the eight
travellers you are, and the choice sticks in `localStorage` and follows you across tabs.

On a first visit nothing is stored under that key yet, so the site opens on a modal asking who
you are before anything else. Without it the picker has to default to somebody, and everything
posted before you notice the picker lands under that person's name, billed to that person's
family. The modal renders outside `.app` as a full-page overlay rather than part of the app
layout.

Note that `.app`'s `container-type: inline-size` does *not* trap fixed descendants: a
`position: fixed` element inside `.app` measures the full viewport, which is why the phone tab
bar pins correctly from inside it. Verified in Chrome with `.app` constrained to 414px, where
a fixed child still measured 1512x738.

That also drives the money. Members map to the parties on the sheet:

| Party | Members |
| --- | --- |
| Nat Fam | Natalie, Gordy |
| Han & Mal | Hannah, Mallory |
| Liv & Joe | Liv, Joe |
| Jord Fam | Jordan, Tim |

Picking who you are is enough to log an expense, since the paying party is derived. The sheet
names parties, never people, so `members` is the only record of who is in each one. Han & Mal
and Liv & Joe fall out of the sheet's own party names; `Natalie` and `Jordan` expand `Nat` and
`Jord`; `Gordy` and `Tim` were added by hand and are confirmed correct. Do not "fix" them back
to something sheet-derived.

`Bozeman airport · 1 hr` is the one drive time the sheet does not state. Everything else in
`places` carries a distance the sheet gives explicitly.

### Voting

Itinerary rows and posted ideas both take one vote per person: up, down, or neither. Pressing
the arrow you already chose clears it, and switching sides is a single swing.

The client never sends its new position, only the difference, and the sheet adds that to the
running total. So switching from up to down arrives as `-2`. That keeps the sheet a single
integer per item instead of a row per person per item, at the cost of trusting the client to
report its own swing honestly. Where each browser stands is kept in `localStorage` under
`pv-trip-votes-v2`, so clearing site data lets the same person vote again.

Itinerary rows are voted on by the stable `id` in `src/data/trip.ts`, not by position. Renaming
an item is safe, changing its `id` orphans its votes.

### Notes

Any itinerary row takes free-text notes, attributed to whoever the member picker says you are
and shown when the row is expanded. A collapsed row with notes carries a count so you can tell
which rows have been talked about without opening all of them. Notes are keyed to the same
stable item `id` as the votes, so changing an `id` orphans its notes as well.

Notes are a plain comment thread on purpose. Ideas already carry votes, and a row's own vote
already measures whether people want to do it, so a second voted list on the same row would be
two ways to say the same thing.

## Deliberate deviations from the handoff

- Roster, party size, prices and the itinerary are the real trip, not the prototype's
  placeholders. The handoff labels those as placeholder content.
- **Money splits four ways by party, not eight ways per head.** The handoff sets
  `share = total / 8`, but the sheet bills each family $902.61, so per-head math would be wrong
  for everyone. Balances still sum to zero, which the handoff requires.
- The add-a-spot form stacks under the map instead of floating over it at 288px. In a 460px
  column a floating panel covers most of the map you are trying to aim at.
- Tab icons are inline SVG rather than the prototype's text glyphs, which the handoff asks
  for.
- Seed pins, drive times and the house coordinate come from the planning sheet rather than the
  handoff's seed list, which places the house near Pray and several spots a few km off.

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

The Map panel is `display: none` at load, so Leaflet would otherwise initialize against a 0x0
container and render blank. A single `ResizeObserver` on the canvas covers it: the reveal is
itself a resize from 0x0, so it fires then and on every resize after, and `invalidateSize()`
keeps the centre. The handoff prescribes an `IntersectionObserver` plus a short poll plus a
`requestAnimationFrame` pass on first reveal as well; all three are the same one call at a
different moment, so they were dropped. Verified in Chrome: the container is 0px wide before
reveal and 776x640 after, with all 13 markers drawn.
