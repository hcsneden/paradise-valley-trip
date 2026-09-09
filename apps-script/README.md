# Sheets backend

Everything the group adds — map pins, ideas, votes and expenses — lives on the trip
spreadsheet. A static site cannot write to Google Sheets directly, so `Code.gs` is deployed
as a Google Apps Script Web App that sits in front of the sheet.

It creates and manages four tabs, so nothing you already have on the sheet is touched:

| Tab | Holds |
| --- | --- |
| `Map Points` | pins people drop on the map |
| `Ideas` | per-day suggestions, the time they are proposed for, and their vote counts |
| `Trip Expenses` | the receipt log behind the settle-up math |
| `Plan Votes` | the running score on each fixed itinerary row, one row per item, created on first vote |

The expense tab is called `Trip Expenses` rather than `Expenses` because the spreadsheet
already has an `Expenses` tab holding a per-person cost matrix, which is a different shape
from the flat log this script reads and writes.

## Setup

1. Open the trip spreadsheet.
2. **Extensions → Apps Script**.
3. Delete whatever is in `Code.gs` and paste in the contents of this folder's `Code.gs`. Save.
4. **Deploy → New deployment**. Click the gear next to "Select type" and choose **Web app**.
5. Set **Execute as** to *Me*, and **Who has access** to *Anyone*.
6. Click **Deploy** and authorize when prompted.
7. Copy the **Web app URL**. It looks like `https://script.google.com/macros/s/AKfy.../exec`.
8. Paste that URL into `src/lib/store.ts` as `SHEET_ENDPOINT`, then commit, push and redeploy.

"Who has access: Anyone" means anyone holding the URL can post. It does not expose the rest
of the spreadsheet, only the four tabs above, and only through the operations in `Code.gs`.

## Changing columns

`getSheet` reconciles headers on every call: if a tab is missing columns the script now expects,
they are appended on the end. That is why new fields go last in a `TABS` entry rather than in a
tidy position. Inserting one in the middle would silently shift every existing row's values.

The `time` column on `Ideas` was added this way. Rows written before it exist keep their five
values and read back with an empty time.

## Redeployment

**Deploy → Manage deployments → pencil icon → Version: New version → Deploy.**
The URL stays the same.

## Known limits

- **No realtime push.** The site loads the sheet once on open. Someone else's idea or pin
  shows up on your next refresh, not the moment they add it. Polling or a websocket layer
  would be the fix if that ever matters.
- **Votes are one per browser**, tracked in `localStorage` under `pv-trip-votes-v2`. Clearing
  site data lets the same person vote again. Enforcing it properly needs real accounts.
- **The client reports its own swing.** A vote POST carries a delta, clamped server-side to
  ±2, not an absolute position. Nothing stops a crafted request from sending `+2` repeatedly.
  Fine for eight people planning a holiday, not fine for anything else.
- **Sheets is slow** compared to a database. Expect a beat before a write comes back.
